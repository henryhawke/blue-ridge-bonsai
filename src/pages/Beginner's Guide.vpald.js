// Blue Ridge Bonsai Society - Learning Center - Phase 1 Implementation
// This is the main page for the Learning Center, providing a tabbed interface
// to access all learning-related content. It uses the central LearningSystem.

import { LearningSystem } from 'public/js/learning-system.js';

// Mock Velo APIs
const wixLocation = { to: (url) => console.log(`Navigating to: ${url}`) };
const wixWindow = { openLightbox: (name, data) => console.log(`Open lightbox: ${name}`, data) };

// Safe DOM manipulation functions, adapted for Velo
function safeElement(selector) {
  try {
    return $w(selector);
  } catch(e) {
    return null; // In a pure Velo environment, this shouldn't happen if the element exists
  }
}

function safeSetHtml(selector, html) {
  const element = safeElement(selector);
  if (element) element.html = html;
}

function safeShow(selector) {
  const element = safeElement(selector);
  if (element) element.show();
}

function safeHide(selector) {
  const element = safeElement(selector);
  if (element) element.hide();
}

function safeOnClick(selector, handler) {
  const element = safeElement(selector);
  if (element) element.onClick(handler);
}

function safeSetValue(selector, value) {
  const element = safeElement(selector);
  if (element) element.value = value;
}

function safeGetValue(selector) {
  const element = safeElement(selector);
  return element ? element.value : "";
}

let learningSystem;
let currentSearchQuery = "";
let currentCategory = "all";
let currentDifficulty = "all";

$w.onReady(function () {
    console.log("🚀 Initializing Learning Center Page");
    initializeLearningPage();
});

async function initializeLearningPage() {
  learningSystem = new LearningSystem();
  createLearningPageStructure();
  
  await loadBeginnersGuide();
  await loadKnowledgeBase();
  await loadResourceLibrary();
  await loadVendorDirectory();
  
  setupEventHandlers();
  initializeAnimations();

  console.log("✅ Learning Center Page initialization complete.");
}

function createLearningPageStructure() {
  try {
    // For Wix environment, try to use $w to find/create containers
    let mainContainer;
    
    // Try Wix-specific selectors first
    try {
      if (typeof $w !== 'undefined') {
        // Look for common Wix page containers
        const wixContainers = ['#page1', '#main', '#content', '#pageContainer', '#siteContainer'];
        for (const selector of wixContainers) {
          try {
            const element = $w(selector);
            if (element) {
              mainContainer = element;
              console.log(`✅ Found Wix container for Learning Center: ${selector}`);
              break;
            }
          } catch (e) {
            // Container doesn't exist, try next one
          }
        }
        
        // If no existing container found, try to use page element
        if (!mainContainer) {
          try {
            const bodyElements = $w('#page1') || $w('Page') || $w('*').filter(el => el.type === 'Page')[0];
            if (bodyElements) {
              mainContainer = bodyElements;
              console.log('✅ Using Wix page element as Learning Center container');
            }
          } catch (e) {
            console.warn('Could not find Wix page container for Learning Center');
          }
        }
      }
    } catch (e) {
      console.warn('Wix $w not available for Learning Center, falling back to DOM');
    }
    
    // Fallback to regular DOM if Wix methods don't work
    if (!mainContainer) {
      mainContainer = safeElement("#main") || 
                     safeElement("#page-content") ||
                     safeElement("#content");
      
      if (!mainContainer && typeof document !== "undefined") {
        mainContainer = document.createElement("div");
        mainContainer.id = "main";
        document.body.appendChild(mainContainer);
      }
    }
    
    if (!mainContainer) {
      console.warn("Cannot create Learning Center page structure - no container available");
      return;
    }
    
    const learningPageHTML = `
      <div class="learning-center-container">
        <!-- Page Header -->
        <div class="page-header">
          <h1>Learning Center</h1>
          <p class="page-subtitle">Your complete guide to mastering the art of bonsai</p>
        </div>

        <!-- Navigation Tabs -->
        <div class="learning-nav">
          <button class="nav-tab active" data-section="beginners-guide">Beginner's Guide</button>
          <button class="nav-tab" data-section="knowledge-base">Knowledge Base</button>
          <button class="nav-tab" data-section="resources">Resources</button>
          <button class="nav-tab" data-section="vendors">Vendors</button>
        </div>

        <!-- Search and Filters -->
        <div class="search-filters-container">
          <div class="search-bar">
            <input type="text" id="searchInput" placeholder="Search articles, guides, and resources..." class="search-input">
            <button id="searchBtn" class="search-btn">🔍</button>
          </div>
          
          <div class="filters">
            <select id="categoryFilter" class="filter-select">
              <option value="all">All Categories</option>
              <option value="beginner">Beginner</option>
              <option value="tools">Tools & Equipment</option>
              <option value="seasonal">Seasonal Care</option>
              <option value="styling">Styling & Design</option>
              <option value="species">Species Guides</option>
            </select>
            
            <select id="difficultyFilter" class="filter-select">
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <!-- Beginner's Guide Section -->
        <div id="beginners-guide" class="learning-section active">
          <div class="section-header">
            <h2>🌱 Beginner's Guide to Bonsai</h2>
            <p>Start your bonsai journey with confidence using our step-by-step guide</p>
          </div>
          
          <div id="beginnersContent" class="beginners-content">
            <!-- Content will be loaded here -->
          </div>
        </div>

        <!-- Knowledge Base Section -->
        <div id="knowledge-base" class="learning-section">
          <div class="section-header">
            <h2>📚 Knowledge Base</h2>
            <p>Searchable articles and guides covering all aspects of bonsai care</p>
          </div>
          
          <div id="knowledgeBaseContent" class="knowledge-base-content">
            <!-- Content will be loaded here -->
          </div>
        </div>

        <!-- Resources Section -->
        <div id="resources" class="learning-section">
          <div class="section-header">
            <h2>📖 Resource Library</h2>
            <p>Downloads, tools, and reference materials for your bonsai practice</p>
          </div>
          
          <div id="resourcesContent" class="resources-content">
            <!-- Content will be loaded here -->
          </div>
        </div>

        <!-- Vendors Section -->
        <div id="vendors" class="learning-section">
          <div class="section-header">
            <h2>🛒 Recommended Vendors</h2>
            <p>Trusted suppliers for trees, tools, and materials in our region</p>
          </div>
          
          <div id="vendorsContent" class="vendors-content">
            <!-- Content will be loaded here -->
          </div>
        </div>
      </div>
    `;
    
    // Inject the HTML into the main container
    // Try multiple methods to set content
    let contentSet = false;
    
    // Method 1: Wix element html property
    if (mainContainer.html !== undefined) {
      try {
        mainContainer.html = learningPageHTML;
        contentSet = true;
        console.log('✅ Learning Center content set using Wix .html property');
      } catch (e) {
        console.warn('Failed to set Learning Center content using Wix .html:', e);
      }
    }
    
    // Method 2: Standard DOM innerHTML
    if (!contentSet && mainContainer.innerHTML !== undefined) {
      try {
        mainContainer.innerHTML = learningPageHTML;
        contentSet = true;
        console.log('✅ Learning Center content set using DOM .innerHTML');
      } catch (e) {
        console.warn('Failed to set Learning Center content using .innerHTML:', e);
      }
    }
    
    // Method 3: Create elements manually and append
    if (!contentSet && typeof document !== 'undefined') {
      try {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = learningPageHTML;
        
        // Clear existing content
        while (mainContainer.firstChild) {
          mainContainer.removeChild(mainContainer.firstChild);
        }
        
        // Append new content
        while (tempDiv.firstChild) {
          mainContainer.appendChild(tempDiv.firstChild);
        }
        contentSet = true;
        console.log('✅ Learning Center content set using manual DOM manipulation');
      } catch (e) {
        console.warn('Failed to set Learning Center content using manual DOM:', e);
      }
    }
    
    if (!contentSet) {
      console.error('❌ Could not set Learning Center page content using any method');
      // As a last resort, try to add a simple text indicator
      try {
        if (mainContainer.text !== undefined) {
          mainContainer.text = 'Blue Ridge Bonsai Society - Learning Center Loading...';
        }
      } catch (e) {
        console.warn('Even basic Learning Center text setting failed');
      }
    }
    
    console.log("✅ Learning Center structure created successfully");
  } catch (error) {
    console.error("Error creating Learning Center structure:", error);
  }
}

async function loadBeginnersGuide() {
  try {
    const beginnersContent = `
      <div class="beginners-guide-grid">
        <!-- Getting Started Card -->
        <div class="glass-card guide-card">
          <div class="card-icon">🌿</div>
          <h3>Getting Started</h3>
          <p>Learn the fundamentals of bonsai and how to choose your first tree.</p>
          <ul class="guide-topics">
            <li>What is bonsai?</li>
            <li>Choosing your first tree</li>
            <li>Basic terminology</li>
            <li>Setting up your workspace</li>
          </ul>
          <button class="btn btn-primary" onclick="openGuideSection('getting-started')">
            Start Here
          </button>
        </div>

        <!-- Basic Care Card -->
        <div class="glass-card guide-card">
          <div class="card-icon">💧</div>
          <h3>Basic Care</h3>
          <p>Essential daily and weekly care routines to keep your bonsai healthy.</p>
          <ul class="guide-topics">
            <li>Watering techniques</li>
            <li>Light requirements</li>
            <li>Soil basics</li>
            <li>Common mistakes to avoid</li>
          </ul>
          <button class="btn btn-primary" onclick="openGuideSection('basic-care')">
            Learn Care
          </button>
        </div>

        <!-- Tools & Equipment Card -->
        <div class="glass-card guide-card">
          <div class="card-icon">✂️</div>
          <h3>Essential Tools</h3>
          <p>Must-have tools for beginners and budget-friendly alternatives.</p>
          <ul class="guide-topics">
            <li>Basic tool kit</li>
            <li>Pruning shears</li>
            <li>Wire and pliers</li>
            <li>Repotting tools</li>
          </ul>
          <button class="btn btn-primary" onclick="openGuideSection('tools')">
            View Tools
          </button>
        </div>

        <!-- First Styling Card -->
        <div class="glass-card guide-card">
          <div class="card-icon">🎨</div>
          <h3>First Styling</h3>
          <p>Simple styling techniques to shape your tree and create your first bonsai.</p>
          <ul class="guide-topics">
            <li>Basic pruning</li>
            <li>Simple wiring</li>
            <li>Creating taper</li>
            <li>Branch selection</li>
          </ul>
          <button class="btn btn-primary" onclick="openGuideSection('styling')">
            Start Styling
          </button>
        </div>

        <!-- Troubleshooting Card -->
        <div class="glass-card guide-card">
          <div class="card-icon">🔧</div>
          <h3>Troubleshooting</h3>
          <p>Common problems and solutions for new bonsai enthusiasts.</p>
          <ul class="guide-topics">
            <li>Yellowing leaves</li>
            <li>Pest identification</li>
            <li>Disease prevention</li>
            <li>Recovery techniques</li>
          </ul>
          <button class="btn btn-primary" onclick="openGuideSection('troubleshooting')">
            Get Help
          </button>
        </div>

        <!-- Next Steps Card -->
        <div class="glass-card guide-card">
          <div class="card-icon">🚀</div>
          <h3>Next Steps</h3>
          <p>Ready to advance? Discover intermediate techniques and join our community.</p>
          <ul class="guide-topics">
            <li>Advanced techniques</li>
            <li>Species selection</li>
            <li>Show preparation</li>
            <li>Community involvement</li>
          </ul>
          <button class="btn btn-primary" onclick="joinCommunity()">
            Join BRBS
          </button>
        </div>
      </div>

      <!-- Quick Reference Section -->
      <div class="quick-reference">
        <h3>Quick Reference</h3>
        <div class="reference-grid">
          <div class="reference-item">
            <h4>Watering Schedule</h4>
            <p>Check soil daily, water when top inch is dry</p>
          </div>
          <div class="reference-item">
            <h4>Feeding Schedule</h4>
            <p>Fertilize every 2 weeks during growing season</p>
          </div>
          <div class="reference-item">
            <h4>Pruning Time</h4>
            <p>Major pruning in late winter, maintenance pruning as needed</p>
          </div>
          <div class="reference-item">
            <h4>Repotting Frequency</h4>
            <p>Young trees: every 1-2 years, Mature trees: every 3-5 years</p>
          </div>
        </div>
      </div>
    `;
    
    safeSetHtml("#beginnersContent", beginnersContent);
  } catch (error) {
    console.error("Error loading beginner's guide:", error);
  }
}

async function loadKnowledgeBase() {
    const articles = await learningSystem.loadArticles({ category: 'all', search: '' });
    if (articles.length > 0) {
        displayKnowledgeBaseArticles(articles);
    } else {
        safeSetHtml("#knowledgeBaseContent", "<p>No articles found.</p>");
    }
}

function displayKnowledgeBaseArticles(articles) {
  const featuredArticles = articles.filter(article => article.featured);
  const regularArticles = articles.filter(article => !article.featured);
  
  const knowledgeBaseHTML = `
    ${featuredArticles.length > 0 ? `
      <div class="featured-articles">
        <h3>Featured Articles</h3>
        <div class="featured-grid">
          ${featuredArticles.map(article => createArticleCard(article, true)).join("")}
        </div>
      </div>
    ` : ""}
    
    <div class="all-articles">
      <h3>All Articles</h3>
      <div class="articles-grid">
        ${regularArticles.map(article => createArticleCard(article, false)).join("")}
      </div>
    </div>
  `;
  
  safeSetHtml("#knowledgeBaseContent", knowledgeBaseHTML);
}

function createArticleCard(article, isFeatured = false) {
  return `
    <div class="glass-card article-card ${isFeatured ? 'featured' : ''}" data-article-id="${article._id}">
      ${isFeatured ? '<div class="featured-badge">Featured</div>' : ''}
      
      <div class="article-meta">
        <span class="article-category">${article.category}</span>
        <span class="article-difficulty">${article.difficulty}</span>
      </div>
      
      <h4 class="article-title">${article.title}</h4>
      <p class="article-excerpt">${article.excerpt}</p>
      
      <div class="article-details">
        <div class="article-stats">
          <span class="read-time">📖 ${article.readTime} min read</span>
          <span class="views">👁️ ${article.views} views</span>
        </div>
        
        <div class="article-author">
          <span>By ${article.author}</span>
        </div>
      </div>
      
      <div class="article-tags">
        ${article.tags.map(tag => `<span class="tag">#${tag}</span>`).join("")}
      </div>
      
      <div class="article-actions">
        <button class="btn btn-primary" onclick="readArticle('${article._id}')">
          Read Article
        </button>
        <button class="btn btn-outline" onclick="bookmarkArticle('${article._id}')">
          📑 Save
        </button>
      </div>
    </div>
  `;
}

// This function is no longer needed as we load directly from the learning system.
// function displayDefaultKnowledgeBase() { ... }

async function loadResourceLibrary() {
    const resources = await learningSystem.loadResources();
    if (resources.length > 0) {
        displayResourceLibrary(resources);
    } else {
        safeSetHtml("#resourcesContent", "<p>No resources found.</p>");
    }
}

function displayResourceLibrary(resources) {
  const resourcesByCategory = resources.reduce((acc, resource) => {
    const category = resource.category || "general";
    if (!acc[category]) acc[category] = [];
    acc[category].push(resource);
    return acc;
  }, {});
  
  const resourcesHTML = `
    <div class="resources-grid">
      ${Object.entries(resourcesByCategory).map(([category, items]) => `
        <div class="resource-category">
          <h3 class="category-title">${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
          <div class="category-resources">
            ${items.map(resource => createResourceCard(resource)).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  `;
  
  safeSetHtml("#resourcesContent", resourcesHTML);
}

function createResourceCard(resource) {
  const typeIcon = {
    "download": "📥",
    "interactive": "🔗",
    "video": "🎥",
    "tool": "🛠️"
  };
  
  return `
    <div class="glass-card resource-card">
      <div class="resource-icon">${typeIcon[resource.type] || "📄"}</div>
      <h4 class="resource-title">${resource.title}</h4>
      <p class="resource-description">${resource.description}</p>
      
      <div class="resource-actions">
        ${resource.fileUrl ? `
          <button class="btn btn-primary" onclick="downloadResource('${resource.fileUrl}', '${resource.title}')">
            Download
          </button>
        ` : `
          <button class="btn btn-primary" onclick="accessResource('${resource.url || '#'}')">
            Access
          </button>
        `}
      </div>
    </div>
  `;
}

// This function is no longer needed.
// function displayDefaultResources() { ... }

async function loadVendorDirectory() {
    const vendors = await learningSystem.loadVendors();
    if (vendors.length > 0) {
        displayVendorDirectory(vendors);
    } else {
        safeSetHtml("#vendorsContent", "<p>No vendors listed.</p>");
    }
}

function displayVendorDirectory(vendors) {
  const vendorsHTML = `
    <div class="vendors-grid">
      ${vendors.map(vendor => createVendorCard(vendor)).join("")}
    </div>
    
    <div class="vendor-disclaimer">
      <p><strong>Disclaimer:</strong> These vendors are recommended by our community members. 
      Blue Ridge Bonsai Society does not endorse specific vendors but provides this list as a service to members.</p>
    </div>
  `;
  
  safeSetHtml("#vendorsContent", vendorsHTML);
}

function createVendorCard(vendor) {
  return `
    <div class="glass-card vendor-card">
      ${vendor.memberDiscount ? '<div class="member-discount-badge">Member Discount</div>' : ''}
      
      <div class="vendor-header">
        <h4 class="vendor-name">${vendor.name}</h4>
        <div class="vendor-rating">
          ${"⭐".repeat(Math.floor(vendor.rating))} ${vendor.rating}
        </div>
      </div>
      
      <p class="vendor-description">${vendor.description}</p>
      
      <div class="vendor-details">
        <div class="vendor-location">
          <span class="detail-icon">📍</span>
          <span>${vendor.location}</span>
        </div>
        
        ${vendor.phone ? `
          <div class="vendor-phone">
            <span class="detail-icon">📞</span>
            <a href="tel:${vendor.phone}">${vendor.phone}</a>
          </div>
        ` : ''}
        
        ${vendor.website ? `
          <div class="vendor-website">
            <span class="detail-icon">🌐</span>
            <a href="${vendor.website}" target="_blank" rel="noopener">Visit Website</a>
          </div>
        ` : ''}
      </div>
      
      <div class="vendor-specialties">
        <h5>Specialties:</h5>
        <div class="specialty-tags">
          ${vendor.specialties.map(specialty => `<span class="specialty-tag">${specialty}</span>`).join("")}
        </div>
      </div>
    </div>
  `;
}

// This function is no longer needed.
// function displayDefaultVendors() { ... }

// This function is now part of setupEventHandlers
// function setupSearch() { ... }

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

async function performSearch() {
    currentSearchQuery = safeGetValue("#searchInput");
    currentCategory = safeGetValue("#categoryFilter");
    currentDifficulty = safeGetValue("#difficultyFilter");

    const articles = await learningSystem.loadArticles({
        search: currentSearchQuery,
        category: currentCategory,
        difficulty: currentDifficulty
    });

    displayKnowledgeBaseArticles(articles);
}

// This function is no longer needed, as displayKnowledgeBaseArticles handles search results.
// function displaySearchResults(results, query) { ... }

function switchSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll(".learning-section");
  sections.forEach(section => {
    section.classList.remove("active");
  });
  
  // Remove active class from all tabs
  const tabs = document.querySelectorAll(".nav-tab");
  tabs.forEach(tab => {
    tab.classList.remove("active");
  });
  
  // Show selected section
  const targetSection = safeElement(`#${sectionId}`);
  if (targetSection) {
    targetSection.classList.add("active");
  }
  
  // Activate current tab
  const activeTab = document.querySelector(`[data-section="${sectionId}"]`);
  if (activeTab) {
    activeTab.classList.add("active");
  }
}

function setupEventHandlers() {
    safeOnClick(".nav-tab", (event) => {
        const section = event.target.dataset.section;
        switchSection(section);
    });

    safeOnClick("#searchBtn", performSearch);
    safeOnInput("#searchInput", debounce(performSearch, 500));
    safeOnChange("#categoryFilter", performSearch);
    safeOnChange("#difficultyFilter", performSearch);
}

function initializeAnimations() {
  // Add scroll-triggered animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);
  
  // Observe all cards
  setTimeout(() => {
    const cards = document.querySelectorAll(".glass-card");
    cards.forEach(card => observer.observe(card));
  }, 500);
}

// Global functions for interactions
if (IS_BROWSER) {
  window.openGuideSection = function(section) {
    mockWixAPIs.wixWindow.openLightbox(`guide-${section}`, { section });
  };

  window.readArticle = function(articleId) {
    mockWixAPIs.wixLocation.to(`/article?id=${articleId}`);
  };

  window.bookmarkArticle = function(articleId) {
    mockWixAPIs.wixWindow.openLightbox("bookmark-modal", { articleId });
  };

  window.downloadResource = function(fileUrl, title) {
    console.log(`Downloading: ${title} from ${fileUrl}`);
    // In a real environment, this would trigger the download
  };

  window.accessResource = function(url) {
    mockWixAPIs.wixLocation.to(url);
  };

  window.joinCommunity = function() {
    mockWixAPIs.wixLocation.to("/join-brbs");
  };

  window.clearSearch = function() {
    safeSetValue("#searchInput", "");
    safeSetValue("#categoryFilter", "all");
    safeSetValue("#difficultyFilter", "all");
    loadKnowledgeBase();
  };
}

// Add CSS for Learning Center styling
if (typeof window !== "undefined") {
  const learningCenterStyles = `
    <style id="learning-center-styles">
      /* Learning Center Layout */
      .learning-center-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
        font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .page-header {
        text-align: center;
        margin-bottom: 3rem;
      }
      
      .page-header h1 {
        color: #4A4A4A;
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0 0 1rem 0;
      }
      
      .page-subtitle {
        color: #6B8E6F;
        font-size: 1.1rem;
        margin: 0;
      }
      
      /* Navigation Tabs */
      .learning-nav {
        display: flex;
        justify-content: center;
        margin-bottom: 2rem;
        background: rgba(254, 255, 254, 0.9);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 0.5rem;
        box-shadow: 0 4px 16px rgba(107, 142, 111, 0.1);
      }
      
      .nav-tab {
        padding: 1rem 2rem;
        border: none;
        background: transparent;
        color: #6B8E6F;
        cursor: pointer;
        border-radius: 8px;
        font-weight: 600;
        transition: all 0.3s ease;
        font-family: inherit;
      }
      
      .nav-tab.active,
      .nav-tab:hover {
        background: #6B8E6F;
        color: #FEFFFE;
        transform: translateY(-2px);
      }
      
      /* Search and Filters */
      .search-filters-container {
        background: rgba(254, 255, 254, 0.9);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 4px 16px rgba(107, 142, 111, 0.1);
      }
      
      .search-bar {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      
      .search-input {
        flex: 1;
        padding: 1rem;
        border: 1px solid #DDE4EA;
        border-radius: 8px;
        background: #FEFFFE;
        color: #4A4A4A;
        font-family: inherit;
        font-size: 1rem;
        transition: border-color 0.2s ease;
      }
      
      .search-input:focus {
        outline: none;
        border-color: #6B8E6F;
        box-shadow: 0 0 0 3px rgba(107, 142, 111, 0.1);
      }
      
      .search-btn {
        padding: 1rem 1.5rem;
        background: #6B8E6F;
        color: #FEFFFE;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1.2rem;
        transition: background-color 0.2s ease;
      }
      
      .search-btn:hover {
        background: #5A7A5E;
      }
      
      .filters {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
      
      .filter-select {
        padding: 0.75rem;
        border: 1px solid #DDE4EA;
        border-radius: 8px;
        background: #FEFFFE;
        color: #4A4A4A;
        font-family: inherit;
        cursor: pointer;
        transition: border-color 0.2s ease;
      }
      
      .filter-select:focus {
        outline: none;
        border-color: #6B8E6F;
        box-shadow: 0 0 0 3px rgba(107, 142, 111, 0.1);
      }
      
      /* Section Management */
      .learning-section {
        display: none;
      }
      
      .learning-section.active {
        display: block;
      }
      
      .section-header {
        text-align: center;
        margin-bottom: 3rem;
      }
      
      .section-header h2 {
        color: #4A4A4A;
        font-size: 2rem;
        margin: 0 0 1rem 0;
      }
      
      .section-header p {
        color: #6B8E6F;
        font-size: 1.1rem;
        margin: 0;
      }
      
      /* Beginner's Guide Styles */
      .beginners-guide-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
        margin: 2rem 0;
      }
      
      .guide-card {
        text-align: center;
        position: relative;
        transition: transform 0.3s ease;
      }
      
      .guide-card:hover {
        transform: translateY(-5px);
      }
      
      .card-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }
      
      .guide-card h3 {
        color: #4A4A4A;
        margin-bottom: 1rem;
      }
      
      .guide-topics {
        list-style: none;
        padding: 0;
        margin: 1rem 0;
        text-align: left;
      }
      
      .guide-topics li {
        padding: 0.25rem 0;
        color: #6B8E6F;
        position: relative;
        padding-left: 1rem;
      }
      
      .guide-topics li:before {
        content: "✓";
        position: absolute;
        left: 0;
        color: #6B8E6F;
        font-weight: bold;
      }
      
      .quick-reference {
        background: rgba(254, 255, 254, 0.9);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 2rem;
        margin: 3rem 0;
        box-shadow: 0 4px 16px rgba(107, 142, 111, 0.1);
      }
      
      .reference-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }
      
      .reference-item {
        background: #F8F9FA;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #6B8E6F;
      }
      
      .reference-item h4 {
        color: #4A4A4A;
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
      }
      
      .reference-item p {
        color: #6B8E6F;
        margin: 0;
        font-size: 0.9rem;
      }
      
      /* Knowledge Base Styles */
      .featured-articles {
        margin-bottom: 3rem;
      }
      
      .featured-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 2rem;
        margin: 1rem 0;
      }
      
      .articles-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
        margin: 1rem 0;
      }
      
      .article-card {
        position: relative;
        transition: transform 0.3s ease;
      }
      
      .article-card:hover {
        transform: translateY(-5px);
      }
      
      .article-card.featured {
        border: 2px solid #FFD700;
      }
      
      .featured-badge {
        position: absolute;
        top: -10px;
        right: -10px;
        background: linear-gradient(45deg, #FFD700, #FFA500);
        color: #333;
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
      }
      
      .article-meta {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      
      .article-category,
      .article-difficulty {
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: capitalize;
      }
      
      .article-category {
        background: #6B8E6F;
        color: white;
      }
      
      .article-difficulty {
        background: #DDE4EA;
        color: #4A4A4A;
      }
      
      .article-title {
        color: #4A4A4A;
        margin-bottom: 0.5rem;
        font-size: 1.2rem;
      }
      
      .article-excerpt {
        color: #6B8E6F;
        line-height: 1.6;
        margin-bottom: 1rem;
      }
      
      .article-details {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 1rem 0;
        font-size: 0.9rem;
        color: #8B7355;
      }
      
      .article-stats {
        display: flex;
        gap: 1rem;
      }
      
      .article-tags {
        margin: 1rem 0;
      }
      
      .tag {
        display: inline-block;
        background: #F8F9FA;
        color: #6B8E6F;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.8rem;
        margin: 0.25rem 0.25rem 0.25rem 0;
      }
      
      .article-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
      }
      
      .article-actions .btn {
        flex: 1;
      }
      
      /* Button Styles */
      .btn {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        text-decoration: none;
        display: inline-block;
        transition: all 0.3s ease;
        border: none;
        font-family: inherit;
        text-align: center;
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
      
      /* Resource Library Styles */
      .resources-grid {
        display: grid;
        gap: 3rem;
      }
      
      .resource-category {
        margin-bottom: 2rem;
      }
      
      .category-title {
        color: #4A4A4A;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #6B8E6F;
      }
      
      .category-resources {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      }
      
      .resource-card {
        text-align: center;
        transition: transform 0.3s ease;
      }
      
      .resource-card:hover {
        transform: translateY(-5px);
      }
      
      .resource-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }
      
      .resource-title {
        color: #4A4A4A;
        margin-bottom: 0.5rem;
      }
      
      .resource-description {
        color: #6B8E6F;
        line-height: 1.6;
        margin-bottom: 1rem;
      }
      
      /* Vendor Directory Styles */
      .vendors-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 2rem;
        margin: 2rem 0;
      }
      
      .vendor-card {
        position: relative;
        transition: transform 0.3s ease;
      }
      
      .vendor-card:hover {
        transform: translateY(-5px);
      }
      
      .member-discount-badge {
        position: absolute;
        top: -10px;
        right: -10px;
        background: linear-gradient(45deg, #28a745, #20c997);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
      }
      
      .vendor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      
      .vendor-name {
        color: #4A4A4A;
        margin: 0;
      }
      
      .vendor-rating {
        color: #FFD700;
        font-weight: 600;
      }
      
      .vendor-description {
        color: #6B8E6F;
        line-height: 1.6;
        margin-bottom: 1rem;
      }
      
      .vendor-details {
        margin: 1rem 0;
      }
      
      .vendor-details > div {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0.5rem 0;
        font-size: 0.9rem;
      }
      
      .detail-icon {
        width: 20px;
        text-align: center;
      }
      
      .vendor-details a {
        color: #6B8E6F;
        text-decoration: none;
      }
      
      .vendor-details a:hover {
        text-decoration: underline;
      }
      
      .vendor-specialties h5 {
        color: #4A4A4A;
        margin: 1rem 0 0.5rem 0;
      }
      
      .specialty-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      
      .specialty-tag {
        background: #6B8E6F;
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
      }
      
      .vendor-disclaimer {
        background: #F8F9FA;
        padding: 1rem;
        border-radius: 8px;
        margin-top: 2rem;
        border-left: 4px solid #6B8E6F;
        font-size: 0.9rem;
        color: #6B8E6F;
      }
      
      /* Search Results */
      .search-results h3 {
        color: #4A4A4A;
        margin-bottom: 0.5rem;
      }
      
      .results-count {
        color: #6B8E6F;
        margin-bottom: 2rem;
        font-style: italic;
      }
      
      .search-results-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
      }
      
      .no-results {
        text-align: center;
        padding: 3rem 2rem;
        color: #6B8E6F;
      }
      
      .no-results-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }
      
      .no-results h4 {
        color: #4A4A4A;
        margin-bottom: 0.5rem;
      }
      
      .no-results p {
        margin-bottom: 2rem;
      }
      
      /* Animations */
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
      
      /* Responsive Design */
      @media (max-width: 768px) {
        .learning-nav {
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .nav-tab {
          padding: 0.75rem 1rem;
        }
        
        .search-bar {
          flex-direction: column;
        }
        
        .filters {
          flex-direction: column;
        }
        
        .beginners-guide-grid,
        .articles-grid,
        .vendors-grid {
          grid-template-columns: 1fr;
        }
        
        .featured-grid {
          grid-template-columns: 1fr;
        }
        
        .reference-grid {
          grid-template-columns: 1fr;
        }
        
        .article-details {
          flex-direction: column;
          gap: 0.5rem;
          align-items: flex-start;
        }
        
        .vendor-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }
        
        .specialty-tags {
          justify-content: center;
        }
      }
    </style>
  `;
  
  if (!document.getElementById("learning-center-styles")) {
    document.head.insertAdjacentHTML("beforeend", learningCenterStyles);
  }
}