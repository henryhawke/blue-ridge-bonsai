// Blue Ridge Bonsai Society - Blog Page
// This page displays articles in a traditional blog format.

import { LearningSystem } from 'public/js/learning-system.js';
// import wixLocation from 'wix-location';

// Mock Velo APIs
const wixLocation = { to: (url) => console.log(`Navigating to: ${url}`) };

let learningSystem;

$w.onReady(function () {
    console.log("🚀 Initializing Blog Page");
    initializeBlogPage();
});

async function initializeBlogPage() {
    learningSystem = new LearningSystem();
    createPageStructure();
    await displayBlogPosts();
    console.log("✅ Blog Page initialization complete.");
}

function createPageStructure() {
    const pageHTML = `
        <div id="blogPageContainer" class="blog-page-container">
            <div class="page-header text-center">
                <h1>Our Blog</h1>
                <p>News, insights, and stories from the Blue Ridge Bonsai Society.</p>
            </div>
            <div id="postsContainer" class="blog-posts-container">
                <!-- Blog posts will be rendered here -->
            </div>
        </div>
    `;
    $w('#mainContainer').html(pageHTML);
}

async function displayBlogPosts() {
    // We can reuse the loadArticles method from our LearningSystem
    const posts = await learningSystem.loadArticles();
    const container = $w('#postsContainer');

    if (!posts || posts.length === 0) {
        container.html = "<p>No blog posts have been published yet.</p>";
        return;
    }

    const postsHTML = posts.map(post => `
        <div class="blog-post-card glass-card" data-article-id="${post._id}">
            <div class="post-header">
                <h2 class="post-title">${post.title}</h2>
                <p class="post-meta">By ${post.author} on ${new Date(post.publishDate).toLocaleDateString()}</p>
            </div>
            <div class="post-excerpt">
                <p>${post.content.substring(0, 300)}...</p>
            </div>
            <div class="post-footer">
                <a href="/article?id=${post._id}" class="btn btn-primary">Read More</a>
                <div class="post-tags">
                    ${post.tags.map(tag => `<span>#${tag}</span>`).join(" ")}
                </div>
            </div>
        </div>
    `).join("");

    container.html = postsHTML;
}
