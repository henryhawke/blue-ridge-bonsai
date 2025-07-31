// Blue Ridge Bonsai Society - Forum Post Page
// This page displays a single forum post and its replies.

import { ForumSystem } from 'public/js/forum-system.js';
// import wixLocation from 'wix-location';

// Mock Velo APIs
const wixLocation = {
    to: (url) => console.log(`Navigating to: ${url}`),
    query: { id: "fpost002" } // Mocking a post ID from the URL
};

let forumSystem;
let currentPostId;
let currentPost;

$w.onReady(function () {
    console.log("🚀 Initializing Forum Post Page");
    currentPostId = wixLocation.query.id;
    if (currentPostId) {
        initializePostPage();
    } else {
        wixLocation.to("/members/forums");
    }
});

async function initializePostPage() {
    forumSystem = new ForumSystem();
    currentPost = await forumSystem.getPostById(currentPostId);

    if (!currentPost) {
        $w('#mainContainer').html = "<h1>Post not found</h1>";
        return;
    }

    const category = (await forumSystem.getForumCategories()).find(c => c._id === currentPost.categoryId);

    createPageStructure(category);
    displayPostContent();
    displayReplies();
    setupEventHandlers();
    console.log("✅ Forum Post Page initialization complete.");
}

function createPageStructure(category) {
    const pageHTML = `
        <div id="postPageContainer" class="post-page-container">
            <div class="page-header">
                <a href="/members/forum-category?id=${currentPost.categoryId}">&larr; Back to ${category ? category.name : 'Category'}</a>
                <h1>${currentPost.title}</h1>
                <p class="post-meta">Posted by ${currentPost.authorName} on ${new Date(currentPost.postDate).toLocaleString()}</p>
            </div>
            <div id="postContentContainer" class="post-content-container glass-card">
                <!-- Main post content will be rendered here -->
            </div>
            <div id="repliesContainer" class="replies-container">
                <!-- Replies will be rendered here -->
            </div>
            <div id="replyFormContainer" class="reply-form-container glass-card">
                <h3>Leave a Reply</h3>
                <textarea id="replyContent" placeholder="Write your reply..."></textarea>
                <button id="submitReplyButton" class="btn btn-primary">Submit Reply</button>
                <div id="replyFeedback" style="display:none;"></div>
            </div>
        </div>
    `;
    $w('#mainContainer').html(pageHTML);
}

function displayPostContent() {
    $w('#postContentContainer').html(`<p>${currentPost.content}</p>`);
}

function displayReplies() {
    const container = $w('#repliesContainer');
    if (!currentPost.replies || currentPost.replies.length === 0) {
        container.html = "<h3>No replies yet.</h3>";
        return;
    }

    const repliesHTML = currentPost.replies.map(reply => `
        <div class="reply-card glass-card">
            <div class="reply-meta">
                <strong>${reply.authorName}</strong> replied on ${new Date(reply.postDate).toLocaleString()}
            </div>
            <div class="reply-content">
                <p>${reply.content}</p>
            </div>
        </div>
    `).join("");

    container.html = `<h2>Replies</h2><div class="replies-list">${repliesHTML}</div>`;
}

function setupEventHandlers() {
    $w('#submitReplyButton').onClick(async () => {
        const replyContent = $w('#replyContent').value;
        const feedback = $w('#replyFeedback');

        if (!replyContent || replyContent.trim() === "") {
            feedback.text = "Reply content cannot be empty.";
            feedback.show();
            return;
        }

        try {
            await forumSystem.addReply(currentPostId, replyContent);
            $w('#replyContent').value = "";
            feedback.hide();
            // Refresh replies
            currentPost = await forumSystem.getPostById(currentPostId);
            displayReplies();
        } catch (error) {
            feedback.text = `Error: ${error.message}`;
            feedback.show();
        }
    });
}
