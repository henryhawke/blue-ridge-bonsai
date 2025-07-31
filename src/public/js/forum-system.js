// Blue Ridge Bonsai Society - Forum System
// This file contains the core logic for managing the member discussion forums.

// Mock Data (simulating Wix Collections)
import forumCategoriesData from 'backend/data/ForumCategories.json';
import forumPostsData from 'backend/data/ForumPosts.json';
import membersData from 'backend/data/Members.json';

// Mock the current member for development purposes
const MOCK_CURRENT_MEMBER_ID = 'mem001';

/**
 * A class to manage all forum-related functionality.
 */
export class ForumSystem {
  constructor() {
    this.categories = forumCategoriesData;
    this.posts = forumPostsData;
    this.members = membersData;
  }

  /**
   * Loads all forum categories with their stats.
   * @returns {Promise<Array>}
   */
  async getForumCategories() {
    // In a real system, you might aggregate post counts here.
    // For now, our mock data has it pre-calculated.
    return this.categories;
  }

  /**
   * Loads all posts for a specific category.
   * @param {string} categoryId - The ID of the category.
   * @returns {Promise<Array>}
   */
  async getPostsForCategory(categoryId) {
    const posts = this.posts.filter(p => p.categoryId === categoryId);
    // Sort by pinned status, then by latest reply or post date
    posts.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        const lastReplyA = a.replies.length > 0 ? a.replies[a.replies.length - 1].postDate : a.postDate;
        const lastReplyB = b.replies.length > 0 ? b.replies[b.replies.length - 1].postDate : b.postDate;
        return new Date(lastReplyB) - new Date(lastReplyA);
    });
    return posts;
  }

  /**
   * Gets a single post and its replies by its ID.
   * @param {string} postId - The ID of the post.
   * @returns {Promise<object|null>}
   */
  async getPostById(postId) {
    return this.posts.find(p => p._id === postId) || null;
  }

  /**
   * Creates a new post.
   * @param {string} categoryId
   * @param {string} title
   * @param {string} content
   * @returns {Promise<object>}
   */
  async createPost(categoryId, title, content) {
    if (!MOCK_CURRENT_MEMBER_ID) throw new Error("Must be logged in to post.");

    const currentUser = this.members.find(m => m._id === MOCK_CURRENT_MEMBER_ID);

    const newPost = {
      _id: `fpost${new Date().getTime()}`,
      categoryId,
      title,
      content,
      authorId: currentUser._id,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
      postDate: new Date().toISOString(),
      replies: [],
      tags: [],
      pinned: false,
      viewCount: 0
    };

    this.posts.push(newPost);
    return newPost;
  }

  /**
   * Adds a reply to a post.
   * @param {string} postId
   * @param {string} content
   * @returns {Promise<object>}
   */
  async addReply(postId, content) {
    if (!MOCK_CURRENT_MEMBER_ID) throw new Error("Must be logged in to reply.");

    const currentUser = this.members.find(m => m._id === MOCK_CURRENT_MEMBER_ID);
    const post = this.posts.find(p => p._id === postId);

    if (!post) throw new Error("Post not found.");

    const newReply = {
      _id: `freply${new Date().getTime()}`,
      authorId: currentUser._id,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
      content,
      postDate: new Date().toISOString()
    };

    post.replies.push(newReply);
    return newReply;
  }
}
