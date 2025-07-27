/**
 * ==========================================================================
 * BLUE RIDGE BONSAI SOCIETY - SITE STRUCTURE & INFORMATION ARCHITECTURE
 * Complete implementation of the sitemap from requirements analysis
 * ==========================================================================
 */

// @ts-check
/// <reference lib="dom" />

/**
 * Site Structure Configuration
 * Based on the comprehensive requirements analysis and sitemap design
 */
const SiteStructure = {
  /**
   * Main navigation structure
   */
  navigation: {
    primary: [
      {
        id: "home",
        title: "Home",
        url: "/",
        icon: "home",
        description: "Welcome to Blue Ridge Bonsai Society",
        priority: 1,
      },
      {
        id: "about",
        title: "About Us",
        url: "/about",
        icon: "info",
        description: "Learn about our mission, history, and team",
        priority: 2,
        children: [
          {
            id: "mission",
            title: "Our Mission & Vision",
            url: "/about/mission",
            description: "The heart and purpose of our society",
            requirement: "BR-01",
          },
          {
            id: "history",
            title: "Our History",
            url: "/about/history",
            description: "Decades of bonsai cultivation in the Blue Ridge",
          },
          {
            id: "board",
            title: "Board Members & Leadership",
            url: "/about/board",
            description: "Meet our dedicated leadership team",
            requirement: "BR-30",
          },
          {
            id: "partnership",
            title: "Partnership with NC Arboretum",
            url: "/about/partnership",
            description:
              "Our special relationship with The North Carolina Arboretum",
            requirement: "BR-08",
          },
          {
            id: "meetings",
            title: "How Our Meetings Work",
            url: "/about/meetings",
            description: "What to expect at BRBS meetings",
            requirement: "BR-10",
          },
          {
            id: "faq",
            title: "Frequently Asked Questions",
            url: "/about/faq",
            description: "Common questions about bonsai and our society",
            requirement: "BR-10",
          },
        ],
      },
      {
        id: "events",
        title: "Events",
        url: "/events",
        icon: "calendar",
        description: "Workshops, meetings, shows, and community gatherings",
        priority: 3,
        requirement: "BR-02",
        children: [
          {
            id: "upcoming",
            title: "Upcoming Events",
            url: "/events/upcoming",
            description: "Current and future club activities",
            requirement: "BR-02, BR-29",
          },
          {
            id: "calendar",
            title: "Event Calendar",
            url: "/events/calendar",
            description: "Month and week view of all events",
            requirement: "BR-27",
          },
          {
            id: "archive",
            title: "Past Events Archive",
            url: "/events/archive",
            description: "Historical events with photos and memories",
            requirement: "BR-07, BR-26",
          },
          {
            id: "annual-show",
            title: "Annual Bonsai Show",
            url: "/events/annual-show",
            description: "Our premier yearly exhibition",
          },
          {
            id: "workshops",
            title: "Workshops & Classes",
            url: "/events/workshops",
            description: "Hands-on learning opportunities",
          },
          {
            id: "rss",
            title: "Event Feed",
            url: "/events/feed.xml",
            description: "RSS feed for calendar integration",
            requirement: "BR-42",
            hidden: true,
          },
        ],
      },
      {
        id: "learn",
        title: "Learn",
        url: "/learn",
        icon: "book",
        description: "Knowledge base, guides, and educational resources",
        priority: 4,
        requirement: "BR-03",
        children: [
          {
            id: "beginners",
            title: "Beginner's Bonsai Guide",
            url: "/learn/beginners",
            description: "Essential knowledge for new enthusiasts",
            requirement: "BR-20",
          },
          {
            id: "articles",
            title: "Articles & Tips",
            url: "/learn/articles",
            description: "Monthly tips and expert knowledge",
            requirement: "BR-03",
            children: [
              {
                id: "species",
                title: "Species Guides",
                url: "/learn/articles/species",
                description: "Detailed care guides by tree species",
              },
              {
                id: "techniques",
                title: "Techniques",
                url: "/learn/articles/techniques",
                description: "Pruning, wiring, and styling methods",
              },
              {
                id: "seasonal",
                title: "Seasonal Care",
                url: "/learn/articles/seasonal",
                description: "Year-round bonsai maintenance",
              },
              {
                id: "monthly-tips",
                title: "Monthly Bonsai Tips",
                url: "/learn/articles/monthly-tips",
                description: "Regular wisdom from our experts",
              },
            ],
          },
          {
            id: "resources",
            title: "Resources",
            url: "/learn/resources",
            description: "Tools, vendors, and external links",
            children: [
              {
                id: "vendors",
                title: "Vendor Directory",
                url: "/learn/resources/vendors",
                description: "Trusted suppliers for tools and materials",
                requirement: "BR-21",
              },
              {
                id: "reading",
                title: "Recommended Reading",
                url: "/learn/resources/reading",
                description: "Books and publications we recommend",
              },
              {
                id: "downloads",
                title: "Downloadable Guides",
                url: "/learn/resources/downloads",
                description: "PDFs and resources for offline learning",
              },
              {
                id: "external",
                title: "External Links",
                url: "/learn/resources/external",
                description: "Helpful websites and organizations",
              },
            ],
          },
          {
            id: "gallery",
            title: "Bonsai Gallery",
            url: "/learn/gallery",
            description: "Curated collections of exceptional trees",
            requirement: "BR-26",
          },
        ],
      },
      {
        id: "gallery",
        title: "Gallery",
        url: "/gallery",
        icon: "image",
        description: "Showcase of beautiful bonsai and member work",
        priority: 5,
        requirement: "BR-26",
        children: [
          {
            id: "featured",
            title: "Featured Trees",
            url: "/gallery/featured",
            description: "Exceptional specimens from our community",
          },
          {
            id: "member-trees",
            title: "Member Collections",
            url: "/gallery/members",
            description: "Trees cultivated by our members",
          },
          {
            id: "exhibitions",
            title: "Exhibition Highlights",
            url: "/gallery/exhibitions",
            description: "Best of our shows and displays",
          },
          {
            id: "progression",
            title: "Tree Development",
            url: "/gallery/progression",
            description: "Before and after transformations",
          },
        ],
      },
      {
        id: "join",
        title: "Join Us",
        url: "/join",
        icon: "users",
        description: "Become part of our bonsai community",
        priority: 6,
        requirement: "BR-04",
        children: [
          {
            id: "benefits",
            title: "Why Join BRBS?",
            url: "/join/benefits",
            description: "Benefits and value of membership",
            requirement: "BR-04",
          },
          {
            id: "membership",
            title: "Membership Levels & Dues",
            url: "/join/membership",
            description: "Different membership options available",
          },
          {
            id: "application",
            title: "New Member Application",
            url: "/join/application",
            description: "Join our society today",
            requirement: "BR-06",
          },
          {
            id: "payment",
            title: "Online Payment Portal",
            url: "/join/payment",
            description: "Pay dues and workshop fees securely",
            requirement: "BR-05",
          },
          {
            id: "sample-meeting",
            title: "Attend a Sample Meeting",
            url: "/join/sample-meeting",
            description: "Experience BRBS before committing",
            requirement: "BR-09",
          },
          {
            id: "inherited-trees",
            title: "Donating Inherited Trees",
            url: "/join/donate-trees",
            description: "Help us care for special trees",
            requirement: "BR-11",
          },
        ],
      },
    ],

    /**
     * Members-only navigation (shown when logged in)
     */
    members: [
      {
        id: "members",
        title: "Members Area",
        url: "/members",
        icon: "lock",
        description: "Exclusive content for society members",
        priority: 7,
        requirement: "BR-31",
        authRequired: true,
        children: [
          {
            id: "dashboard",
            title: "Member Dashboard",
            url: "/members/dashboard",
            description: "Your personal member portal",
          },
          {
            id: "directory",
            title: "Member Directory",
            url: "/members/directory",
            description: "Connect with fellow members",
            requirement: "BR-12",
            permission: "board",
          },
          {
            id: "forums",
            title: "Discussion Forums",
            url: "/members/forums",
            description: "Community discussions and advice",
            requirement: "BR-40",
            children: [
              {
                id: "regional-advice",
                title: "Regional Biome Advice",
                url: "/members/forums/regional",
                description: "Blue Ridge specific growing tips",
              },
              {
                id: "repotting",
                title: "Repotting",
                url: "/members/forums/repotting",
                description: "Repotting techniques and timing",
              },
              {
                id: "pest-disease",
                title: "Pest & Disease",
                url: "/members/forums/pest-disease",
                description: "Health and treatment discussions",
              },
              {
                id: "general",
                title: "General Discussion",
                url: "/members/forums/general",
                description: "Open community conversation",
              },
            ],
          },
          {
            id: "helpline",
            title: "Helpline Q&A",
            url: "/members/helpline",
            description: "Expert answers to your questions",
            requirement: "BR-25",
          },
          {
            id: "exclusive",
            title: "Exclusive Content",
            url: "/members/exclusive",
            description: "Members-only resources and materials",
          },
          {
            id: "profile",
            title: "My Profile",
            url: "/members/profile",
            description: "Manage your account and preferences",
          },
        ],
      },
    ],

    /**
     * Footer navigation
     */
    footer: [
      {
        id: "contact",
        title: "Contact Us",
        url: "/contact",
        icon: "mail",
        description: "Get in touch with our society",
      },
      {
        id: "privacy",
        title: "Privacy Policy",
        url: "/privacy",
        description: "How we protect your information",
      },
      {
        id: "terms",
        title: "Terms of Use",
        url: "/terms",
        description: "Guidelines for using our site",
      },
      {
        id: "sitemap",
        title: "Sitemap",
        url: "/sitemap",
        description: "Complete site navigation overview",
      },
      {
        id: "accessibility",
        title: "Accessibility Statement",
        url: "/accessibility",
        description: "Our commitment to inclusive design",
      },
      {
        id: "admin",
        title: "Admin Login",
        url: "/admin",
        description: "Administrative access",
        hidden: true,
        permission: "admin",
      },
    ],
  },

  /**
   * Content categorization system
   */
  categories: {
    species: [
      "Deciduous Trees",
      "Evergreen Trees",
      "Flowering Trees",
      "Fruit Trees",
      "Native Species",
      "Indoor Species",
    ],
    techniques: [
      "Pruning & Trimming",
      "Wiring & Shaping",
      "Repotting",
      "Soil & Fertilization",
      "Pest Control",
      "Disease Management",
      "Styling & Design",
    ],
    skill_levels: ["Beginner", "Intermediate", "Advanced", "Expert"],
    seasons: [
      "Spring Care",
      "Summer Maintenance",
      "Fall Preparation",
      "Winter Protection",
    ],
    event_types: [
      "Workshop",
      "Meeting",
      "Exhibition",
      "Field Trip",
      "Social Event",
      "Guest Speaker",
    ],
  },

  /**
   * Search configuration
   */
  search: {
    searchablePages: ["home", "about", "events", "learn", "gallery", "join"],
    searchFilters: {
      content_type: ["Article", "Event", "Resource", "Gallery"],
      skill_level: ["Beginner", "Intermediate", "Advanced"],
      category: ["Species", "Techniques", "Seasonal", "Equipment"],
      date_range: ["Past Week", "Past Month", "Past Year", "All Time"],
    },
    searchFields: ["title", "description", "content", "tags", "categories"],
  },

  /**
   * Requirements mapping
   * Maps each requirement ID to implementation locations
   */
  requirementsMapping: {
    "BR-01": ["about/mission"],
    "BR-02": ["events", "events/upcoming", "home"],
    "BR-03": ["learn", "learn/articles"],
    "BR-04": ["join", "join/benefits"],
    "BR-05": ["join/payment"],
    "BR-06": ["join/application"],
    "BR-07": ["events/archive"],
    "BR-08": ["about/partnership"],
    "BR-09": ["join/sample-meeting"],
    "BR-10": ["about/meetings", "about/faq"],
    "BR-11": ["join/donate-trees", "about/faq"],
    "BR-12": ["members/directory"],
    "BR-14": ["members/directory"], // Admin function
    "BR-19": ["events/upcoming"], // Event badging
    "BR-20": ["learn/beginners"],
    "BR-21": ["learn/resources/vendors"],
    "BR-22": ["admin"], // WYSIWYG editor
    "BR-24": ["home"], // Clean homepage design
    "BR-25": ["members/helpline"],
    "BR-26": ["gallery", "events/archive", "learn/gallery"],
    "BR-27": ["events/calendar"],
    "BR-29": ["events/upcoming"], // Event summary pages
    "BR-30": ["about/board"],
    "BR-31": ["members"],
    "BR-32": ["about", "join", "home"], // Tone and messaging
    "BR-33": ["all"], // Mobile friendly
    "BR-37": ["all"], // Content accessibility
    "BR-40": ["members/forums"],
    "BR-42": ["events/feed.xml"],
    "BR-49": ["events/upcoming"], // Event registration
  },
};

/**
 * Navigation utility functions
 */
const NavigationHelper = {
  /**
   * Get navigation structure for current user
   */
  getNavigationForUser(userRole = "guest") {
    const nav = { ...SiteStructure.navigation };

    // Add members navigation if user is authenticated
    if (userRole !== "guest") {
      nav.primary.push(...nav.members);
    }

    // Filter based on permissions
    return this.filterByPermissions(nav, userRole);
  },

  /**
   * Filter navigation items by user permissions
   */
  filterByPermissions(navigation, userRole) {
    const filterItems = (items) => {
      return items.filter((item) => {
        // Check if item requires authentication
        if (item.authRequired && userRole === "guest") {
          return false;
        }

        // Check specific permissions
        if (item.permission) {
          if (item.permission === "admin" && userRole !== "admin") {
            return false;
          }
          if (
            item.permission === "board" &&
            !["admin", "board"].includes(userRole)
          ) {
            return false;
          }
        }

        // Check hidden items
        if (item.hidden && userRole !== "admin") {
          return false;
        }

        // Recursively filter children
        if (item.children) {
          item.children = filterItems(item.children);
        }

        return true;
      });
    };

    return {
      primary: filterItems(navigation.primary),
      footer: filterItems(navigation.footer),
    };
  },

  /**
   * Get breadcrumb navigation for current page
   */
  getBreadcrumbs(currentPath) {
    const breadcrumbs = [{ title: "Home", url: "/" }];

    const findPageInNav = (items, path) => {
      for (const item of items) {
        if (item.url === path) {
          return [item];
        }

        if (item.children) {
          const childResult = findPageInNav(item.children, path);
          if (childResult) {
            return [item, ...childResult];
          }
        }
      }
      return null;
    };

    const pageNavigation = findPageInNav(
      SiteStructure.navigation.primary,
      currentPath
    );
    if (pageNavigation) {
      breadcrumbs.push(...pageNavigation);
    }

    return breadcrumbs;
  },

  /**
   * Get related pages for current section
   */
  getRelatedPages(currentPath) {
    const pathParts = currentPath.split("/").filter(Boolean);
    const sectionPath = `/${pathParts[0]}`;

    const findSection = (items) => {
      for (const item of items) {
        if (item.url === sectionPath) {
          return item.children || [];
        }
      }
      return [];
    };

    return findSection(SiteStructure.navigation.primary);
  },

  /**
   * Generate sitemap XML
   */
  generateSitemap() {
    const getAllUrls = (items) => {
      let urls = [];

      items.forEach((item) => {
        if (!item.hidden && item.url !== "#") {
          urls.push({
            url: item.url,
            title: item.title,
            description: item.description,
            priority: item.priority || 0.5,
            changefreq: this.getChangeFreq(item.url),
          });
        }

        if (item.children) {
          urls.push(...getAllUrls(item.children));
        }
      });

      return urls;
    };

    return getAllUrls([
      ...SiteStructure.navigation.primary,
      ...SiteStructure.navigation.footer,
    ]);
  },

  /**
   * Get change frequency for sitemap
   */
  getChangeFreq(url) {
    if (url === "/") return "daily";
    if (url.includes("/events")) return "weekly";
    if (url.includes("/learn")) return "monthly";
    if (url.includes("/gallery")) return "weekly";
    return "monthly";
  },
};

/**
 * Search functionality
 */
const SearchManager = {
  /**
   * Initialize search functionality
   */
  init() {
    this.setupSearchInput();
    this.setupFilters();
    this.bindEvents();
  },

  /**
   * Setup search input handling
   */
  setupSearchInput() {
    if (typeof document === "undefined") return;
    const searchInputs = document.querySelectorAll('input[type="search"]');

    searchInputs.forEach((input) => {
      let timeout;

      input.addEventListener("input", (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.performSearch(e.target.value);
        }, 300);
      });
    });
  },

  /**
   * Setup search filters
   */
  setupFilters() {
    // Implementation for filter dropdowns and checkboxes
    console.log("Search filters initialized");
  },

  /**
   * Bind search events
   */
  bindEvents() {
    // Keyboard shortcuts for search
    document.addEventListener("keydown", (e) => {
      // Ctrl/Cmd + K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        this.openSearch();
      }

      // Escape to close search
      if (e.key === "Escape") {
        this.closeSearch();
      }
    });
  },

  /**
   * Perform search operation
   */
  performSearch(query) {
    if (!query || query.length < 2) {
      this.clearResults();
      return;
    }

    // This would integrate with the actual search backend
    console.log(`Searching for: ${query}`);

    // Mock search results for now
    const mockResults = this.getMockResults(query);
    this.displayResults(mockResults);
  },

  /**
   * Get mock search results (to be replaced with real search)
   */
  getMockResults(query) {
    const allPages = NavigationHelper.generateSitemap();

    return allPages
      .filter(
        (page) =>
          page.title.toLowerCase().includes(query.toLowerCase()) ||
          page.description.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10);
  },

  /**
   * Display search results
   */
  displayResults(results) {
    // Implementation for displaying search results
    console.log("Search results:", results);
  },

  /**
   * Clear search results
   */
  clearResults() {
    // Implementation for clearing search results
    console.log("Search results cleared");
  },

  /**
   * Open search interface
   */
  openSearch() {
    // Implementation for opening search modal/interface
    console.log("Search opened");
  },

  /**
   * Close search interface
   */
  closeSearch() {
    // Implementation for closing search interface
    console.log("Search closed");
  },
};

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = { SiteStructure, NavigationHelper, SearchManager };
}

// Auto-initialize when DOM is ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      SearchManager.init();
    });
  } else {
    SearchManager.init();
  }
}
