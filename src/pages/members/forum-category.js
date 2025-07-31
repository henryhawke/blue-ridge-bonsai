// Blue Ridge Bonsai Society - Forum Category Page
// This page lists all the posts within a specific forum category.

import { ForumSystem } from 'public/js/forum-system.js';
// import wixLocation from 'wix-location';

// Mock Velo APIs
const wixLocation = {
    to: (url) => console.log(`Navigating to: ${url}`),
    query: { id: "fcat001" } // Mocking a category ID from the URL
};

let forumSystem;
let currentCategoryId;

$w.onReady(function () {
    console.log("🚀 Initializing Forum Category Page");
    currentCategoryId = wixLocation.query.id;
    if (currentCategoryId) {
        initializeCategoryPage();
    } else {
        wixLocation.to("/members/forums");
    }
});

async function initializeCategoryPage() {
    forumSystem = new ForumSystem();
    const category = (await forumSystem.getForumCategories()).find(c => c._id === currentCategoryId);

    createPageStructure(category);
    await displayPosts();
    setupEventHandlers();
    console.log("✅ Forum Category Page initialization complete.");
}

function createPageStructure(category) {
    const pageHTML = `
        <div id="categoryPageContainer" class="category-page-container">
            <div class="page-header">
                <a href="/members/forums">&larr; Back to Forums</a>
                <h1>${category ? category.name : 'Forum Category'}</h1>
                <p>${category ? category.description : ''}</p>
                <button id="newPostButton" class="btn btn-primary">Create New Post</button>
            </div>
            <div id="postsContainer" class="posts-container">
                <!-- Forum posts will be rendered here -->
            </div>
        </div>
    `;
    $w('#mainContainer').html(pageHTML);
}

async function displayPosts() {
    const posts = await forumSystem.getPostsForCategory(currentCategoryId);
    const container = $w('#postsContainer');

    if (!posts || posts.length === 0) {
        container.html = "<p>No posts in this category yet. Be the first to create one!</p>";
        return;
    }

    const postsHTML = posts.map(post => `
        <div class="post-card glass-card" data-post-id="${post._id}" onclick="wixLocation.to('/members/forum-post?id=${post._id}')">
            <div class="post-info">
                <h3 class="post-title">${post.pinned ? '📌 ' : ''}${post.title}</h3>
                <p class="post-meta">By ${post.authorName} on ${new Date(post.postDate).toLocaleDateString()}</p>
            </div>
            <div class="post-stats">
                <div class="stat-item">
                    <strong>${post.replies.length}</strong>
                    <span>Replies</span>
                </div>
                <div class="stat-item">
                    <strong>${post.viewCount}</strong>
                    <span>Views</span>
                </div>
            </div>
            <div class="post-latest-reply">
                ${post.replies.length > 0 ? `
                    <p><strong>Last Reply:</strong> by ${post.replies[post.replies.length - 1].authorName}</p>
                    <p class="latest-reply-meta">${new Date(post.replies[post.replies.length - 1].postDate).toLocaleString()}</p>
                ` : `
                    <p>No replies yet.</p>
                `}
            </div>
        </div>
    `).join("");

    container.html = `<div class="posts-list">${postsHTML}</div>`;
}

function setupEventHandlers() {
    $w('#newPostButton').onClick(() => {
        // In a real app, this would likely open a lightbox or navigate to a new page
        // For now, we'll just log it.
        console.log("Create new post button clicked for category:", currentCategoryId);
        // wixLocation.to(`/members/new-post?categoryId=${currentCategoryId}`);
    });
}
