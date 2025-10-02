import React, { useState, useRef, useEffect } from 'react';
import { generateImageSEOData } from '../utils/seoUtils';

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

interface SEOImageProps {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  projectType?: string;
  serviceType?: string;
  onClick?: () => void;
}

const SEOImage: React.FC<SEOImageProps> = ({
  src,
  alt,
  title,
  caption,
  className = '',
  width,
  height,
  priority = false,
  projectType,
  serviceType,
  onClick
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate SEO-optimized image data
  const seoData = generateImageSEOData(src, alt, title, caption);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Load images 50px before they come into view
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    
    // Track image view for analytics if project type is specified
    if (projectType && window.trackProjectView) {
      window.trackProjectView(projectType);
    }
  };

  // Handle image error
  const handleError = () => {
    setError(true);
  };

  // Handle click tracking
  const handleClick = () => {
    if (onClick) onClick();
    
    // Track service inquiry if service type is specified
    if (serviceType && window.trackServiceInquiry) {
      window.trackServiceInquiry(serviceType);
    }
  };

  // Generate structured data for images
  const generateImageStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      "url": src,
      "name": title || alt,
      "description": caption || alt,
      "caption": caption || alt,
      "creator": {
        "@type": "Organization",
        "name": "Siddhi Vinayak Steel"
      },
      "copyrightHolder": {
        "@type": "Organization", 
        "name": "Siddhi Vinayak Steel"
      },
      "acquireLicensePage": "https://siddhivinayaksteel.com/contact",
      "width": width,
      "height": height
    };
  };

  return (
    <div 
      ref={containerRef}
      className={`seo-image-container ${className}`}
      style={{ 
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        backgroundColor: '#f5f5f5',
        position: 'relative'
      }}
    >
      {/* Structured Data for Image */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateImageStructuredData())
        }}
      />
      
      {/* Loading placeholder */}
      {!isLoaded && !error && (
        <div
          className="image-placeholder"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid #cbd5e0',
              borderTop: '4px solid #3182ce',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
        </div>
      )}
      
      {/* Error fallback */}
      {error && (
        <div
          className="image-error"
          style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#fed7d7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c53030',
            fontSize: '14px'
          }}
        >
          Failed to load image
        </div>
      )}
      
      {/* Actual image */}
      {isInView && !error && (
        <img
          ref={imgRef}
          src={src}
          alt={seoData.alt}
          title={seoData.title}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={seoData.decoding}
          onLoad={handleLoad}
          onError={handleError}
          onClick={handleClick}
          data-project-type={projectType}
          data-service={serviceType}
          className={className}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.3s ease',
            opacity: isLoaded ? 1 : 0,
            cursor: onClick ? 'pointer' : 'default'
          }}
          // SEO attributes
          itemProp="image"
          itemScope
          itemType="https://schema.org/ImageObject"
        />
      )}
      
      {/* Caption */}
      {caption && isLoaded && (
        <figcaption
          style={{
            fontSize: '12px',
            color: '#666',
            marginTop: '8px',
            textAlign: 'center',
            fontStyle: 'italic'
          }}
          itemProp="caption"
        >
          {caption}
        </figcaption>
      )}
      
      {/* CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .seo-image-container:hover img {
          transform: scale(1.02);
          transition: transform 0.3s ease;
        }
        
        .seo-image-container {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        @media (max-width: 768px) {
          .seo-image-container {
            border-radius: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default SEOImage;