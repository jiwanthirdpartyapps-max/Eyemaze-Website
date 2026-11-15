import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json());

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API endpoint for AI Project Consultant / Scope Generator
  app.post('/api/gemini/consult', async (req, res) => {
    try {
      const { prompt, projectType, budget, timeline } = req.body;

      const systemInstruction = `You are the Senior Pre-Press Director and Print Consultant at Eyemaze Graphics Enterprises in Marin-6, Chhap, Sindhuli, Nepal (eyemaze.com.np).
      Eyemaze specializes in Offset & Bulk Printing, Flex & Vinyl Banners, Luxury Gold-Foil Stationery & Visiting Cards, Custom Packaging Boxes, Personalized Corporate Sets, Graphic Design, and Commercial Product Photography.
      Give concise, practical, non-generic technical advice covering exact paper GSM weights, lamination/foil finishes, CMYK color profiles, bleed margins, and estimated production turnaround in Nepal.`;

      const userMessage = `Client Print Consultation Request:
      - Print Category: ${projectType || 'Custom Print Job'}
      - Target Quantity: ${req.body.quantity || 'Standard Batch'}
      - Desired Timeline: ${timeline || 'Standard'}
      - Client Brief: ${prompt}

      Provide clear pre-press specifications, recommended paper stock/GSM, finishing options, and cost-saving production tips.`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: userMessage,
        config: {
          systemInstruction,
        }
      });

      res.json({ success: true, text: response.text });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to generate AI consultation response.' 
      });
    }
  });

  // Verify genuine Firebase Auth RS256 ID Tokens against Google's official x509 certificates
  let cachedCerts: { certs: Record<string, string>; expiresAt: number } | null = null;
  const FIREBASE_PROJECT_ID = 'numeric-liberty-jwk2q';

  async function getGoogleFirebaseCerts(): Promise<Record<string, string>> {
    if (cachedCerts && Date.now() < cachedCerts.expiresAt) {
      return cachedCerts.certs;
    }
    const resp = await fetch(
      'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
    );
    if (!resp.ok) {
      throw new Error('Failed to fetch Google Firebase public certificates.');
    }
    const cacheControl = resp.headers.get('cache-control') || '';
    const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
    const maxAgeMs = maxAgeMatch ? Number(maxAgeMatch[1]) * 1000 : 3600 * 1000;
    const certs = (await resp.json()) as Record<string, string>;
    cachedCerts = { certs, expiresAt: Date.now() + maxAgeMs };
    return certs;
  }

  async function verifyFirebaseIdToken(idToken: string) {
    const parts = idToken.split('.');
    if (parts.length !== 3) {
      throw new Error('Malformed Firebase ID token.');
    }
    const [headerB64, payloadB64, signatureB64] = parts;
    const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf8'));
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));

    if (header.alg !== 'RS256' || !header.kid) {
      throw new Error('Unsupported Firebase JWT header algorithm or missing key ID.');
    }
    const nowSec = Math.floor(Date.now() / 1000);
    if (typeof payload.exp !== 'number' || payload.exp <= nowSec) {
      throw new Error('Firebase ID token has expired.');
    }
    if (payload.aud !== FIREBASE_PROJECT_ID) {
      throw new Error('Firebase ID token audience mismatch.');
    }
    if (payload.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`) {
      throw new Error('Firebase ID token issuer mismatch.');
    }
    if (typeof payload.sub !== 'string' || !payload.sub) {
      throw new Error('Firebase ID token subject (uid) missing.');
    }

    const certs = await getGoogleFirebaseCerts();
    const certPem = certs[header.kid];
    if (!certPem) {
      throw new Error('Unknown Firebase signing key ID.');
    }

    const { createVerify } = await import('node:crypto');
    const verifier = createVerify('RSA-SHA256');
    verifier.update(`${headerB64}.${payloadB64}`);
    verifier.end();
    const isValidSig = verifier.verify(certPem, Buffer.from(signatureB64, 'base64url'));
    if (!isValidSig) {
      throw new Error('Firebase ID token signature verification failed.');
    }

    return {
      uid: payload.sub as string,
      name: (payload.name as string) || (payload.email as string)?.split('@')[0] || 'Eyemaze Client',
      email: (payload.email as string) || '',
      emailVerified: Boolean(payload.email_verified),
      picture: (payload.picture as string) || '',
    };
  }

  // Zero-Trust Auth Verification Endpoint (used by Web & Android Firebase clients)
  const handleVerifyFirebaseToken = async (req: express.Request, res: express.Response) => {
    try {
      const authHeader = req.headers.authorization || '';
      const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
      const idToken = bearerToken || (typeof req.body?.idToken === 'string' ? req.body.idToken.trim() : '');

      if (!idToken) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized: Valid Firebase Google ID token required in Authorization Bearer header.',
        });
      }

      const verifiedUser = await verifyFirebaseIdToken(idToken);
      return res.json({
        success: true,
        user: verifiedUser,
      });
    } catch (error: unknown) {
      return res.status(401).json({
        success: false,
        error: error instanceof Error ? error.message : 'Invalid Firebase ID token.',
      });
    }
  };

  app.post('/api/auth/verify', handleVerifyFirebaseToken);
  app.post('/api/auth/login', handleVerifyFirebaseToken);

  // API endpoint for Android App Integration Guide and Config (no private credentials exposed)
  app.get('/api/android/config', (req, res) => {
    res.json({
      appName: 'Payowire / Eyemaze Android App',
      packageName: 'np.com.eyemaze.app',
      firebaseProjectId: FIREBASE_PROJECT_ID,
      apiVersion: 'v2.0.0',
      authVerifyEndpoint: '/api/auth/verify',
      dashboardUrl: 'https://ais-dev-kb5whbwhogqfr4ny7zic7a-474499258610.us-east1.run.app/#dashboard',
      supportedModes: ['Firebase Google Auth + Firestore', 'TWA (Trusted Web Activity)', 'WebView Hybrid'],
    });
  });

  // Public browser configuration for Google Maps JS API (HTTP-referrer restricted key)
  app.get('/api/config/maps', (_req, res) => {
    const apiKey =
      process.env.VITE_GOOGLE_MAPS_API_KEY ||
      process.env.GOOGLE_MAPS_API_KEY ||
      process.env.GMP_API_KEY ||
      '';
    res.json({ apiKey });
  });

  // Explicit SEO sitemap & robots routes
  app.get('/sitemap.xml', (_req, res) => {
    res.setHeader('Content-Type', 'application/xml');
    res.sendFile(path.resolve(__dirname, 'public/sitemap.xml'));
  });

  app.get('/robots.txt', (_req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile(path.resolve(__dirname, 'public/robots.txt'));
  });

  app.get('/llms.txt', (_req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile(path.resolve(__dirname, 'public/llms.txt'));
  });

  // Vite development middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
