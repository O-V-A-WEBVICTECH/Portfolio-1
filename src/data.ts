import { Product, Review, EQPreset } from './types';

// Import images from assets to allow Vite to bundle and cache-bust them correctly
import earbudImg from './assets/images/earbud_y168a_1782901344186.jpg';
import proImg from './assets/images/pro_x168a_1782901354641.jpg';
import speakerImg from './assets/images/speaker_p168a_1782901366265.jpg';
import heroImg from './assets/images/crescendo_hero_1782901331827.jpg';

export { heroImg };

export const PRODUCTS: Product[] = [
  {
    id: 'earbud-y168a',
    name: 'Earbud Y168A',
    category: 'earbuds',
    price: 270.00,
    rating: 4.9,
    reviewCount: 124,
    image: earbudImg,
    colors: [
      { name: 'Obsidian Black', hex: '#111827' },
      { name: 'Silver Mist', hex: '#9CA3AF' },
      { name: 'Midnight Violet', hex: '#4C1D95' }
    ],
    specs: {
      driver: '11mm Dynamic Driver with Graphene Diaphragm',
      battery: 'Up to 8 hours (32 hours total with case)',
      bluetooth: 'Bluetooth® 5.3 with LE Audio Support',
      waterproof: 'IPX7 Sweat & Water Resistant',
      weight: '4.8g per earbud'
    },
    description: 'Immerse yourself in unrivaled acoustic clarity. Features Active Ambient Cancellation (AAC), high-definition codec support (LDAC/AAC), and ergonomic touch controls.',
    badge: 'Best Seller'
  },
  {
    id: 'pro-x168a',
    name: 'Pro X168A',
    category: 'headphones',
    price: 250.00,
    rating: 4.8,
    reviewCount: 98,
    image: proImg,
    colors: [
      { name: 'Charcoal Matte', hex: '#1F2937' },
      { name: 'Royal Eclipse', hex: '#1E3A8A' },
      { name: 'Champagne Gold', hex: '#D97706' }
    ],
    specs: {
      driver: '40mm Custom-Engineered Dynamic Drivers',
      battery: 'Up to 45 hours with ANC Off (30 hours ANC On)',
      bluetooth: 'Bluetooth® 5.3 with Multi-Point Connection',
      waterproof: 'IPX4 Splash Resistant',
      weight: '245g ultra-lightweight design'
    },
    description: 'Over-ear mastery redefined. Delivering high-resolution audio, custom-tuned memory foam cushion earcups, and an advanced 4-microphone hybrid feedback ANC array.',
    badge: 'Premium Studio'
  },
  {
    id: 'speaker-p168a',
    name: 'Speaker P168A',
    category: 'speakers',
    price: 240.00,
    rating: 4.7,
    reviewCount: 86,
    image: speakerImg,
    colors: [
      { name: 'Sleek Obsidian', hex: '#0F172A' },
      { name: 'Stone Grey', hex: '#4B5563' },
      { name: 'Crescendo Coral', hex: '#DC2626' }
    ],
    specs: {
      driver: 'Dual 50mm Full-Range Drivers & Dual Passive Radiators',
      battery: 'Up to 24 hours playback time',
      bluetooth: 'Bluetooth® 5.2 with 100ft range',
      waterproof: 'IP67 Dustproof & Waterproof',
      weight: '480g portable build'
    },
    description: 'Room-filling, bidirectional spatial acoustics in a compact, rugged form factor. Outfitted with high-excursion bass radiators and an integrated speakerphone mic.',
    badge: 'Spatial Audio'
  },
  {
    id: 'wireless-charger-y12',
    name: 'Wireless Charger Y12',
    category: 'accessories',
    price: 65.00,
    rating: 4.6,
    reviewCount: 45,
    image: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?q=80&w=600&auto=format&fit=crop',
    colors: [
      { name: 'Carbon Black', hex: '#111827' },
      { name: 'Chalk White', hex: '#F9FAFB' }
    ],
    specs: {
      power: '15W Fast Qi Wireless Output',
      weight: '110g slim profile',
      bluetooth: 'N/A'
    },
    description: 'Sleek, anodized aluminum charging pad optimized for high-speed power delivery. Features temperature protection and automatic object detection.',
    badge: 'Accessories'
  },
  {
    id: 'accessories-brick-w30',
    name: 'Wall Adapter W30',
    category: 'accessories',
    price: 45.00,
    rating: 4.8,
    reviewCount: 32,
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=600&auto=format&fit=crop',
    colors: [
      { name: 'Polar White', hex: '#F3F4F6' },
      { name: 'Obsidian Black', hex: '#111827' }
    ],
    specs: {
      power: '30W GaN Fast Charger Port',
      weight: '65g compact plug'
    },
    description: 'Gallium Nitride (GaN) technology enables 30W charging speeds in a miniature, travel-ready folding prongs housing. Keeps your Crescendo hardware powered.',
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userName: 'Alexander V.',
    rating: 5,
    date: '2026-06-25',
    comment: 'The acoustic tuning on the Pro X168A is incredible. Bass is rich but never muddy, and the mid-tones have a spacious, live-room feel. Definitely rivals anything double its price.',
    verified: true
  },
  {
    id: 'rev-2',
    userName: 'Elena R.',
    rating: 5,
    date: '2026-06-18',
    comment: 'The Y168A earbuds fit perfectly. I run with them every day and they never budge. The ambient sound cancellation is outstanding in noisy traffic.',
    verified: true
  },
  {
    id: 'rev-3',
    userName: 'Marcus T.',
    rating: 4,
    date: '2026-06-10',
    comment: 'Super sturdy build on the Speaker P168A. Sound remains extremely crisp even at maximum volume in outdoor pool parties. Great buy!',
    verified: true
  }
];

export const EQ_PRESETS: EQPreset[] = [
  {
    name: 'Crescendo Signature',
    bass: 4,
    mid: 2,
    treble: 5,
    description: 'Our custom-tuned house curve. Features tight, punching sub-bass, vivid vocals, and airy, sparkling high frequencies.'
  },
  {
    name: 'Bass Heavyweight',
    bass: 8,
    mid: -1,
    treble: 1,
    description: 'Rich, deep, club-like bass emphasis. Perfect for Hip-Hop, House, and electronic soundtracks.'
  },
  {
    name: 'Acoustic & Vocal Focus',
    bass: -2,
    mid: 6,
    treble: 4,
    description: 'Pushes mid-frequencies forward for beautiful, intimate singer-songwriter acoustic tracks and podcasts.'
  },
  {
    name: 'Studio Reference',
    bass: 0,
    mid: 0,
    treble: 0,
    description: 'Completely uncolored, transparent frequency response. Exactly as the studio engineer intended.'
  }
];
