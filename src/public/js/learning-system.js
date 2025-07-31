// Blue Ridge Bonsai Society - Learning System
// This file contains the core logic for the Learning Center, including managing
// articles, resources, and vendors.

// Mock Data (simulating Wix Collections)
import articlesData from 'backend/data/Articles.json';
import resourcesData from 'backend/data/Resources.json';
import vendorListData from 'backend/data/VendorList.json';

/**
 * A class to manage all content for the Learning Center.
 */
export class LearningSystem {
  constructor() {
    this.articles = articlesData;
    this.resources = resourcesData;
    this.vendors = vendorListData;
  }

  /**
   * Loads articles based on filters.
   * @param {object} filters - Optional filters (e.g., { category: '...', search: '...' }).
   * @returns {Promise<Array>} - A promise that resolves to the filtered articles.
   */
  async loadArticles(filters = {}) {
    let results = this.articles;

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      results = results.filter(article => article.category === filters.category);
    }

    // Filter by difficulty
    if (filters.difficulty && filters.difficulty !== 'all') {
      results = results.filter(article => article.difficulty === filters.difficulty);
    }

    // Filter by search term (searches title and tags)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(article =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Sort by publish date (newest first)
    results.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

    return results;
  }

  /**
   * Gets a single article by its ID.
   * @param {string} articleId - The ID of the article.
   * @returns {Promise<object|null>} - The article object or null if not found.
   */
  async getArticleById(articleId) {
    return this.articles.find(a => a._id === articleId) || null;
  }

  /**
   * Gets all unique article categories.
   * @returns {Promise<Array>} - A promise that resolves to an array of category names.
   */
  async getArticleCategories() {
    const categories = this.articles.map(a => a.category);
    return [...new Set(categories)]; // Return unique categories
  }

  /**
   * Loads all resources.
   * @returns {Promise<Array>}
   */
  async loadResources() {
      return this.resources;
  }

  /**
   * Loads all vendors from the vendor list.
   * @returns {Promise<Array>}
   */
  async loadVendors() {
      return this.vendors;
  }
}
