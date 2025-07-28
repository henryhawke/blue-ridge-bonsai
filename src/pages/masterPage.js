// @ts-nocheck
// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// Blue Ridge Bonsai Society - Master Page Implementation with Dependency Injection
// WIX REPOSITORY INTEGRATION - Auto-deploys from Git commits

import { currentMember } from "wix-members";
import wixLocationFrontend from "wix-location-frontend";
import wixUsers from "wix-users";
import wixWindow from "wix-window";

// =====================================================
// DEPENDENCY INJECTION & WORKAROUND SYSTEM
// =====================================================

let injectedCSS = false;
let cssInjectionAttempts = 0;
const maxCSSInjectionAttempts = 3;

// Environment detection and safety checks
const IS_BROWSER =
  typeof window !== "undefined" && typeof document !== "undefined";
const IS_WIX_EDITOR =
  typeof wixWindow !== "undefined" &&
  wixWindow.rendering &&
  wixWindow.rendering.env === "browser";

// Helper function to safely access window properties
function safeGetWindowProperty(propertyName, defaultValue = {}) {
  if (!IS_BROWSER || typeof window === "undefined") {
    console.log(
      `⚠️ Window property ${propertyName} not available in current environment`
    );
    return defaultValue;
  }
  return window[propertyName] || defaultValue;
}

// Helper function to safely set window properties
function safeSetWindowProperty(propertyName, value) {
  if (typeof window !== "undefined") {
    window[propertyName] = value;
    return true;
  }
  return false;
}

// Helper function to safely call window property methods
function safeCallWindowMethod(propertyName, methodName, ...args) {
  const obj = safeGetWindowProperty(propertyName);
  if (obj && typeof obj[methodName] === "function") {
    return obj[methodName](...args);
  }
  return undefined;
}

// Fallback styling methods when Wix APIs fail
const FALLBACK_STYLES = {
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
  atmosphericBg: {
    background:
      "linear-gradient(135deg, rgba(254, 255, 254, 0.9) 0%, rgba(221, 228, 234, 0.7) 100%)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
  },
};

$w.onReady(function () {
  console.log(
    "Running the code for the site. To debug this code in your browser's dev tools, open masterPage.js."
  );
  console.log("💡 Blue Ridge Bonsai Society - Enhanced System Ready");
  console.log("🔧 Dependency injection and workaround systems active");
  console.log("🎯 Fallback methods initialized for Wix API limitations");
  console.log(
    "🌸 Blue Ridge Bonsai Society - Enhanced Dependency Injection Active"
  );
  console.log(
    "🚀 Auto-deploying from Git repository commit with fallback systems"
  );

  // Initialize dependency injection system
  initializeDependencyInjection();
});

/**
 * Initialize comprehensive dependency injection and workaround system
 */
async function initializeDependencyInjection() {
  try {
    console.log("🔧 Initializing dependency injection system...");

    // Phase 1: CSS Injection with multiple fallback methods
    await injectCSSWithFallbacks();

    // Phase 2: Enhanced element manipulation with error handling
    await initializeEnhancedElementManipulation();

    // Phase 3: Alternative navigation system
    await initializeRobustNavigation();

    // Phase 4: Enhanced styling with fallback methods
    await applyEnhancedStylingWithFallbacks();

    // Phase 5: Micro-interactions with error handling
    await addRobustMicroInteractions();

    console.log(
      "✅ All dependency injection and workarounds completed successfully!"
    );
  } catch (error) {
    console.error("❌ Error in dependency injection system:", error);
    await initializeFallbackSystem();
  }
}

/**
 * Inject CSS using multiple fallback methods when Wix methods fail
 */
async function injectCSSWithFallbacks() {
  console.log("💉 Injecting CSS with multiple fallback methods...");

  try {
    // Method 1: Try standard CSS verification first
    if (await verifyCSSLoaded()) {
      console.log("✅ Standard CSS loading verified");
      return;
    }

    // Method 2: Inject CSS via HTML component if available
    await injectCSSViaHTMLComponent();

    // Method 3: Inject CSS via custom style element
    await injectCSSViaCustomElement();

    // Method 4: Apply inline styles as final fallback
    await applyInlineStylesFallback();
  } catch (error) {
    console.error("Error in CSS injection:", error);
    await applyInlineStylesFallback();
  }
}

/**
 * Verify CSS loading with enhanced detection and environment safety
 */
async function verifyCSSLoaded() {
  return new Promise((resolve) => {
    try {
      // Check if we're in a browser environment with DOM access
      if (typeof document === "undefined" || typeof window === "undefined") {
        console.log(
          "⚠️ Browser APIs not available - server/restricted environment detected"
        );
        console.log("🔄 Skipping CSS verification, will use fallback styling");
        resolve(false);
        return;
      }

      // Check Wix environment if available
      if (wixWindow && wixWindow.rendering) {
        if (wixWindow.rendering.env !== "browser") {
          console.log(
            "⚠️ Not in browser rendering environment:",
            wixWindow.rendering.env
          );
          resolve(false);
          return;
        }
      }

      // Try to create test element
      let testDiv;
      try {
        testDiv = document.createElement("div");
      } catch (domError) {
        console.log("⚠️ Cannot create DOM elements - restricted environment");
        resolve(false);
        return;
      }

      testDiv.className = "liquid-glass-nav";
      testDiv.style.position = "absolute";
      testDiv.style.left = "-9999px";
      testDiv.style.top = "-9999px";
      testDiv.style.visibility = "hidden";
      testDiv.style.pointerEvents = "none";

      // Safe DOM manipulation
      try {
        document.body.appendChild(testDiv);
      } catch (appendError) {
        console.log(
          "⚠️ Cannot append to document body - restricted DOM access"
        );
        resolve(false);
        return;
      }

      setTimeout(() => {
        try {
          const computedStyle = getComputedStyle(testDiv);
          const hasBackdropFilter =
            computedStyle.backdropFilter !== "none" &&
            computedStyle.backdropFilter !== "";
          const hasPosition =
            computedStyle.position === "fixed" ||
            computedStyle.position === "absolute";

          // Safe removal
          if (document.body.contains(testDiv)) {
            document.body.removeChild(testDiv);
          }

          if (hasBackdropFilter && hasPosition) {
            console.log("✅ CSS loaded successfully from repository");
            resolve(true);
          } else {
            console.warn("⚠️ CSS not fully loaded - attempting injection");
            resolve(false);
          }
        } catch (cleanupError) {
          console.log("Error in CSS verification:", cleanupError);
          // Try to clean up anyway
          try {
            if (testDiv && document.body.contains(testDiv)) {
              document.body.removeChild(testDiv);
            }
          } catch (removeError) {
            // Ignore cleanup errors
          }
          resolve(false);
        }
      }, 100);
    } catch (error) {
      console.log("Could not verify CSS loading:", error);
      resolve(false);
    }
  });
}

/**
 * Inject CSS via HTML component method
 */
async function injectCSSViaHTMLComponent() {
  try {
    // Try to find an HTML component to inject CSS
    const htmlComponents = $w("HtmlComponent");

    if (htmlComponents && htmlComponents.length > 0) {
      const cssContent = generateCSSContent();

      htmlComponents.forEach((component) => {
        try {
          component.postMessage({
            type: "INJECT_CSS",
            css: cssContent,
          });
          console.log("✅ CSS injected via HTML component");
        } catch (e) {
          console.log("Could not inject CSS via HTML component");
        }
      });
    }

    // Create hidden HTML component for CSS injection if none exists
    await createCSSInjectionComponent();
  } catch (error) {
    console.log("HTML component CSS injection failed:", error);
  }
}

/**
 * Create a hidden HTML component specifically for CSS injection
 */
async function createCSSInjectionComponent() {
  try {
    if (cssInjectionAttempts >= maxCSSInjectionAttempts) {
      console.log("Max CSS injection attempts reached");
      return;
    }

    cssInjectionAttempts++;

    // Check if we're in a browser environment first
    if (typeof document === "undefined" || typeof window === "undefined") {
      console.log(
        "⚠️ Document/Window not available - skipping direct CSS injection"
      );
      return;
    }

    // Try to add CSS injection via wixWindow if available
    if (wixWindow && wixWindow.rendering) {
      if (wixWindow.rendering.env === "browser") {
        const cssContent = generateCSSContent();

        // Method: Direct style injection with safe DOM access
        try {
          const styleElement = document.createElement("style");
          styleElement.textContent = cssContent;
          styleElement.id = "brbs-injected-styles";

          // Remove existing injected styles safely
          const existingStyle = document.getElementById("brbs-injected-styles");
          if (existingStyle && existingStyle.parentNode) {
            existingStyle.parentNode.removeChild(existingStyle);
          }

          // Safe append to head
          if (document.head) {
            document.head.appendChild(styleElement);
            console.log("✅ CSS injected directly via document.head");
            injectedCSS = true;
          } else {
            console.log("⚠️ Document head not available");
          }
        } catch (domError) {
          console.log("⚠️ DOM manipulation failed:", domError);
        }
      } else {
        console.log(
          "⚠️ Not in browser rendering environment:",
          wixWindow.rendering.env
        );
      }
    } else {
      console.log("⚠️ wixWindow.rendering not available");
    }
  } catch (error) {
    console.log("Could not create CSS injection component:", error);
  }
}

/**
 * Generate CSS content for injection
 */
function generateCSSContent() {
  return `
    /* Blue Ridge Bonsai Society - Injected Styles */
    .liquid-glass-nav {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      z-index: 9999 !important;
      background: rgba(254, 255, 254, 0.85) !important;
      backdrop-filter: blur(20px) !important;
      -webkit-backdrop-filter: blur(20px) !important;
      border-bottom: 1px solid rgba(107, 142, 111, 0.2) !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }

    .nav-enhanced {
      padding: 0.75rem 1.5rem !important;
      background: transparent !important;
    }

    .nav-scrolled {
      background: rgba(254, 255, 254, 0.95) !important;
      backdrop-filter: blur(25px) !important;
      box-shadow: 0 1px 20px rgba(0, 0, 0, 0.08) !important;
    }

    .nav-hidden {
      transform: translateY(-100%) !important;
    }

    .btn-enhanced {
      background: linear-gradient(135deg, #6B8E6F 0%, #5A7A5E 100%) !important;
      color: #FEFFFE !important;
      border: none !important;
      border-radius: 8px !important;
      padding: 12px 24px !important;
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 500 !important;
      cursor: pointer !important;
      transition: all 0.2s ease !important;
      box-shadow: 0 2px 8px rgba(107, 142, 111, 0.2) !important;
    }

    .btn-enhanced:hover {
      background: linear-gradient(135deg, #5A7A5E 0%, #4F6B52 100%) !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 16px rgba(107, 142, 111, 0.3) !important;
    }

    .atmospheric-bg {
      background: linear-gradient(135deg, rgba(254, 255, 254, 0.9) 0%, rgba(221, 228, 234, 0.7) 100%) !important;
      backdrop-filter: blur(10px) !important;
      -webkit-backdrop-filter: blur(10px) !important;
      border-radius: 12px !important;
    }

    .text-enhanced {
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      color: #4A4A4A !important;
      line-height: 1.6 !important;
    }

    .container-enhanced {
      background: rgba(254, 255, 254, 0.6) !important;
      backdrop-filter: blur(10px) !important;
      border-radius: 12px !important;
      padding: 2rem !important;
    }

    .input-enhanced {
      background: #FEFFFE !important;
      border: 1px solid #DDE4EA !important;
      border-radius: 8px !important;
      color: #4A4A4A !important;
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      padding: 12px 16px !important;
      transition: all 0.2s ease !important;
    }

    .input-enhanced:focus {
      border-color: #6B8E6F !important;
      box-shadow: 0 0 0 3px rgba(107, 142, 111, 0.1) !important;
      outline: none !important;
    }

    /* Animation Classes */
    .fade-in {
      animation: fadeIn 0.6s ease-out forwards !important;
    }

    .slide-up {
      animation: slideUp 0.6s ease-out forwards !important;
    }

    .scale-in {
      animation: scaleIn 0.6s ease-out forwards !important;
    }

    .pulse {
      animation: pulse 2s infinite !important;
    }

    .hover-lift {
      transition: transform 0.2s ease !important;
    }

    .hover-lift:hover {
      transform: translateY(-2px) !important;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    /* Seasonal Themes */
    .spring-theme { filter: hue-rotate(10deg) saturate(1.1) !important; }
    .summer-theme { filter: hue-rotate(20deg) saturate(1.2) brightness(1.05) !important; }
    .autumn-theme { filter: hue-rotate(-10deg) saturate(1.15) !important; }
    .winter-theme { filter: saturate(0.9) brightness(0.95) !important; }
  `;
}

/**
 * Inject CSS via custom element method with environment safety
 */
async function injectCSSViaCustomElement() {
  try {
    // Check for browser environment
    if (typeof window === "undefined") {
      console.log(
        "⚠️ Window not available - skipping custom element CSS injection"
      );
      return;
    }

    // Try using wixWindow to access broader APIs
    if (wixWindow && wixWindow.copyToClipboard) {
      // This indicates we have enhanced wixWindow access
      console.log("✅ Enhanced wixWindow access available");
    }

    // Alternative: Use messaging system to inject CSS
    if (window.parent && typeof window.parent.postMessage === "function") {
      try {
        window.parent.postMessage(
          {
            type: "BRBS_INJECT_CSS",
            css: generateCSSContent(),
          },
          "*"
        );
        console.log("✅ CSS injection message sent to parent window");
      } catch (messageError) {
        console.log(
          "⚠️ Could not send message to parent window:",
          messageError
        );
      }
    } else {
      console.log("⚠️ Parent window messaging not available");
    }
  } catch (error) {
    console.log("Custom element CSS injection failed:", error);
  }
}

/**
 * Apply inline styles as ultimate fallback
 */
async function applyInlineStylesFallback() {
  console.log("🔄 Applying inline styles as fallback method");

  try {
    // Apply fallback styles to navigation
    await applyNavigationFallbackStyles();

    // Apply fallback styles to buttons
    await applyButtonFallbackStyles();

    // Apply fallback styles to containers
    await applyContainerFallbackStyles();

    console.log("✅ Inline fallback styles applied");
  } catch (error) {
    console.error("Error applying inline fallback styles:", error);
  }
}

/**
 * Apply navigation fallback styles
 */
async function applyNavigationFallbackStyles() {
  const headerSelectors = [
    "#SITE_HEADER",
    "#header",
    "#wixHeader",
    "#masterHeader",
    "#siteHeader",
  ];

  headerSelectors.forEach((selector) => {
    try {
      const headerElement = $w(selector);
      if (headerElement && headerElement.length > 0) {
        // Apply styles with error handling
        Object.entries(FALLBACK_STYLES.liquidGlassNav).forEach(
          ([property, value]) => {
            try {
              if (
                headerElement.style &&
                headerElement.style[property] !== undefined
              ) {
                headerElement.style[property] = value;
              }
            } catch (e) {
              console.log(`Could not apply ${property} to ${selector}`);
            }
          }
        );

        console.log(`✅ Fallback navigation styles applied to ${selector}`);
      }
    } catch (e) {
      // Element not found, continue
    }
  });
}

/**
 * Apply button fallback styles
 */
async function applyButtonFallbackStyles() {
  try {
    const buttons = $w("Button");
    if (buttons && buttons.length > 0) {
      buttons.forEach((button) => {
        try {
          Object.entries(FALLBACK_STYLES.enhancedButton).forEach(
            ([property, value]) => {
              try {
                if (button.style && button.style[property] !== undefined) {
                  button.style[property] = value;
                }
              } catch (e) {
                console.log(`Could not apply ${property} to button`);
              }
            }
          );

          // Enhanced interactions with error handling
          try {
            button.onMouseIn(() => {
              if (button.style && button.style.backgroundColor !== undefined) {
                button.style.backgroundColor = "#5A7A5E";
              }
            });

            button.onMouseOut(() => {
              if (button.style && button.style.backgroundColor !== undefined) {
                button.style.backgroundColor = "#6B8E6F";
              }
            });
          } catch (e) {
            console.log("Could not add button interactions");
          }
        } catch (e) {
          console.log("Could not style button");
        }
      });
    }
  } catch (error) {
    console.log("Error applying button fallback styles:", error);
  }
}

/**
 * Apply container fallback styles
 */
async function applyContainerFallbackStyles() {
  try {
    const containers = $w("Container");
    if (containers && containers.length > 0) {
      containers.forEach((container) => {
        try {
          Object.entries(FALLBACK_STYLES.atmosphericBg).forEach(
            ([property, value]) => {
              try {
                if (
                  container.style &&
                  container.style[property] !== undefined
                ) {
                  container.style[property] = value;
                }
              } catch (e) {
                console.log(`Could not apply ${property} to container`);
              }
            }
          );
        } catch (e) {
          console.log("Could not style container");
        }
      });
    }
  } catch (error) {
    console.log("Error applying container fallback styles:", error);
  }
}

/**
 * Initialize enhanced element manipulation with robust error handling
 */
async function initializeEnhancedElementManipulation() {
  console.log("🔧 Initializing enhanced element manipulation...");

  try {
    // Enhanced class manipulation with fallbacks
    await enhancedClassManipulation();

    // Enhanced event handling with error recovery
    await enhancedEventHandling();

    // Enhanced style application with validation
    await enhancedStyleApplication();
  } catch (error) {
    console.error("Error in enhanced element manipulation:", error);
  }
}

/**
 * Enhanced class manipulation with multiple fallback methods
 */
async function enhancedClassManipulation() {
  const elementMethods = {
    // Method 1: Try customClassList
    addClassMethod1: (element, className) => {
      if (
        element.customClassList &&
        typeof element.customClassList.add === "function"
      ) {
        element.customClassList.add(className);
        return true;
      }
      return false;
    },

    // Method 2: Try direct className manipulation
    addClassMethod2: (element, className) => {
      if (element.className !== undefined) {
        const currentClasses = element.className.split(" ");
        if (!currentClasses.includes(className)) {
          element.className = `${element.className} ${className}`.trim();
        }
        return true;
      }
      return false;
    },

    // Method 3: Try setAttribute
    addClassMethod3: (element, className) => {
      if (typeof element.setAttribute === "function") {
        const currentClass = element.getAttribute("class") || "";
        const classes = currentClass.split(" ");
        if (!classes.includes(className)) {
          element.setAttribute("class", `${currentClass} ${className}`.trim());
        }
        return true;
      }
      return false;
    },
  };

  // Store for later use (if window is available)
  if (safeSetWindowProperty("BRBS_ElementMethods", elementMethods)) {
    console.log(
      "✅ Enhanced class manipulation methods initialized and stored on window"
    );
  } else {
    console.log(
      "✅ Enhanced class manipulation methods initialized (window not available for storage)"
    );
  }
}

/**
 * Enhanced event handling with error recovery
 */
async function enhancedEventHandling() {
  const eventMethods = {
    // Safe event binding with error handling
    safeBindEvent: (element, eventName, handler) => {
      try {
        if (element && typeof element[eventName] === "function") {
          element[eventName](handler);
          return true;
        }
      } catch (error) {
        console.log(`Could not bind ${eventName} event:`, error);
      }
      return false;
    },

    // Alternative event binding methods
    bindEventAlternative: (element, eventName, handler) => {
      try {
        if (element && element.addEventListener) {
          element.addEventListener(eventName.replace("on", ""), handler);
          return true;
        }
      } catch (error) {
        console.log(`Could not bind ${eventName} via addEventListener:`, error);
      }
      return false;
    },
  };

  if (safeSetWindowProperty("BRBS_EventMethods", eventMethods)) {
    console.log(
      "✅ Enhanced event handling methods initialized and stored on window"
    );
  } else {
    console.log(
      "✅ Enhanced event handling methods initialized (window not available for storage)"
    );
  }
}

/**
 * Enhanced style application with validation
 */
async function enhancedStyleApplication() {
  const styleMethods = {
    // Safe style application
    safeApplyStyle: (element, property, value) => {
      try {
        if (element && element.style && element.style[property] !== undefined) {
          element.style[property] = value;
          return true;
        }
      } catch (error) {
        console.log(`Could not apply style ${property}:`, error);
      }
      return false;
    },

    // Batch style application
    applyStyleBatch: (element, styles) => {
      let applied = 0;
      Object.entries(styles).forEach(([property, value]) => {
        if (styleMethods.safeApplyStyle(element, property, value)) {
          applied++;
        }
      });
      return applied;
    },
  };

  if (safeSetWindowProperty("BRBS_StyleMethods", styleMethods)) {
    console.log(
      "✅ Enhanced style application methods initialized and stored on window"
    );
  } else {
    console.log(
      "✅ Enhanced style application methods initialized (window not available for storage)"
    );
  }
}

/**
 * Initialize robust navigation system with multiple fallback methods
 */
async function initializeRobustNavigation() {
  console.log("🧭 Initializing robust navigation system...");

  try {
    // Get current member with enhanced error handling
    const member = await getCurrentMemberRobust();
    const userRole = getUserRoleRobust(member);

    // Setup navigation with fallback methods
    await setupRobustNavigationForUser(userRole);

    // Setup enhanced responsive navigation
    await setupEnhancedResponsiveNavigation();

    // Setup scroll-based navigation with error handling
    await setupRobustScrollNavigation();

    console.log("✅ Robust navigation system initialized");
  } catch (error) {
    console.error("Error in robust navigation system:", error);
    await setupBasicNavigationFallback();
  }
}

/**
 * Get current member with enhanced error handling
 */
async function getCurrentMemberRobust() {
  try {
    const member = await currentMember.getMember();
    return member;
  } catch (error) {
    console.log("No member logged in or error accessing member:", error);
    return null;
  }
}

/**
 * Get user role with enhanced validation
 */
function getUserRoleRobust(member) {
  if (!member) return "guest";

  try {
    const memberRoles = member.memberRoles || member.roles || [];
    if (Array.isArray(memberRoles)) {
      if (memberRoles.includes("admin")) return "admin";
      if (memberRoles.includes("board")) return "board";
      return "member";
    }
    return "member";
  } catch (error) {
    console.log("Error determining user role:", error);
    return "guest";
  }
}

/**
 * Setup robust navigation with multiple fallback methods
 */
async function setupRobustNavigationForUser(userRole) {
  console.log(`Setting up navigation for user role: ${userRole}`);

  try {
    // Use enhanced element methods
    const { addClassMethod1, addClassMethod2, addClassMethod3 } =
      safeGetWindowProperty("BRBS_ElementMethods");

    // Apply navigation classes with fallback methods
    const headerSelectors = [
      "#SITE_HEADER",
      "#header",
      "#wixHeader",
      "#masterHeader",
      "#siteHeader",
    ];

    headerSelectors.forEach((selector) => {
      try {
        const headerElement = $w(selector);
        if (headerElement && headerElement.length > 0) {
          // Try multiple methods to add classes
          let classAdded = false;
          if (
            addClassMethod1 &&
            addClassMethod1(headerElement, "liquid-glass-nav")
          ) {
            classAdded = true;
          } else if (
            addClassMethod2 &&
            addClassMethod2(headerElement, "liquid-glass-nav")
          ) {
            classAdded = true;
          } else if (
            addClassMethod3 &&
            addClassMethod3(headerElement, "liquid-glass-nav")
          ) {
            classAdded = true;
          }

          if (classAdded) {
            console.log(`✅ Applied liquid-glass-nav class to ${selector}`);
          } else {
            // Fallback to direct styling
            safeCallWindowMethod(
              "BRBS_StyleMethods",
              "applyStyleBatch",
              headerElement,
              FALLBACK_STYLES.liquidGlassNav
            );
          }
        }
      } catch (e) {
        console.log(`Could not access ${selector}`);
      }
    });

    // Setup role-based navigation visibility
    await setupRoleBasedNavigation(userRole);
  } catch (error) {
    console.error("Error setting up robust navigation:", error);
  }
}

/**
 * Setup role-based navigation with enhanced error handling
 */
async function setupRoleBasedNavigation(userRole) {
  const membersOnlySelectors = [
    "#membersArea",
    "#memberDirectory",
    "#adminPanel",
    "#memberDashboard",
  ];

  const publicSelectors = ["#joinUsButton", "#loginLink", "#guestWelcome"];

  try {
    if (userRole === "guest") {
      // Hide member elements, show public elements
      membersOnlySelectors.forEach((selector) => {
        try {
          const element = $w(selector);
          if (
            element &&
            element.length > 0 &&
            typeof element.hide === "function"
          ) {
            element.hide();
          }
        } catch (e) {
          console.log(`Could not hide ${selector}`);
        }
      });

      publicSelectors.forEach((selector) => {
        try {
          const element = $w(selector);
          if (
            element &&
            element.length > 0 &&
            typeof element.show === "function"
          ) {
            element.show();
          }
        } catch (e) {
          console.log(`Could not show ${selector}`);
        }
      });
    } else {
      // Show member elements, hide public elements
      membersOnlySelectors.forEach((selector) => {
        try {
          const element = $w(selector);
          if (
            element &&
            element.length > 0 &&
            typeof element.show === "function"
          ) {
            element.show();
          }
        } catch (e) {
          console.log(`Could not show ${selector}`);
        }
      });

      publicSelectors.forEach((selector) => {
        try {
          const element = $w(selector);
          if (
            element &&
            element.length > 0 &&
            typeof element.hide === "function"
          ) {
            element.hide();
          }
        } catch (e) {
          console.log(`Could not hide ${selector}`);
        }
      });
    }

    console.log(`✅ Role-based navigation setup completed for: ${userRole}`);
  } catch (error) {
    console.error("Error in role-based navigation setup:", error);
  }
}

/**
 * Setup enhanced responsive navigation with error handling
 */
async function setupEnhancedResponsiveNavigation() {
  try {
    const { safeBindEvent, bindEventAlternative } =
      safeGetWindowProperty("BRBS_EventMethods");

    // Mobile menu toggle with enhanced error handling
    const mobileToggle = $w("#mobileMenuToggle");
    const mobileMenu = $w("#mobileMenu");

    if (
      mobileToggle &&
      mobileToggle.length > 0 &&
      mobileMenu &&
      mobileMenu.length > 0
    ) {
      const toggleHandler = () => {
        try {
          const isVisible =
            typeof mobileMenu.isVisible === "boolean"
              ? mobileMenu.isVisible
              : mobileMenu.style && mobileMenu.style.display !== "none";

          if (isVisible) {
            if (typeof mobileMenu.hide === "function") {
              mobileMenu.hide();
            } else if (mobileMenu.style) {
              mobileMenu.style.display = "none";
            }
          } else {
            if (typeof mobileMenu.show === "function") {
              mobileMenu.show();
            } else if (mobileMenu.style) {
              mobileMenu.style.display = "block";
            }
          }
        } catch (e) {
          console.log("Error in mobile menu toggle:", e);
        }
      };

      // Try multiple event binding methods
      if (
        !safeBindEvent ||
        !safeBindEvent(mobileToggle, "onClick", toggleHandler)
      ) {
        if (bindEventAlternative) {
          bindEventAlternative(mobileToggle, "click", toggleHandler);
        }
      }

      console.log("✅ Enhanced mobile navigation setup completed");
    }
  } catch (error) {
    console.error("Error setting up enhanced responsive navigation:", error);
  }
}

/**
 * Setup robust scroll-based navigation
 */
async function setupRobustScrollNavigation() {
  if (typeof window === "undefined") return;

  try {
    let lastScrollY = 0;
    let ticking = false;

    const updateNavigation = () => {
      const currentScrollY = window.scrollY || window.pageYOffset || 0;

      try {
        const headerSelectors = ["#SITE_HEADER", "#header", "#wixHeader"];
        const elementMethods =
          (typeof window !== "undefined" && window.BRBS_ElementMethods) || {};
        const { addClassMethod1, addClassMethod2 } = elementMethods;

        headerSelectors.forEach((selector) => {
          try {
            const headerElement = $w(selector);
            if (headerElement && headerElement.length > 0) {
              // Remove/add classes based on scroll with fallback methods
              if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down - hide navigation
                if (addClassMethod1) {
                  addClassMethod1(headerElement, "nav-hidden");
                } else if (addClassMethod2) {
                  addClassMethod2(headerElement, "nav-hidden");
                } else if (headerElement.style) {
                  headerElement.style.transform = "translateY(-100%)";
                }
              } else {
                // Scrolling up - show navigation
                if (
                  headerElement.customClassList &&
                  typeof headerElement.customClassList.remove === "function"
                ) {
                  headerElement.customClassList.remove("nav-hidden");
                } else if (headerElement.style) {
                  headerElement.style.transform = "translateY(0)";
                }
              }

              // Add scrolled state
              if (currentScrollY > 50) {
                if (addClassMethod1) {
                  addClassMethod1(headerElement, "nav-scrolled");
                } else if (addClassMethod2) {
                  addClassMethod2(headerElement, "nav-scrolled");
                } else {
                  const styleMethods =
                    (typeof window !== "undefined" &&
                      window.BRBS_StyleMethods) ||
                    {};
                  if (styleMethods.applyStyleBatch) {
                    styleMethods.applyStyleBatch(headerElement, {
                      backgroundColor: "rgba(254, 255, 254, 0.95)",
                      backdropFilter: "blur(25px)",
                      boxShadow: "0 1px 20px rgba(0, 0, 0, 0.08)",
                    });
                  }
                }
              } else {
                if (
                  headerElement.customClassList &&
                  typeof headerElement.customClassList.remove === "function"
                ) {
                  headerElement.customClassList.remove("nav-scrolled");
                } else {
                  const styleMethods =
                    (typeof window !== "undefined" &&
                      window.BRBS_StyleMethods) ||
                    {};
                  if (styleMethods.applyStyleBatch) {
                    styleMethods.applyStyleBatch(
                      headerElement,
                      FALLBACK_STYLES.liquidGlassNav
                    );
                  }
                }
              }
            }
          } catch (e) {
            console.log(`Error updating navigation for ${selector}`);
          }
        });
      } catch (error) {
        console.log("Error in scroll navigation update:", error);
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(updateNavigation);
        } else {
          setTimeout(updateNavigation, 16);
        }
        ticking = true;
      }
    };

    // Bind scroll event with error handling
    try {
      window.addEventListener("scroll", onScroll, { passive: true });
      console.log("✅ Robust scroll navigation initialized");
    } catch (error) {
      // Fallback for older browsers
      window.onscroll = onScroll;
      console.log("✅ Fallback scroll navigation initialized");
    }
  } catch (error) {
    console.error("Error setting up robust scroll navigation:", error);
  }
}

/**
 * Apply enhanced styling with comprehensive fallback methods
 */
async function applyEnhancedStylingWithFallbacks() {
  console.log("🎨 Applying enhanced styling with fallback methods...");

  try {
    // Apply enhanced button styling
    await applyEnhancedButtonStyling();

    // Apply enhanced text styling
    await applyEnhancedTextStyling();

    // Apply enhanced container styling
    await applyEnhancedContainerStyling();

    // Apply enhanced input styling
    await applyEnhancedInputStyling();

    // Apply seasonal theming
    await applySeasonalTheming();

    console.log("✅ Enhanced styling with fallbacks applied successfully");
  } catch (error) {
    console.error("Error applying enhanced styling:", error);
  }
}

/**
 * Apply enhanced button styling with multiple methods
 */
async function applyEnhancedButtonStyling() {
  try {
    const buttons = $w("Button");
    if (buttons && buttons.length > 0) {
      buttons.forEach((button) => {
        try {
          // Try class-based styling first
          const { addClassMethod1, addClassMethod2 } = safeGetWindowProperty(
            "BRBS_ElementMethods"
          );

          let classApplied = false;
          if (addClassMethod1 && addClassMethod1(button, "btn-enhanced")) {
            classApplied = true;
          } else if (
            addClassMethod2 &&
            addClassMethod2(button, "btn-enhanced")
          ) {
            classApplied = true;
          }

          // Fallback to direct styling
          if (!classApplied) {
            safeCallWindowMethod(
              "BRBS_StyleMethods",
              "applyStyleBatch",
              button,
              FALLBACK_STYLES.enhancedButton
            );
          }

          // Enhanced interactions with fallback methods
          const { safeBindEvent } = safeGetWindowProperty("BRBS_EventMethods");

          const mouseInHandler = () => {
            safeCallWindowMethod(
              "BRBS_StyleMethods",
              "safeApplyStyle",
              button,
              "backgroundColor",
              "#5A7A5E"
            );
            safeCallWindowMethod(
              "BRBS_StyleMethods",
              "safeApplyStyle",
              button,
              "transform",
              "translateY(-1px)"
            );
          };

          const mouseOutHandler = () => {
            safeCallWindowMethod(
              "BRBS_StyleMethods",
              "safeApplyStyle",
              button,
              "backgroundColor",
              "#6B8E6F"
            );
            safeCallWindowMethod(
              "BRBS_StyleMethods",
              "safeApplyStyle",
              button,
              "transform",
              "translateY(0)"
            );
          };

          if (safeBindEvent) {
            safeBindEvent(button, "onMouseIn", mouseInHandler);
            safeBindEvent(button, "onMouseOut", mouseOutHandler);
          }

          console.log("✅ Enhanced button styling applied");
        } catch (e) {
          console.log("Could not style individual button:", e);
        }
      });
    }
  } catch (error) {
    console.log("Error applying enhanced button styling:", error);
  }
}

/**
 * Apply enhanced text styling
 */
async function applyEnhancedTextStyling() {
  try {
    const textElements = $w("Text");
    if (textElements && textElements.length > 0) {
      textElements.forEach((text) => {
        try {
          const { addClassMethod1, addClassMethod2 } = safeGetWindowProperty(
            "BRBS_ElementMethods"
          );

          let classApplied = false;
          if (addClassMethod1 && addClassMethod1(text, "text-enhanced")) {
            classApplied = true;
          } else if (
            addClassMethod2 &&
            addClassMethod2(text, "text-enhanced")
          ) {
            classApplied = true;
          }

          if (!classApplied) {
            safeCallWindowMethod("BRBS_StyleMethods", "applyStyleBatch", text, {
              fontFamily:
                "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              color: "#4A4A4A",
              lineHeight: "1.6",
            });
          }
        } catch (e) {
          console.log("Could not style text element");
        }
      });
    }
  } catch (error) {
    console.log("Error applying enhanced text styling:", error);
  }
}

/**
 * Apply enhanced container styling
 */
async function applyEnhancedContainerStyling() {
  try {
    const containers = $w("Container");
    if (containers && containers.length > 0) {
      containers.forEach((container) => {
        try {
          const { addClassMethod1, addClassMethod2 } = safeGetWindowProperty(
            "BRBS_ElementMethods"
          );

          let classApplied = false;
          if (
            addClassMethod1 &&
            addClassMethod1(container, "container-enhanced")
          ) {
            classApplied = true;
          } else if (
            addClassMethod2 &&
            addClassMethod2(container, "container-enhanced")
          ) {
            classApplied = true;
          }

          if (!classApplied) {
            safeCallWindowMethod(
              "BRBS_StyleMethods",
              "applyStyleBatch",
              container,
              FALLBACK_STYLES.atmosphericBg
            );
          }
        } catch (e) {
          console.log("Could not style container");
        }
      });
    }
  } catch (error) {
    console.log("Error applying enhanced container styling:", error);
  }
}

/**
 * Apply enhanced input styling
 */
async function applyEnhancedInputStyling() {
  const inputTypes = ["TextInput", "TextBox"];

  inputTypes.forEach((inputType) => {
    try {
      const inputs = $w(inputType);
      if (inputs && inputs.length > 0) {
        inputs.forEach((input) => {
          try {
            const { addClassMethod1, addClassMethod2 } = safeGetWindowProperty(
              "BRBS_ElementMethods"
            );

            let classApplied = false;
            if (addClassMethod1 && addClassMethod1(input, "input-enhanced")) {
              classApplied = true;
            } else if (
              addClassMethod2 &&
              addClassMethod2(input, "input-enhanced")
            ) {
              classApplied = true;
            }

            if (!classApplied) {
              safeCallWindowMethod(
                "BRBS_StyleMethods",
                "applyStyleBatch",
                input,
                {
                  backgroundColor: "#FEFFFE",
                  borderColor: "#DDE4EA",
                  borderRadius: "8px",
                  color: "#4A4A4A",
                  fontFamily:
                    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  padding: "12px 16px",
                }
              );
            }

            // Enhanced focus effects
            const { safeBindEvent } =
              safeGetWindowProperty("BRBS_EventMethods");

            if (safeBindEvent) {
              safeBindEvent(input, "onFocus", () => {
                safeCallWindowMethod(
                  "BRBS_StyleMethods",
                  "safeApplyStyle",
                  input,
                  "borderColor",
                  "#6B8E6F"
                );
              });

              safeBindEvent(input, "onBlur", () => {
                safeCallWindowMethod(
                  "BRBS_StyleMethods",
                  "safeApplyStyle",
                  input,
                  "borderColor",
                  "#DDE4EA"
                );
              });
            }
          } catch (e) {
            console.log(`Could not style ${inputType} element`);
          }
        });
      }
    } catch (e) {
      console.log(`Could not access ${inputType} elements`);
    }
  });
}

/**
 * Apply seasonal theming with enhanced detection
 */
async function applySeasonalTheming() {
  try {
    const currentMonth = new Date().getMonth();
    let seasonalClass = "";

    if (currentMonth >= 2 && currentMonth <= 4) {
      seasonalClass = "spring-theme";
    } else if (currentMonth >= 5 && currentMonth <= 7) {
      seasonalClass = "summer-theme";
    } else if (currentMonth >= 8 && currentMonth <= 10) {
      seasonalClass = "autumn-theme";
    } else {
      seasonalClass = "winter-theme";
    }

    const containerSelectors = [
      "#SITE_CONTAINER",
      "#main",
      "#mainContainer",
      "#pageContainer",
    ];
    const { addClassMethod1, addClassMethod2 } = safeGetWindowProperty(
      "BRBS_ElementMethods"
    );

    containerSelectors.forEach((selector) => {
      try {
        const container = $w(selector);
        if (container && container.length > 0) {
          let classApplied = false;
          if (addClassMethod1 && addClassMethod1(container, seasonalClass)) {
            classApplied = true;
          } else if (
            addClassMethod2 &&
            addClassMethod2(container, seasonalClass)
          ) {
            classApplied = true;
          }

          if (classApplied) {
            console.log(`✅ Applied ${seasonalClass} to ${selector}`);
          }
        }
      } catch (e) {
        console.log(`Could not apply seasonal theme to ${selector}`);
      }
    });
  } catch (error) {
    console.log("Error applying seasonal theming:", error);
  }
}

/**
 * Add robust micro-interactions with comprehensive error handling
 */
async function addRobustMicroInteractions() {
  console.log("✨ Adding robust micro-interactions with error handling...");

  try {
    // Enhanced animations with fallback methods
    await addEnhancedAnimations();

    // Enhanced scroll-triggered effects
    await addEnhancedScrollEffects();

    // Enhanced loading transitions
    await addEnhancedLoadingTransitions();

    console.log("✅ Robust micro-interactions added successfully");
  } catch (error) {
    console.error("Error adding robust micro-interactions:", error);
  }
}

/**
 * Add enhanced animations with multiple fallback methods
 */
async function addEnhancedAnimations() {
  try {
    const elementTypes = ["Container", "Section", "Text", "Title", "Image"];
    const { addClassMethod1, addClassMethod2 } = safeGetWindowProperty(
      "BRBS_ElementMethods"
    );

    elementTypes.forEach((elementType) => {
      try {
        const elements = $w(elementType);
        if (elements && elements.length > 0) {
          elements.forEach((element, index) => {
            try {
              setTimeout(() => {
                let animationClass = "";
                switch (elementType) {
                  case "Container":
                    animationClass = "scale-in";
                    break;
                  case "Section":
                    animationClass = "fade-in";
                    break;
                  case "Text":
                  case "Title":
                    animationClass = "slide-up";
                    break;
                  case "Image":
                    animationClass = "fade-in";
                    break;
                  default:
                    animationClass = "fade-in";
                }

                // Try multiple methods to add animation class
                let classApplied = false;
                if (
                  addClassMethod1 &&
                  addClassMethod1(element, animationClass)
                ) {
                  classApplied = true;
                } else if (
                  addClassMethod2 &&
                  addClassMethod2(element, animationClass)
                ) {
                  classApplied = true;
                }

                // Fallback to direct style animation
                if (!classApplied && element.style) {
                  element.style.opacity = "0";
                  setTimeout(() => {
                    if (element.style) {
                      element.style.transition = "opacity 0.6s ease-out";
                      element.style.opacity = "1";
                    }
                  }, 50);
                }
              }, index * 100);
            } catch (e) {
              console.log(`Could not animate ${elementType} element`);
            }
          });
        }
      } catch (e) {
        console.log(`Could not access ${elementType} elements`);
      }
    });
  } catch (error) {
    console.log("Error adding enhanced animations:", error);
  }
}

/**
 * Add enhanced scroll effects
 */
async function addEnhancedScrollEffects() {
  if (typeof window === "undefined") return;

  try {
    // Enhanced scroll-triggered animations
    const observeElements = () => {
      try {
        const containers = $w("Container");
        if (containers && containers.length > 0) {
          containers.forEach((container) => {
            try {
              // Add hover effects via CSS classes
              const { addClassMethod1, addClassMethod2 } =
                safeGetWindowProperty("BRBS_ElementMethods");

              if (addClassMethod1) {
                addClassMethod1(container, "hover-lift");
              } else if (addClassMethod2) {
                addClassMethod2(container, "hover-lift");
              }
            } catch (e) {
              console.log("Could not add scroll effects to container");
            }
          });
        }
      } catch (error) {
        console.log("Error in scroll effects observation:", error);
      }
    };

    // Run scroll effects
    observeElements();

    // Setup intersection observer if available
    if (window.IntersectionObserver) {
      try {
        const observerCallback = (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const element = entry.target;
              if (element && element.style) {
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
              }
            }
          });
        };

        const observer = new IntersectionObserver(observerCallback, {
          threshold: 0.1,
          rootMargin: "50px",
        });

        // Observe elements if we can access them
        setTimeout(() => {
          try {
            const allElements = [
              ...($w("Container") || []),
              ...($w("Section") || []),
              ...($w("Text") || []),
            ];

            allElements.forEach((element) => {
              if (element && element.style) {
                element.style.opacity = "0";
                element.style.transform = "translateY(20px)";
                element.style.transition =
                  "opacity 0.6s ease, transform 0.6s ease";

                // Try to observe the element
                try {
                  observer.observe(element);
                } catch (e) {
                  // Fallback: just show the element
                  element.style.opacity = "1";
                  element.style.transform = "translateY(0)";
                }
              }
            });
          } catch (e) {
            console.log("Could not setup intersection observer");
          }
        }, 500);
      } catch (error) {
        console.log("Intersection Observer not available:", error);
      }
    }
  } catch (error) {
    console.log("Error adding enhanced scroll effects:", error);
  }
}

/**
 * Add enhanced loading transitions
 */
async function addEnhancedLoadingTransitions() {
  try {
    const images = $w("Image");
    if (images && images.length > 0) {
      images.forEach((image, index) => {
        try {
          const { addClassMethod1, addClassMethod2 } = safeGetWindowProperty(
            "BRBS_ElementMethods"
          );

          // Add loading animation
          let loadingApplied = false;
          if (addClassMethod1 && addClassMethod1(image, "pulse")) {
            loadingApplied = true;
          } else if (addClassMethod2 && addClassMethod2(image, "pulse")) {
            loadingApplied = true;
          }

          // Fallback loading animation
          if (!loadingApplied && image.style) {
            image.style.opacity = "0.5";
            image.style.animation = "pulse 2s infinite";
          }

          // Simulate loading completion
          setTimeout(() => {
            try {
              if (
                image.customClassList &&
                typeof image.customClassList.remove === "function"
              ) {
                image.customClassList.remove("pulse");
              }

              if (addClassMethod1) {
                addClassMethod1(image, "fade-in");
              } else if (image.style) {
                image.style.opacity = "1";
                image.style.animation = "none";
                image.style.transition = "opacity 0.3s ease";
              }
            } catch (e) {
              console.log("Could not complete loading transition");
            }
          }, 500 + index * 100);
        } catch (e) {
          console.log("Could not add loading transition to image");
        }
      });
    }
  } catch (error) {
    console.log("Error adding enhanced loading transitions:", error);
  }
}

/**
 * Initialize fallback system when all else fails
 */
async function initializeFallbackSystem() {
  console.log("🔄 Initializing ultimate fallback system...");

  try {
    // Basic styling fallback
    await applyBasicStylingFallback();

    // Basic navigation fallback
    await setupBasicNavigationFallback();

    // Basic interactions fallback
    await addBasicInteractionsFallback();

    console.log("✅ Ultimate fallback system initialized");
  } catch (error) {
    console.error("Error in ultimate fallback system:", error);
  }
}

/**
 * Apply basic styling as ultimate fallback
 */
async function applyBasicStylingFallback() {
  try {
    // Apply basic button styling
    const buttons = $w("Button");
    if (buttons && buttons.length > 0) {
      buttons.forEach((button) => {
        try {
          if (button.style) {
            button.style.backgroundColor = "#6B8E6F";
            button.style.color = "#FEFFFE";
            button.style.borderRadius = "8px";
            button.style.padding = "12px 24px";
            button.style.border = "none";
          }
        } catch (e) {
          console.log("Could not apply basic button styling");
        }
      });
    }

    // Apply basic text styling
    const textElements = $w("Text");
    if (textElements && textElements.length > 0) {
      textElements.forEach((text) => {
        try {
          if (text.style) {
            text.style.color = "#4A4A4A";
            text.style.lineHeight = "1.6";
          }
        } catch (e) {
          console.log("Could not apply basic text styling");
        }
      });
    }

    console.log("✅ Basic styling fallback applied");
  } catch (error) {
    console.log("Error applying basic styling fallback:", error);
  }
}

/**
 * Setup basic navigation as ultimate fallback
 */
async function setupBasicNavigationFallback() {
  try {
    const navSelectors = [".nav-link", "[data-nav-link]", "nav a", "header a"];

    navSelectors.forEach((selector) => {
      try {
        const navLinks = $w(selector);
        if (navLinks && navLinks.length > 0) {
          navLinks.forEach((link) => {
            try {
              if (link && link.link && typeof link.onClick === "function") {
                link.onClick(() => {
                  try {
                    wixLocationFrontend.to(link.link);
                  } catch (e) {
                    console.log("Could not navigate using wixLocationFrontend");
                    // Ultimate fallback: try window.location
                    if (typeof window !== "undefined" && window.location) {
                      window.location.href = link.link;
                    }
                  }
                });
              }
            } catch (e) {
              console.log("Could not setup link navigation");
            }
          });
        }
      } catch (e) {
        console.log(`Could not access navigation links: ${selector}`);
      }
    });

    console.log("✅ Basic navigation fallback setup completed");
  } catch (error) {
    console.log("Error setting up basic navigation fallback:", error);
  }
}

/**
 * Add basic interactions as ultimate fallback
 */
async function addBasicInteractionsFallback() {
  try {
    // Basic button hover effects
    const buttons = $w("Button");
    if (buttons && buttons.length > 0) {
      buttons.forEach((button) => {
        try {
          if (
            typeof button.onMouseIn === "function" &&
            typeof button.onMouseOut === "function"
          ) {
            button.onMouseIn(() => {
              if (button.style && button.style.backgroundColor !== undefined) {
                button.style.backgroundColor = "#5A7A5E";
              }
            });

            button.onMouseOut(() => {
              if (button.style && button.style.backgroundColor !== undefined) {
                button.style.backgroundColor = "#6B8E6F";
              }
            });
          }
        } catch (e) {
          console.log("Could not add basic button interactions");
        }
      });
    }

    // Basic form focus effects
    const inputs = [...($w("TextInput") || []), ...($w("TextBox") || [])];
    inputs.forEach((input) => {
      try {
        if (
          typeof input.onFocus === "function" &&
          typeof input.onBlur === "function"
        ) {
          input.onFocus(() => {
            if (input.style && input.style.borderColor !== undefined) {
              input.style.borderColor = "#6B8E6F";
            }
          });

          input.onBlur(() => {
            if (input.style && input.style.borderColor !== undefined) {
              input.style.borderColor = "#DDE4EA";
            }
          });
        }
      } catch (e) {
        console.log("Could not add basic input interactions");
      }
    });

    console.log("✅ Basic interactions fallback added");
  } catch (error) {
    console.log("Error adding basic interactions fallback:", error);
  }
}

// =====================================================
// INITIALIZE SYSTEM ON PAGE READY
// =====================================================

// Log system status
console.log("💡 Blue Ridge Bonsai Society - Enhanced System Ready");
console.log("🔧 Dependency injection and workaround systems active");
console.log("🎯 Fallback methods initialized for Wix API limitations");
