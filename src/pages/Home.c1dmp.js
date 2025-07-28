// Blue Ridge Bonsai Society Homepage - Phase 1 Implementation
// API Reference: https://www.wix.com/velo/reference/api-overview/introduction

// Environment detection
const IS_BROWSER = typeof window !== "undefined" && typeof document !== "undefined";
const IS_SERVER = typeof window === "undefined";

// Mock Wix APIs for standalone execution
const mockWixAPIs = {
  wixData: {
    query: (collection) => ({
      eq: () => mockWixAPIs.wixData.query(collection),
      gt: () => mockWixAPIs.wixData.query(collection),
      lt: () => mockWixAPIs.wixData.query(collection),
      ascending: () => mockWixAPIs.wixData.query(collection),
      descending: () => mockWixAPIs.wixData.query(collection),
      limit: () => mockWixAPIs.wixData.query(collection),
      count: () => Promise.resolve({ totalCount: 25 }),
      find: () => Promise.resolve({ items: getMockData(collection) })
    })
  },
  currentMember: {
    getMember: () => Promise.resolve(null) // Not logged in by default
  },
  wixLocation: {
    to: (url) => console.log(`Navigate to: ${url}`),
    url: IS_BROWSER ? window.location.href : 'https://example.com'
  },
  wixWindow: {
    openLightbox: (name, data) => console.log(`Open lightbox: ${name}`, data)
  }
};

// Mock data for testing
function getMockData(collection) {
  const mockData = {
    Events: [
      {
        _id: '1',
        title: 'Spring Bonsai Workshop',
        description: 'Learn the fundamentals of bonsai care and styling in this hands-on workshop perfect for beginners and intermediate enthusiasts.',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        category: 'Workshop',
        location: 'NC Arboretum'
      },
      {
        _id: '2', 
        title: 'Monthly Club Meeting',
        description: 'Join us for our monthly meeting featuring guest speaker and tree critiques. All skill levels welcome.',
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        category: 'Meeting',
        location: 'Community Center'
      },
      {
        _id: '3',
        title: 'Advanced Styling Techniques',
        description: 'Master advanced wiring and shaping techniques with expert guidance. Intermediate to advanced level.',
        startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
        category: 'Workshop',
        location: 'NC Arboretum'
      }
    ],
    MemberSpotlights: [
      {
        _id: '1',
        memberName: 'Sarah Johnson',
        memberTitle: 'Bonsai Enthusiast',
        testimonial: 'Joining BRBS transformed my understanding of bonsai. The community support and expert guidance have been invaluable.',
        yearsExperience: 8,
        favoriteStyle: 'Informal Upright',
        memberPhoto: '/images/member-sarah.jpg'
      }
    ],
    Announcements: [
      {
        _id: '1',
        title: 'Spring Exhibition Coming Soon',
        excerpt: 'Our annual spring exhibition will showcase the finest bonsai from our members. Registration opens next week.',
        publishDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    ]
  };
  
  return mockData[collection] || [];
}

// Pure JavaScript DOM manipulation functions
function safeElement(selector) {
  if (!IS_BROWSER) {
    console.warn(`Element access skipped (server environment): ${selector}`);
    return null;
  }
  
  try {
    const element = document.querySelector(selector);
    if (!element) {
      console.warn(`Element not found: ${selector}`);
      return null;
    }
    return element;
  } catch (error) {
    console.warn(`Error selecting element ${selector}:`, error);
    return null;
  }
}

function safeSetText(selector, text) {
  if (!IS_BROWSER) return;
  
  const element = safeElement(selector);
  if (element) {
    element.textContent = text;
  }
}

function safeSetHtml(selector, html) {
  if (!IS_BROWSER) return;
  
  const element = safeElement(selector);
  if (element) {
    element.innerHTML = html;
  }
}

function safeShow(selector) {
  if (!IS_BROWSER) return;
  
  try {
    const element = safeElement(selector);
    if (element) {
      element.style.display = '';
      element.classList.remove('hidden');
    }
  } catch (error) {
    console.warn(`Error showing element ${selector}:`, error);
  }
}

function safeHide(selector) {
  if (!IS_BROWSER) return;
  
  try {
    const element = safeElement(selector);
    if (element) {
      element.style.display = 'none';
      element.classList.add('hidden');
    }
  } catch (error) {
    console.warn(`Error hiding element ${selector}:`, error);
  }
}

function safeOnClick(selector, handler) {
  if (!IS_BROWSER) return;
  
  const element = safeElement(selector);
  if (element) {
    element.addEventListener('click', handler);
  }
}

function createElement(tagName, attributes = {}, children = []) {
  if (!IS_BROWSER) return null;
  
  const element = document.createElement(tagName);
  
  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'textContent') {
      element.textContent = value;
    } else if (key === 'innerHTML') {
      element.innerHTML = value;
    } else {
      element.setAttribute(key, value);
    }
  });
  
  // Add children
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof Element) {
      element.appendChild(child);
    }
  });
  
  return element;
}

// Initialize when document is ready or immediately if in server environment  
function initializeHomePage() {
  console.log("Running the code for the Home page. To debug this code in your browser's dev tools, open c1dmp.js.");
  console.log("💡 Initializing Blue Ridge Bonsai Society Home Page");

    // Initialize homepage components
  initializeHomepage().then(() => {
    // Setup event handlers
    setupEventHandlers();
    
    // Load dynamic content
    loadDynamicContent();
  }).catch(error => {
    console.error("Error initializing homepage:", error);
  });
}

// Run initialization based on environment
if (IS_BROWSER) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHomePage);
  } else {
    initializeHomePage();
  }
} else {
  // Server-side execution
  initializeHomePage();
}

async function initializeHomepage() {
    try {
    // Create the main home page structure
    createHomePageStructure();

        // Display welcome message with current user info
        await displayWelcomeMessage();
        
        // Load latest events preview
        await loadEventsPreview();
        
        // Load member spotlight
        await loadMemberSpotlight();
        
        // Setup call-to-action buttons
        setupCallToActions();
        
        // Initialize atmospheric animations
        initializeAnimations();
    } catch (error) {
    console.error("Error initializing homepage:", error);
  }
}

/**
 * Create the complete HTML structure for the home page
 */
function createHomePageStructure() {
  try {
    // Find or create main container
    let mainContainer =
      safeElement("#main") ||
      safeElement("#page-content") ||
      safeElement("#content");

    if (!mainContainer) {
      // If no main container exists, create one in the body
      if (typeof document !== "undefined") {
        mainContainer = document.createElement("div");
        mainContainer.id = "main";
        document.body.appendChild(mainContainer);
      } else {
        console.warn("Cannot create page structure - document not available");
        return;
      }
    }

    const homePageHTML = `
            <div class="home-page-container">
                <!-- Hero Section -->
                <section class="hero-section">
                    <div class="hero-content">
                        <h1 id="heroTitle" class="hero-title">Welcome to Blue Ridge Bonsai Society</h1>
                        <p id="heroSubtitle" class="hero-subtitle">Cultivating the ancient art of bonsai in the heart of Asheville, North Carolina</p>
                        
                        <div class="hero-actions">
                            <button id="ctaJoinButton" class="btn btn-primary">Join Our Community</button>
                            <button id="ctaEventsButton" class="btn btn-outline">View Events</button>
                            <button id="ctaLearningButton" class="btn btn-outline">Beginner's Guide</button>
                            <button id="ctaAboutButton" class="btn btn-outline">About Us</button>
                        </div>
                    </div>
                    
                    <div class="hero-image">
                        <img src="/images/hero-bonsai.jpg" alt="Beautiful bonsai display" />
                    </div>
                </section>

                <!-- Quick Stats Section -->
                <section id="statsSection" class="stats-section">
                    <div id="statsContainer" class="stats-container">
                        <!-- Stats will be loaded here -->
                    </div>
                </section>

                <!-- Events Preview Section -->
                <section id="eventsSection" class="events-section">
                    <div class="section-header">
                        <h2>Upcoming Events</h2>
                        <p>Join us for workshops, meetings, and exhibitions</p>
                    </div>
                    <div id="eventsPreviewContainer" class="events-preview-container">
                        <!-- Events preview will be loaded here -->
                    </div>
                </section>

                <!-- Member Spotlight Section -->
                <section id="memberSpotlightSection" class="spotlight-section">
                    <div class="section-header">
                        <h2>Member Spotlight</h2>
                    </div>
                    <div id="spotlightContainer" class="spotlight-container">
                        <!-- Member spotlight will be loaded here -->
                    </div>
                </section>

                <!-- Latest News Section -->
                <section id="newsSection" class="news-section" style="display: none;">
                    <div class="section-header">
                        <h2>Latest News</h2>
                    </div>
                    <div id="newsContainer" class="news-container">
                        <!-- News will be loaded here -->
                    </div>
                </section>

                <!-- About Preview Section -->
                <section class="about-preview-section">
                    <div class="about-content">
                        <div class="about-text">
                            <h2>About Blue Ridge Bonsai Society</h2>
                            <p>We are a community of bonsai enthusiasts dedicated to learning, sharing, and celebrating the ancient art of bonsai. Located in the beautiful Blue Ridge Mountains, we meet monthly to share knowledge, techniques, and our passion for these living sculptures.</p>
                            
                            <div class="partnership-highlight">
                                <h3>Partnership with NC Arboretum</h3>
                                <p>We're proud to partner with The North Carolina Arboretum for special exhibitions and educational programs.</p>
                            </div>
                        </div>
                        
                        <div class="about-image">
                            <img src="/images/arboretum-partnership.jpg" alt="NC Arboretum Partnership" />
                        </div>
                    </div>
                </section>
            </div>
        `;

    // Inject the HTML into the main container
    if (mainContainer.innerHTML !== undefined) {
      mainContainer.innerHTML = homePageHTML;
    } else if (mainContainer.html !== undefined) {
      mainContainer.html = homePageHTML;
    }

    console.log("✅ Home page structure created successfully");
  } catch (error) {
    console.error("Error creating home page structure:", error);
    }
}

async function displayWelcomeMessage() {
    try {
    const member = await mockWixAPIs.currentMember.getMember();
        
        if (member) {
      const firstName = member.contactDetails?.firstName || "Member";
      safeSetText("#heroTitle", `Welcome back, ${firstName}!`);
      safeSetText(
        "#heroSubtitle",
        "Continue your bonsai journey with Blue Ridge Bonsai Society"
      );

      // Update button text and functionality
      const joinButton = safeElement("#ctaJoinButton");
      if (joinButton) {
        joinButton.textContent = "My Dashboard";
        joinButton.setAttribute("data-link", "/members/dashboard");
      }
        } else {
      safeSetText("#heroTitle", "Welcome to Blue Ridge Bonsai Society");
      safeSetText(
        "#heroSubtitle",
        "Cultivating the ancient art of bonsai in the heart of Asheville, North Carolina"
      );

      const joinButton = safeElement("#ctaJoinButton");
      if (joinButton) {
        joinButton.textContent = "Join Our Community";
        joinButton.setAttribute("data-link", "/join-brbs");
      }
        }
    } catch (error) {
    console.error("Error displaying welcome message:", error);
        // Fallback to default message
    safeSetText("#heroTitle", "Welcome to Blue Ridge Bonsai Society");
    safeSetText(
      "#heroSubtitle",
      "Cultivating the ancient art of bonsai in the heart of Asheville, North Carolina"
    );
    }
}

async function loadEventsPreview() {
    try {
        // Load next 3 upcoming events
      const upcomingEvents = await mockWixAPIs.wixData
        .query("Events")
        .gt("startDate", new Date())
        .ascending("startDate")
            .limit(3)
            .find();
        
        if (upcomingEvents.items.length > 0) {
        safeShow("#eventsSection");
            displayEventsPreview(upcomingEvents.items);
        } else {
        safeHide("#eventsSection");
        }
    } catch (error) {
      console.error("Error loading events preview:", error);
        // Hide events section if there's an error
      safeHide("#eventsSection");
    }
}

function displayEventsPreview(events) {
  const eventsHTML = events
    .map((event) => {
        const eventDate = new Date(event.startDate);
      const formattedDate = eventDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        });
        
        return `
            <div class="glass-card event-preview-card" data-event-id="${
              event._id
            }">
                <div class="event-date">
                    <span class="date-text">${formattedDate}</span>
                </div>
                <div class="event-content">
                    <h4 class="event-title">${event.title}</h4>
                    <p class="event-description">${event.description.substring(
                      0,
                      120
                    )}...</p>
                    <div class="event-meta">
                        <span class="event-category">${
                          event.category || "Workshop"
                        }</span>
                        <span class="event-location">${
                          event.location || "TBD"
                        }</span>
                    </div>
                </div>
                <div class="event-actions">
                    <button class="btn btn-primary" onclick="viewEventDetails('${
                      event._id
                    }')">
                        Learn More
                    </button>
                </div>
            </div>
        `;
    })
    .join("");
    
  safeSetHtml("#eventsPreviewContainer", `
        <div class="events-preview-grid">
            ${eventsHTML}
        </div>
        <div class="events-cta text-center mt-lg">
            <button class="btn btn-primary" onclick="viewAllEvents()">
                View All Events
            </button>
        </div>
    `);
}

async function loadMemberSpotlight() {
    try {
        // Load featured member or testimonial
    const spotlights = await wixData
      .query("MemberSpotlights")
      .eq("featured", true)
      .eq("active", true)
            .limit(1)
            .find();
        
        if (spotlights.items.length > 0) {
            const spotlight = spotlights.items[0];
            displayMemberSpotlight(spotlight);
      $w("#memberSpotlightSection").show();
        } else {
            // Fallback to default testimonial
            displayDefaultTestimonial();
        }
    } catch (error) {
    console.error("Error loading member spotlight:", error);
        displayDefaultTestimonial();
    }
}

function displayMemberSpotlight(spotlight) {
  $w("#spotlightContainer").html = `
        <div class="glass-card spotlight-card">
            <div class="spotlight-image">
                <img src="${
                  spotlight.memberPhoto || "/images/default-member.jpg"
                }" alt="${spotlight.memberName}" />
            </div>
            <div class="spotlight-content">
                <h4 class="spotlight-name">${spotlight.memberName}</h4>
                <p class="spotlight-title">${
                  spotlight.memberTitle || "BRBS Member"
                }</p>
                <blockquote class="spotlight-quote">
                    "${spotlight.testimonial}"
                </blockquote>
                <div class="spotlight-details">
                    <span class="years-experience">Bonsai Experience: ${
                      spotlight.yearsExperience
                    } years</span>
                    <span class="favorite-style">Favorite Style: ${
                      spotlight.favoriteStyle
                    }</span>
                </div>
            </div>
        </div>
    `;
}

function displayDefaultTestimonial() {
  $w("#spotlightContainer").html = `
        <div class="glass-card spotlight-card">
            <div class="spotlight-content text-center">
                <h4 class="spotlight-title">Community Voices</h4>
                <blockquote class="spotlight-quote">
                    "Blue Ridge Bonsai Society has been instrumental in developing my understanding 
                    of this beautiful art form. The workshops and community support are invaluable."
                </blockquote>
                <p class="spotlight-attribution">- BRBS Community Member</p>
                <div class="spotlight-cta mt-md">
                    <button class="btn btn-primary" onclick="joinCommunity()">
                        Join Our Community
                    </button>
                </div>
            </div>
        </div>
    `;
  $w("#memberSpotlightSection").show();
}

function setupCallToActions() {
    // Primary CTA - Join/Dashboard button
  safeOnClick("#ctaJoinButton", () => {
    const button = safeElement("#ctaJoinButton");
    const link = button?.getAttribute("data-link") || "/join-brbs";
    if (typeof wixLocation !== "undefined") {
        wixLocation.to(link);
    } else {
      console.log("Navigate to:", link);
    }
    });
    
    // Secondary CTAs
  safeOnClick("#ctaEventsButton", () => {
    if (typeof wixLocation !== "undefined") {
      wixLocation.to("/events");
    } else {
      console.log("Navigate to: /events");
    }
  });

  safeOnClick("#ctaLearningButton", () => {
    if (typeof wixLocation !== "undefined") {
      wixLocation.to("/beginners-guide");
    } else {
      console.log("Navigate to: /beginners-guide");
    }
  });

  safeOnClick("#ctaAboutButton", () => {
    if (typeof wixLocation !== "undefined") {
      wixLocation.to("/about-brbs");
    } else {
      console.log("Navigate to: /about-brbs");
    }
    });
}

function initializeAnimations() {
    // Add scroll-triggered animations for cards
    const observerOptions = {
        threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
    };
    
    const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
            if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
            }
        });
    }, observerOptions);
    
    // Observe all glass cards
    setTimeout(() => {
    const cards = document.querySelectorAll(".glass-card");
    cards.forEach((card) => observer.observe(card));
    }, 500);
}

async function loadDynamicContent() {
    try {
        // Load quick stats
        await loadQuickStats();
        
        // Load latest news/announcements
        await loadLatestNews();
    } catch (error) {
    console.error("Error loading dynamic content:", error);
    }
}

async function loadQuickStats() {
    try {
        // Get member count (approximate)
    const memberCount = await wixData
      .query("Members")
      .eq("isActive", true)
            .count();
        
        // Get upcoming events count
    const upcomingEventsCount = await wixData
      .query("Events")
      .gt("startDate", new Date())
            .count();
        
        // Display stats
    $w("#statsContainer").html = `
            <div class="stats-grid">
                <div class="stat-item glass-card">
                    <div class="stat-number">${
                      memberCount.totalCount || "50+"
                    }</div>
                    <div class="stat-label">Active Members</div>
                </div>
                <div class="stat-item glass-card">
                    <div class="stat-number">${
                      upcomingEventsCount.totalCount || "5+"
                    }</div>
                    <div class="stat-label">Upcoming Events</div>
                </div>
                <div class="stat-item glass-card">
                    <div class="stat-number">25+</div>
                    <div class="stat-label">Years of Experience</div>
                </div>
                <div class="stat-item glass-card">
                    <div class="stat-number">∞</div>
                    <div class="stat-label">Learning Opportunities</div>
                </div>
            </div>
        `;
        
    $w("#statsSection").show();
    } catch (error) {
    console.error("Error loading stats:", error);
    $w("#statsSection").hide();
    }
}

async function loadLatestNews() {
    try {
        // Load latest announcement or blog post
    const latestNews = await wixData
      .query("Announcements")
      .eq("published", true)
      .descending("publishDate")
            .limit(1)
            .find();
        
        if (latestNews.items.length > 0) {
            const news = latestNews.items[0];
            displayLatestNews(news);
        }
    } catch (error) {
    console.error("Error loading latest news:", error);
        // News section will remain hidden if no data
    }
}

function displayLatestNews(news) {
  $w("#newsContainer").html = `
        <div class="glass-card news-card">
            <div class="news-header">
                <h4 class="news-title">${news.title}</h4>
                <span class="news-date">${new Date(
                  news.publishDate
                ).toLocaleDateString()}</span>
            </div>
            <div class="news-content">
                <p class="news-excerpt">${news.excerpt}</p>
                <button class="btn btn-primary" onclick="readFullNews('${
                  news._id
                }')">
                    Read More
                </button>
            </div>
        </div>
    `;
  $w("#newsSection").show();
}

function setupEventHandlers() {
    // Global event handlers for dynamically created elements
  $w("#page").onClick((event) => {
        const target = event.target;
        
        // Handle event card clicks
    if (target.closest(".event-preview-card")) {
      const eventId = target.closest(".event-preview-card").dataset.eventId;
            if (eventId) {
                wixLocation.to(`/event-details?eventId=${eventId}`);
            }
        }
    });
}

// Global functions for dynamic content
window.viewEventDetails = function (eventId) {
    wixLocation.to(`/event-details?eventId=${eventId}`);
};

window.viewAllEvents = function () {
  wixLocation.to("/events");
};

window.joinCommunity = function () {
  wixLocation.to("/join-brbs");
};

window.readFullNews = function (newsId) {
    wixLocation.to(`/news?id=${newsId}`);
};

// Add CSS for homepage-specific styling
if (typeof window !== "undefined") {
    const homepageStyles = `
        <style id="homepage-styles">
            /* Home Page Layout */
            .home-page-container {
                font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
            }
            
            /* Hero Section */
            .hero-section {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 4rem;
                align-items: center;
                padding: 4rem 2rem;
                max-width: 1200px;
                margin: 0 auto;
                min-height: 60vh;
            }
            
            .hero-title {
                font-size: 3.5rem;
                font-weight: 700;
                color: #4A4A4A;
                margin: 0 0 1rem 0;
                line-height: 1.1;
            }
            
            .hero-subtitle {
                font-size: 1.25rem;
                color: #6B8E6F;
                margin: 0 0 2rem 0;
                line-height: 1.5;
            }
            
            .hero-actions {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
            }
            
            .btn {
                padding: 1rem 2rem;
                border-radius: 8px;
                font-weight: 600;
                text-decoration: none;
                display: inline-block;
                transition: all 0.3s ease;
                border: none;
                cursor: pointer;
                font-family: inherit;
                font-size: 1rem;
            }
            
            .btn-primary {
                background: linear-gradient(135deg, #6B8E6F 0%, #5A7A5E 100%);
                color: #FEFFFE;
                box-shadow: 0 4px 16px rgba(107, 142, 111, 0.3);
            }
            
            .btn-primary:hover {
                background: linear-gradient(135deg, #5A7A5E 0%, #4F6B52 100%);
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(107, 142, 111, 0.4);
            }
            
            .btn-outline {
                background: transparent;
                border: 2px solid #6B8E6F;
                color: #6B8E6F;
            }
            
            .btn-outline:hover {
                background: #6B8E6F;
                color: #FEFFFE;
                transform: translateY(-2px);
            }
            
            .hero-image img {
                width: 100%;
                height: auto;
                border-radius: 16px;
                box-shadow: 0 12px 40px rgba(107, 142, 111, 0.2);
            }
            
            /* Section Styling */
            .stats-section, .events-section, .spotlight-section, 
            .news-section, .about-preview-section {
                padding: 4rem 2rem;
                max-width: 1200px;
                margin: 0 auto;
            }
            
            .section-header {
                text-align: center;
                margin-bottom: 3rem;
            }
            
            .section-header h2 {
                font-size: 2.5rem;
                color: #4A4A4A;
                margin: 0 0 1rem 0;
                font-weight: 700;
            }
            
            .section-header p {
                color: #6B8E6F;
                font-size: 1.1rem;
                margin: 0;
            }
            
            /* Stats Section */
            .stats-container {
                background: rgba(254, 255, 254, 0.9);
                backdrop-filter: blur(15px);
                border-radius: 16px;
                padding: 2rem;
                box-shadow: 0 8px 32px rgba(107, 142, 111, 0.1);
            }
            
            .events-preview-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
                margin: 2rem 0;
            }
            
            .event-preview-card {
                cursor: pointer;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .event-preview-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 25px rgba(107, 142, 111, 0.2);
            }
            
            .event-date {
                background: var(--mountain-sage);
                color: var(--cloud-white);
                padding: 0.5rem;
                border-radius: var(--radius-md);
                text-align: center;
                margin-bottom: 1rem;
                font-weight: 600;
            }
            
            .event-title {
                color: var(--stone-gray);
                margin-bottom: 0.5rem;
            }
            
            .event-description {
                color: var(--stone-gray);
                font-size: 0.9rem;
                line-height: 1.5;
            }
            
            .event-meta {
                display: flex;
                gap: 1rem;
                margin: 1rem 0;
                font-size: 0.85rem;
                color: var(--earth-brown);
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                margin: 2rem 0;
            }
            
            .stat-item {
                text-align: center;
                padding: 1.5rem 1rem;
            }
            
            .stat-number {
                font-size: 2.5rem;
                font-weight: 700;
                color: var(--mountain-sage);
                margin-bottom: 0.5rem;
            }
            
            .stat-label {
                font-size: 0.9rem;
                color: var(--stone-gray);
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            
            .spotlight-card {
                display: flex;
                gap: 2rem;
                align-items: center;
            }
            
            .spotlight-image img {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                object-fit: cover;
                border: 3px solid var(--mountain-sage);
            }
            
            .spotlight-quote {
                font-style: italic;
                font-size: 1.1rem;
                color: var(--earth-brown);
                margin: 1rem 0;
                border-left: 4px solid var(--mountain-sage);
                padding-left: 1rem;
            }
            
            .news-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }
            
            .news-date {
                font-size: 0.85rem;
                color: var(--earth-brown);
            }
            
            .animate-in {
                animation: slideInUp 0.6s ease-out;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @media (max-width: 768px) {
                .spotlight-card {
                    flex-direction: column;
                    text-align: center;
                }
                
                .events-preview-grid {
                    grid-template-columns: 1fr;
                }
                
                .stats-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        </style>
    `;
    
  if (!document.getElementById("homepage-styles")) {
    document.head.insertAdjacentHTML("beforeend", homepageStyles);
    }
}
