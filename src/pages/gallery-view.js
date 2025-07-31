// Blue Ridge Bonsai Society - Individual Gallery View Page
// This page displays all the photos within a single gallery.

import { GallerySystem } from 'public/js/gdrive-gallery.js';
// import wixLocation from 'wix-location';
// import { lightbox } from 'wix-window'; // In Velo, use this for lightbox

// Mock Velo APIs
const wixLocation = {
    to: (url) => console.log(`Navigating to: ${url}`),
    query: { id: "gal001" } // Mocking a gallery ID from the URL
};
const lightbox = { open: (data) => console.log("Opening lightbox with:", data) };


let gallerySystem;
let currentGalleryId;
let photosInGallery = [];

$w.onReady(function () {
    console.log("🚀 Initializing Gallery View Page");
    currentGalleryId = wixLocation.query.id;
    if (currentGalleryId) {
        initializeGalleryPage();
    } else {
        wixLocation.to("/photos");
    }
});

async function initializeGalleryPage() {
    gallerySystem = new GallerySystem();
    const gallery = await gallerySystem.getGalleryById(currentGalleryId);
    photosInGallery = await gallerySystem.getPhotosForGallery(currentGalleryId);

    if (!gallery) {
        $w('#mainContainer').html = "<h1>Gallery not found</h1>";
        return;
    }

    createPageStructure(gallery);
    displayPhotos();
    setupEventHandlers();
    console.log("✅ Gallery View Page initialization complete.");
}

function createPageStructure(gallery) {
    const pageHTML = `
        <div id="galleryViewContainer" class="gallery-view-container">
            <div class="page-header">
                <a href="/photos">&larr; Back to All Galleries</a>
                <h1>${gallery.name}</h1>
                <p>${gallery.description}</p>
            </div>
            <div id="photosContainer" class="photos-grid">
                <!-- Photos will be rendered here -->
            </div>
        </div>
    `;
    $w('#mainContainer').html(pageHTML);
}

function displayPhotos() {
    const container = $w('#photosContainer');

    if (!photosInGallery || photosInGallery.length === 0) {
        container.html = "<p>This gallery is empty.</p>";
        return;
    }

    // The TO-DO.md suggests using a masonry layout. This can be achieved with CSS grid
    // by making rows span based on image aspect ratio, but for this mock implementation
    // a standard grid is sufficient.
    const photosHTML = photosInGallery.map((photo, index) => `
        <div class="photo-card" data-index="${index}" data-photo-id="${photo._id}">
            <img src="${photo.thumbnailUrl}" alt="${photo.altText}" loading="lazy" />
            <div class="photo-overlay">
                <p>${photo.title}</p>
            </div>
        </div>
    `).join("");

    container.html = photosHTML;
}

function setupEventHandlers() {
    $w('#photosContainer').onClick((event) => {
        const photoCard = event.target.closest('.photo-card');
        if (photoCard) {
            const photoIndex = parseInt(photoCard.dataset.index, 10);
            openLightbox(photoIndex);
        }
    });
}

function openLightbox(startIndex) {
    // This function simulates opening a lightbox, like fslightbox.
    // It would be implemented with a real lightbox library in the target environment.
    console.log(`Opening lightbox starting at index ${startIndex}`);

    // Create an array of image URLs for the lightbox
    const imageSources = photosInGallery.map(p => p.originalUrl);

    // The fslightbox library is typically initialized by setting the `sources`
    // and opening it. We'll simulate that call.
    const fslightbox = {
        props: {
            sources: [],
            slide: 1
        },
        open: function() {
            console.log("fslightbox opened with sources:", this.props.sources);
            console.log("Starting at slide:", this.props.slide);
        }
    };

    fslightbox.props.sources = imageSources;
    fslightbox.props.slide = startIndex + 1; // fslightbox is 1-based index
    fslightbox.open();

    // For Velo's built-in lightbox:
    // lightbox.open('PhotoLightbox', { images: imageSources, startIndex: startIndex });
}
