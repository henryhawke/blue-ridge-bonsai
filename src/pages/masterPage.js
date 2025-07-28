// @ts-nocheck
// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// Blue Ridge Bonsai Society - Master Page Implementation
// Wix Velo Compatible Implementation - Phases 1-3 Applied

import { currentMember } from "wix-members";
import wixLocationFrontend from "wix-location-frontend";
import wixUsers from "wix-users";

$w.onReady(function () {
  console.log("🌸 Blue Ridge Bonsai Society - Master Page Loaded (Phases 1-3)");

  // Phase 1: Initialize Liquid Glass Navigation
  try {
    initializeLiquidGlassNavigation();
  } catch (error) {
    console.error("Error initializing liquid glass navigation:", error);
  }

  // Phase 2: Apply Design System Styling
  try {
    applyDesignSystemStyling();
  } catch (error) {
    console.error("Error applying design system:", error);
  }

  // Initialize navigation system with embedded functionality
  initializeEmbeddedNavigation();

  // Phase 3: Add micro-interactions and animations
  setTimeout(() => {
    addMicroInteractions();
  }, 500);
});

/**
 * Phase 1: Initialize Liquid Glass Navigation System
 * Implements the liquid glass navigation with backdrop-filter effects
 */
function initializeLiquidGlassNavigation() {
  console.log("🌊 Initializing Liquid Glass Navigation System");

  try {
    // Inject the liquid glass CSS styles
    injectLiquidGlassStyles();

    // Initialize dynamic navigation adaptation
    initializeNavigationAdaptation();

    // Setup scroll-based navigation behavior
    setupScrollBasedNavigation();

    console.log("✅ Liquid Glass Navigation System initialized");
  } catch (error) {
    console.error("❌ Error initializing liquid glass navigation:", error);
  }
}

/**
 * Inject Liquid Glass CSS Styles
 */
function injectLiquidGlassStyles() {
  const liquidGlassCSS = `
    <style>
      /* Phase 1: Liquid Glass Navigation Base Styles */
      .wix-header, header, [data-testid="header.container"] {
        position: fixed !important;
        top: 0 !important;
        width: 100% !important;
        z-index: 1000 !important;
        background: rgba(254, 255, 254, 0.8) !important;
        backdrop-filter: blur(20px) saturate(1.2) !important;
        -webkit-backdrop-filter: blur(20px) saturate(1.2) !important;
        border-bottom: 1px solid rgba(107, 142, 111, 0.2) !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        box-shadow: 0 2px 32px rgba(107, 142, 111, 0.08) !important;
      }

      /* Liquid Glass Reflection Effect */
      .wix-header::before, header::before, [data-testid="header.container"]::before {
        content: "" !important;
        position: absolute !important;
        top: 100% !important;
        left: 0 !important;
        right: 0 !important;
        height: 20px !important;
        background: linear-gradient(180deg, rgba(254, 255, 254, 0.4) 0%, transparent 100%) !important;
        filter: blur(8px) !important;
        transform: scaleY(-1) !important;
        opacity: 0.6 !important;
        pointer-events: none !important;
      }

      /* Navigation Items with Enhanced Hover States */
      nav a, .nav-link, [data-testid*="nav"] a {
        position: relative !important;
        padding: 1rem 1.5rem !important;
        border-radius: 12px !important;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        overflow: hidden !important;
        color: #4A4A4A !important;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        font-weight: 500 !important;
        text-decoration: none !important;
      }

      /* Liquid Glass Sweep Effect */
      nav a::before, .nav-link::before, [data-testid*="nav"] a::before {
        content: "" !important;
        position: absolute !important;
        top: 0 !important;
        left: -100% !important;
        width: 100% !important;
        height: 100% !important;
        background: linear-gradient(90deg, transparent, rgba(107, 142, 111, 0.1), transparent) !important;
        transition: left 0.6s ease !important;
        pointer-events: none !important;
      }

      nav a:hover::before, .nav-link:hover::before, [data-testid*="nav"] a:hover::before {
        left: 100% !important;
      }

      nav a:hover, .nav-link:hover, [data-testid*="nav"] a:hover {
        background: rgba(107, 142, 111, 0.08) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 32px rgba(107, 142, 111, 0.12) !important;
        color: #6B8E6F !important;
      }

      /* Adaptive Opacity Classes */
      .liquid-glass-nav.content-light {
        background: rgba(254, 255, 254, 0.9) !important;
        backdrop-filter: blur(30px) saturate(1.8) !important;
      }

      .liquid-glass-nav.content-dark {
        background: rgba(26, 29, 27, 0.85) !important;
        backdrop-filter: blur(25px) saturate(1.5) !important;
        border-bottom-color: rgba(143, 166, 147, 0.3) !important;
      }

      /* Mobile Navigation Enhancements */
      @media (max-width: 768px) {
        .wix-header, header, [data-testid="header.container"] {
          backdrop-filter: blur(15px) saturate(1.1) !important;
        }
        
        nav a, .nav-link, [data-testid*="nav"] a {
          padding: 0.8rem 1.2rem !important;
        }
      }

      /* Fallback for browsers without backdrop-filter support */
      @supports not (backdrop-filter: blur()) {
        .wix-header, header, [data-testid="header.container"] {
          background: rgba(254, 255, 254, 0.95) !important;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1) !important;
        }
      }
    </style>
  `;

  // Inject styles into document head
  if (typeof document !== "undefined") {
    const existingStyle = document.getElementById("liquid-glass-styles");
    if (!existingStyle) {
      document.head.insertAdjacentHTML("beforeend", liquidGlassCSS);
    }
  }
}

/**
 * Initialize Navigation Adaptation Based on Content
 */
function initializeNavigationAdaptation() {
  if (typeof window === "undefined") return;

  // Add liquid glass class to navigation elements
  const addLiquidGlassClass = () => {
    const navElements = [
      document.querySelector(".wix-header"),
      document.querySelector("header"),
      document.querySelector('[data-testid="header.container"]'),
    ].filter(Boolean);

    navElements.forEach((nav) => {
      if (nav) {
        nav.classList.add("liquid-glass-nav");
      }
    });
  };

  // Run immediately and on DOM changes
  addLiquidGlassClass();

  // Observe DOM changes for dynamic content
  if (typeof MutationObserver !== "undefined") {
    const observer = new MutationObserver(addLiquidGlassClass);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Content contrast detection
  setupContentContrastDetection();
}

/**
 * Setup Content Contrast Detection for Adaptive Navigation
 */
function setupContentContrastDetection() {
  if (typeof IntersectionObserver === "undefined") return;

  const navElements = document.querySelectorAll(".liquid-glass-nav");
  if (navElements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const styles = getComputedStyle(element);
          const bgColor = styles.backgroundColor;

          // Simple luminance calculation
          const isLight = isColorLight(bgColor);

          navElements.forEach((nav) => {
            nav.classList.toggle("content-light", isLight);
            nav.classList.toggle("content-dark", !isLight);
          });
        }
      });
    },
    {
      rootMargin: "-80px 0px 0px 0px",
    }
  );

  // Observe all major content sections
  document
    .querySelectorAll(
      'section, .hero, .content-block, [data-testid*="section"]'
    )
    .forEach((section) => {
      observer.observe(section);
    });
}

/**
 * Determine if a color is light or dark
 */
function isColorLight(color) {
  if (!color || color === "transparent") return true;

  const rgb = color.match(/\d+/g);
  if (!rgb) return true;

  const [r, g, b] = rgb.map(Number);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

/**
 * Setup Scroll-Based Navigation Behavior
 */
function setupScrollBasedNavigation() {
  if (typeof window === "undefined") return;

  let lastScrollY = 0;
  let ticking = false;

  const updateNavigation = () => {
    const currentScrollY = window.scrollY;
    const navElements = document.querySelectorAll(".liquid-glass-nav");

    navElements.forEach((nav) => {
      if (!nav || !nav.style) return; // Safety check

      // Hide/show navigation based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        nav.style.transform = "translateY(-100%)";
      } else {
        nav.style.transform = "translateY(0)";
      }

      // Adjust blur and opacity based on scroll position
      const scrollProgress = Math.min(currentScrollY / 300, 1);
      const blurAmount = 20 + scrollProgress * 15;
      const opacity = 0.8 + scrollProgress * 0.15;

      nav.style.backdropFilter = `blur(${blurAmount}px) saturate(1.2)`;

      // Update background opacity
      const currentBg = nav.style.background || "rgba(254, 255, 254, 0.8)";
      nav.style.background = currentBg.replace(
        /rgba\([^)]+\)/,
        `rgba(254, 255, 254, ${opacity})`
      );
    });

    lastScrollY = currentScrollY;
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateNavigation);
      ticking = true;
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
}

/**
 * Phase 2: Apply Design System Styling
 * Implements the atmospheric UI and CSS custom properties from DESIGN.md
 */
function applyDesignSystemStyling() {
  console.log("🎨 Applying Design System Styling (Phase 2)");

  try {
    // Inject Design System CSS
    injectDesignSystemStyles();

    // Apply Wix element styling
    applyWixElementStyling();

    // Setup atmospheric effects
    setupAtmosphericEffects();

    console.log("✅ Design System styling applied successfully");
  } catch (error) {
    console.error("❌ Error applying design system styling:", error);
  }
}

/**
 * Inject comprehensive Design System CSS
 */
function injectDesignSystemStyles() {
  const designSystemCSS = `
    <style id="blue-ridge-design-system">
      /* Phase 2: Blue Ridge Bonsai Design System */
      :root {
        /* Primary Colors */
        --color-mountain-sage: #6B8E6F;
        --color-stone-gray: #4A4A4A;
        --color-cloud-white: #FEFFFE;
        --color-earth-brown: #8B7355;
        
        /* Extended Neutral Palette */
        --color-fog-mist: #EBF1EE;
        --color-dawn-sky: #DDE4EA;
        --color-mountain-haze: #C8D2CE;
        --color-valley-shadow: #9BA5A1;
        
        /* Gradient Tokens */
        --gradient-sage-fog: linear-gradient(135deg, #6B8E6F 0%, #EBF1EE 100%);
        --gradient-dawn-mist: linear-gradient(180deg, #DDE4EA 0%, #FEFFFE 60%);
        --gradient-mountain-breath: linear-gradient(45deg, #EBF1EE 0%, #DDE4EA 50%, #C8D2CE 100%);
        
        /* Secondary Colors */
        --color-moss-green: #7D8471;
        --color-slate-blue: #5C6B73;
        --color-warm-cream: #F9F7F4;
        --color-copper-accent: #B08D57;
        
        /* Semantic Colors */
        --color-success: #4F7942;
        --color-warning: #D4A574;
        --color-error: #A85A5A;
        --color-info: #6B8CAE;
        
        /* Typography */
        --font-primary: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        --font-secondary: "Crimson Text", Georgia, serif;
        --font-accent: "Noto Sans JP", sans-serif;
        
        /* Spacing System (8px base) */
        --space-xs: 0.25rem;
        --space-sm: 0.5rem;
        --space-md: 1rem;
        --space-lg: 1.5rem;
        --space-xl: 2rem;
        --space-2xl: 3rem;
        --space-3xl: 4rem;
        --space-4xl: 6rem;
        
        /* Border Radius */
        --radius-sm: 6px;
        --radius-md: 8px;
        --radius-lg: 12px;
        --radius-xl: 16px;
        
        /* Shadows */
        --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
        --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
        --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.12);
        --shadow-atmospheric: 0 16px 48px rgba(107, 142, 111, 0.15);
      }

      /* Global Typography Improvements */
      body, .wix-rich-text, [data-testid*="text"] {
        font-family: var(--font-primary) !important;
        color: var(--color-stone-gray) !important;
        line-height: 1.6 !important;
      }

      h1, h2, h3, .heading, [data-testid*="heading"] {
        font-family: var(--font-secondary) !important;
        color: var(--color-stone-gray) !important;
        line-height: 1.2 !important;
        font-weight: 600 !important;
      }

      /* Enhanced Button Styles */
      button, .btn, [data-testid*="button"], input[type="submit"] {
        font-family: var(--font-primary) !important;
        font-weight: 500 !important;
        border-radius: var(--radius-md) !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        border: none !important;
        cursor: pointer !important;
        padding: 12px 24px !important;
      }

      /* Primary Button */
      .btn-primary, [data-testid*="button"]:not(.btn-secondary):not(.btn-outline) {
        background: var(--color-mountain-sage) !important;
        color: var(--color-cloud-white) !important;
        box-shadow: var(--shadow-sm) !important;
      }

      .btn-primary:hover, [data-testid*="button"]:not(.btn-secondary):not(.btn-outline):hover {
        background: #5A7A5E !important;
        transform: translateY(-1px) !important;
        box-shadow: var(--shadow-lg) !important;
      }

      /* Secondary Button */
      .btn-secondary, .btn-outline {
        background: transparent !important;
        color: var(--color-mountain-sage) !important;
        border: 2px solid var(--color-mountain-sage) !important;
        padding: 10px 22px !important;
      }

      .btn-secondary:hover, .btn-outline:hover {
        background: var(--color-mountain-sage) !important;
        color: var(--color-cloud-white) !important;
      }

      /* Enhanced Cards */
      .card, [data-testid*="card"], .container, [data-testid*="container"] {
        background: var(--color-cloud-white) !important;
        border-radius: var(--radius-lg) !important;
        box-shadow: var(--shadow-md) !important;
        transition: all 0.3s ease !important;
        border: 1px solid var(--color-fog-mist) !important;
        padding: var(--space-xl) !important;
      }

      .card:hover, [data-testid*="card"]:hover {
        transform: translateY(-2px) !important;
        box-shadow: var(--shadow-atmospheric) !important;
      }

      /* Form Elements */
      input, textarea, select, .form-input, [data-testid*="input"] {
        font-family: var(--font-primary) !important;
        padding: 12px 16px !important;
        border: 2px solid var(--color-dawn-sky) !important;
        border-radius: var(--radius-md) !important;
        background: var(--color-cloud-white) !important;
        color: var(--color-stone-gray) !important;
        transition: border-color 0.3s ease !important;
        font-size: 1rem !important;
      }

      input:focus, textarea:focus, select:focus, .form-input:focus, [data-testid*="input"]:focus {
        outline: none !important;
        border-color: var(--color-mountain-sage) !important;
        box-shadow: 0 0 0 3px rgba(107, 142, 111, 0.1) !important;
      }

      /* Atmospheric Background Effects */
      body::before {
        content: "" !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: var(--gradient-dawn-mist) !important;
        z-index: -2 !important;
        pointer-events: none !important;
      }

      /* Section Backgrounds */
      section, .section, [data-testid*="section"] {
        position: relative !important;
        background: rgba(254, 255, 254, 0.6) !important;
        backdrop-filter: blur(10px) !important;
        border-radius: var(--radius-lg) !important;
        margin: var(--space-lg) 0 !important;
        padding: var(--space-2xl) !important;
      }

      /* Hero Section Enhancement */
      .hero, [data-testid*="hero"], .header-section {
        background: var(--gradient-sage-fog) !important;
        color: var(--color-cloud-white) !important;
        position: relative !important;
        overflow: hidden !important;
      }

      .hero::after, [data-testid*="hero"]::after {
        content: "" !important;
        position: absolute !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        height: 40% !important;
        background: linear-gradient(transparent, rgba(254, 255, 254, 0.1)) !important;
        pointer-events: none !important;
      }

      /* Mobile Responsiveness */
      @media (max-width: 768px) {
        .card, [data-testid*="card"], .container, [data-testid*="container"] {
          padding: var(--space-lg) !important;
          margin: var(--space-md) 0 !important;
        }
        
        section, .section, [data-testid*="section"] {
          padding: var(--space-lg) !important;
          margin: var(--space-md) 0 !important;
        }
        
        button, .btn, [data-testid*="button"] {
          padding: 10px 20px !important;
          font-size: 0.9rem !important;
        }
      }

      /* Accessibility Enhancements */
      *:focus-visible {
        outline: 2px solid var(--color-mountain-sage) !important;
        outline-offset: 2px !important;
        border-radius: var(--radius-sm) !important;
      }

      /* Reduced Motion Support */
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }

      /* Dark Mode Support */
      @media (prefers-color-scheme: dark) {
        :root {
          --color-mountain-sage: #8FA693;
          --color-stone-gray: #E8E8E8;
          --color-cloud-white: #1A1D1B;
          --color-fog-mist: #2A2F2C;
          --color-dawn-sky: #363B38;
        }
        
        body::before {
          background: linear-gradient(180deg, #363B38 0%, #1A1D1B 60%) !important;
        }
      }
    </style>
  `;

  // Inject styles into document head
  if (typeof document !== "undefined") {
    const existingStyle = document.getElementById("blue-ridge-design-system");
    if (!existingStyle) {
      document.head.insertAdjacentHTML("beforeend", designSystemCSS);
    }
  }
}

/**
 * Apply styling to Wix elements using the $w API
 */
function applyWixElementStyling() {
  try {
    // Style buttons using Design System
    const wixButtons = $w("Button");
    if (wixButtons && wixButtons.length > 0) {
      wixButtons.forEach((button) => {
        try {
          button.style.backgroundColor = "#6B8E6F";
          button.style.color = "#FEFFFE";
          button.style.borderRadius = "8px";
          button.style.fontFamily =
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
          button.style.fontWeight = "500";
          button.style.padding = "12px 24px";
          button.style.border = "none";
          button.style.cursor = "pointer";

          // Enhanced hover effects
          button.onMouseIn(() => {
            button.style.backgroundColor = "#5A7A5E";
            if (button.style.transform !== undefined) {
              button.style.transform = "translateY(-1px)";
            }
          });

          button.onMouseOut(() => {
            button.style.backgroundColor = "#6B8E6F";
            if (button.style.transform !== undefined) {
              button.style.transform = "translateY(0)";
            }
          });
        } catch (e) {
          console.log("Could not style button:", e);
        }
      });
    }

    // Style text elements with improved typography
    const textElements = $w("Text");
    if (textElements && textElements.length > 0) {
      textElements.forEach((text) => {
        try {
          text.style.fontFamily =
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
          text.style.color = "#4A4A4A";
          text.style.lineHeight = "1.6";
        } catch (e) {
          console.log("Could not style text element");
        }
      });
    }

    // Style containers with atmospheric effects
    const containers = $w("Container");
    if (containers && containers.length > 0) {
      containers.forEach((container) => {
        try {
          container.style.backgroundColor = "rgba(254, 255, 254, 0.6)";
          container.style.borderRadius = "12px";
          container.style.padding = "2rem";
          if (container.style.backdropFilter !== undefined) {
            container.style.backdropFilter = "blur(10px)";
          }
        } catch (e) {
          console.log("Could not style container");
        }
      });
    }

    // Style input elements with design system - use safer approach
    try {
      // Try TextInput first
      const textInputs = $w("TextInput");
      if (textInputs && textInputs.length > 0) {
        textInputs.forEach((input) => {
          try {
            if (input.style) {
              input.style.backgroundColor = "#FEFFFE";
              input.style.borderColor = "#DDE4EA";
              input.style.borderRadius = "8px";
              input.style.color = "#4A4A4A";
              input.style.fontFamily =
                "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
              input.style.padding = "12px 16px";

              // Enhanced focus effects
              input.onFocus(() => {
                if (input.style) input.style.borderColor = "#6B8E6F";
              });

              input.onBlur(() => {
                if (input.style) input.style.borderColor = "#DDE4EA";
              });
            }
          } catch (e) {
            console.log("Could not style text input element");
          }
        });
      }
    } catch (e) {
      console.log("Could not access TextInput elements");
    }

    try {
      // Try TextBox separately
      const textBoxes = $w("TextBox");
      if (textBoxes && textBoxes.length > 0) {
        textBoxes.forEach((input) => {
          try {
            if (input.style) {
              input.style.backgroundColor = "#FEFFFE";
              input.style.borderColor = "#DDE4EA";
              input.style.borderRadius = "8px";
              input.style.color = "#4A4A4A";
              input.style.fontFamily =
                "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
              input.style.padding = "12px 16px";

              // Enhanced focus effects
              input.onFocus(() => {
                if (input.style) input.style.borderColor = "#6B8E6F";
              });

              input.onBlur(() => {
                if (input.style) input.style.borderColor = "#DDE4EA";
              });
            }
          } catch (e) {
            console.log("Could not style text box element");
          }
        });
      }
    } catch (e) {
      console.log("Could not access TextBox elements");
    }

    console.log("✅ Design System Wix element styling applied");
  } catch (error) {
    console.error("❌ Error applying Wix element styling:", error);
  }
}

/**
 * Setup atmospheric effects and seasonal adaptations
 */
function setupAtmosphericEffects() {
  try {
    // Add subtle particle effects using CSS animations
    const particleCSS = `
      <style id="atmospheric-effects">
        /* Atmospheric particle effects */
        body::after {
          content: "" !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          background-image: 
            radial-gradient(1px 1px at 20px 30px, rgba(107, 142, 111, 0.1), transparent),
            radial-gradient(1px 1px at 40px 70px, rgba(107, 142, 111, 0.08), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(107, 142, 111, 0.06), transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(107, 142, 111, 0.04), transparent);
          background-repeat: repeat !important;
          background-size: 200px 100px !important;
          z-index: -1 !important;
          pointer-events: none !important;
          animation: float 20s ease-in-out infinite !important;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(-5px) translateX(-5px); }
          75% { transform: translateY(-15px) translateX(3px); }
        }

        /* Seasonal mist overlay */
        .seasonal-mist {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          background: radial-gradient(ellipse at top, rgba(235, 241, 238, 0.1), transparent 50%) !important;
          z-index: -1 !important;
          pointer-events: none !important;
        }
      </style>
    `;

    if (typeof document !== "undefined") {
      const existingStyle = document.getElementById("atmospheric-effects");
      if (!existingStyle) {
        document.head.insertAdjacentHTML("beforeend", particleCSS);

        // Add seasonal mist element
        const mistElement = document.createElement("div");
        mistElement.className = "seasonal-mist";
        document.body.appendChild(mistElement);
      }
    }

    // Setup seasonal color adaptations
    setupSeasonalAdaptations();

    console.log("✅ Atmospheric effects setup complete");
  } catch (error) {
    console.error("❌ Error setting up atmospheric effects:", error);
  }
}

/**
 * Setup seasonal color palette adaptations
 */
function setupSeasonalAdaptations() {
  const currentMonth = new Date().getMonth();
  let seasonalClass = "";

  // Determine season and apply appropriate styling
  if (currentMonth >= 2 && currentMonth <= 4) {
    seasonalClass = "spring-theme";
  } else if (currentMonth >= 5 && currentMonth <= 7) {
    seasonalClass = "summer-theme";
  } else if (currentMonth >= 8 && currentMonth <= 10) {
    seasonalClass = "autumn-theme";
  } else {
    seasonalClass = "winter-theme";
  }

  // Apply seasonal class to body
  if (typeof document !== "undefined") {
    document.body.classList.add(seasonalClass);
  }
}

/**
 * Initialize embedded navigation system
 */
async function initializeEmbeddedNavigation() {
  console.log("🧭 Initializing embedded navigation system");

  try {
    // Get current member status
    const member = await getCurrentMember();
    const userRole = getUserRole(member);

    // Setup navigation based on user role
    await setupNavigationForUser(userRole);

    // Setup responsive navigation
    setupResponsiveNavigation();

    // Setup member features
    setupMemberFeatures();

    // Update active navigation
    updateActiveNavigation();

    console.log(
      "✅ Embedded navigation system initialized for user:",
      userRole
    );
  } catch (error) {
    console.error("❌ Error initializing embedded navigation:", error);
    setupBasicNavigation();
  }
}

/**
 * Get current member information
 */
async function getCurrentMember() {
  try {
    const member = await currentMember.getMember();
    return member;
  } catch (error) {
    console.log("No member logged in");
    return null;
  }
}

/**
 * Determine user role based on member data
 */
function getUserRole(member) {
  if (!member) return "guest";

  try {
    const memberRoles = member.memberRoles || [];
    if (memberRoles.includes("admin")) return "admin";
    if (memberRoles.includes("board")) return "board";
    return "member";
  } catch (error) {
    return "guest";
  }
}

/**
 * Setup navigation based on user role
 */
async function setupNavigationForUser(userRole) {
  try {
    // Show/hide navigation items based on user role
    const membersOnlySelectors = [
      "#membersArea",
      "#memberDirectory",
      "#adminPanel",
    ];

    if (userRole === "guest") {
      // Hide members-only navigation
      membersOnlySelectors.forEach((selector) => {
        try {
          const element = $w(selector);
          if (element && element.length > 0) {
            element.hide();
          }
        } catch (e) {
          console.log(`Member element not found: ${selector}`);
        }
      });

      // Show login/join prompts
      try {
        const joinButton = $w("#joinUsButton");
        if (joinButton && joinButton.length > 0) joinButton.show();
      } catch (e) {
        console.log("Join button not found");
      }

      try {
        const loginLink = $w("#loginLink");
        if (loginLink && loginLink.length > 0) loginLink.show();
      } catch (e) {
        console.log("Login link not found");
      }
    } else {
      // Show member navigation
      membersOnlySelectors.forEach((selector) => {
        try {
          const element = $w(selector);
          if (element && element.length > 0) {
            element.show();
          }
        } catch (e) {
          console.log(`Member element not found: ${selector}`);
        }
      });

      // Hide join prompts
      try {
        const joinButton = $w("#joinUsButton");
        if (joinButton && joinButton.length > 0) joinButton.hide();
      } catch (e) {
        console.log("Join button not found");
      }

      try {
        const loginLink = $w("#loginLink");
        if (loginLink && loginLink.length > 0) loginLink.hide();
      } catch (e) {
        console.log("Login link not found");
      }

      // Setup member-specific navigation
      await setupMemberNavigation(userRole);
    }
  } catch (error) {
    console.error("Error setting up navigation for user:", error);
  }
}

/**
 * Setup member-specific navigation
 */
async function setupMemberNavigation(userRole) {
  try {
    // Setup member dashboard link
    try {
      const memberDashboard = $w("#memberDashboard");
      if (memberDashboard && memberDashboard.length > 0) {
        memberDashboard.onClick(() => {
          wixLocationFrontend.to("/members/dashboard");
        });
      }
    } catch (e) {
      console.log("Member dashboard not found");
    }

    // Setup member directory (board members only)
    if (userRole === "board" || userRole === "admin") {
      try {
        const memberDirectory = $w("#memberDirectory");
        if (memberDirectory && memberDirectory.length > 0) {
          memberDirectory.show();
          memberDirectory.onClick(() => {
            wixLocationFrontend.to("/members/directory");
          });
        }
      } catch (e) {
        console.log("Member directory not found");
      }
    }

    // Setup admin panel (admins only)
    if (userRole === "admin") {
      try {
        const adminPanel = $w("#adminPanel");
        if (adminPanel && adminPanel.length > 0) {
          adminPanel.show();
          adminPanel.onClick(() => {
            wixLocationFrontend.to("/admin");
          });
        }
      } catch (e) {
        console.log("Admin panel not found");
      }
    }
  } catch (error) {
    console.error("Error setting up member navigation:", error);
  }
}

/**
 * Setup responsive navigation
 */
function setupResponsiveNavigation() {
  try {
    // Mobile menu toggle
    try {
      const mobileToggle = $w("#mobileMenuToggle");
      const mobileMenu = $w("#mobileMenu");

      if (
        mobileToggle &&
        mobileToggle.length > 0 &&
        mobileMenu &&
        mobileMenu.length > 0
      ) {
        mobileToggle.onClick(() => {
          try {
            const isOpen = mobileMenu.isVisible;
            if (isOpen) {
              mobileMenu.hide();
            } else {
              mobileMenu.show();
            }
          } catch (e) {
            console.log("Error toggling mobile menu:", e);
          }
        });
      }
    } catch (e) {
      console.log("Mobile navigation elements not found");
    }

    // Close menu when overlay is clicked
    try {
      const overlay = $w("#mobileOverlay");
      if (overlay && overlay.length > 0) {
        overlay.onClick(() => {
          try {
            const mobileMenu = $w("#mobileMenu");
            if (mobileMenu && mobileMenu.length > 0) {
              mobileMenu.hide();
            }
          } catch (e) {
            console.log("Error closing mobile menu:", e);
          }
        });
      }
    } catch (e) {
      console.log("Mobile overlay not found");
    }
  } catch (error) {
    console.error("Error setting up responsive navigation:", error);
  }
}

/**
 * Setup member features
 */
function setupMemberFeatures() {
  try {
    // Login button
    try {
      const loginButton = $w("#loginButton");
      if (loginButton && loginButton.length > 0) {
        loginButton.onClick(async () => {
          try {
            await wixUsers.promptLogin();
            await initializeEmbeddedNavigation(); // Refresh navigation
          } catch (error) {
            console.error("Login error:", error);
          }
        });
      }
    } catch (e) {
      console.log("Login button not found");
    }

    // Logout button
    try {
      const logoutButton = $w("#logoutButton");
      if (logoutButton && logoutButton.length > 0) {
        logoutButton.onClick(async () => {
          try {
            await wixUsers.logout();
            await initializeEmbeddedNavigation(); // Refresh navigation
          } catch (error) {
            console.error("Logout error:", error);
          }
        });
      }
    } catch (e) {
      console.log("Logout button not found");
    }
  } catch (error) {
    console.error("Error setting up member features:", error);
  }
}

/**
 * Update active navigation states
 */
function updateActiveNavigation() {
  try {
    const pathResult = wixLocationFrontend.path || "";
    const currentPath = Array.isArray(pathResult)
      ? pathResult.join("/")
      : String(pathResult);

    // This will work with any nav links that exist
    const navSelectors = [".nav-link", "[data-nav-link]", "nav a"];

    navSelectors.forEach((selector) => {
      try {
        const navLinks = $w(selector);
        if (navLinks && navLinks.length > 0) {
          navLinks.forEach((link) => {
            try {
              if (link && link.link) {
                const href = String(link.link);
                if (href && currentPath.startsWith(href)) {
                  // Add active styling
                  if (link.style) {
                    link.style.backgroundColor = "rgba(107, 142, 111, 0.25)";
                    link.style.color = "#6B8E6F";
                  }
                } else {
                  // Remove active styling
                  if (link.style) {
                    link.style.backgroundColor = "transparent";
                    link.style.color = "#4A4A4A";
                  }
                }
              }
            } catch (e) {
              // Individual link error, continue with others
            }
          });
        }
      } catch (e) {
        // Selector not found, try next one
      }
    });
  } catch (error) {
    console.error("Error updating active navigation:", error);
  }
}

/**
 * Basic navigation setup as fallback
 */
function setupBasicNavigation() {
  console.log("Setting up basic navigation");

  // Try multiple navigation selectors
  const navSelectors = [".nav-link", "[data-nav-link]", "nav a", "header a"];

  navSelectors.forEach((selector) => {
    try {
      const navLinks = $w(selector);
      if (navLinks && navLinks.length > 0) {
        navLinks.forEach((link) => {
          try {
            if (link && link.link) {
              link.onClick(() => {
                wixLocationFrontend.to(link.link);
              });
            }
          } catch (e) {
            // Individual link error, continue
          }
        });
        console.log(`✅ Basic navigation setup for: ${selector}`);
      }
    } catch (e) {
      // Selector not found, try next
    }
  });
}

/**
 * Phase 3: Add Enhanced Micro-Interactions and Animations
 * Implements component library and sophisticated animations
 */
function addMicroInteractions() {
  console.log("✨ Adding Enhanced Micro-Interactions (Phase 3)");

  try {
    // Initialize GSAP-style animations using CSS and JavaScript
    initializeAnimationLibrary();

    // Add enhanced button interactions
    addEnhancedButtonInteractions();

    // Add scroll-triggered animations
    addScrollTriggeredAnimations();

    // Add loading and transition effects
    addLoadingTransitions();

    // Add enhanced form interactions
    addFormInteractions();

    console.log("✅ Enhanced micro-interactions added successfully");
  } catch (error) {
    console.error("❌ Error adding micro-interactions:", error);
  }
}

/**
 * Initialize Animation Library (GSAP-style using CSS and JavaScript)
 */
function initializeAnimationLibrary() {
  const animationCSS = `
    <style id="animation-library">
      /* Phase 3: Enhanced Animation Library */
      
      /* Ensō-inspired motion curves */
      .enso-motion {
        animation: ensoMotion 0.7s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      @keyframes ensoMotion {
        0% { transform: scale(0.8) translateY(20px); opacity: 0; }
        40% { transform: scale(1.05) translateY(-5px); opacity: 1; }
        60% { transform: scale(1) translateY(0); opacity: 1; }
        100% { transform: scale(1) translateY(0); opacity: 1; }
      }
      
      /* Fade in animations */
      .fade-in {
        opacity: 0;
        animation: fadeIn 0.6s ease forwards;
      }
      
      @keyframes fadeIn {
        to { opacity: 1; }
      }
      
      /* Slide up animations */
      .slide-up {
        transform: translateY(20px);
        opacity: 0;
        animation: slideUp 0.5s ease forwards;
      }
      
      @keyframes slideUp {
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      /* Smooth scale animations */
      .scale-in {
        transform: scale(0.9);
        opacity: 0;
        animation: scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
      
      @keyframes scaleIn {
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
      
      /* Enhanced hover states */
      .hover-lift {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .hover-lift:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(107, 142, 111, 0.2);
      }
      
      /* Loading skeleton animation */
      .loading-skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      /* Pulse animation for interactive elements */
      .pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      
      /* Smooth gradient animations */
      .gradient-shift {
        background-size: 300% 300%;
        animation: gradientShift 8s ease infinite;
      }
      
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      /* Stagger animations for lists */
      .stagger-item {
        opacity: 0;
        transform: translateY(20px);
        animation: staggerIn 0.6s ease forwards;
      }
      
      .stagger-item:nth-child(1) { animation-delay: 0.1s; }
      .stagger-item:nth-child(2) { animation-delay: 0.2s; }
      .stagger-item:nth-child(3) { animation-delay: 0.3s; }
      .stagger-item:nth-child(4) { animation-delay: 0.4s; }
      .stagger-item:nth-child(5) { animation-delay: 0.5s; }
      
      @keyframes staggerIn {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Respects reduced motion preferences */
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    </style>
  `;

  if (typeof document !== "undefined") {
    const existingStyle = document.getElementById("animation-library");
    if (!existingStyle) {
      document.head.insertAdjacentHTML("beforeend", animationCSS);
    }
  }
}

/**
 * Add enhanced button interactions
 */
function addEnhancedButtonInteractions() {
  const buttons = $w("Button");
  if (buttons && buttons.length > 0) {
    buttons.forEach((button) => {
      try {
        // Enhanced hover with supported Wix events
        button.onMouseIn(() => {
          if (button.style) {
            button.style.backgroundColor = "#5A7A5E";
            // Only use transform if available
            try {
              if (button.style.transform !== undefined) {
                button.style.transform = "translateY(-2px)";
              }
            } catch (e) {
              // Transform not supported, continue without
            }
            // Only use boxShadow if available
            try {
              if (button.style.boxShadow !== undefined) {
                button.style.boxShadow = "0 8px 32px rgba(107, 142, 111, 0.25)";
              }
            } catch (e) {
              // BoxShadow not supported, continue without
            }
          }
        });

        button.onMouseOut(() => {
          if (button.style) {
            button.style.backgroundColor = "#6B8E6F";
            // Only use transform if available
            try {
              if (button.style.transform !== undefined) {
                button.style.transform = "translateY(0)";
              }
            } catch (e) {
              // Transform not supported, continue without
            }
            // Only use boxShadow if available
            try {
              if (button.style.boxShadow !== undefined) {
                button.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.06)";
              }
            } catch (e) {
              // BoxShadow not supported, continue without
            }
          }
        });
      } catch (e) {
        console.log("Could not enhance button interactions");
      }
    });
  }
}

/**
 * Add scroll-triggered animations using Intersection Observer
 */
function addScrollTriggeredAnimations() {
  if (typeof IntersectionObserver === "undefined") return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;

        try {
          // Add animation classes based on element type
          if (
            element.classList &&
            (element.classList.contains("card") ||
              (element.dataset && element.dataset.testid?.includes("card")))
          ) {
            element.classList.add("scale-in");
          } else if (
            element.tagName === "SECTION" ||
            (element.dataset && element.dataset.testid?.includes("section"))
          ) {
            element.classList.add("fade-in");
          } else {
            element.classList.add("slide-up");
          }
        } catch (e) {
          // Fallback: just add slide-up animation
          try {
            element.classList.add("slide-up");
          } catch (e2) {
            // Element doesn't support classList, skip animation
          }
        }

        // Unobserve after animation
        animateOnScroll.unobserve(element);
      }
    });
  }, observerOptions);

  // Observe Wix elements - handle safely
  try {
    const sections = $w("Section");
    if (sections && sections.length > 0) {
      sections.forEach((section) => {
        try {
          // Try to get the DOM element differently for Wix elements
          if (section.element) {
            animateOnScroll.observe(section.element);
          } else if (section.id) {
            // Fallback: try to find by ID in DOM
            const domElement = document.getElementById(section.id);
            if (domElement) {
              animateOnScroll.observe(domElement);
            }
          }
        } catch (e) {
          console.log("Could not observe section for animation");
        }
      });
    }
  } catch (e) {
    console.log("Could not access sections");
  }

  // Also observe containers and other elements
  if (typeof document !== "undefined") {
    setTimeout(() => {
      document
        .querySelectorAll(
          '.card, [data-testid*="card"], .container, [data-testid*="container"]'
        )
        .forEach((element) => {
          animateOnScroll.observe(element);
        });
    }, 100);
  }
}

/**
 * Add loading and transition effects
 */
function addLoadingTransitions() {
  // Add page load animation
  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
      // Stagger animation for main content areas
      const mainElements = document.querySelectorAll(
        "header, main, section, .hero"
      );
      mainElements.forEach((element, index) => {
        try {
          if (element.style) {
            element.style.opacity = "0";
            element.style.transform = "translateY(20px)";

            setTimeout(() => {
              if (element.style) {
                element.style.transition =
                  "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
              }
            }, index * 100);
          }
        } catch (e) {
          // Element doesn't support style manipulation, skip
        }
      });
    });

    // Add loading states for dynamic content
    const addLoadingState = (element) => {
      element.classList.add("loading-skeleton");
      setTimeout(() => {
        element.classList.remove("loading-skeleton");
        element.classList.add("fade-in");
      }, 800);
    };

    // Apply to images when they load
    document.querySelectorAll("img").forEach((img) => {
      if (!img.complete) {
        addLoadingState(img);
      }
    });
  }
}

/**
 * Add enhanced form interactions
 */
function addFormInteractions() {
  // Handle TextInput and TextBox separately for better type safety
  try {
    const textInputs = $w("TextInput");
    if (textInputs && textInputs.length > 0) {
      textInputs.forEach((input) => {
        try {
          // Enhanced focus animations
          input.onFocus(() => {
            if (input.style) {
              input.style.borderColor = "#6B8E6F";
              input.style.boxShadow = "0 0 0 3px rgba(107, 142, 111, 0.1)";
              try {
                if (input.style.transform !== undefined) {
                  input.style.transform = "translateY(-1px)";
                }
              } catch (e) {
                // Transform not supported
              }
            }
          });

          input.onBlur(() => {
            if (input.style) {
              input.style.borderColor = "#DDE4EA";
              input.style.boxShadow = "none";
              try {
                if (input.style.transform !== undefined) {
                  input.style.transform = "translateY(0)";
                }
              } catch (e) {
                // Transform not supported
              }
            }
          });

          // Input validation animations
          input.onChange(() => {
            if (input.value && input.value.length > 0) {
              if (input.style && input.style.borderColor !== undefined) {
                input.style.borderColor = "#4F7942"; // Success color
              }
            }
          });
        } catch (e) {
          console.log("Could not enhance TextInput interactions");
        }
      });
    }
  } catch (e) {
    console.log("Could not access TextInput elements");
  }

  try {
    const textBoxes = $w("TextBox");
    if (textBoxes && textBoxes.length > 0) {
      textBoxes.forEach((input) => {
        try {
          // Enhanced focus animations
          input.onFocus(() => {
            if (input.style) {
              input.style.borderColor = "#6B8E6F";
              input.style.boxShadow = "0 0 0 3px rgba(107, 142, 111, 0.1)";
              try {
                if (input.style.transform !== undefined) {
                  input.style.transform = "translateY(-1px)";
                }
              } catch (e) {
                // Transform not supported
              }
            }
          });

          input.onBlur(() => {
            if (input.style) {
              input.style.borderColor = "#DDE4EA";
              input.style.boxShadow = "none";
              try {
                if (input.style.transform !== undefined) {
                  input.style.transform = "translateY(0)";
                }
              } catch (e) {
                // Transform not supported
              }
            }
          });

          // Input validation animations
          input.onChange(() => {
            if (input.value && input.value.length > 0) {
              if (input.style && input.style.borderColor !== undefined) {
                input.style.borderColor = "#4F7942"; // Success color
              }
            }
          });
        } catch (e) {
          console.log("Could not enhance TextBox interactions");
        }
      });
    }
  } catch (e) {
    console.log("Could not access TextBox elements");
  }
}
