import React from 'react';
import { Helmet } from 'react-helmet-async';

// TypeScript global window extension
declare global {
  interface Window {
    trackServiceInquiry?: (serviceType: string) => void;
    trackProjectView?: (projectType: string) => void;
    trackContactForm?: (source: string) => void;
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'service';
  structuredData?: object;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Siddhi Vinayak Steel - Premium Steel & Glass Solutions | Mumbai's Leading Steel Fabrication Company",
  description = "Siddhi Vinayak Steel offers premium steel fabrication, glass installation, stainless steel railings, structural steel work in Mumbai, Maharashtra. 15+ years experience in construction industry. Get instant quotes for steel gates, glass partitions, handrails.",
  keywords = "steel fabrication mumbai, glass installation mumbai, stainless steel railing, structural steel work, steel gates, glass partition, steel construction, metal fabrication, handrail installation, steel contractor mumbai, glass doors, steel fencing, custom steel work, industrial steel, commercial steel, residential steel, steel welding, glass panels, steel staircase, balcony railing",
  image = "https://siddivinayakasteel.shop/assets/profilebanner.jpg",
  url = "https://siddivinayakasteel.shop",
  type = "website",
  structuredData
}) => {
  const siteTitle = title.includes("Siddhi Vinayak Steel") ? title : `${title} | Siddhi Vinayak Steel`;
  
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Siddhi Vinayak Steel",
    "description": description,
    "url": url,
    "telephone": "+91-9326698359",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Mumbai Industrial Area",
      "addressLocality": "Mumbai",
      "addressRegion": "Maharashtra",
      "postalCode": "400001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 19.0760,
      "longitude": 72.8777
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "priceRange": "$$",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Steel & Glass Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Steel Fabrication",
            "description": "Custom steel fabrication services for residential and commercial projects",
            "provider": {
              "@type": "LocalBusiness",
              "name": "Siddhi Vinayak Steel"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Glass Installation",
            "description": "Professional glass installation for doors, windows, and partitions",
            "provider": {
              "@type": "LocalBusiness",
              "name": "Siddhi Vinayak Steel"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Stainless Steel Railings",
            "description": "Premium stainless steel railing installation for balconies and staircases",
            "provider": {
              "@type": "LocalBusiness",
              "name": "Siddhi Vinayak Steel"
            }
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Mumbai Client"
        },
        "reviewBody": "Excellent steel fabrication work. Professional team and quality service."
      }
    ]
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Siddhi Vinayak Steel" />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content="Siddhi Vinayak Steel - Premium Steel & Glass Solutions" />
      <meta property="og:site_name" content="Siddhi Vinayak Steel" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content="Siddhi Vinayak Steel - Premium Steel & Glass Solutions" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#1a365d" />
      <meta name="msapplication-TileColor" content="#1a365d" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Location-based Meta Tags */}
      <meta name="geo.region" content="IN-MH" />
      <meta name="geo.placename" content="Mumbai" />
      
   
      
      {/* Business-specific Meta Tags */}
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      <meta name="revisit-after" content="1 day" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
      
      {/* Additional Meta Tags for Steel Industry */}
      <meta name="industry" content="Steel Fabrication, Glass Installation, Construction" />
      <meta name="category" content="Construction Services, Metal Fabrication" />
      <meta name="service-area" content="Mumbai, Pune, Thane, Navi Mumbai, Maharashtra" />
    </Helmet>
  );
};

export default SEOHead;