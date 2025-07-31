// Blue Ridge Bonsai Society - Search Results Page
// This page displays results from a site-wide search.

import { SearchSystem } from 'public/js/search-system.js';
// import wixLocation from 'wix-location';

// Mock Velo APIs
const wixLocation = {
    to: (url) => console.log(`Navigating to: ${url}`),
    query: { q: "beginner" } // Mocking a search query from the URL
};

let searchSystem;
let currentQuery;

$w.onReady(function () {
    console.log("🚀 Initializing Search Results Page");
    currentQuery = wixLocation.query.q;
    initializeSearchResultsPage();
});

async function initializeSearchResultsPage() {
    searchSystem = new SearchSystem();
    createPageStructure();

    if (currentQuery) {
        $w('#searchInput').value = currentQuery;
        await performSearch();
    } else {
        $w('#resultsContainer').html("<p>Please enter a search term in the box above.</p>");
    }

    setupEventHandlers();
    console.log("✅ Search Results Page initialization complete.");
}

function createPageStructure() {
    const pageHTML = `
        <div id="searchPageContainer" class="search-page-container">
            <div class="page-header text-center">
                <h1>Search Results</h1>
                <div class="search-bar">
                    <input type="text" id="searchInput" placeholder="Search the site..." />
                    <button id="searchButton" class="btn btn-primary">Search</button>
                </div>
            </div>
            <div id="resultsSummary"></div>
            <div id="resultsContainer" class="results-container">
                <!-- Search results will be rendered here -->
            </div>
        </div>
    `;
    $w('#mainContainer').html(pageHTML);
}

async function performSearch() {
    currentQuery = $w('#searchInput').value;
    if (!currentQuery || currentQuery.trim() === "") {
        $w('#resultsContainer').html("<p>Please enter a search term.</p>");
        return;
    }

    const results = await searchSystem.searchAll(currentQuery);
    displayResults(results);
}

function displayResults(results) {
    const total = results.events.length + results.articles.length + results.resources.length;
    $w('#resultsSummary').html(`<h3>Found ${total} result(s) for "${currentQuery}"</h3>`);

    let resultsHTML = '';

    if (results.articles.length > 0) {
        resultsHTML += '<h2>Articles</h2>';
        resultsHTML += results.articles.map(item => `
            <div class="result-card article-result" onclick="wixLocation.to('/article?id=${item._id}')">
                <h4>${item.title}</h4>
                <p>${item.content.substring(0, 150)}...</p>
                <span class="result-type">Article</span>
            </div>
        `).join('');
    }

    if (results.events.length > 0) {
        resultsHTML += '<h2>Events</h2>';
        resultsHTML += results.events.map(item => `
            <div class="result-card event-result" onclick="wixLocation.to('/event-details?eventId=${item._id}')">
                <h4>${item.title}</h4>
                <p>${item.description.substring(0, 150)}...</p>
                <span class="result-type">Event</span>
            </div>
        `).join('');
    }

    if (results.resources.length > 0) {
        resultsHTML += '<h2>Resources</h2>';
        resultsHTML += results.resources.map(item => `
            <div class="result-card resource-result" onclick="wixLocation.to('${item.url}')">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <span class="result-type">Resource</span>
            </div>
        `).join('');
    }

    if (total === 0) {
        resultsHTML = '<p>No results found for your query.</p>';
    }

    $w('#resultsContainer').html(resultsHTML);
}

function setupEventHandlers() {
    $w('#searchButton').onClick(performSearch);
    $w('#searchInput').onKeyPress((event) => {
        if (event.key === "Enter") {
            performSearch();
        }
    });
}
