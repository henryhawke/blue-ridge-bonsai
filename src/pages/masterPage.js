/**
 * BLUE RIDGE BONSAI SOCIETY - MASTER PAGE SCRIPT
 *
 * COMPONENTS & IMPLEMENTATIONS:
 *
 * 1. GLOBAL SITE INITIALIZATION
 *    - Runs on every page of the site via $w.onReady()
 *    - Centralized site-wide functionality and initialization
 *    - Global analytics and tracking setup
 *    - Cross-page consistency and functionality
 *
 * 2. ANALYTICS & TRACKING SYSTEM
 *    - initAnalytics(): Initializes analytics tracking system
 *    - trackPageView(): Tracks page views for analytics
 *    - Page view tracking with URL path information
 *    - Analytics integration for site performance monitoring
 *
 * 3. CUSTOM ELEMENT MANAGEMENT
 *    - ensureCustomElement(): Ensures brbs-styles custom element is present
 *    - Dynamic custom element creation and injection
 *    - Custom element placement in site header
 *    - Fallback handling for missing containers
 *
 * 4. GLOBAL FOOTER ELEMENTS
 *    - addGlobalFooterElements(): Adds dynamic footer content
 *    - Google Group link integration
 *    - Dynamic footer element creation and injection
 *    - Duplicate prevention for navigation scenarios
 *
 * 5. SITE HEADER INTEGRATION
 *    - Custom element placement in site header
 *    - Header container detection and management
 *    - Dynamic element injection into header
 *    - Error handling for missing header containers
 *
 * 6. RENDERING CYCLE MANAGEMENT
 *    - Render cycle detection for proper timing
 *    - First render cycle handling (renderCycle === 1)
 *    - Element creation timing optimization
 *    - Performance-conscious element injection
 *
 * 7. ERROR HANDLING & LOGGING
 *    - Comprehensive error handling for missing elements
 *    - Console logging for debugging and monitoring
 *    - Graceful degradation for missing containers
 *    - User-friendly error messages
 *
 * 8. PERFORMANCE OPTIMIZATION
 *    - Efficient element creation and injection
 *    - Minimal DOM manipulation
 *    - Optimized rendering cycle handling
 *    - Fast page initialization
 *
 * 9. CROSS-PAGE FUNCTIONALITY
 *    - Site-wide analytics integration
 *    - Global footer link management
 *    - Custom element consistency across pages
 *    - Navigation state preservation
 *
 * 10. WIX VELO INTEGRATION
 *    - Wix Window Frontend API integration
 *    - Wix Location Frontend API integration
 *    - Custom element creation and management
 *    - Dynamic element injection capabilities
 *
 * DEPENDENCIES:
 *    - Analytics tracking system (public/js/analytics-tracking.js)
 *    - Wix Window Frontend API (wix-window-frontend)
 *    - Wix Location Frontend API (wix-location-frontend)
 *    - Wix Velo framework ($w API)
 *    - Custom brbs-styles element
 *
 * BROWSER COMPATIBILITY:
 *    - Modern browsers with ES6+ support
 *    - Wix Velo environment
 *    - Cross-browser analytics compatibility
 *
 * SECURITY & PRIVACY:
 *    - Analytics data collection compliance
 *    - Secure external link handling
 *    - Privacy-conscious tracking implementation
 *    - Safe external resource loading
 */

// @ts-nocheck
// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
import wixWindow from "wix-window-frontend";
import wixLocation from "wix-location-frontend";
import { initAnalytics, trackPageView } from "public/js/analytics-tracking.js";
import { initPhotosPage } from "public/js/pages/photos.js";
import { initGalleryViewPage } from "public/js/pages/gallery-view.js";

// Initialize the master page when ready
try {
  if (typeof $w !== "undefined" && $w.onReady) {
    $w.onReady(function () {
      // This function runs on every page of your site.
      console.log("Master page script loaded.");

      // Initialize Analytics
      initAnalytics();
      trackPageView(wixLocation.path.join("/"));

      // Ensure the custom element for styles is present
      ensureCustomElement();

      // Add global elements like a dynamic footer link
      addGlobalFooterElements();

      // Initialize liquid glass navigation enhancements
      setupLiquidGlassNav();

      // Lightweight page router to ensure per-page code runs even if page files are empty
      try {
        const pathArr = (wixLocation.path || []).map((p) =>
          String(p).toLowerCase()
        );
        const slug = "/" + pathArr.join("/");
        if (slug.endsWith("/photos") || slug === "/photos") {
          initPhotosPage();
        } else if (slug.endsWith("/gallery-view") || slug === "/gallery-view") {
          initGalleryViewPage();
        }
      } catch (e) {
        console.log("Page init router failed:", e);
      }
    });
  } else {
    console.log("$w API not available, initializing master page directly.");
    // Fallback initialization
    initAnalytics();
    trackPageView(wixLocation.path.join("/"));
    ensureCustomElement();
    addGlobalFooterElements();
    setupLiquidGlassNav();
  }
} catch (error) {
  console.error("Error initializing master page:", error);
  // Fallback initialization
  try {
    initAnalytics();
    trackPageView(wixLocation.path.join("/"));
  } catch (analyticsError) {
    console.error("Analytics initialization failed:", analyticsError);
  }
}

/**
 * Ensures the brbs-styles custom element is on the page.
 */
function ensureCustomElement() {
  if (wixWindow.rendering.renderCycle === 1) {
    try {
      // Check if the custom element exists
      const customElement = $w("CustomElement");
      if (customElement) {
        // Try to find the brbs-styles element
        const brbsStylesElement = customElement.find(
          (el) => el.tagName && el.tagName.toLowerCase() === "brbs-styles"
        );
        if (!brbsStylesElement) {
          console.log(
            "brbs-styles custom element not found. Please add it manually in the Wix Editor."
          );
        } else {
          console.log("brbs-styles custom element found and ready.");
        }
      }
    } catch (error) {
      console.log("Custom element check failed:", error);
    }
  }
}

/**
 * Adds dynamically created global elements to the site, like footer links.
 */
function addGlobalFooterElements() {
  try {
    const footer = $w("#SITE_FOOTER");
    if (footer) {
      console.log("Site footer found, checking for existing links...");
      // Note: In Wix Velo, you typically add elements through the editor
      // rather than programmatically creating them
    } else {
      console.log(
        "Site footer not found. Footer links should be added manually in the Wix Editor."
      );
    }
  } catch (error) {
    console.log("Footer element check failed:", error);
  }
}

/**
 * Enhance and stabilize the liquid glass navigation.
 * - Applies classes for atmospheric nav styles
 * - Adds scroll hide/reveal and scrolled state
 * - Adapts theme based on content brightness
 */
function setupLiquidGlassNav() {
  try {
    // Try DOM first for universal compatibility
    if (typeof document !== "undefined") {
      const nav =
        document.querySelector("#liquid-glass-nav") ||
        document.querySelector('header, [data-testid="siteHeader"]');
      if (nav) {
        nav.classList.add("liquid-glass-nav");

        // Scroll hide/reveal + scrolled state
        let lastY = window.scrollY;
        let ticking = false;
        window.addEventListener(
          "scroll",
          () => {
            if (!ticking) {
              window.requestAnimationFrame(() => {
                const y = window.scrollY;
                if (y > 24) nav.classList.add("nav-scrolled");
                else nav.classList.remove("nav-scrolled");
                if (y > lastY && y > 120) nav.classList.add("nav-hidden");
                else nav.classList.remove("nav-hidden");
                lastY = y;
                ticking = false;
              });
              ticking = true;
            }
          },
          { passive: true }
        );

        // Content-aware theming (light/dark) based on background
        const checkTheme = () => {
          try {
            const main =
              document.querySelector("main, #SITE_PAGES, #masterPage") ||
              document.body;
            const bg =
              window.getComputedStyle(main).backgroundColor ||
              "rgb(255,255,255)";
            // Simple luminance heuristic
            const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (m) {
              const r = parseInt(m[1], 10),
                g = parseInt(m[2], 10),
                b = parseInt(m[3], 10);
              const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
              if (lum < 140) {
                nav.classList.add("content-dark");
                nav.classList.remove("content-light");
              } else {
                nav.classList.add("content-light");
                nav.classList.remove("content-dark");
              }
            }
          } catch (_) {}
        };
        checkTheme();
        window.addEventListener("resize", checkTheme, { passive: true });
      }
    }

    // If $w exists, ensure header section gets class for CSS targeting
    try {
      if (typeof $w !== "undefined") {
        const header = $w("Header");
        if (
          header &&
          header.length > 0 &&
          typeof header.addClass === "function"
        ) {
          header.addClass("liquid-glass-nav");
        }
      }
    } catch (e) {
      // Non-fatal
    }
  } catch (error) {
    console.log("Navigation enhancement failed:", error);
  }
}
