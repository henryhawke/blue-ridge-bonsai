// @ts-nocheck
// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// Blue Ridge Bonsai Society - Master Page Implementation
// Wix Studio Compatible Implementation with CSS Panel Integration

import { currentMember } from "wix-members";
import wixLocationFrontend from "wix-location-frontend";
import wixUsers from "wix-users";

$w.onReady(function () {
  console.log(
    "🌸 Blue Ridge Bonsai Society - Master Page Loaded (Wix Studio CSS)"
  );

  // Verify CSS is loaded from Wix Studio CSS panel
  verifyCSSLoaded();

  // Phase 1: Initialize Liquid Glass Navigation
  try {
    initializeLiquidGlassNavigation();
  } catch (error) {
    console.error("Error initializing liquid glass navigation:", error);
  }

  // Phase 2: Apply Design System Styling via CSS Classes
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
 * Verify that CSS has been loaded from Wix Studio CSS panel
 */
function verifyCSSLoaded() {
  try {
    // Check if our CSS classes are available in the document
    const testElement = document.createElement("div");
    testElement.className = "liquid-glass-nav";
    document.body.appendChild(testElement);

    const computedStyle = getComputedStyle(testElement);
    const hasBackdropFilter =
      computedStyle.backdropFilter !== "none" &&
      computedStyle.backdropFilter !== "";

    document.body.removeChild(testElement);

    if (hasBackdropFilter) {
      console.log("✅ CSS loaded successfully from Wix Studio CSS panel");
    } else {
      console.warn(
        "⚠️ CSS not loaded. Please add global.css to Wix Studio CSS panel"
      );
      console.warn(
        "📋 Instructions: Open Code panel → CSS → global.css → paste CSS content"
      );
    }
  } catch (error) {
    console.log("Could not verify CSS loading:", error);
  }
}

/**
 * Phase 1: Initialize Liquid Glass Navigation System
 * Applies CSS classes to achieve liquid glass effects
 */
function initializeLiquidGlassNavigation() {
  console.log("🌊 Initializing Liquid Glass Navigation System");

  try {
    // Apply liquid glass CSS classes to Wix elements
    applyLiquidGlassClasses();

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
 * Apply Liquid Glass CSS Classes to Navigation Elements
 * Uses Wix Studio's CSS class system
 */
function applyLiquidGlassClasses() {
  try {
    // Apply to header/navigation elements - try multiple common IDs
    const headerSelectors = [
      "#SITE_HEADER",
      "#header",
      "#wixHeader",
      "#masterHeader",
      "#siteHeader",
    ];

    let headerFound = false;
    headerSelectors.forEach((selector) => {
      try {
        const headerElement = $w(selector);
        if (headerElement && headerElement.length > 0) {
          headerElement.customClassList.add("liquid-glass-nav");
          console.log(`✅ Applied liquid-glass-nav to ${selector}`);
          headerFound = true;
        }
      } catch (e) {
        // Element not found, continue
      }
    });

    if (!headerFound) {
      console.log("ℹ️ No header elements found with standard IDs");
    }

    // Apply enhanced nav styles to navigation elements
    const navSelectors = [
      "#navBar",
      "#navigation",
      "#menuContainer",
      "#horizontalMenuContainer",
    ];

    navSelectors.forEach((selector) => {
      try {
        const navElement = $w(selector);
        if (navElement && navElement.length > 0) {
          if (Array.isArray(navElement)) {
            navElement.forEach((element) => {
              try {
                element.customClassList.add("nav-enhanced");
              } catch (e) {
                console.log("Could not add nav-enhanced class to element");
              }
            });
          } else {
            navElement.customClassList.add("nav-enhanced");
          }
          console.log(`✅ Applied nav-enhanced to ${selector}`);
        }
      } catch (e) {
        // Element not found, continue
      }
    });

    // Apply atmospheric background to main containers
    const containerSelectors = [
      "#SITE_CONTAINER",
      "#main",
      "#mainContainer",
      "#pageContainer",
    ];

    containerSelectors.forEach((selector) => {
      try {
        const container = $w(selector);
        if (container && container.length > 0) {
          container.customClassList.add("atmospheric-bg");
          console.log(`✅ Applied atmospheric-bg to ${selector}`);
        }
      } catch (e) {
        // Element not found, continue
      }
    });
  } catch (error) {
    console.log("Error applying liquid glass classes:", error);
  }
}

/**
 * Initialize Navigation Adaptation Based on Content
 */
function initializeNavigationAdaptation() {
  if (typeof window === "undefined") return;

  // Add adaptive classes based on scroll and content
  const addAdaptiveClasses = () => {
    try {
      const headerSelectors = ["#SITE_HEADER", "#header", "#wixHeader"];

      headerSelectors.forEach((selector) => {
        try {
          const headerElement = $w(selector);
          if (headerElement && headerElement.length > 0) {
            // Add base navigation enhancement
            headerElement.customClassList.add("liquid-glass-nav");

            // Add adaptive state based on scroll position
            const scrollY = window.scrollY;
            if (scrollY > 50) {
              headerElement.customClassList.add("nav-scrolled");
            } else {
              headerElement.customClassList.remove("nav-scrolled");
            }
          }
        } catch (e) {
          // Element not found, continue
        }
      });
    } catch (error) {
      console.log("Error in navigation adaptation:", error);
    }
  };

  // Run immediately and on scroll
  addAdaptiveClasses();

  // Listen for scroll events
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", addAdaptiveClasses, { passive: true });
  }
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

    try {
      const headerSelectors = ["#SITE_HEADER", "#header", "#wixHeader"];

      headerSelectors.forEach((selector) => {
        try {
          const headerElement = $w(selector);
          if (headerElement && headerElement.length > 0) {
            // Add/remove scroll-based classes
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
              headerElement.customClassList.add("nav-hidden");
            } else {
              headerElement.customClassList.remove("nav-hidden");
            }

            if (currentScrollY > 50) {
              headerElement.customClassList.add("nav-scrolled");
            } else {
              headerElement.customClassList.remove("nav-scrolled");
            }
          }
        } catch (e) {
          // Element not found, continue
        }
      });
    } catch (error) {
      console.log("Error in scroll navigation:", error);
    }

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
 * Uses Wix Studio CSS classes for consistent styling
 */
function applyDesignSystemStyling() {
  console.log("🎨 Applying Design System Styling (Wix Studio CSS)");

  try {
    // Apply Design System CSS classes to Wix elements
    applyDesignSystemClasses();

    // Apply Wix element styling using style properties
    applyWixElementStyling();

    // Setup atmospheric effects using CSS classes
    setupAtmosphericEffects();

    console.log("✅ Design System styling applied successfully");
  } catch (error) {
    console.error("❌ Error applying design system styling:", error);
  }
}

/**
 * Apply Design System CSS Classes to Wix Elements
 * Uses classes defined in Wix Studio CSS panel
 */
function applyDesignSystemClasses() {
  try {
    // Apply enhanced classes to buttons
    const buttons = $w("Button");
    if (buttons && buttons.length > 0) {
      buttons.forEach((button) => {
        try {
          button.customClassList.add("btn-enhanced");
          console.log("✅ Applied btn-enhanced class to button");
        } catch (e) {
          console.log("Could not add btn-enhanced class to button");
        }
      });
    }

    // Apply enhanced classes to text elements
    const textElements = $w("Text");
    if (textElements && textElements.length > 0) {
      textElements.forEach((text) => {
        try {
          text.customClassList.add("text-enhanced");
        } catch (e) {
          console.log("Could not add text-enhanced class to text");
        }
      });
    }

    // Apply enhanced classes to headings/titles
    const headings = $w("Title");
    if (headings && headings.length > 0) {
      headings.forEach((heading) => {
        try {
          heading.customClassList.add("heading-enhanced");
        } catch (e) {
          console.log("Could not add heading-enhanced class to title");
        }
      });
    }

    // Apply enhanced classes to containers
    const containers = $w("Container");
    if (containers && containers.length > 0) {
      containers.forEach((container) => {
        try {
          container.customClassList.add("container-enhanced");
        } catch (e) {
          console.log("Could not add container-enhanced class");
        }
      });
    }

    // Apply enhanced classes to sections
    const sections = $w("Section");
    if (sections && sections.length > 0) {
      sections.forEach((section) => {
        try {
          section.customClassList.add("section-enhanced");
        } catch (e) {
          console.log("Could not add section-enhanced class");
        }
      });
    }

    // Apply enhanced classes to input elements
    try {
      const textInputs = $w("TextInput");
      if (textInputs && textInputs.length > 0) {
        textInputs.forEach((input) => {
          try {
            input.customClassList.add("input-enhanced");
          } catch (e) {
            console.log("Could not add input-enhanced class to TextInput");
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
            input.customClassList.add("input-enhanced");
          } catch (e) {
            console.log("Could not add input-enhanced class to TextBox");
          }
        });
      }
    } catch (e) {
      console.log("Could not access TextBox elements");
    }

    // Apply seasonal theme based on current month
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

    // Apply seasonal class to main container
    const containerSelectors = ["#SITE_CONTAINER", "#main", "#mainContainer"];
    containerSelectors.forEach((selector) => {
      try {
        const container = $w(selector);
        if (container && container.length > 0) {
          container.customClassList.add(seasonalClass);
          console.log(`✅ Applied ${seasonalClass} to ${selector}`);
        }
      } catch (e) {
        // Element not found, continue
      }
    });

    console.log("✅ Design system CSS classes applied successfully");
  } catch (error) {
    console.log("Error applying design system classes:", error);
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
    // Apply atmospheric background class to main containers
    try {
      const mainContainers = $w("#SITE_CONTAINER, #main, #mainContainer");
      if (mainContainers && mainContainers.length > 0) {
        mainContainers.forEach((container) => {
          try {
            container.customClassList.add("atmospheric-bg");
            console.log("✅ Applied atmospheric-bg class to main container");
          } catch (e) {
            console.log("Could not add atmospheric-bg class");
          }
        });
      }
    } catch (e) {
      console.log("Could not access main containers for atmospheric effects");
    }

    // Apply hero enhancement to header sections
    try {
      const heroSections = $w("#header, #hero, .hero-section");
      if (heroSections && heroSections.length > 0) {
        heroSections.forEach((hero) => {
          try {
            hero.customClassList.add("hero-enhanced");
            console.log("✅ Applied hero-enhanced class");
          } catch (e) {
            console.log("Could not add hero-enhanced class");
          }
        });
      }
    } catch (e) {
      console.log("Could not access hero sections");
    }

    console.log("✅ Atmospheric effects setup complete");
  } catch (error) {
    console.error("❌ Error setting up atmospheric effects:", error);
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
    // Add enhanced button interactions using CSS classes
    addEnhancedButtonInteractions();

    // Add scroll-triggered animations using CSS classes
    addScrollTriggeredAnimations();

    // Add loading and transition effects using CSS classes
    addLoadingTransitions();

    // Add enhanced form interactions
    addFormInteractions();

    console.log("✅ Enhanced micro-interactions added successfully");
  } catch (error) {
    console.error("❌ Error adding micro-interactions:", error);
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
 * Add scroll-triggered animations using CSS classes on Wix elements
 */
function addScrollTriggeredAnimations() {
  try {
    // Apply entrance animations to containers
    const containers = $w("Container");
    if (containers && containers.length > 0) {
      containers.forEach((container, index) => {
        try {
          // Stagger the animations
          setTimeout(() => {
            container.customClassList.add("scale-in");
            container.customClassList.add("hover-lift");
          }, index * 100);
        } catch (e) {
          console.log("Could not add animation classes to container");
        }
      });
    }

    // Apply fade-in animations to sections
    const sections = $w("Section");
    if (sections && sections.length > 0) {
      sections.forEach((section, index) => {
        try {
          setTimeout(() => {
            section.customClassList.add("fade-in");
          }, index * 150);
        } catch (e) {
          console.log("Could not add animation classes to section");
        }
      });
    }

    // Apply slide-up animations to text elements
    const textElements = $w("Text");
    if (textElements && textElements.length > 0) {
      textElements.forEach((text, index) => {
        try {
          setTimeout(() => {
            text.customClassList.add("slide-up");
          }, index * 50);
        } catch (e) {
          console.log("Could not add animation classes to text");
        }
      });
    }

    console.log("✅ Scroll-triggered animations applied via CSS classes");
  } catch (error) {
    console.log("Error applying scroll-triggered animations:", error);
  }
}

/**
 * Add loading and transition effects using CSS classes
 */
function addLoadingTransitions() {
  try {
    // Apply loading transitions to images
    const images = $w("Image");
    if (images && images.length > 0) {
      images.forEach((image, index) => {
        try {
          // Add loading skeleton initially
          image.customClassList.add("pulse");

          // Add fade-in after a delay to simulate loading
          setTimeout(() => {
            image.customClassList.remove("pulse");
            image.customClassList.add("fade-in");
          }, 500 + index * 100);
        } catch (e) {
          console.log("Could not add loading transition to image");
        }
      });
    }

    // Apply staggered entrance animations to all major elements
    const allElements = [
      ...($w("Button") || []),
      ...($w("Text") || []),
      ...($w("Title") || []),
    ];

    allElements.forEach((element, index) => {
      try {
        setTimeout(() => {
          element.customClassList.add("fade-in");
        }, index * 25);
      } catch (e) {
        console.log("Could not add entrance animation");
      }
    });

    console.log("✅ Loading transitions applied via CSS classes");
  } catch (error) {
    console.log("Error applying loading transitions:", error);
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
