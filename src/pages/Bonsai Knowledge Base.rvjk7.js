// Blue Ridge Bonsai Society - Bonsai Knowledge Base Page
// This page provides a searchable and filterable repository of bonsai articles.

import { LearningSystem } from 'public/js/learning-system.js';

let learningSystem;
let currentFilters = {
    category: 'all',
    search: ''
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
    $w('#mainContainer').html = pageHTML;
}

/**
 * Populates the category filter dropdown with unique categories from the articles.
 */
async function populateFilters() {
    const categories = await learningSystem.getArticleCategories();
    const categoryFilter = $w('#kbCategoryFilter');

    const options = categories.map(cat => ({ label: cat, value: cat }));
    categoryFilter.options = [
        { label: "All Categories", value: "all" },
        ...options
    ];
}

/**
 * Loads articles based on current filters and displays them.
 */
async function loadAndDisplayArticles() {
    const articles = await learningSystem.loadArticles(currentFilters);
    const articlesContainer = $w('#articlesContainer');
    const noArticlesMessage = $w('#noArticlesMessage');
    const articleCount = $w('#articleCount');

    articleCount.text = `Showing ${articles.length} article(s).`;

    if (articles.length === 0) {
        articlesContainer.html = '';
        noArticlesMessage.show();
        return;
    }

    noArticlesMessage.hide();

    const articlesHTML = articles.map(article => `
        <div class="article-card glass-card" data-article-id="${article._id}">
            ${article.featured ? '<div class="featured-badge">Featured</div>' : ''}
            <div class="article-card-content">
                <p class="article-category">${article.category}</p>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.content.substring(0, 150)}...</p>
                <div class="article-meta">
                    <span>By ${article.author}</span>
                    <span>${new Date(article.publishDate).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="article-card-footer">
                <a href="/article?id=${article._id}" class="btn btn-outline">Read More</a>
            </div>
        </div>
    `).join("");

    articlesContainer.html = articlesHTML;
}

/**
 * Sets up event handlers for the search and filter controls.
 */
function setupEventHandlers() {
    let searchTimeout;

    $w('#kbSearchInput').onInput(() => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentFilters.search = $w('#kbSearchInput').value;
            loadAndDisplayArticles();
        }, 300); // Debounce search input
    });

    $w('#kbCategoryFilter').onChange(() => {
        currentFilters.category = $w('#kbCategoryFilter').value;
        loadAndDisplayArticles();
    });
}
