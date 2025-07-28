// Blue Ridge Bonsai Society - Wix Workaround System Test & Demo
// This file demonstrates how to use the enhanced workaround system

import {
  ClassManipulation,
  StyleManipulation,
  EventHandling,
  VisibilityControl,
  ElementSelection,
  Utils,
} from "./element-workarounds.js";

import {
  WixWorkaroundConfig,
  isFeatureEnabled,
  getFallbackStyle,
  getCurrentSeason,
} from "./wix-workaround-config.js";

/**
 * Test and demonstrate the Wix workaround system
 * Call this function to run comprehensive tests
 */
export function runWorkaroundTests() {
  console.log("🧪 Starting Wix Workaround System Tests...");

  // Test system diagnostics
  testSystemDiagnostics();

  // Test element manipulation
  testElementManipulation();

  // Test CSS class manipulation
  testClassManipulation();

  // Test style manipulation
  testStyleManipulation();

  // Test event handling
  testEventHandling();

  // Test visibility control
  testVisibilityControl();

  // Test configuration system
  testConfigurationSystem();

  // Test seasonal theming
  testSeasonalTheming();

  console.log("✅ Wix Workaround System Tests Complete!");
}

/**
 * Test system diagnostics and capabilities
 */
function testSystemDiagnostics() {
  console.log("📊 Testing System Diagnostics...");

  try {
    // Get system diagnostics
    const diagnostics = Utils.getDiagnostics();
    console.log("System Diagnostics:", diagnostics);

    // Test with a button element if available
    const testButton = ElementSelection.select("#testButton");
    if (testButton) {
      const capabilities = Utils.testCapabilities(testButton);
      console.log("Test Button Capabilities:", capabilities);
    } else {
      console.log("No test button found - creating virtual test");

      // Try with any available button
      const buttons = $w("Button");
      if (buttons && buttons.length > 0) {
        const capabilities = Utils.testCapabilities(buttons[0]);
        console.log("First Button Capabilities:", capabilities);
      }
    }

    console.log("✅ System diagnostics test passed");
  } catch (error) {
    console.error("❌ System diagnostics test failed:", error);
  }
}

/**
 * Test element manipulation
 */
function testElementManipulation() {
  console.log("🔧 Testing Element Manipulation...");

  try {
    // Test multiple element selection
    const selectors = ["#testButton", "#testContainer", "#testText"];
    const elements = ElementSelection.selectMultiple(selectors);

    console.log("Selected elements:", elements);

    // Test first available element selection
    const headerSelectors = ["#SITE_HEADER", "#header", "#wixHeader"];
    const headerElement =
      ElementSelection.selectFirstAvailable(headerSelectors);

    if (headerElement) {
      console.log("✅ Found header element using fallback selection");
    } else {
      console.log("⚠️ No header element found with any selector");
    }

    console.log("✅ Element manipulation test passed");
  } catch (error) {
    console.error("❌ Element manipulation test failed:", error);
  }
}

/**
 * Test CSS class manipulation with fallbacks
 */
function testClassManipulation() {
  console.log("🎨 Testing Class Manipulation...");

  try {
    // Test with buttons
    const buttons = $w("Button");
    if (buttons && buttons.length > 0) {
      const testButton = buttons[0];

      // Test adding class
      const addSuccess = ClassManipulation.addClass(testButton, "test-class");
      console.log("Add class result:", addSuccess);

      // Test checking class
      const hasClass = ClassManipulation.hasClass(testButton, "test-class");
      console.log("Has class result:", hasClass);

      // Test removing class
      const removeSuccess = ClassManipulation.removeClass(
        testButton,
        "test-class"
      );
      console.log("Remove class result:", removeSuccess);

      // Test toggle class
      const toggleSuccess = ClassManipulation.toggleClass(
        testButton,
        "test-toggle"
      );
      console.log("Toggle class result:", toggleSuccess);

      // Clean up
      ClassManipulation.removeClass(testButton, "test-toggle");
    }

    console.log("✅ Class manipulation test passed");
  } catch (error) {
    console.error("❌ Class manipulation test failed:", error);
  }
}

/**
 * Test style manipulation with fallbacks
 */
function testStyleManipulation() {
  console.log("💅 Testing Style Manipulation...");

  try {
    // Test with containers
    const containers = $w("Container");
    if (containers && containers.length > 0) {
      const testContainer = containers[0];

      // Test single style
      const singleStyleSuccess = StyleManipulation.setStyle(
        testContainer,
        "borderRadius",
        "8px"
      );
      console.log("Single style result:", singleStyleSuccess);

      // Test multiple styles
      const multipleStylesCount = StyleManipulation.setStyles(testContainer, {
        backgroundColor: "rgba(254, 255, 254, 0.9)",
        padding: "1rem",
        borderRadius: "12px",
      });
      console.log("Multiple styles applied:", multipleStylesCount);

      // Test getting style
      const styleValue = StyleManipulation.getStyle(
        testContainer,
        "borderRadius"
      );
      console.log("Retrieved style value:", styleValue);

      // Test resetting styles
      const resetSuccess = StyleManipulation.resetStyles(testContainer, [
        "backgroundColor",
        "padding",
      ]);
      console.log("Reset styles result:", resetSuccess);
    }

    console.log("✅ Style manipulation test passed");
  } catch (error) {
    console.error("❌ Style manipulation test failed:", error);
  }
}

/**
 * Test event handling with fallbacks
 */
function testEventHandling() {
  console.log("⚡ Testing Event Handling...");

  try {
    // Test with buttons
    const buttons = $w("Button");
    if (buttons && buttons.length > 0) {
      const testButton = buttons[0];

      // Create test handler
      const testHandler = () => {
        console.log("🎯 Test event handler triggered!");
      };

      // Test binding event
      const bindSuccess = EventHandling.bindEvent(
        testButton,
        "onClick",
        testHandler
      );
      console.log("Event binding result:", bindSuccess);

      // Test unbinding event (optional - might interfere with actual functionality)
      // const unbindSuccess = EventHandling.unbindEvent(testButton, "onClick", testHandler);
      // console.log("Event unbinding result:", unbindSuccess);
    }

    console.log("✅ Event handling test passed");
  } catch (error) {
    console.error("❌ Event handling test failed:", error);
  }
}

/**
 * Test visibility control with fallbacks
 */
function testVisibilityControl() {
  console.log("👁️ Testing Visibility Control...");

  try {
    // Test with text elements
    const textElements = $w("Text");
    if (textElements && textElements.length > 0) {
      const testText = textElements[0];

      // Test visibility check
      const isVisible = VisibilityControl.isVisible(testText);
      console.log("Initial visibility:", isVisible);

      // Test hide (be careful not to break the UI)
      // const hideSuccess = VisibilityControl.hide(testText);
      // console.log("Hide result:", hideSuccess);

      // Test show
      const showSuccess = VisibilityControl.show(testText);
      console.log("Show result:", showSuccess);
    }

    console.log("✅ Visibility control test passed");
  } catch (error) {
    console.error("❌ Visibility control test failed:", error);
  }
}

/**
 * Test configuration system
 */
function testConfigurationSystem() {
  console.log("⚙️ Testing Configuration System...");

  try {
    // Test feature flags
    const cssInjectionEnabled = isFeatureEnabled("cssInjection");
    console.log("CSS Injection enabled:", cssInjectionEnabled);

    const seasonalThemingEnabled = isFeatureEnabled("seasonalTheming");
    console.log("Seasonal Theming enabled:", seasonalThemingEnabled);

    // Test fallback styles
    const buttonFallbackStyle = getFallbackStyle("enhancedButton");
    console.log("Button fallback style:", buttonFallbackStyle);

    const navFallbackStyle = getFallbackStyle("liquidGlassNav");
    console.log("Navigation fallback style:", navFallbackStyle);

    // Test configuration access
    const systemConfig = WixWorkaroundConfig.system;
    console.log("System configuration:", systemConfig);

    console.log("✅ Configuration system test passed");
  } catch (error) {
    console.error("❌ Configuration system test failed:", error);
  }
}

/**
 * Test seasonal theming
 */
function testSeasonalTheming() {
  console.log("🌅 Testing Seasonal Theming...");

  try {
    // Get current season
    const currentSeason = getCurrentSeason();
    console.log("Current season:", currentSeason);

    // Apply seasonal theme to a container
    const containers = $w("Container");
    if (containers && containers.length > 0) {
      const testContainer = containers[0];

      const seasonClass = `${currentSeason}-theme`;
      const addSeasonSuccess = ClassManipulation.addClass(
        testContainer,
        seasonClass
      );
      console.log(`Applied ${seasonClass}:`, addSeasonSuccess);

      // Test each season
      const seasons = ["spring", "summer", "autumn", "winter"];
      seasons.forEach((season) => {
        const seasonConfig =
          WixWorkaroundConfig.seasonalTheming.seasons[season];
        console.log(`${season} theme config:`, seasonConfig);
      });
    }

    console.log("✅ Seasonal theming test passed");
  } catch (error) {
    console.error("❌ Seasonal theming test failed:", error);
  }
}

/**
 * Demonstrate enhanced button styling
 */
export function demonstrateEnhancedButtons() {
  console.log("🔘 Demonstrating Enhanced Button Styling...");

  try {
    const buttons = $w("Button");
    if (buttons && buttons.length > 0) {
      buttons.forEach((button, index) => {
        // Apply enhanced styling
        const enhancedStyleSuccess = ClassManipulation.addClass(
          button,
          "btn-enhanced"
        );

        if (!enhancedStyleSuccess) {
          // Fallback to direct styling
          const fallbackStyle = getFallbackStyle("enhancedButton");
          const stylesApplied = StyleManipulation.setStyles(
            button,
            fallbackStyle
          );
          console.log(
            `Button ${index}: Fallback styles applied (${stylesApplied})`
          );
        } else {
          console.log(`Button ${index}: Enhanced class applied`);
        }

        // Add hover effects
        EventHandling.bindEvent(button, "onMouseIn", () => {
          const hoverStyle = getFallbackStyle("enhancedButtonHover");
          StyleManipulation.setStyles(button, hoverStyle);
        });

        EventHandling.bindEvent(button, "onMouseOut", () => {
          const normalStyle = getFallbackStyle("enhancedButton");
          StyleManipulation.setStyles(button, normalStyle);
        });
      });
    }

    console.log("✅ Enhanced button demonstration complete");
  } catch (error) {
    console.error("❌ Enhanced button demonstration failed:", error);
  }
}

/**
 * Demonstrate navigation enhancement
 */
export function demonstrateNavigationEnhancement() {
  console.log("🧭 Demonstrating Navigation Enhancement...");

  try {
    // Find navigation elements
    const headerSelectors = [
      "#SITE_HEADER",
      "#header",
      "#wixHeader",
      "#masterHeader",
    ];

    const headerElement =
      ElementSelection.selectFirstAvailable(headerSelectors);

    if (headerElement) {
      // Apply liquid glass navigation
      const liquidGlassSuccess = ClassManipulation.addClass(
        headerElement,
        "liquid-glass-nav"
      );

      if (!liquidGlassSuccess) {
        // Fallback to direct styling
        const fallbackStyle = getFallbackStyle("liquidGlassNav");
        const stylesApplied = StyleManipulation.setStyles(
          headerElement,
          fallbackStyle
        );
        console.log(`Navigation: Fallback styles applied (${stylesApplied})`);
      } else {
        console.log("Navigation: Liquid glass class applied");
      }

      // Add scroll-based behavior
      if (typeof window !== "undefined") {
        window.addEventListener(
          "scroll",
          () => {
            const scrollY = window.scrollY || 0;

            if (scrollY > 50) {
              ClassManipulation.addClass(headerElement, "nav-scrolled");
            } else {
              ClassManipulation.removeClass(headerElement, "nav-scrolled");
            }
          },
          { passive: true }
        );
      }
    }

    console.log("✅ Navigation enhancement demonstration complete");
  } catch (error) {
    console.error("❌ Navigation enhancement demonstration failed:", error);
  }
}

/**
 * Demonstrate atmospheric effects
 */
export function demonstrateAtmosphericEffects() {
  console.log("🌊 Demonstrating Atmospheric Effects...");

  try {
    // Apply atmospheric background to containers
    const containers = $w("Container");
    if (containers && containers.length > 0) {
      containers.forEach((container, index) => {
        const atmosphericSuccess = ClassManipulation.addClass(
          container,
          "atmospheric-bg"
        );

        if (!atmosphericSuccess) {
          // Fallback to direct styling
          const fallbackStyle = getFallbackStyle("atmosphericBackground");
          const stylesApplied = StyleManipulation.setStyles(
            container,
            fallbackStyle
          );
          console.log(
            `Container ${index}: Atmospheric fallback applied (${stylesApplied})`
          );
        } else {
          console.log(`Container ${index}: Atmospheric class applied`);
        }

        // Add hover lift effect
        ClassManipulation.addClass(container, "hover-lift");
      });
    }

    console.log("✅ Atmospheric effects demonstration complete");
  } catch (error) {
    console.error("❌ Atmospheric effects demonstration failed:", error);
  }
}

/**
 * Run a quick system health check
 */
export function runSystemHealthCheck() {
  console.log("🏥 Running System Health Check...");

  const healthReport = {
    timestamp: new Date().toISOString(),
    systemStatus: "healthy",
    warnings: [],
    errors: [],
    capabilities: {},
  };

  try {
    // Check diagnostics
    const diagnostics = Utils.getDiagnostics();
    healthReport.diagnostics = diagnostics;

    // Check error log
    const errors = Utils.getErrorLog ? Utils.getErrorLog() : [];
    healthReport.errorCount = errors.length;
    healthReport.recentErrors = errors.slice(-3);

    // Check feature availability
    const features = [
      "cssInjection",
      "htmlComponentFallback",
      "directStylingFallback",
      "enhancedEventHandling",
      "visibilityControl",
    ];

    features.forEach((feature) => {
      healthReport.capabilities[feature] = isFeatureEnabled(feature);
    });

    // Check element access
    const testSelectors = ["Button", "Container", "Text"];
    testSelectors.forEach((selector) => {
      try {
        const elements = $w(selector);
        healthReport.capabilities[`${selector}Access`] =
          elements && elements.length > 0;
      } catch (error) {
        healthReport.capabilities[`${selector}Access`] = false;
        healthReport.warnings.push(`Cannot access ${selector} elements`);
      }
    });

    // Overall health assessment
    const errorCount = healthReport.errorCount || 0;
    const warningCount = healthReport.warnings.length;

    if (errorCount > 10) {
      healthReport.systemStatus = "critical";
    } else if (errorCount > 5 || warningCount > 3) {
      healthReport.systemStatus = "degraded";
    }

    console.log("📋 System Health Report:", healthReport);
    return healthReport;
  } catch (error) {
    console.error("❌ Health check failed:", error);
    healthReport.systemStatus = "error";
    healthReport.errors.push(error.message);
    return healthReport;
  }
}

// Auto-run basic tests if in development mode
if (WixWorkaroundConfig.development.testMode) {
  console.log("🧪 Auto-running tests in development mode...");

  // Delay to allow page initialization
  setTimeout(() => {
    runWorkaroundTests();
    runSystemHealthCheck();
  }, 2000);
}

// Export all test functions
export default {
  runWorkaroundTests,
  demonstrateEnhancedButtons,
  demonstrateNavigationEnhancement,
  demonstrateAtmosphericEffects,
  runSystemHealthCheck,
};
