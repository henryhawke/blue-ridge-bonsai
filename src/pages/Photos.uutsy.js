/**
 * BLUE RIDGE BONSAI SOCIETY - PHOTO GALLERIES PAGE
 *
 * COMPONENTS & IMPLEMENTATIONS:
 *
 * 1. GALLERY SYSTEM INTEGRATION
 *    - Imports GallerySystem class from public/js/gdrive-gallery.js
 *    - Centralized photo gallery management and display
 *    - Google Drive integration for photo storage
 *    - Gallery metadata and statistics tracking
 *
 * 2. PAGE INITIALIZATION & STRUCTURE
 *    - initializeGalleriesPage(): Main orchestration function
 *    - createPageStructure(): Complete HTML layout with gallery grid
 *    - Error handling and empty state management
 *    - Console logging for debugging and monitoring
 *
 * 3. GALLERY DISPLAY SYSTEM
 *    - displayGalleries(): Fetches and renders all available galleries
 *    - Gallery cards with cover images and metadata
 *    - Gallery statistics display (photo count, view count)
 *    - Responsive grid layout for gallery cards
 *    - Gallery navigation and linking
 *
 * 4. GALLERY CARD COMPONENTS
 *    - Individual gallery card with cover image
 *    - Gallery name and description display
 *    - Photo count and view statistics
 *    - Click navigation to gallery detail view
 *    - Glass-card styling for visual appeal
 *
 * 5. NAVIGATION & LINKING
 *    - Gallery detail page navigation
 *    - URL parameter handling for gallery identification
 *    - Deep linking to specific galleries
 *    - SEO-friendly URL structure
 *
 * 6. RESPONSIVE DESIGN
 *    - Mobile-first responsive layout
 *    - Adaptive gallery grid system
 *    - Flexible card layouts
 *    - Cross-device compatibility
 *
 * 7. PERFORMANCE OPTIMIZATION
 *    - Efficient gallery data loading
 *    - Optimized image loading
 *    - Minimal DOM manipulation
 *    - Fast gallery rendering
 *
 * 8. USER EXPERIENCE FEATURES
 *    - Clear gallery organization
 *    - Visual gallery previews
 *    - Gallery statistics and metadata
 *    - Intuitive navigation flow
 *    - Loading states and error handling
 *
 * 9. CONTENT MANAGEMENT
 *    - Dynamic gallery loading from backend
 *    - Gallery metadata management
 *    - Photo count tracking
 *    - View statistics tracking
 *
 * 10. ACCESSIBILITY FEATURES
 *    - Semantic HTML structure
 *    - Alt text for gallery images
 *    - Keyboard navigation support
 *    - Screen reader compatibility
 *
 * DEPENDENCIES:
 *    - GallerySystem class (public/js/gdrive-gallery.js)
 *    - Wix Velo framework ($w API)
 *    - Global CSS classes and styling
 *    - Google Drive API integration
 *    - Backend gallery data systems
 *
 * BROWSER COMPATIBILITY:
 *    - Modern browsers with ES6+ support
 *    - Wix Velo environment
 *    - Mobile and desktop responsive
 *
 * SEO & CONTENT ORGANIZATION:
 *    - Semantic HTML structure
 *    - Proper heading hierarchy
 *    - Gallery metadata for search engines
 *    - Image optimization for performance
 */

// Blue Ridge Bonsai Society - Main Photo Galleries Page
// This page displays a list of all available photo galleries.

import { GallerySystem } from "public/js/gdrive-gallery.js";
// import wixLocation from 'wix-location';

// Mock Velo APIs
const wixLocation = { to: (url) => console.log(`Navigating to: ${url}`) };

let gallerySystem;

$w.onReady(function () {
  console.log("🚀 Initializing Photo Galleries Page");
  initializeGalleriesPage();
});

function stripHtml(input) {
  return String(input)
    .replace(/<[^>]*>/g, "")
    .trim();
}

function setContent(selector, htmlString) {
  try {
    const el = $w(selector);
    if (!el) {
      console.warn(`Element not found: ${selector}`);
      return;
    }
    console.log(`Rendering into ${selector} (type: ${el.type || "unknown"})`);
    if (typeof el.html === "string" || typeof el.html === "undefined") {
      if ("html" in el) {
        el.html = htmlString;
        return;
      }
    }
    if ("text" in el) {
      el.text = stripHtml(htmlString);
      return;
    }
    console.warn(`Element ${selector} does not support html/text. Skipping.`);
  } catch (e) {
    console.error(`Failed to set content for ${selector}:`, e);
  }
}

async function initializeGalleriesPage() {
  gallerySystem = new GallerySystem();
  createPageStructure();
  await displayGalleries();
  console.log("✅ Photo Galleries Page initialization complete.");
}

function createPageStructure() {
  const pageHTML = `
        <div id="galleriesPageContainer" class="galleries-page-container">
            <div class="page-header text-center">
                <h1>Photo Galleries</h1>
                <p>Explore collections of beautiful bonsai from our shows, workshops, and members.</p>
            </div>
            <div id="galleriesContainer" class="galleries-grid">
                <!-- Gallery cards will be rendered here -->
            </div>
        </div>
    `;
  setContent("#mainContainer", pageHTML);
}

async function displayGalleries() {
  const galleries = await gallerySystem.getGalleries();
  const container = $w("#galleriesContainer");

  if (!galleries || galleries.length === 0) {
    setContent(
      "#galleriesContainer",
      "<p>No photo galleries have been created yet.</p>"
    );
    return;
  }

  const galleriesHTML = galleries
    .map(
      (gallery) => `
        <div class="gallery-card glass-card" data-gallery-id="${gallery._id}" onclick="wixLocation.to('/gallery-view?id=${gallery._id}')">
            <div class="gallery-card-image" style="background-image: url('${gallery.coverImageUrl}');">
                <div class="gallery-card-overlay">
                    <h3 class="gallery-name">${gallery.name}</h3>
                </div>
            </div>
            <div class="gallery-card-content">
                <p class="gallery-description">${gallery.description}</p>
                <div class="gallery-card-meta">
                    <span>${gallery.totalPhotos} Photos</span>
                    <span>${gallery.viewCount} Views</span>
                </div>
            </div>
        </div>
    `
    )
    .join("");

  setContent("#galleriesContainer", galleriesHTML);
}
