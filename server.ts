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

      const systemInstruction = `You are the Senior Pre-Press Director and Print Consultant at Eyemaze Graphics Enterprises in Kathmandu, Nepal.
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

  // API endpoint for Authentication (used by both Web and Android App)
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    // Support Jiwan Kumar Majhi or standard demo
    const user = {
      id: 'usr_85050801',
      name: 'Jiwan Kumar Majhi',
      email: cleanEmail || '4jsm.life@gmail.com',
      accountId: '85050801',
      balanceNpr: 124555,
      balanceUsd: 0.0,
      isVerified: false,
      totalCards: 0,
      bankAccounts: 0,
      token: 'jwt_eyemaze_' + Buffer.from(cleanEmail || '4jsm.life').toString('base64'),
    };

    res.json({
      success: true,
      message: 'Login successful',
      user,
      token: user.token,
    });
  });

  // API endpoint for Android App Integration Guide and Config
  app.get('/api/android/config', (req, res) => {
    res.json({
      appName: 'Payowire / Eyemaze Android App',
      packageName: 'np.com.eyemaze.app',
      apiVersion: 'v1.0.0',
      authEndpoint: '/api/auth/login',
      dashboardUrl: 'https://ais-dev-kb5whbwhogqfr4ny7zic7a-474499258610.us-east1.run.app/#dashboard',
      supportedModes: ['TWA (Trusted Web Activity)', 'WebView Hybrid', 'Native REST API (Retrofit)'],
      quickCredentials: {
        email: '4jsm.life@gmail.com',
        accountId: '85050801',
      }
    });
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
