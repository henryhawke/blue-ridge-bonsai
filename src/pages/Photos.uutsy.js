// Blue Ridge Bonsai Society - Main Photo Galleries Page
// This page displays a list of all available photo galleries.

import { GallerySystem } from 'public/js/gdrive-gallery.js';
// import wixLocation from 'wix-location';

// Mock Velo APIs
const wixLocation = { to: (url) => console.log(`Navigating to: ${url}`) };

let gallerySystem;

$w.onReady(function () {
    console.log("🚀 Initializing Photo Galleries Page");
    initializeGalleriesPage();
});

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
    $w('#mainContainer').html(pageHTML);
}

async function displayGalleries() {
    const galleries = await gallerySystem.getGalleries();
    const container = $w('#galleriesContainer');

    if (!galleries || galleries.length === 0) {
        container.html = "<p>No photo galleries have been created yet.</p>";
        return;
    }

    const galleriesHTML = galleries.map(gallery => `
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
    `).join("");

    container.html = galleriesHTML;
}
