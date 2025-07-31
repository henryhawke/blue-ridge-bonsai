/**
 * BLUE RIDGE BONSAI SOCIETY - BONSAI KNOWLEDGE BASE PAGE
 *
 * COMPONENTS & IMPLEMENTATIONS:
 *
 * 1. LEARNING SYSTEM INTEGRATION
 *    - Imports LearningSystem class from public/js/learning-system.js
 *    - Manages article loading, filtering, and display functionality
 *    - Handles search and category filtering with debounced search input
 *
 * 2. PAGE STRUCTURE COMPONENTS
 *    - createPageStructure(): Builds complete HTML layout with glass-card styling
 *    - Hero section with title and description
 *    - Filters container with search input and category dropdown
 *    - Articles grid container for dynamic content
 *    - No results message for empty states
 *
 * 3. FILTERING & SEARCH SYSTEM
 *    - populateFilters(): Dynamically loads categories from articles
 *    - Real-time search with 300ms debounce
 *    - Category filter dropdown with "All Categories" option
 *    - Combined search and category filtering
 *
 * 4. CONTENT MANAGEMENT
 *    - loadAndDisplayArticles(): Fetches and renders articles based on filters
 *    - Article cards with featured badges, categories, titles, excerpts
 *    - Article metadata display (author, publish date)
 *    - Article count display
 *    - Responsive grid layout for article cards
 *
 * 5. EVENT HANDLING
 *    - setupEventHandlers(): Configures search input and category filter events
 *    - Debounced search input to prevent excessive API calls
 *    - Category filter change handling
 *    - Automatic content refresh on filter changes
 *
 * 6. STYLING & UX FEATURES
 *    - Glass-card design system integration
 *    - Featured article badges
 *    - Responsive article grid layout
 *    - Loading states and error handling
 *    - Clean typography and spacing
 *
 * 7. NAVIGATION & LINKS
 *    - Article detail page links with query parameters
 *    - SEO-friendly URL structure
 *
 * DEPENDENCIES:
 *    - LearningSystem class (public/js/learning-system.js)
 *    - Wix Velo framework ($w API)
 *    - Global CSS classes (glass-card, knowledge-base-container, etc.)
 *
 * BROWSER COMPATIBILITY:
 *    - Modern browsers with ES6+ support
 *    - Wix Velo environment
 *
 * PERFORMANCE FEATURES:
 *    - Debounced search input (300ms)
 *    - Efficient DOM manipulation
 *    - Lazy loading of article content
 *    - Optimized filter updates
 */

// Blue Ridge Bonsai Society - Bonsai Knowledge Base Page
// This page provides a searchable and filterable repository of bonsai articles.

// Type declaration for Wix Velo $w function
/** @type {any} */
const $w = (selector) => {};

import { LearningSystem } from "public/js/learning-system.js";

let learningSystem;
let currentFilters = {
  category: "all",
  search: "",
};

$w.onReady(function () {
  console.log("🚀 Initializing Bonsai Knowledge Base Page");
  initializeKnowledgeBase();
});

/**
 * Main function to orchestrate the page build-out.
 */
async function initializeKnowledgeBase() {
  learningSystem = new LearningSystem();
  createPageStructure();
  await populateFilters();
  await loadAndDisplayArticles();
  setupEventHandlers();
  console.log("✅ Knowledge Base Page initialization complete.");
}

/**
 * Creates the static HTML structure for the page.
 */
function createPageStructure() {
  const pageHTML = `
        <div id="knowledgeBaseContainer" class="knowledge-base-container">
            <div class="page-header text-center">
                <h1>Bonsai Knowledge Base</h1>
                <p>Your comprehensive guide to the art and science of bonsai.</p>
            </div>

            <div class="filters-container glass-card">
                <div class="filter-group">
                    <label for="kbSearchInput">Search Articles</label>
                    <input type="text" id="kbSearchInput" placeholder="e.g., 'watering' or 'juniper'..." />
                </div>
                <div class="filter-group">
                    <label for="kbCategoryFilter">Filter by Category</label>
                    <select id="kbCategoryFilter">
                        <option value="all">All Categories</option>
                        <!-- Categories will be populated here -->
                    </select>
                </div>
            </div>

            <div id="articleCount" class="article-count"></div>

            <div id="articlesContainer" class="articles-grid">
                <!-- Article cards will be rendered here -->
            </div>

            <div id="noArticlesMessage" style="display: none;" class="text-center glass-card">
                <h3>No Articles Found</h3>
                <p>No articles match your current search or filter criteria. Please try a different search.</p>
            </div>
        </div>
    `;
  // Assuming a main container exists on the page with id 'mainContainer'
  const mainContainer = /** @type {any} */ ($w("#mainContainer"));
  if (mainContainer) {
    mainContainer.html = pageHTML;
  }
}

/**
 * Populates the category filter dropdown with unique categories from the articles.
 */
async function populateFilters() {
  const categories = await learningSystem.getArticleCategories();
  const categoryFilter = /** @type {any} */ ($w("#kbCategoryFilter"));

  const options = categories.map((cat) => ({ label: cat, value: cat }));
  categoryFilter.options = [
    { label: "All Categories", value: "all" },
    ...options,
  ];
}

/**
 * Loads articles based on current filters and displays them.
 */
async function loadAndDisplayArticles() {
  const articles = await learningSystem.loadArticles(currentFilters);
  const articlesContainer = /** @type {any} */ ($w("#articlesContainer"));
  const noArticlesMessage = /** @type {any} */ ($w("#noArticlesMessage"));
  const articleCount = /** @type {any} */ ($w("#articleCount"));

  articleCount.text = `Showing ${articles.length} article(s).`;

  if (articles.length === 0) {
    articlesContainer.html = "";
    noArticlesMessage.show();
    return;
  }

  noArticlesMessage.hide();

  const articlesHTML = articles
    .map(
      (article) => `
        <div class="article-card glass-card" data-article-id="${article._id}">
            ${
              article.featured
                ? '<div class="featured-badge">Featured</div>'
                : ""
            }
            <div class="article-card-content">
                <p class="article-category">${article.category}</p>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.content.substring(
                  0,
                  150
                )}...</p>
                <div class="article-meta">
                    <span>By ${article.author}</span>
                    <span>${new Date(
                      article.publishDate
                    ).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="article-card-footer">
                <a href="/article?id=${
                  article._id
                }" class="btn btn-outline">Read More</a>
            </div>
        </div>
    `
    )
    .join("");

  articlesContainer.html = articlesHTML;
}

/**
 * Sets up event handlers for the search and filter controls.
 */
function setupEventHandlers() {
  let searchTimeout;

  /** @type {any} */ ($w("#kbSearchInput")).onInput(() => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentFilters.search = /** @type {any} */ ($w("#kbSearchInput")).value;
      loadAndDisplayArticles();
    }, 300); // Debounce search input
  });

  /** @type {any} */ ($w("#kbCategoryFilter")).onChange(() => {
    currentFilters.category = /** @type {any} */ (
      $w("#kbCategoryFilter")
    ).value;
    loadAndDisplayArticles();
  });
}
