// Blue Ridge Bonsai Society - Element Manipulation Workarounds
// Utility functions for when Wix Velo APIs fail or are limited

/**
 * Enhanced Element Manipulation Utilities
 * Provides multiple fallback methods for element manipulation when Wix APIs fail
 */

// Global error tracking
let errorLog = [];
const MAX_ERROR_LOG = 50;

/**
 * Log errors with context
 */
function logError(error, context = "") {
  const errorEntry = {
    timestamp: new Date().toISOString(),
    error: error.message || String(error),
    context,
    stack: error.stack || "No stack trace available",
  };

  errorLog.push(errorEntry);

  // Keep error log manageable
  if (errorLog.length > MAX_ERROR_LOG) {
    errorLog = errorLog.slice(-MAX_ERROR_LOG);
  }

  console.warn(`🚨 Error in ${context}:`, error);
}

/**
 * Get error log for debugging
 */
export function getErrorLog() {
  return [...errorLog];
}

/**
 * Clear error log
 */
export function clearErrorLog() {
  errorLog = [];
}

/**
 * Enhanced Class Manipulation with Multiple Fallback Methods
 */
export const ClassManipulation = {
  /**
   * Add class with multiple fallback methods
   * @param {Object} element - Wix element
   * @param {string} className - Class name to add
   * @returns {boolean} - Success status
   */
  addClass: function (element, className) {
    const methods = [
      // Method 1: customClassList.add (Wix Velo standard)
      () => {
        if (
          element &&
          element.customClassList &&
          typeof element.customClassList.add === "function"
        ) {
          element.customClassList.add(className);
          return true;
        }
        return false;
      },

      // Method 2: Direct className manipulation
      () => {
        if (element && element.className !== undefined) {
          const currentClasses = String(element.className).split(" ");
          if (!currentClasses.includes(className)) {
            element.className = `${element.className} ${className}`.trim();
          }
          return true;
        }
        return false;
      },

      // Method 3: setAttribute approach
      () => {
        if (element && typeof element.setAttribute === "function") {
          const currentClass = element.getAttribute("class") || "";
          const classes = currentClass.split(" ");
          if (!classes.includes(className)) {
            element.setAttribute(
              "class",
              `${currentClass} ${className}`.trim()
            );
          }
          return true;
        }
        return false;
      },

      // Method 4: classList.add (if available)
      () => {
        if (
          element &&
          element.classList &&
          typeof element.classList.add === "function"
        ) {
          element.classList.add(className);
          return true;
        }
        return false;
      },
    ];

    for (let i = 0; i < methods.length; i++) {
      try {
        if (methods[i]()) {
          return true;
        }
      } catch (error) {
        logError(error, `addClass method ${i + 1} for class ${className}`);
      }
    }

    return false;
  },

  /**
   * Remove class with multiple fallback methods
   * @param {Object} element - Wix element
   * @param {string} className - Class name to remove
   * @returns {boolean} - Success status
   */
  removeClass: function (element, className) {
    const methods = [
      // Method 1: customClassList.remove (Wix Velo standard)
      () => {
        if (
          element &&
          element.customClassList &&
          typeof element.customClassList.remove === "function"
        ) {
          element.customClassList.remove(className);
          return true;
        }
        return false;
      },

      // Method 2: Direct className manipulation
      () => {
        if (element && element.className !== undefined) {
          const currentClasses = String(element.className).split(" ");
          const filteredClasses = currentClasses.filter(
            (cls) => cls !== className
          );
          element.className = filteredClasses.join(" ");
          return true;
        }
        return false;
      },

      // Method 3: setAttribute approach
      () => {
        if (element && typeof element.setAttribute === "function") {
          const currentClass = element.getAttribute("class") || "";
          const classes = currentClass.split(" ");
          const filteredClasses = classes.filter((cls) => cls !== className);
          element.setAttribute("class", filteredClasses.join(" "));
          return true;
        }
        return false;
      },

      // Method 4: classList.remove (if available)
      () => {
        if (
          element &&
          element.classList &&
          typeof element.classList.remove === "function"
        ) {
          element.classList.remove(className);
          return true;
        }
        return false;
      },
    ];

    for (let i = 0; i < methods.length; i++) {
      try {
        if (methods[i]()) {
          return true;
        }
      } catch (error) {
        logError(error, `removeClass method ${i + 1} for class ${className}`);
      }
    }

    return false;
  },

  /**
   * Toggle class with multiple fallback methods
   * @param {Object} element - Wix element
   * @param {string} className - Class name to toggle
   * @returns {boolean} - Success status
   */
  toggleClass: function (element, className) {
    if (this.hasClass(element, className)) {
      return this.removeClass(element, className);
    } else {
      return this.addClass(element, className);
    }
  },

  /**
   * Check if element has class
   * @param {Object} element - Wix element
   * @param {string} className - Class name to check
   * @returns {boolean} - Has class status
   */
  hasClass: function (element, className) {
    try {
      // Method 1: customClassList.contains
      if (
        element &&
        element.customClassList &&
        typeof element.customClassList.contains === "function"
      ) {
        return element.customClassList.contains(className);
      }

      // Method 2: className check
      if (element && element.className !== undefined) {
        const currentClasses = String(element.className).split(" ");
        return currentClasses.includes(className);
      }

      // Method 3: getAttribute check
      if (element && typeof element.getAttribute === "function") {
        const currentClass = element.getAttribute("class") || "";
        const classes = currentClass.split(" ");
        return classes.includes(className);
      }

      // Method 4: classList.contains
      if (
        element &&
        element.classList &&
        typeof element.classList.contains === "function"
      ) {
        return element.classList.contains(className);
      }
    } catch (error) {
      logError(error, `hasClass check for class ${className}`);
    }

    return false;
  },
};

/**
 * Enhanced Style Manipulation with Validation
 */
export const StyleManipulation = {
  /**
   * Apply single style property with validation
   * @param {Object} element - Wix element
   * @param {string} property - CSS property name
   * @param {string} value - CSS property value
   * @returns {boolean} - Success status
   */
  setStyle: function (element, property, value) {
    try {
      if (element && element.style && element.style[property] !== undefined) {
        element.style[property] = value;
        return true;
      }
    } catch (error) {
      logError(error, `setStyle ${property}: ${value}`);
    }
    return false;
  },

  /**
   * Apply multiple styles at once
   * @param {Object} element - Wix element
   * @param {Object} styles - Object with CSS property-value pairs
   * @returns {number} - Number of successfully applied styles
   */
  setStyles: function (element, styles) {
    let appliedCount = 0;

    if (!element || !styles || typeof styles !== "object") {
      return appliedCount;
    }

    Object.entries(styles).forEach(([property, value]) => {
      if (this.setStyle(element, property, value)) {
        appliedCount++;
      }
    });

    return appliedCount;
  },

  /**
   * Get computed style property
   * @param {Object} element - Wix element
   * @param {string} property - CSS property name
   * @returns {string|null} - Style value or null
   */
  getStyle: function (element, property) {
    try {
      if (element && element.style && element.style[property] !== undefined) {
        return element.style[property];
      }
    } catch (error) {
      logError(error, `getStyle ${property}`);
    }
    return null;
  },

  /**
   * Reset element styles to default
   * @param {Object} element - Wix element
   * @param {Array} properties - Array of CSS properties to reset
   * @returns {boolean} - Success status
   */
  resetStyles: function (element, properties = []) {
    let resetCount = 0;

    properties.forEach((property) => {
      if (this.setStyle(element, property, "")) {
        resetCount++;
      }
    });

    return resetCount === properties.length;
  },
};

/**
 * Enhanced Event Handling with Multiple Fallback Methods
 */
export const EventHandling = {
  /**
   * Bind event with multiple fallback methods
   * @param {Object} element - Wix element
   * @param {string} eventName - Event name (e.g., 'onClick', 'onMouseIn')
   * @param {Function} handler - Event handler function
   * @returns {boolean} - Success status
   */
  bindEvent: function (element, eventName, handler) {
    const methods = [
      // Method 1: Wix Velo event binding
      () => {
        if (element && typeof element[eventName] === "function") {
          element[eventName](handler);
          return true;
        }
        return false;
      },

      // Method 2: addEventListener fallback
      () => {
        if (element && element.addEventListener) {
          const domEventName = eventName.replace(/^on/, "").toLowerCase();
          element.addEventListener(domEventName, handler);
          return true;
        }
        return false;
      },

      // Method 3: Direct assignment fallback
      () => {
        if (element) {
          const domEventName = eventName.toLowerCase();
          element[domEventName] = handler;
          return true;
        }
        return false;
      },
    ];

    for (let i = 0; i < methods.length; i++) {
      try {
        if (methods[i]()) {
          return true;
        }
      } catch (error) {
        logError(error, `bindEvent method ${i + 1} for ${eventName}`);
      }
    }

    return false;
  },

  /**
   * Unbind event with multiple fallback methods
   * @param {Object} element - Wix element
   * @param {string} eventName - Event name
   * @param {Function} handler - Event handler function
   * @returns {boolean} - Success status
   */
  unbindEvent: function (element, eventName, handler) {
    try {
      // Method 1: removeEventListener
      if (element && element.removeEventListener) {
        const domEventName = eventName.replace(/^on/, "").toLowerCase();
        element.removeEventListener(domEventName, handler);
        return true;
      }

      // Method 2: Direct assignment to null
      if (element) {
        const domEventName = eventName.toLowerCase();
        element[domEventName] = null;
        return true;
      }
    } catch (error) {
      logError(error, `unbindEvent for ${eventName}`);
    }

    return false;
  },
};

/**
 * Enhanced Element Visibility Control
 */
export const VisibilityControl = {
  /**
   * Show element with multiple fallback methods
   * @param {Object} element - Wix element
   * @returns {boolean} - Success status
   */
  show: function (element) {
    const methods = [
      // Method 1: Wix show() method
      () => {
        if (element && typeof element.show === "function") {
          element.show();
          return true;
        }
        return false;
      },

      // Method 2: Style display
      () => {
        if (element && element.style) {
          element.style.display = "block";
          return true;
        }
        return false;
      },

      // Method 3: Style visibility
      () => {
        if (element && element.style) {
          element.style.visibility = "visible";
          element.style.opacity = "1";
          return true;
        }
        return false;
      },
    ];

    for (let i = 0; i < methods.length; i++) {
      try {
        if (methods[i]()) {
          return true;
        }
      } catch (error) {
        logError(error, `show method ${i + 1}`);
      }
    }

    return false;
  },

  /**
   * Hide element with multiple fallback methods
   * @param {Object} element - Wix element
   * @returns {boolean} - Success status
   */
  hide: function (element) {
    const methods = [
      // Method 1: Wix hide() method
      () => {
        if (element && typeof element.hide === "function") {
          element.hide();
          return true;
        }
        return false;
      },

      // Method 2: Style display
      () => {
        if (element && element.style) {
          element.style.display = "none";
          return true;
        }
        return false;
      },

      // Method 3: Style visibility
      () => {
        if (element && element.style) {
          element.style.visibility = "hidden";
          element.style.opacity = "0";
          return true;
        }
        return false;
      },
    ];

    for (let i = 0; i < methods.length; i++) {
      try {
        if (methods[i]()) {
          return true;
        }
      } catch (error) {
        logError(error, `hide method ${i + 1}`);
      }
    }

    return false;
  },

  /**
   * Check if element is visible
   * @param {Object} element - Wix element
   * @returns {boolean} - Visibility status
   */
  isVisible: function (element) {
    try {
      // Method 1: Wix isVisible property
      if (element && typeof element.isVisible === "boolean") {
        return element.isVisible;
      }

      // Method 2: Style display check
      if (element && element.style) {
        const display = element.style.display;
        const visibility = element.style.visibility;
        const opacity = element.style.opacity;

        return display !== "none" && visibility !== "hidden" && opacity !== "0";
      }
    } catch (error) {
      logError(error, "isVisible check");
    }

    return true; // Default to visible if can't determine
  },
};

/**
 * Enhanced Element Selection
 */
export const ElementSelection = {
  /**
   * Safe element selection with error handling
   * @param {string} selector - Element selector
   * @returns {Object|null} - Element or null
   */
  select: function (selector) {
    try {
      const element = $w(selector);
      if (element && element.length > 0) {
        return element;
      }
    } catch (error) {
      logError(error, `select ${selector}`);
    }

    return null;
  },

  /**
   * Select multiple elements with error handling
   * @param {Array} selectors - Array of selectors
   * @returns {Object} - Object with selector: element pairs
   */
  selectMultiple: function (selectors) {
    const results = {};

    selectors.forEach((selector) => {
      results[selector] = this.select(selector);
    });

    return results;
  },

  /**
   * Find first available element from selector list
   * @param {Array} selectors - Array of selectors to try
   * @returns {Object|null} - First found element or null
   */
  selectFirstAvailable: function (selectors) {
    for (const selector of selectors) {
      const element = this.select(selector);
      if (element) {
        return element;
      }
    }

    return null;
  },
};

/**
 * Utility Functions
 */
export const Utils = {
  /**
   * Get system diagnostics
   * @returns {Object} - Diagnostic information
   */
  getDiagnostics: function () {
    return {
      timestamp: new Date().toISOString(),
      errorCount: errorLog.length,
      recentErrors: errorLog.slice(-5),
      wixAPIs: {
        $w: typeof $w !== "undefined",
        wixWindow: typeof wixWindow !== "undefined",
        currentMember: typeof currentMember !== "undefined",
      },
      browser: {
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
        hasLocalStorage: typeof localStorage !== "undefined",
        hasSessionStorage: typeof sessionStorage !== "undefined",
      },
    };
  },

  /**
   * Test element manipulation capabilities
   * @param {Object} element - Test element
   * @returns {Object} - Test results
   */
  testCapabilities: function (element) {
    const results = {
      classManipulation: false,
      styleManipulation: false,
      eventBinding: false,
      visibility: false,
    };

    if (!element) return results;

    try {
      // Test class manipulation
      results.classManipulation = ClassManipulation.addClass(
        element,
        "test-class"
      );
      if (results.classManipulation) {
        ClassManipulation.removeClass(element, "test-class");
      }

      // Test style manipulation
      results.styleManipulation = StyleManipulation.setStyle(
        element,
        "opacity",
        "1"
      );

      // Test event binding
      const testHandler = () => {};
      results.eventBinding = EventHandling.bindEvent(
        element,
        "onClick",
        testHandler
      );

      // Test visibility
      results.visibility =
        typeof VisibilityControl.isVisible(element) === "boolean";
    } catch (error) {
      logError(error, "testCapabilities");
    }

    return results;
  },
};

// Export all utilities as default object
export default {
  ClassManipulation,
  StyleManipulation,
  EventHandling,
  VisibilityControl,
  ElementSelection,
  Utils,
  getErrorLog,
  clearErrorLog,
};
