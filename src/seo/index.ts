// SEO Components
export { default as SEOHead } from './components/SEOHead';
export { default as GoogleAnalytics } from './components/GoogleAnalytics';
export { default as SEOImage } from './components/SEOImage';

// SEO Utilities
export {
  STEEL_KEYWORDS,
  generateSEOUrl,
  generateMetaDescription,
  generateKeywords,
  generateSEOTitle,
  generateStructuredData,
  calculateSEOScore,
  generateBreadcrumbData,
  generateFAQData,
  generateImageSEOData,
  generateRobotsContent
} from './utils/seoUtils';

// Types for SEO
export interface SEOPageData {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  url: string;
  type?: 'website' | 'article' | 'product' | 'service';
  structuredData?: object;
  breadcrumbs?: Array<{name: string, url: string}>;
  faqs?: Array<{question: string, answer: string}>;
}

// SEO Configuration
export const SEO_CONFIG = {
  siteName: 'Siddhi Vinayak Steel',
  siteUrl: 'https://siddivinayakasteel.shop',
  defaultTitle: "Siddhi Vinayak Steel - Premium Steel Fitting Services | Mumbai's Leading Steel Fabrication Company",
  defaultDescription: "Siddhi Vinayak Steel offers premium steel fabrication, glass installation, stainless steel railings, structural steel work in Mumbai, Maharashtra. 15+ years experience in construction industry. Get instant quotes for steel gates, glass partitions, handrails.",
  defaultImage: 'https://siddivinayakasteel.shop/assets/profilebanner.jpg',
  twitterHandle: '',
  facebookPage: '',
  linkedinPage: '',
  instagramPage: '',
  googleTagManagerId: 'GTM-TRLVR64P', // Your actual GTM ID
  googleAnalyticsId: '', // Will be managed through GTM
  googleSearchConsole: 'your-search-console-verification-code', // Replace with actual verification code
  businessInfo: {
    name: 'Siddhi Vinayak Steel',
    address: {
      street: 'Mumbai Industrial Area',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'IN'
    },
    phone: '+91-9876543210',
    email: 'info@siddhivinayaksteel.com',
    geo: {
      latitude: 19.0760,
      longitude: 72.8777
    },
    openingHours: 'Mo-Sa 09:00-18:00',
    priceRange: '$$'
  }
};

// Page-specific SEO data
export const PAGE_SEO_DATA: Record<string, SEOPageData> = {
  home: {
    title: "Siddhi Vinayak Steel - Premium Steel & Glass Solutions | Mumbai's Leading Steel Fabrication Company",
    description: "Siddhi Vinayak Steel offers premium steel fabrication, glass installation, stainless steel railings, structural steel work in Mumbai, Maharashtra. 15+ years experience in construction industry. Get instant quotes for steel gates, glass partitions, handrails.",
    keywords: ['steel fabrication', 'glass installation', 'mumbai', 'maharashtra'],
    url: 'https://siddivinayakasteel.shop/',
    type: 'website'
  },
  about: {
    title: "About Us - 15+ Years of Steel Fabrication Excellence in Mumbai",
    description: "Learn about Siddhi Vinayak Steel's journey, expertise in steel fabrication, glass installation services in Mumbai. Trusted by 500+ clients for quality steel work, custom fabrication, and professional installation services.",
    keywords: ['about siddhi vinayak steel', 'steel fabrication company mumbai', 'experienced steel contractor', 'mumbai', 'maharashtra'],
    url: 'https://siddivinayakasteel.shop/about',
    type: 'website'
  },
  services: {
    title: "Steel Fabrication Services Mumbai - Glass Installation & Stainless Steel Work",
    description: "Professional steel fabrication, glass installation, stainless steel railings, structural steel work in Mumbai. Custom steel gates, handrails, fencing, glass partitions. Free quotes available.",
    keywords: ['steel fabrication services', 'glass installation services', 'stainless steel work', 'mumbai', 'maharashtra'],
    url: 'https://siddivinayakasteel.shop/services',
    type: 'service'
  },
  portfolio: {
    title: "Steel & Glass Projects Portfolio - Mumbai's Premier Fabrication Work",
    description: "View our portfolio of completed steel fabrication and glass installation projects in Mumbai. Custom steel gates, railings, staircases, glass partitions, commercial and residential projects.",
    keywords: ['steel projects mumbai', 'glass installation portfolio', 'steel fabrication gallery', 'steel gates', 'handrail installation'],
    url: 'https://siddivinayakasteel.shop/portfolio',
    type: 'website'
  },
  gallery: {
    title: "Steel & Glass Work Gallery - Before & After Project Photos",
    description: "Browse our gallery of steel fabrication and glass installation projects. High-quality photos of completed steel gates, railings, glass partitions, custom steel work in Mumbai and Maharashtra.",
    keywords: ['steel work photos', 'glass installation images', 'fabrication gallery mumbai', 'steel contractor mumbai'],
    url: 'https://siddivinayakasteel.shop/gallery',
    type: 'website'
  },
  contact: {
    title: "Contact Siddhi Vinayak Steel - Get Free Quote for Steel & Glass Work",
    description: "Contact Siddhi Vinayak Steel for steel fabrication and glass installation services in Mumbai. Get free quotes, schedule consultations, and discuss your steel work requirements. Call now!",
    keywords: ['contact steel fabricator mumbai', 'free steel quote', 'glass installation inquiry', 'mumbai', 'maharashtra'],
    url: 'https://siddivinayakasteel.shop/contact',
    type: 'website'
  },
  testimonials: {
    title: "Client Testimonials - Steel & Glass Work Reviews Mumbai",
    description: "Read testimonials from satisfied clients about our steel fabrication and glass installation services. 5-star reviews for quality work, timely delivery, and professional service in Mumbai.",
    keywords: ['steel fabrication reviews mumbai', 'glass installation testimonials', 'client feedback steel work', 'mumbai', 'maharashtra'],
    url: 'https://siddivinayakasteel.shop/testimonials',
    type: 'website'
  }
};