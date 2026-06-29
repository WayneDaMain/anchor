import React, { useEffect } from 'react';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  canonical, 
  ogImage = 'https://anchor.biblescriptura.com/folio.png', 
  ogType = 'website' 
}) => {
  useEffect(() => {
    // 1. Update Title
    if (title) {
      document.title = title;
    }

    // Helper to update or create meta tags
    const updateOrCreateMeta = (selector, nameAttr, nameValue, content) => {
      if (!content) return;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, nameValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Update Description
    if (description) {
      updateOrCreateMeta('meta[name="description"]', 'name', 'description', description);
      updateOrCreateMeta('meta[property="og:description"]', 'property', 'og:description', description);
      updateOrCreateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    }

    // 3. Update Titles (OG / Twitter)
    if (title) {
      updateOrCreateMeta('meta[property="og:title"]', 'property', 'og:title', title);
      updateOrCreateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    }

    // 4. Update Type
    updateOrCreateMeta('meta[property="og:type"]', 'property', 'og:type', ogType);

    // 5. Update Image
    if (ogImage) {
      updateOrCreateMeta('meta[property="og:image"]', 'property', 'og:image', ogImage);
      updateOrCreateMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);
    }

    // 6. Update Keywords
    if (keywords && keywords.length > 0) {
      const keywordsStr = Array.isArray(keywords) ? keywords.join(', ') : keywords;
      updateOrCreateMeta('meta[name="keywords"]', 'name', 'keywords', keywordsStr);
    }

    // 7. Update Canonical link & og:url
    if (canonical) {
      let linkElement = document.querySelector('link[rel="canonical"]');
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'canonical');
        document.head.appendChild(linkElement);
      }
      linkElement.setAttribute('href', canonical);
      
      updateOrCreateMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
      updateOrCreateMeta('meta[name="twitter:url"]', 'name', 'twitter:url', canonical);
    }
  }, [title, description, keywords, canonical, ogImage, ogType]);

  return null;
};

export default SEO;
