// Blue Ridge Bonsai Society - Wix Workaround Configuration
// Configuration and settings for dependency injection and API workarounds

/**
 * Configuration for Wix API Workarounds and Fallback Systems
 */
export const WixWorkaroundConfig = {
  // System Configuration
  system: {
    maxRetries: 3,
    retryDelay: 100, // milliseconds
    debugMode: true,
    logErrors: true,
    maxErrorLog: 50,
    cssInjectionTimeout: 5000, // milliseconds

    // Feature flags
    features: {
      cssInjection: true,
      htmlComponentFallback: true,
      directStylingFallback: true,
      enhancedEventHandling: true,
      visibilityControl: true,
      seasonalTheming: true,
      scrollBasedNavigation: true,
      microInteractions: true,
    },
  },

  // CSS Injection Strategies
  cssInjection: {
    strategies: [
      {
        name: "wix-css-panel",
        priority: 1,
        description: "Use Wix Studio CSS panel (primary method)",
        enabled: true,
      },
      {
        name: "html-component",
        priority: 2,
        description: "Inject via HTML component messaging",
        enabled: true,
      },
      {
        name: "document-head",
        priority: 3,
        description: "Direct document.head injection",
        enabled: true,
      },
      {
        name: "inline-styles",
        priority: 4,
        description: "Fallback to inline styles",
        enabled: true,
      },
    ],

    // CSS verification settings
    verification: {
      enabled: true,
      testClass: "liquid-glass-nav",
      requiredProperties: ["backdropFilter", "position"],
      timeout: 2000,
    },
  },

  // Element Manipulation Strategies
  elementManipulation: {
    classManipulation: {
      strategies: [
        {
          name: "customClassList",
          method: "element.customClassList.add/remove",
          priority: 1,
          enabled: true,
        },
        {
          name: "className",
          method: "element.className manipulation",
          priority: 2,
          enabled: true,
        },
        {
          name: "setAttribute",
          method: "element.setAttribute('class', ...)",
          priority: 3,
          enabled: true,
        },
        {
          name: "classList",
          method: "element.classList.add/remove",
          priority: 4,
          enabled: true,
        },
      ],
    },

    styleManipulation: {
      strategies: [
        {
          name: "elementStyle",
          method: "element.style.property",
          priority: 1,
          enabled: true,
        },
        {
          name: "cssClasses",
          method: "CSS classes with predefined styles",
          priority: 2,
          enabled: true,
        },
      ],
    },

    eventHandling: {
      strategies: [
        {
          name: "wixEvents",
          method: "element.onClick/onMouseIn/etc",
          priority: 1,
          enabled: true,
        },
        {
          name: "addEventListener",
          method: "element.addEventListener",
          priority: 2,
          enabled: true,
        },
        {
          name: "directAssignment",
          method: "element.onclick = handler",
          priority: 3,
          enabled: true,
        },
      ],
    },
  },

  // Navigation Configuration
  navigation: {
    // Header/navigation element selectors to try
    headerSelectors: [
      "#SITE_HEADER",
      "#header",
      "#wixHeader",
      "#masterHeader",
      "#siteHeader",
      "#navigation",
      "#navbar",
    ],

    // Navigation link selectors
    linkSelectors: [
      ".nav-link",
      "[data-nav-link]",
      "nav a",
      "header a",
      "#menuContainer a",
    ],

    // Mobile navigation elements
    mobileSelectors: {
      toggle: ["#mobileMenuToggle", "#hamburger", "#mobileToggle"],
      menu: ["#mobileMenu", "#mobileNav", "#mobileContainer"],
      overlay: ["#mobileOverlay", "#overlay", "#backdrop"],
    },

    // Scroll behavior
    scroll: {
      enabled: true,
      hideThreshold: 100, // pixels
      showThreshold: 50, // pixels
      throttleDelay: 16, // milliseconds
    },
  },

  // Design System Configuration
  designSystem: {
    // Color palette
    colors: {
      primary: "#6B8E6F", // Mountain Sage
      primaryHover: "#5A7A5E",
      secondary: "#4A4A4A", // Stone Gray
      background: "#FEFFFE", // Cloud White
      accent: "#8B7355", // Earth Brown
      border: "#DDE4EA",
      success: "#4F7942",
      warning: "#E6B800",
      error: "#DC3545",
    },

    // Typography
    typography: {
      primary:
        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      secondary: "Crimson Text, Georgia, serif",
      japanese: "Noto Sans JP, sans-serif",

      sizes: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
      },
    },

    // Spacing
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "3rem",
    },

    // Border radius
    borderRadius: {
      sm: "4px",
      md: "8px",
      lg: "12px",
      xl: "16px",
      full: "50%",
    },

    // Shadows
    shadows: {
      sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
      md: "0 4px 6px rgba(0, 0, 0, 0.1)",
      lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
      xl: "0 20px 25px rgba(0, 0, 0, 0.1)",
    },
  },

  // Fallback Styles (when CSS injection fails)
  fallbackStyles: {
    liquidGlassNav: {
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      zIndex: "9999",
      backgroundColor: "rgba(254, 255, 254, 0.85)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(107, 142, 111, 0.2)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    },

    enhancedButton: {
      backgroundColor: "#6B8E6F",
      color: "#FEFFFE",
      borderRadius: "8px",
      fontFamily:
        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontWeight: "500",
      padding: "12px 24px",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },

    enhancedButtonHover: {
      backgroundColor: "#5A7A5E",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 16px rgba(107, 142, 111, 0.3)",
    },

    atmosphericBackground: {
      background:
        "linear-gradient(135deg, rgba(254, 255, 254, 0.9) 0%, rgba(221, 228, 234, 0.7) 100%)",
      backdropFilter: "blur(10px)",
      borderRadius: "12px",
    },

    enhancedText: {
      fontFamily:
        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: "#4A4A4A",
      lineHeight: "1.6",
    },

    enhancedInput: {
      backgroundColor: "#FEFFFE",
      borderColor: "#DDE4EA",
      borderRadius: "8px",
      color: "#4A4A4A",
      fontFamily:
        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      padding: "12px 16px",
      transition: "all 0.2s ease",
    },

    enhancedInputFocus: {
      borderColor: "#6B8E6F",
      boxShadow: "0 0 0 3px rgba(107, 142, 111, 0.1)",
      outline: "none",
    },
  },

  // Animation Configuration
  animations: {
    // Default animation settings
    defaults: {
      duration: "0.6s",
      easing: "ease-out",
      delay: "0s",
    },

    // Animation types
    types: {
      fadeIn: {
        keyframes: "brbs-fadeIn",
        duration: "0.6s",
        easing: "ease-out",
      },
      slideUp: {
        keyframes: "brbs-slideUp",
        duration: "0.6s",
        easing: "ease-out",
      },
      scaleIn: {
        keyframes: "brbs-scaleIn",
        duration: "0.6s",
        easing: "ease-out",
      },
      pulse: {
        keyframes: "brbs-pulse",
        duration: "2s",
        iterationCount: "infinite",
      },
    },

    // Stagger delays for multiple elements
    staggerDelay: 100, // milliseconds
  },

  // Seasonal Theming
  seasonalTheming: {
    enabled: true,

    seasons: {
      spring: {
        months: [2, 3, 4], // March, April, May
        className: "spring-theme",
        filter: "hue-rotate(10deg) saturate(1.1)",
      },
      summer: {
        months: [5, 6, 7], // June, July, August
        className: "summer-theme",
        filter: "hue-rotate(20deg) saturate(1.2) brightness(1.05)",
      },
      autumn: {
        months: [8, 9, 10], // September, October, November
        className: "autumn-theme",
        filter: "hue-rotate(-10deg) saturate(1.15)",
      },
      winter: {
        months: [11, 0, 1], // December, January, February
        className: "winter-theme",
        filter: "saturate(0.9) brightness(0.95)",
      },
    },
  },

  // Performance Configuration
  performance: {
    // Throttle/debounce settings
    throttle: {
      scroll: 16, // ~60fps
      resize: 100,
      mousemove: 50,
    },

    // Intersection Observer settings
    intersectionObserver: {
      enabled: true,
      threshold: 0.1,
      rootMargin: "50px",
    },

    // Animation performance
    animation: {
      useTransforms: true,
      useWillChange: true,
      preferredProperties: ["transform", "opacity"],
    },
  },

  // Error Handling
  errorHandling: {
    // Global error handler settings
    global: {
      enabled: true,
      logToConsole: true,
      logToStorage: false,
      reportToService: false,
    },

    // Retry strategies
    retry: {
      maxAttempts: 3,
      backoffMultiplier: 2,
      initialDelay: 100,
    },

    // Fallback behaviors
    fallbacks: {
      gracefulDegradation: true,
      showErrorMessages: false,
      useBasicStyling: true,
      maintainFunctionality: true,
    },
  },

  // Development/Debug Settings
  development: {
    enabled: true,
    verboseLogging: true,
    showDiagnostics: true,
    testMode: false,

    // Test selectors for verification
    testSelectors: ["#testButton", "#testContainer", "#testText"],
  },
};

/**
 * Get current season based on date
 * @returns {string} - Season name
 */
export function getCurrentSeason() {
  const currentMonth = new Date().getMonth();
  const seasons = WixWorkaroundConfig.seasonalTheming.seasons;

  for (const [seasonName, config] of Object.entries(seasons)) {
    if (config.months.includes(currentMonth)) {
      return seasonName;
    }
  }

  return "spring"; // fallback
}

/**
 * Get configuration for specific feature
 * @param {string} feature - Feature name
 * @returns {Object|null} - Feature configuration
 */
export function getFeatureConfig(feature) {
  const parts = feature.split(".");
  let config = WixWorkaroundConfig;

  for (const part of parts) {
    if (config && config[part]) {
      config = config[part];
    } else {
      return null;
    }
  }

  return config;
}

/**
 * Check if feature is enabled
 * @param {string} feature - Feature name
 * @returns {boolean} - Enabled status
 */
export function isFeatureEnabled(feature) {
  const config = getFeatureConfig(`system.features.${feature}`);
  return config === true;
}

/**
 * Get fallback style for component
 * @param {string} component - Component name
 * @returns {Object|null} - Style object
 */
export function getFallbackStyle(component) {
  return WixWorkaroundConfig.fallbackStyles[component] || null;
}

/**
 * Get element selectors for feature
 * @param {string} feature - Feature name
 * @returns {Array} - Array of selectors
 */
export function getSelectors(feature) {
  const config = getFeatureConfig(`navigation.${feature}Selectors`);
  return Array.isArray(config) ? config : [];
}

// Export default configuration
export default WixWorkaroundConfig;
