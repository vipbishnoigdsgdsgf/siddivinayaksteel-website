// SEO Keywords for Steel & Glass Industry
export const STEEL_KEYWORDS = {
  primary: [
    'steel fabrication',
    'glass installation',
    'stainless steel railing',
    'structural steel work',
    'steel construction',
    'metal fabrication'
  ],
  secondary: [
    'steel gates',
    'glass partition',
    'handrail installation',
    'steel contractor',
    'glass doors',
    'steel fencing',
    'custom steel work',
    'industrial steel',
    'commercial steel',
    'residential steel',
    'steel welding',
    'glass panels',
    'steel staircase',
    'balcony railing'
  ],
  location: [
    'mumbai',
    'navi mumbai',
    'thane',
    'pune',
    'maharashtra',
    'india'
  ],
  services: [
    'steel fabrication services',
    'glass installation services',
    'stainless steel work',
    'structural steel solutions',
    'custom metal work',
    'glass partition installation',
    'steel gate manufacturing',
    'handrail fabrication',
    'steel fencing solutions',
    'glass door installation'
  ]
};

// Generate SEO-friendly URLs
export const generateSEOUrl = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

// Generate meta description with keywords
export const generateMetaDescription = (
  content: string,
  keywords: string[],
  maxLength: number = 160
): string => {
  let description = content.substring(0, maxLength - 20);
  
  // Add keywords if they're not already in the description
  const keywordPhrase = keywords.slice(0, 2).join(', ');
  if (!description.toLowerCase().includes(keywords[0].toLowerCase())) {
    description = `${keywordPhrase} - ${description}`;
  }
  
  // Ensure it ends with a complete sentence
  const lastPeriod = description.lastIndexOf('.');
  if (lastPeriod > 0 && lastPeriod < description.length - 10) {
    description = description.substring(0, lastPeriod + 1);
  }
  
  return description.length > maxLength ? 
    description.substring(0, maxLength - 3) + '...' : 
    description;
};

// Generate keywords string for meta tags
export const generateKeywords = (
  primaryKeywords: string[],
  secondaryKeywords: string[],
  locationKeywords: string[]
): string => {
  const combined = [
    ...primaryKeywords.slice(0, 3),
    ...secondaryKeywords.slice(0, 5),
    ...locationKeywords.slice(0, 3)
  ];
  
  return combined.join(', ');
};

// SEO-friendly title generation
export const generateSEOTitle = (
  pageTitle: string,
  includeCompany: boolean = true,
  keywords?: string[]
): string => {
  let title = pageTitle;
  
  // Add primary keyword if not present
  if (keywords && keywords.length > 0) {
    const primaryKeyword = keywords[0];
    if (!title.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      title = `${primaryKeyword} - ${title}`;
    }
  }
  
  // Add company name
  if (includeCompany && !title.includes('Siddhi Vinayak Steel')) {
    title = `${title} | Siddhi Vinayak Steel`;
  }
  
  // Ensure title is within optimal length (50-60 characters)
  if (title.length > 60) {
    const parts = title.split(' | ');
    if (parts.length > 1) {
      title = `${parts[0].substring(0, 40)}... | ${parts[parts.length - 1]}`;
    } else {
      title = title.substring(0, 57) + '...';
    }
  }
  
  return title;
};

// Generate structured data for different page types
export const generateStructuredData = (type: string, data: any) => {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": type
  };
  
  switch (type) {
    case 'LocalBusiness':
      return {
        ...baseStructuredData,
        "name": "Siddhi Vinayak Steel",
        "description": "Premium steel fabrication and glass installation services in Hyderabad",
        "url": "https://www.siddivinayakasteel.shop/",
        "telephone": "+91-9326698359",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Hyderabad Industrial Area",
          "addressLocality": "Hyderabad",
          "addressRegion": "Telangana",
          "postalCode": "500098",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 19.0760,
          "longitude": 72.8777
        },
        "openingHours": "Mo-Sa 09:00-18:00",
        "priceRange": "$$",
        ...data
      };
      
    case 'Service':
      return {
        ...baseStructuredData,
        "provider": {
          "@type": "LocalBusiness",
          "name": "Siddhi Vinayak Steel"
        },
        "areaServed": "Hyderabad, Telangana",
        ...data
      };
      
    case 'Product':
      return {
        ...baseStructuredData,
        "manufacturer": {
          "@type": "Organization",
          "name": "Siddhi Vinayak Steel"
        },
        ...data
      };
      
    case 'Article':
      return {
        ...baseStructuredData,
        "publisher": {
          "@type": "Organization",
          "name": "Siddhi Vinayak Steel",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.siddivinayakasteel.shop/siddhi-vinayak-logo.png"
          }
        },
        ...data
      };
      
    default:
      return { ...baseStructuredData, ...data };
  }
};

// Check SEO score for content
export const calculateSEOScore = (content: string, targetKeywords: string[]): number => {
  let score = 0;
  const contentLower = content.toLowerCase();
  const wordCount = content.split(' ').length;
  
  // Keyword density check (2-3% is optimal)
  targetKeywords.forEach(keyword => {
    const keywordCount = (contentLower.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
    const density = (keywordCount / wordCount) * 100;
    
    if (density >= 1 && density <= 3) {
      score += 20;
    } else if (density > 0) {
      score += 10;
    }
  });
  
  // Content length check (300+ words is good)
  if (wordCount >= 300) {
    score += 20;
  } else if (wordCount >= 150) {
    score += 10;
  }
  
  // Header tags presence (H1, H2, H3)
  if (content.includes('<h1>') || content.includes('# ')) score += 10;
  if (content.includes('<h2>') || content.includes('## ')) score += 10;
  if (content.includes('<h3>') || content.includes('### ')) score += 10;
  
  // Image alt text check
  if (content.includes('alt=')) score += 10;
  
  return Math.min(score, 100);
};

// Generate breadcrumb structured data
export const generateBreadcrumbData = (breadcrumbs: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

// Generate FAQ structured data
export const generateFAQData = (faqs: Array<{question: string, answer: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

// Image optimization for SEO
export const generateImageSEOData = (
  src: string,
  alt: string,
  title?: string,
  caption?: string
) => {
  return {
    src,
    alt: `${alt} - Siddhi Vinayak Steel`,
    title: title || alt,
    caption: caption || alt,
    loading: 'lazy' as const,
    decoding: 'async' as const
  };
};

// Generate robots meta content
export const generateRobotsContent = (
  index: boolean = true,
  follow: boolean = true,
  archive: boolean = true,
  snippet: boolean = true
): string => {
  const directives = [];
  
  if (index) directives.push('index');
  else directives.push('noindex');
  
  if (follow) directives.push('follow');
  else directives.push('nofollow');
  
  if (!archive) directives.push('noarchive');
  if (!snippet) directives.push('nosnippet');
  
  return directives.join(', ');
};
