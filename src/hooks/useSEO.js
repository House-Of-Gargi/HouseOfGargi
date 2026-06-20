import { useEffect } from 'react';

export default function useSEO({ title, description }) {
  useEffect(() => {
    // Save the original title/description so we can restore it if needed,
    // though in an SPA we usually just overwrite it per page.
    const defaultTitle = 'House of Gargi | Handcrafted Luxury Indian Fashion';
    const defaultDesc = 'House of Gargi offers luxury, handcrafted traditional Indian fashion. Explore our curated collections of pure silk sarees, bridal lehengas, block-printed kurta sets, and heritage jewellery. Handcrafted Heritage, Worn Today.';

    if (title) {
      document.title = `${title} | House of Gargi`;
      // Update og:title
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', `${title} | House of Gargi`);
      // Update twitter:title
      const twTitle = document.querySelector('meta[property="twitter:title"]');
      if (twTitle) twTitle.setAttribute('content', `${title} | House of Gargi`);
    } else {
      document.title = defaultTitle;
    }

    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', description);
      const twDesc = document.querySelector('meta[property="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', description);
    } else {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', defaultDesc);
      }
    }
  }, [title, description]);
}
