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

interface GoogleAnalyticsProps {
  trackingId?: string;
  searchConsoleVerification?: string;
  gtmId?: string;
}

const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({
  trackingId = "", // Will use GTM instead
  searchConsoleVerification = "your-search-console-verification-code", // Replace with actual verification code
  gtmId = "GTM-TRLVR64P" // Your actual GTM ID
}) => {
  return (
    <Helmet>
      {/* Google Tag Manager */}
      {gtmId && (
        <>
          <script>
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
              
              // Initialize dataLayer
              window.dataLayer = window.dataLayer || [];
              
              // Track important business events for steel business
              function trackServiceInquiry(serviceType) {
                window.dataLayer.push({
                  event: 'service_inquiry',
                  service_type: serviceType,
                  event_category: 'Lead Generation',
                  event_label: serviceType,
                  value: 1
                });
              }
              
              function trackProjectView(projectType) {
                window.dataLayer.push({
                  event: 'project_view',
                  project_type: projectType,
                  event_category: 'Portfolio Engagement',
                  event_label: projectType,
                  value: 1
                });
              }
              
              function trackContactForm(source) {
                window.dataLayer.push({
                  event: 'contact_form_submit',
                  form_source: source,
                  event_category: 'Lead Generation',
                  event_label: source,
                  value: 5
                });
              }
              
              // Track scroll depth for engagement
              let scrollDepth = 0;
              window.addEventListener('scroll', function() {
                const currentScrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                if (currentScrollDepth > scrollDepth && currentScrollDepth % 25 === 0) {
                  scrollDepth = currentScrollDepth;
                  window.dataLayer.push({
                    event: 'scroll_depth',
                    scroll_percentage: scrollDepth,
                    event_category: 'Engagement',
                    event_label: scrollDepth + '%',
                    value: scrollDepth
                  });
                }
              });
              
              // Make functions globally available
              window.trackServiceInquiry = trackServiceInquiry;
              window.trackProjectView = trackProjectView;
              window.trackContactForm = trackContactForm;
            `}
          </script>
        </>
      )}
      
      {/* Google Tag Manager (noscript) */}
      {gtmId && (
        <noscript>
          {`<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`}
        </noscript>
      )}
      
      {/* Google Search Console Verification */}
      {searchConsoleVerification && (
        <meta name="google-site-verification" content={searchConsoleVerification} />
      )}
      
      {/* Bing Webmaster Tools Verification */}
      <meta name="msvalidate.01" content="your-bing-verification-code" />
      
      {/* Yandex Verification */}
      <meta name="yandex-verification" content="your-yandex-verification-code" />
      
      {/* Additional tracking for steel industry specific metrics */}
      <script>
        {`
          // Custom tracking for steel industry KPIs
          document.addEventListener('DOMContentLoaded', function() {
            // Track important CTA button clicks
            const ctaButtons = document.querySelectorAll('[data-cta="service-inquiry"]');
            ctaButtons.forEach(button => {
              button.addEventListener('click', function() {
                const serviceType = this.getAttribute('data-service') || 'general';
                if (window.trackServiceInquiry) {
                  window.trackServiceInquiry(serviceType);
                }
              });
            });
            
            // Track portfolio image views
            const portfolioImages = document.querySelectorAll('[data-project-type]');
            portfolioImages.forEach(image => {
              const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                  if (entry.isIntersecting) {
                    const projectType = entry.target.getAttribute('data-project-type');
                    if (window.trackProjectView && projectType) {
                      window.trackProjectView(projectType);
                    }
                    observer.unobserve(entry.target);
                  }
                });
              }, { threshold: 0.5 });
              observer.observe(image);
            });
            
            // Track phone number clicks
            const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
            phoneLinks.forEach(link => {
              link.addEventListener('click', function() {
                gtag('event', 'phone_click', {
                  event_category: 'Contact',
                  event_label: 'phone_number',
                  value: 10
                });
              });
            });
            
            // Track WhatsApp clicks
            const whatsappLinks = document.querySelectorAll('a[href*="whatsapp"]');
            whatsappLinks.forEach(link => {
              link.addEventListener('click', function() {
                gtag('event', 'whatsapp_click', {
                  event_category: 'Contact',
                  event_label: 'whatsapp',
                  value: 8
                });
              });
            });
          });
        `}
      </script>
    </Helmet>
  );
};

export default GoogleAnalytics;