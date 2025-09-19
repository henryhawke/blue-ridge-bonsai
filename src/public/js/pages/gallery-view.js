// @ts-nocheck
import wixLocation from 'wix-location-frontend';
import { GallerySystem } from 'public/js/gdrive-gallery.js';

export async function initGalleryViewPage() {
  try {
    const query = wixLocation.query || {};
    const folderId = query.folderId;
    const shouldOpen = query.open === '1';
    if (!folderId) {
      console.warn('initGalleryViewPage: missing folderId');
      return;
    }

    showIfExists('#loadingBox');
    hideIfExists('#emptyStateBox');

    const gallerySystem = new GallerySystem();
    const items = await gallerySystem.getPhotosForGallery(folderId);

    const pro = $w('#proGallery1');
    if (!pro) {
      console.warn('initGalleryViewPage: #proGallery1 not found. Add Wix Pro Gallery with that ID.');
      return;
    }

    // Map Drive items to Pro Gallery items
    const galleryItems = (items || []).map((p) => ({
      src: p.src,
      title: p.title,
      description: p.description || ''
    }));

    if (typeof pro.items !== 'undefined') {
      pro.items = galleryItems;
    }

    hideIfExists('#loadingBox');

    if (shouldOpen && typeof pro.expand === 'function') {
      // Open lightbox on first image if desired
      setTimeout(() => {
        try { pro.expand(0); } catch(_) {}
      }, 250);
    }
  } catch (error) {
    console.error('initGalleryViewPage error:', error);
    hideIfExists('#loadingBox');
    showIfExists('#emptyStateBox');
  }
}

function showIfExists(selector) {
  try { const el = $w(selector); if (el && typeof el.show === 'function') el.show(); } catch(_) {}
}
function hideIfExists(selector) {
  try { const el = $w(selector); if (el && typeof el.hide === 'function') el.hide(); } catch(_) {}
}


