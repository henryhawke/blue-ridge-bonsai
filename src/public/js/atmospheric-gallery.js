/**
 * ================================================================
 * ATMOSPHERIC IMAGE GALLERY
 * Blue Ridge Bonsai Society - Enhanced Gallery with Atmospheric Effects
 * ================================================================
 */

class AtmosphericGallery {
  constructor(container, options = {}) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    this.options = {
      autoplay: options.autoplay || false,
      autoplayDelay: options.autoplayDelay || 5000,
      showThumbnails: options.showThumbnails !== false,
      enableKeyboard: options.enableKeyboard !== false,
      enableTouch: options.enableTouch !== false,
      enableZoom: options.enableZoom !== false,
      fadeEffect: options.fadeEffect !== false,
      atmosphericEffects: options.atmosphericEffects !== false,
      ...options,
    };

    this.images = [];
    this.currentIndex = 0;
    this.isZoomed = false;
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    if (!this.container) {
      console.error("Gallery container not found");
      return;
    }

    this.createStructure();
    this.loadImages();
    this.setupEventListeners();
    this.initializeAtmosphericEffects();

    console.log("🎨 Atmospheric Gallery initialized");
  }

  createStructure() {
    this.container.innerHTML = `
            <div class="atmospheric-gallery">
                <div class="gallery-main">
                    <div class="gallery-stage">
                        <div class="stage-image-container">
                            <img class="stage-image" alt="Gallery image">
                            <div class="image-info glass-card">
                                <h3 class="image-title"></h3>
                                <p class="image-description"></p>
                                <div class="image-meta">
                                    <span class="image-date"></span>
                                    <span class="image-counter"></span>
                                </div>
                            </div>
                        </div>
                        <div class="gallery-controls">
                            <button class="control-btn prev-btn btn-atmospheric" aria-label="Previous image">
                                <span>‹</span>
                            </button>
                            <button class="control-btn next-btn btn-atmospheric" aria-label="Next image">
                                <span>›</span>
                            </button>
                            <button class="control-btn zoom-btn btn-atmospheric" aria-label="Zoom image">
                                <span>🔍</span>
                            </button>
                            <button class="control-btn fullscreen-btn btn-atmospheric" aria-label="Fullscreen">
                                <span>⛶</span>
                            </button>
                        </div>
                        <div class="atmospheric-overlay"></div>
                        <div class="atmospheric-particles"></div>
                    </div>
                </div>
                <div class="gallery-thumbnails">
                    <div class="thumbnails-container">
                        <!-- Thumbnails will be populated here -->
                    </div>
                </div>
                <div class="gallery-loading glass-card">
                    <div class="loading-spinner"></div>
                    <p>Loading gallery...</p>
                </div>
            </div>
        `;

    // Apply atmospheric styling
    this.applyAtmosphericStyling();
  }

  applyAtmosphericStyling() {
    const styles = document.createElement("style");
    styles.textContent = `
            .atmospheric-gallery {
                position: relative;
                width: 100%;
                height: 600px;
                background: linear-gradient(135deg, rgba(254, 255, 254, 0.1) 0%, rgba(232, 237, 233, 0.1) 100%);
                border-radius: 0.75rem;
                overflow: hidden;
                backdrop-filter: blur(20px) saturate(1.2);
                -webkit-backdrop-filter: blur(20px) saturate(1.2);
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            }
            
            .gallery-stage {
                position: relative;
                width: 100%;
                height: 480px;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }
            
            .stage-image-container {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .stage-image {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 0.5rem;
                box-shadow: 0 20px 40px rgba(31, 38, 135, 0.15);
                transition: all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
                cursor: pointer;
            }
            
            .stage-image:hover {
                transform: scale(1.02);
                box-shadow: 0 25px 50px rgba(31, 38, 135, 0.25);
            }
            
            .stage-image.zoomed {
                transform: scale(2);
                cursor: zoom-out;
            }
            
            .image-info {
                position: absolute;
                bottom: 20px;
                left: 20px;
                right: 20px;
                padding: 1rem;
                background: rgba(254, 255, 254, 0.9);
                backdrop-filter: blur(20px) saturate(1.2);
                -webkit-backdrop-filter: blur(20px) saturate(1.2);
                transform: translateY(100%);
                transition: transform 0.4s ease;
            }
            
            .gallery-stage:hover .image-info {
                transform: translateY(0);
            }
            
            .image-title {
                margin: 0 0 0.5rem 0;
                color: #6B8E6F;
                font-size: 1.25rem;
                font-weight: 600;
            }
            
            .image-description {
                margin: 0 0 1rem 0;
                color: #4A4A4A;
                font-size: 0.9rem;
                line-height: 1.4;
            }
            
            .image-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.8rem;
                color: #8B9B8D;
            }
            
            .gallery-controls {
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                transform: translateY(-50%);
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 20px;
                pointer-events: none;
            }
            
            .control-btn {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: rgba(107, 142, 111, 0.15);
                backdrop-filter: blur(20px) saturate(1.2);
                -webkit-backdrop-filter: blur(20px) saturate(1.2);
                border: 1px solid rgba(107, 142, 111, 0.3);
                color: #6B8E6F;
                font-size: 1.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                pointer-events: auto;
                opacity: 0;
                transform: scale(0.8);
            }
            
            .gallery-stage:hover .control-btn {
                opacity: 1;
                transform: scale(1);
            }
            
            .control-btn:hover {
                background: rgba(107, 142, 111, 0.25);
                transform: scale(1.1);
                box-shadow: 0 10px 40px rgba(107, 142, 111, 0.15);
            }
            
            .prev-btn, .next-btn {
                position: relative;
            }
            
            .zoom-btn, .fullscreen-btn {
                position: absolute;
                top: 20px;
                right: 80px;
            }
            
            .fullscreen-btn {
                right: 20px;
            }
            
            .atmospheric-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(circle at center, transparent 40%, rgba(107, 142, 111, 0.05) 100%);
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.6s ease;
            }
            
            .gallery-stage:hover .atmospheric-overlay {
                opacity: 1;
            }
            
            .atmospheric-particles {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                pointer-events: none;
                overflow: hidden;
            }
            
            .gallery-thumbnails {
                height: 120px;
                padding: 20px;
                background: rgba(254, 255, 254, 0.5);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }
            
            .thumbnails-container {
                display: flex;
                gap: 10px;
                overflow-x: auto;
                height: 80px;
                padding: 5px 0;
            }
            
            .thumbnail {
                flex-shrink: 0;
                width: 80px;
                height: 80px;
                border-radius: 0.5rem;
                overflow: hidden;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 2px solid transparent;
                position: relative;
            }
            
            .thumbnail:hover {
                transform: scale(1.1);
                border-color: rgba(107, 142, 111, 0.5);
            }
            
            .thumbnail.active {
                border-color: #6B8E6F;
                box-shadow: 0 5px 20px rgba(107, 142, 111, 0.3);
            }
            
            .thumbnail img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .gallery-loading {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1rem;
                padding: 2rem;
                z-index: 1000;
            }
            
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid rgba(107, 142, 111, 0.3);
                border-top-color: #6B8E6F;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            .floating-particle {
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(107, 142, 111, 0.3);
                border-radius: 50%;
                animation: floatParticle 8s infinite linear;
                pointer-events: none;
            }
            
            @keyframes floatParticle {
                0% {
                    transform: translateY(100vh) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 0.6;
                }
                90% {
                    opacity: 0.6;
                }
                100% {
                    transform: translateY(-20px) rotate(360deg);
                    opacity: 0;
                }
            }
            
            /* Responsive Design */
            @media (max-width: 768px) {
                .atmospheric-gallery {
                    height: 500px;
                }
                
                .gallery-stage {
                    height: 380px;
                }
                
                .control-btn {
                    width: 40px;
                    height: 40px;
                    font-size: 1.2rem;
                }
                
                .image-info {
                    left: 10px;
                    right: 10px;
                    bottom: 10px;
                    padding: 0.75rem;
                }
                
                .thumbnail {
                    width: 60px;
                    height: 60px;
                }
            }
        `;

    document.head.appendChild(styles);
  }

  loadImages() {
    // Mock image data - replace with actual data loading
    this.images = [
      {
        src: "/images/bonsai-1.jpg",
        thumb: "/images/bonsai-1-thumb.jpg",
        title: "Japanese Maple Bonsai",
        description:
          "A stunning 15-year-old Japanese Maple showcasing the beautiful autumn colors and intricate branch structure.",
        date: "2024-01-15",
        species: "Acer palmatum",
      },
      {
        src: "/images/bonsai-2.jpg",
        thumb: "/images/bonsai-2-thumb.jpg",
        title: "Juniper Cascade Style",
        description:
          "An elegant cascade style Juniper bonsai demonstrating the windswept appearance of trees growing on cliffs.",
        date: "2024-02-20",
        species: "Juniperus procumbens",
      },
      {
        src: "/images/bonsai-3.jpg",
        thumb: "/images/bonsai-3-thumb.jpg",
        title: "Pine Forest Group",
        description:
          "A forest composition of five Pine trees creating the illusion of a miniature forest landscape.",
        date: "2024-03-10",
        species: "Pinus thunbergii",
      },
    ];

    this.renderThumbnails();
    this.showImage(0);
    this.hideLoading();
  }

  renderThumbnails() {
    const container = this.container.querySelector(".thumbnails-container");
    container.innerHTML = this.images
      .map(
        (image, index) => `
            <div class="thumbnail ${
              index === 0 ? "active" : ""
            }" data-index="${index}">
                <img src="${image.thumb}" alt="${image.title}">
            </div>
        `
      )
      .join("");
  }

  showImage(index) {
    if (index < 0 || index >= this.images.length) return;

    const image = this.images[index];
    const stageImage = this.container.querySelector(".stage-image");
    const imageInfo = this.container.querySelector(".image-info");

    // Update active thumbnail
    this.container.querySelectorAll(".thumbnail").forEach((thumb, i) => {
      thumb.classList.toggle("active", i === index);
    });

    // Update stage image with fade effect
    if (this.options.fadeEffect) {
      stageImage.style.opacity = "0";
      setTimeout(() => {
        stageImage.src = image.src;
        stageImage.alt = image.title;
        stageImage.style.opacity = "1";
      }, 300);
    } else {
      stageImage.src = image.src;
      stageImage.alt = image.title;
    }

    // Update image info
    imageInfo.querySelector(".image-title").textContent = image.title;
    imageInfo.querySelector(".image-description").textContent =
      image.description;
    imageInfo.querySelector(".image-date").textContent = new Date(
      image.date
    ).toLocaleDateString();
    imageInfo.querySelector(".image-counter").textContent = `${index + 1} / ${
      this.images.length
    }`;

    this.currentIndex = index;

    // Create atmospheric particles
    if (this.options.atmosphericEffects) {
      this.createAtmosphericParticles();
    }
  }

  nextImage() {
    const nextIndex = (this.currentIndex + 1) % this.images.length;
    this.showImage(nextIndex);
  }

  prevImage() {
    const prevIndex =
      this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
    this.showImage(prevIndex);
  }

  toggleZoom() {
    const stageImage = this.container.querySelector(".stage-image");
    this.isZoomed = !this.isZoomed;
    stageImage.classList.toggle("zoomed", this.isZoomed);

    const zoomBtn = this.container.querySelector(".zoom-btn span");
    zoomBtn.textContent = this.isZoomed ? "🔍⊖" : "🔍";
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.container.requestFullscreen().catch((err) => {
        console.log("Error entering fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  setupEventListeners() {
    // Navigation buttons
    this.container
      .querySelector(".prev-btn")
      .addEventListener("click", () => this.prevImage());
    this.container
      .querySelector(".next-btn")
      .addEventListener("click", () => this.nextImage());
    this.container
      .querySelector(".zoom-btn")
      .addEventListener("click", () => this.toggleZoom());
    this.container
      .querySelector(".fullscreen-btn")
      .addEventListener("click", () => this.toggleFullscreen());

    // Thumbnail clicks
    this.container.addEventListener("click", (e) => {
      if (e.target.closest(".thumbnail")) {
        const index = parseInt(e.target.closest(".thumbnail").dataset.index);
        this.showImage(index);
      }
    });

    // Stage image click for zoom
    this.container
      .querySelector(".stage-image")
      .addEventListener("click", () => {
        if (this.options.enableZoom) {
          this.toggleZoom();
        }
      });

    // Keyboard navigation
    if (this.options.enableKeyboard) {
      document.addEventListener("keydown", (e) => {
        if (!this.container.matches(":hover")) return;

        switch (e.key) {
          case "ArrowLeft":
            e.preventDefault();
            this.prevImage();
            break;
          case "ArrowRight":
            e.preventDefault();
            this.nextImage();
            break;
          case " ":
            e.preventDefault();
            this.toggleZoom();
            break;
          case "f":
            e.preventDefault();
            this.toggleFullscreen();
            break;
        }
      });
    }

    // Touch gestures
    if (this.options.enableTouch) {
      this.setupTouchEvents();
    }

    // Autoplay
    if (this.options.autoplay) {
      this.startAutoplay();
    }
  }

  setupTouchEvents() {
    const stage = this.container.querySelector(".gallery-stage");

    stage.addEventListener(
      "touchstart",
      (e) => {
        this.touchStartX = e.touches[0].clientX;
      },
      { passive: true }
    );

    stage.addEventListener(
      "touchend",
      (e) => {
        this.touchEndX = e.changedTouches[0].clientX;
        this.handleSwipe();
      },
      { passive: true }
    );
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = this.touchStartX - this.touchEndX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        this.nextImage();
      } else {
        this.prevImage();
      }
    }
  }

  startAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }

    this.autoplayInterval = setInterval(() => {
      this.nextImage();
    }, this.options.autoplayDelay);

    // Pause autoplay on hover
    this.container.addEventListener("mouseenter", () => {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
      }
    });

    this.container.addEventListener("mouseleave", () => {
      this.startAutoplay();
    });
  }

  createAtmosphericParticles() {
    const particlesContainer = this.container.querySelector(
      ".atmospheric-particles"
    );

    // Clear existing particles
    particlesContainer.innerHTML = "";

    // Create new particles
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const particle = document.createElement("div");
        particle.className = "floating-particle";
        particle.style.left = Math.random() * 100 + "%";
        particle.style.animationDelay = Math.random() * 8 + "s";
        particle.style.animationDuration = 8 + Math.random() * 4 + "s";

        particlesContainer.appendChild(particle);

        // Remove particle after animation
        setTimeout(() => {
          if (particle.parentElement) {
            particle.remove();
          }
        }, 12000);
      }, i * 1000);
    }
  }

  initializeAtmosphericEffects() {
    if (!this.options.atmosphericEffects) return;

    // Create background atmospheric effect
    const overlay = this.container.querySelector(".atmospheric-overlay");
    if (overlay) {
      // Add subtle color shifting
      let hue = 0;
      setInterval(() => {
        hue = (hue + 1) % 360;
        overlay.style.background = `radial-gradient(circle at center, transparent 40%, hsla(${hue}, 30%, 50%, 0.05) 100%)`;
      }, 100);
    }
  }

  hideLoading() {
    const loading = this.container.querySelector(".gallery-loading");
    if (loading) {
      loading.style.opacity = "0";
      setTimeout(() => {
        loading.style.display = "none";
      }, 500);
    }
  }

  // Public API methods
  goToImage(index) {
    this.showImage(index);
  }

  addImage(imageData) {
    this.images.push(imageData);
    this.renderThumbnails();
  }

  removeImage(index) {
    if (index >= 0 && index < this.images.length) {
      this.images.splice(index, 1);
      this.renderThumbnails();
      if (this.currentIndex >= this.images.length) {
        this.showImage(this.images.length - 1);
      }
    }
  }

  destroy() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }

    this.container.innerHTML = "";
  }
}

// Auto-initialize galleries with data-atmospheric-gallery attribute
document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll("[data-atmospheric-gallery]")
    .forEach((container) => {
      const el = container instanceof HTMLElement ? container : null;
      if (!el) return;
      const options = {};

      // Parse options from data attributes
      const ds = el.dataset || {};
      if (ds.autoplay) options.autoplay = ds.autoplay === "true";
      if (ds.autoplayDelay) options.autoplayDelay = parseInt(ds.autoplayDelay);
      if (ds.showThumbnails)
        options.showThumbnails = ds.showThumbnails === "true";
      if (ds.enableKeyboard)
        options.enableKeyboard = ds.enableKeyboard === "true";
      if (ds.enableTouch) options.enableTouch = ds.enableTouch === "true";
      if (ds.enableZoom) options.enableZoom = ds.enableZoom === "true";
      if (ds.fadeEffect) options.fadeEffect = ds.fadeEffect === "true";
      if (ds.atmosphericEffects)
        options.atmosphericEffects = ds.atmosphericEffects === "true";

      new AtmosphericGallery(el, options);
    });
});

// Export for manual initialization
if (typeof module !== "undefined" && module.exports) {
  module.exports = AtmosphericGallery;
} else if (typeof window !== "undefined") {
  window["AtmosphericGallery"] = AtmosphericGallery;
}
