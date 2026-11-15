import type { PrintCategory, PrintFinish, PrintOrder } from '../utils/printPricing';

export interface ServicePillar {
  id: string;
  title: string;
  shortDesc: string;
  items: string[];
  accentBg: string;
  accentText: string;
}

export interface PrintSpecItem {
  id: string;
  label: string;
  detail: string;
  category: PrintCategory;
  finish: PrintFinish;
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: 'stationery' | 'flex' | 'packaging' | 'photography' | 'offset';
  categoryLabel: string;
  client: string;
  specLine: string;
  image: string;
  description: string;
  deliverables: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const SERVICE_PILLARS: ServicePillar[] = [
  {
    id: 'print',
    title: 'Print Services',
    shortDesc: 'Heidelberg multi-color offset, large-format flex banners, vinyl stickers, and custom packaging boxes.',
    items: ['Offset Catalogs & Brochures', 'Flex & Star Vinyl Banners', 'Die-Cut Packaging Boxes', 'Sublimation Mugs & Apparel'],
    accentBg: 'bg-rose-50',
    accentText: 'text-rose-600',
  },
  {
    id: 'design',
    title: 'Design Services',
    shortDesc: 'Print-ready graphic design, corporate brand guidelines, packaging dielines, and CMYK pre-press proofing.',
    items: ['Brand Identity & Logos', 'Packaging Dieline Artwork', 'Annual Report Layouts', 'Pre-Press Color Separation'],
    accentBg: 'bg-orange-50',
    accentText: 'text-orange-600',
  },
  {
    id: 'stationery',
    title: 'Stationery Services',
    shortDesc: 'Gold-foiled visiting cards, letterheads, PVC smart ID cards, custom diaries, and corporate gift sets.',
    items: ['Embossed Visiting Cards', 'Letterheads & Envelopes', 'PVC ID Cards & Lanyards', 'Personalized Corporate Sets'],
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-600',
  },
  {
    id: 'photography',
    title: 'Photography Services',
    shortDesc: 'Commercial product shoots, studio packshots, architectural photography, and corporate event coverage.',
    items: ['Studio Product Packshots', 'Executive Headshots', 'Catalog & Lookbook Shoots', 'High-Res Retouching'],
    accentBg: 'bg-sky-50',
    accentText: 'text-sky-600',
  },
];

export const PRINT_SPECS_MATRIX: PrintSpecItem[] = [
  { id: 'spec-foil', label: '350 GSM Gold Foil Card', detail: 'Hot foil + Velvet Matte', category: 'visiting-cards', finish: 'gold-foil' },
  { id: 'spec-uv', label: 'Spot UV Visiting Card', detail: '400 GSM Art Board', category: 'visiting-cards', finish: 'spot-uv' },
  { id: 'spec-flex', label: 'UV Star Flex Banner', detail: '440 GSM Weatherproof', category: 'flex-banners', finish: 'standard' },
  { id: 'spec-vinyl', label: 'Matte Vinyl Wall Decal', detail: 'Eco-Solvent High DPI', category: 'flex-banners', finish: 'matte-lamination' },
  { id: 'spec-catalog', label: 'Saddle-Stitched Catalog', detail: '170 GSM Art + 300 Cover', category: 'offset-brochures', finish: 'matte-lamination' },
  { id: 'spec-trifold', label: 'Tri-Fold Offset Brochure', detail: '150 GSM Glossy Art', category: 'offset-brochures', finish: 'standard' },
  { id: 'spec-box', label: 'Rigid Die-Cut Gift Box', detail: '1200 GSM Greyboard', category: 'packaging-boxes', finish: 'gold-foil' },
  { id: 'spec-bag', label: 'Embossed Paper Carry Bag', detail: '250 GSM Kraft / Art', category: 'packaging-boxes', finish: 'matte-lamination' },
  { id: 'spec-letter', label: '100 GSM Bond Letterhead', detail: 'Executive Watermark', category: 'stationery-sets', finish: 'standard' },
  { id: 'spec-id', label: 'CR80 PVC ID + Lanyard', detail: 'Satin Sublimation Strap', category: 'stationery-sets', finish: 'matte-lamination' },
  { id: 'spec-tee', label: 'Combed Cotton Merch Tee', detail: 'DTF & Screen Print', category: 'merchandise', finish: 'standard' },
  { id: 'spec-mug', label: 'Ceramic Sublimation Mug', detail: 'AAA Grade Full Wrap', category: 'merchandise', finish: 'standard' },
];

export const INITIAL_PRINT_ORDERS: PrintOrder[] = [
  {
    id: 'EYM-4082',
    title: 'Executive Gold Foil Visiting Cards',
    client: 'Aeterna Holdings',
    category: 'visiting-cards',
    spec: '350 GSM Matte · Gold Foil Stamping',
    quantity: 1000,
    totalNpr: 6160,
    status: 'In Press',
    updatedAt: 'Today, 11:20 AM',
  },
  {
    id: 'EYM-4081',
    title: 'Rigid Cosmetic Gift Boxes & Bags',
    client: 'Aurelia Botanicals',
    category: 'packaging-boxes',
    spec: '1200 GSM Rigid Board · Coral & Foil',
    quantity: 500,
    totalNpr: 83781,
    status: 'Proof Review',
    updatedAt: 'Today, 09:45 AM',
  },
  {
    id: 'EYM-4079',
    title: 'Himalayan Trail Expo Flex Banners',
    client: 'Adventure Tours Nepal',
    category: 'flex-banners',
    spec: '440 GSM Star Flex · UV Solvent',
    quantity: 25,
    totalNpr: 1200,
    status: 'Dispatched',
    updatedAt: 'Yesterday, 04:15 PM',
  },
  {
    id: 'EYM-4076',
    title: 'Annual Report 2026 Offset Print',
    client: 'Kathmandu FinCorp',
    category: 'offset-brochures',
    spec: '170 GSM Art Paper · Perfect Bound',
    quantity: 1500,
    totalNpr: 33414,
    status: 'Completed',
    updatedAt: '12 Nov 2026',
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 1,
    title: 'Luxury Gold Foil Stationery Suite',
    category: 'stationery',
    categoryLabel: 'Stationery Services',
    client: 'Aeterna & Co.',
    specLine: '350 GSM Velvet Matte · Hot Gold Foil · Embossed Seal',
    image: '/src/assets/images/print_visiting_cards_1794657251418.jpg',
    description: 'Bespoke corporate stationery set engineered with 350 GSM dark navy cotton board, crisp metallic gold foil stamping, matching watermarked letterheads, and custom envelopes.',
    deliverables: ['1,000 Foil Visiting Cards', '500 Bond Letterheads', '500 Custom Envelopes'],
  },
  {
    id: 2,
    title: 'Die-Cut Packaging & Embossed Gift Bags',
    category: 'packaging',
    categoryLabel: 'Specialty Items',
    client: 'Aurelia & Luna',
    specLine: '1200 GSM Rigid Box · Laser Die-Cut · Ribbon Closure',
    image: '/src/assets/images/print_packaging_box_1794657536632.jpg',
    description: 'Custom structural packaging dielines and luxury retail carry bags featuring coral and charcoal board finishes with precision blind debossing.',
    deliverables: ['Custom Structural Dieline', 'Rigid Magnetic Boxes', 'Foil-Stamped Retail Bags'],
  },
  {
    id: 3,
    title: 'Large-Format Outdoor Flex & Vinyl',
    category: 'flex',
    categoryLabel: 'Print Services',
    client: 'Adventure Tours Nepal',
    specLine: '440 GSM Star Flex · Weatherproof Eco-Solvent Ink',
    image: '/src/assets/images/print_flex_banner_1794657251987.jpg',
    description: 'High-impact large format hoarding banners and exhibition backdrops printed on weather-resistant star flex with vivid outdoor color calibration.',
    deliverables: ['20x10 ft Hoarding Flex', 'Roll-Up Standees', 'Vinyl Counter Branding'],
  },
  {
    id: 4,
    title: 'Studio Product Photography & Lookbook',
    category: 'photography',
    categoryLabel: 'Photography Services',
    client: 'Serenity Naturals',
    specLine: 'Multi-Strobe Studio Lighting · 50MP Color-Matched RAW',
    image: '/src/assets/images/photography_studio_shoot_1794657533895.jpg',
    description: 'Commercial product photography and print-ready color grading tailored specifically for CMYK packaging catalogs and billboard campaigns.',
    deliverables: ['30 Studio Packshots', 'Print-Ready CMYK Retouch', 'Catalog Spread Layouts'],
  },
  {
    id: 5,
    title: 'Custom Merch & Sublimation Gift Sets',
    category: 'offset',
    categoryLabel: 'Personalized Sets',
    client: 'Elevate Adventures',
    specLine: 'Full-Color Sublimation · Combed Cotton Apparel',
    image: '/src/assets/images/print_merchandise_1794657251898.jpg',
    description: 'Complete corporate gift packs featuring custom printed apparel, ceramic mugs, stainless tumblers, and canvas tote bags with vibrant fade-proof transfer.',
    deliverables: ['250 Printed T-Shirts', '250 Ceramic Mugs', '250 Canvas Tote Bags'],
  },
  {
    id: 6,
    title: 'Multi-Color Offset Press Production',
    category: 'offset',
    categoryLabel: 'Print Services',
    client: 'Himalayan Publications',
    specLine: 'Heidelberg Speedmaster · Pantone Spot Calibration',
    image: '/src/assets/images/printing_press_hero_1794657251905.jpg',
    description: 'High-volume magazine, book, and commercial catalog printing run on industrial multi-color offset presses with strict density verification.',
    deliverables: ['10,000 Offset Catalogs', 'Pantone Ink Matching', 'Automated Saddle Stitching'],
  },
];

export const PRINT_FAQS: FaqItem[] = [
  {
    question: 'What artwork file formats work best for Eyemaze offset and flex printing?',
    answer: 'For sharpest print output, submit vector PDF, CorelDRAW (.cdr), or Adobe Illustrator (.ai) files in CMYK color mode with 3mm bleed margins and outlined fonts. High-resolution 300 DPI TIFF/PNG files are also supported after our pre-press team verifies them.',
  },
  {
    question: 'How fast can you deliver visiting cards, stationery, and urgent flex banners?',
    answer: 'Digital cards and flex banners can be produced within 24 to 48 hours on Express Rush. Standard offset visiting cards, letterheads, and brochures ship within 3 to 4 business days from our मरिण–६, छाप, सिन्धुली press across Nepal.',
  },
  {
    question: 'Can I preview a digital or physical press proof before full bulk production?',
    answer: 'Yes. Every order goes through a Proof Review step in our Print Portal where we share calibrated digital artwork proofs. For bulk offset runs above 1,000 copies or custom packaging boxes, we also provide a physical press dummy.',
  },
  {
    question: 'Do you handle both commercial product photography and print layout design?',
    answer: 'Yes — Eyemaze Graphics Enterprises combines commercial studio photography, graphic design, and in-house offset/digital printing under one roof so colors stay consistent from camera lens to printed paper.',
  },
];
