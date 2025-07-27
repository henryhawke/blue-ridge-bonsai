// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// Blue Ridge Bonsai Society - Master Page Implementation
// Embedded Phase 1-3 Implementation for Wix Environment

// @ts-nocheck - Wix Velo environment has outdated TypeScript definitions
// Suppress WixElementSelector type errors for $w() function

import { currentMember } from "wix-members";
import wixLocationFrontend from "wix-location-frontend";
import wixUsers from "wix-users";

$w.onReady(function () {
  console.log("🌸 Blue Ridge Bonsai Society - Master Page Loaded (Phase 3)");

  // Apply atmospheric styling using Wix proper methods
  applyAtmosphericStyling();

  // Initialize navigation system with embedded functionality
  initializeEmbeddedNavigation();

  // Add micro-interactions
  setTimeout(() => {
    addMicroInteractions();
  }, 100);
});

/**
 * Apply atmospheric styling using Wix Velo proper methods
 */
function applyAtmosphericStyling() {
  try {
    // Apply global styles to body and common elements using Wix approach
    if (typeof $w !== "undefined") {
      // Apply styles to all buttons
      const buttons = $w("Button");
      if (buttons && buttons.length > 0) {
        buttons.forEach((button) => {
          try {
            button.style = {
              backgroundColor: "rgba(107, 142, 111, 0.15)",
              borderColor: "rgba(107, 142, 111, 0.3)",
              borderRadius: "8px",
              color: "#6B8E6F",
            };
          } catch (e) {
            console.log("Could not style button:", e);
          }
        });
      }

      // Apply styles to header elements
      const headers = $w("#header");
      if (headers && headers.length > 0) {
        headers.forEach((header) => {
          try {
            header.style = {
              backgroundColor: "rgba(254, 255, 254, 0.8)",
              borderBottomColor: "rgba(255, 255, 255, 0.2)",
            };
          } catch (e) {
            console.log("Could not style header:", e);
          }
        });
      }

      // Apply glass effect to sections
      const sections = $w("Section");
      if (sections && sections.length > 0) {
        sections.forEach((section, index) => {
          try {
            if (index % 2 === 0) {
              section.style = {
                backgroundColor: "rgba(254, 255, 254, 0.25)",
                borderRadius: "12px",
                borderColor: "rgba(255, 255, 255, 0.2)",
              };
            }
          } catch (e) {
            console.log("Could not style section:", e);
          }
        });
      }
    }

    // Fallback: Use HTML injection for critical CSS if Wix styling doesn't work
    injectCriticalCSS();

    console.log("🎨 Atmospheric styling applied successfully");
  } catch (error) {
    console.error("Error applying atmospheric styling:", error);
    // Fallback to CSS injection
    injectCriticalCSS();
  }
}

/**
 * Inject critical CSS as fallback using Wix-compatible method
 */
function injectCriticalCSS() {
  try {
    // Use Wix's HTML element if available
    const htmlElements = $w("HtmlComponent");
    if (htmlElements && htmlElements.length > 0) {
      const cssHTML = `
        <style>
          /* BLUE RIDGE BONSAI ATMOSPHERIC DESIGN SYSTEM */
          :root {
            --mountain-sage: #6B8E6F;
            --cloud-white: #FEFFFE;
            --mountain-haze: #E8EDE9;
            --valley-mist: #D1DAD3;
            --stone-gray: #4A4A4A;
            --autumn-gold: #D4A574;
          }

          body {
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            background: linear-gradient(135deg, #FEFFFE 0%, #E8EDE9 100%) !important;
            color: #4A4A4A !important;
          }

          /* ATMOSPHERIC BUTTONS */
          button, [role="button"], .button {
            background: rgba(107, 142, 111, 0.15) !important;
            border: 1px solid rgba(107, 142, 111, 0.3) !important;
            border-radius: 0.5rem !important;
            color: #6B8E6F !important;
            transition: all 300ms ease !important;
            cursor: pointer !important;
          }

          button:hover, [role="button"]:hover, .button:hover {
            background: rgba(107, 142, 111, 0.25) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 10px 40px rgba(107, 142, 111, 0.15) !important;
          }

          /* GLASS SECTIONS */
          section, .section {
            background: rgba(254, 255, 254, 0.25) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 0.75rem !important;
            margin: 1rem !important;
            padding: 2rem !important;
            transition: all 300ms ease !important;
          }

          /* NAVIGATION LINKS */
          nav a, header a {
            color: #4A4A4A !important;
            text-decoration: none !important;
            font-weight: 500 !important;
            padding: 0.5rem 0.75rem !important;
            border-radius: 0.5rem !important;
            transition: all 300ms ease !important;
          }

          nav a:hover, header a:hover {
            background: rgba(107, 142, 111, 0.15) !important;
            color: #6B8E6F !important;
            transform: translateY(-2px) !important;
          }
        </style>
      `;

      // Apply to first HTML component
      htmlElements[0].html = cssHTML;
      console.log("✅ Critical CSS injected via HTML component");
    } else {
      console.log("No HTML components found for CSS injection");
    }
  } catch (error) {
    console.error("Error injecting critical CSS:", error);
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
 * Add micro-interactions using Wix-compatible methods
 */
function addMicroInteractions() {
  try {
    // Add hover effects to buttons using Wix API
    const buttons = $w("Button");
    if (buttons && buttons.length > 0) {
      buttons.forEach((button) => {
        try {
          button.onMouseIn(() => {
            if (button.style) {
              button.style.backgroundColor = "rgba(107, 142, 111, 0.25)";
            }
          });

          button.onMouseOut(() => {
            if (button.style) {
              button.style.backgroundColor = "rgba(107, 142, 111, 0.15)";
            }
          });
        } catch (e) {
          console.log("Could not add hover effect to button");
        }
      });
    }

    // Add scroll effects to sections
    const sections = $w("Section");
    if (sections && sections.length > 0) {
      sections.forEach((section) => {
        try {
          // Fade in animation when section comes into view
          section.onViewportEnter(() => {
            if (section.style) {
              section.style.opacity = "1";
            }
          });
        } catch (e) {
          console.log("Could not add scroll effect to section");
        }
      });
    }

    console.log("✨ Micro-interactions added successfully");
  } catch (error) {
    console.error("Error adding micro-interactions:", error);
  }
}
