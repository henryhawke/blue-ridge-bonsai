// Blue Ridge Bonsai Society - Custom Element for Styles and Scripts
// This custom element loads the global CSS and initializes site-wide JavaScript functionalities.

// The URL for the global CSS file in the public folder.
const CSS_URL = "https://static.parastorage.com/services/wix-code-public/1.0.0/css/global.css";

class BrbsStyles extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.loadCSS();
    this.initGlobalScripts();
    console.log("BRBS Styles custom element loaded and initialized.");
  }

  async loadCSS() {
    try {
      const response = await fetch(CSS_URL);
      if (!response.ok) {
        console.error(`Failed to fetch CSS. Status: ${response.status}`);
        return;
      }
      const css = await response.text();
      const style = document.createElement('style');
      style.textContent = css;
      this.shadowRoot.appendChild(style);
      console.log("Global CSS loaded successfully.");
    } catch (error) {
      console.error("Error loading CSS:", error);
    }
  }

  initGlobalScripts() {
    // Re-implementing the scroll-based navigation from the old masterPage.js
    let lastScrollY = window.scrollY;
    let ticking = false;

    const header = document.querySelector('#SITE_HEADER');

    if (header) {
      const onScroll = () => {
        const currentScrollY = window.scrollY;
        if (!ticking) {
          window.requestAnimationFrame(() => {
            if (currentScrollY > 100 && currentScrollY > lastScrollY) {
              // Scrolling down
              header.classList.add('nav-hidden');
            } else {
              // Scrolling up
              header.classList.remove('nav-hidden');
            }

            if (currentScrollY > 50) {
              header.classList.add('nav-scrolled');
            } else {
              header.classList.remove('nav-scrolled');
            }

            lastScrollY = currentScrollY;
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      console.log("Scroll-based navigation initialized.");
    } else {
        console.warn("Could not find #SITE_HEADER for scroll-based navigation.")
    }

    // You can add other global scripts here, such as:
    // - Initializing animations on scroll (Intersection Observer)
    // - Setting up seasonal themes
    // - etc.
  }
}

customElements.define('brbs-styles', BrbsStyles);
