// Blue Ridge Bonsai Society - Discussion Forums Main Page
// This page lists all the available forum categories.

import { ForumSystem } from 'public/js/forum-system.js';
import { MembershipSystem } from 'public/js/membership-system.js';
// import wixLocation from 'wix-location'; // In Velo, use this for navigation

// Mock Velo APIs
const wixLocation = { to: (url) => console.log(`Navigating to: ${url}`) };

let forumSystem;
let membershipSystem;

$w.onReady(function () {
    console.log("🚀 Initializing Forums Page");
    initializeForumsPage();
});

async function initializeForumsPage() {
    forumSystem = new ForumSystem();
    membershipSystem = new MembershipSystem();

    // In a real site, you'd have a router check for authentication.
    // We'll simulate it here.
    const member = await membershipSystem.getCurrentMemberProfile();
    if (!member) {
        $w('#mainContainer').html = "<h1>Access Denied</h1><p>You must be a logged-in member to view the forums.</p>";
        // wixLocation.to("/login");
        return;
    }

    createPageStructure();
    await displayForumCategories();
    console.log("✅ Forums Page initialization complete.");
}

function createPageStructure() {
    const pageHTML = `
        <div id="forumsPageContainer" class="forums-page-container">
            <div class="page-header text-center">
                <h1>Discussion Forums</h1>
                <p>Connect with fellow members, ask questions, and share your passion.</p>
            </div>
            <div id="categoriesContainer" class="categories-container">
                <!-- Forum category list will be rendered here -->
            </div>
        </div>
    `;
    $w('#mainContainer').html(pageHTML);
}

async function displayForumCategories() {
    const categories = await forumSystem.getForumCategories();
    const container = $w('#categoriesContainer');

    if (!categories || categories.length === 0) {
        container.html = "<p>No forum categories have been set up yet.</p>";
        return;
    }

    const categoriesHTML = categories.map(cat => `
        <div class="category-card glass-card" data-category-id="${cat._id}" onclick="wixLocation.to('/members/forum-category?id=${cat._id}')">
            <div class="category-info">
                <h3 class="category-name">${cat.name}</h3>
                <p class="category-description">${cat.description}</p>
            </div>
            <div class="category-stats">
                <div class="stat-item">
                    <strong>${cat.postCount}</strong>
                    <span>Posts</span>
                </div>
            </div>
            <div class="category-latest-post">
                ${cat.latestPost ? `
                    <p><strong>Latest:</strong> ${cat.latestPost.title}</p>
                    <p class="latest-post-meta">by ${cat.latestPost.authorName} on ${new Date(cat.latestPost.timestamp).toLocaleDateString()}</p>
                ` : `
                    <p>No posts yet.</p>
                `}
            </div>
        </div>
    `).join("");

    container.html = categoriesHTML;
}
