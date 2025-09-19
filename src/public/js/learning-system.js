// Blue Ridge Bonsai Society - Learning System
// Fetches learning content from backend/site-data and provides filtering
// helpers for page scripts.

import { fetchLearningContent } from 'public/js/data-service.js';

export class LearningSystem {
  constructor() {
    this._contentPromise = null;
  }

  async loadContent() {
    if (!this._contentPromise) {
      this._contentPromise = fetchLearningContent();
    }
    return this._contentPromise;
  }

  async loadArticles(filters = {}) {
    const content = await this.loadContent();
    let results = content.articles || [];

    if (filters.category && filters.category !== 'all') {
      results = results.filter((article) => article.category === filters.category);
    }

    if (filters.difficulty && filters.difficulty !== 'all') {
      results = results.filter((article) => article.difficulty === filters.difficulty);
    }

    if (filters.search) {
      const term = String(filters.search).toLowerCase();
      results = results.filter((article) => {
        const haystack = [
          article.title,
          article.content,
          article.excerpt,
          ...(article.tags || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(term);
      });
    }

    return results.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
  }

  async getArticleById(articleId) {
    if (!articleId) return null;
    const content = await this.loadContent();
    return (content.articles || []).find((article) => article._id === articleId) || null;
  }

  async getArticleCategories() {
    const content = await this.loadContent();
    return content.categories || [];
  }

  async loadResources() {
    const content = await this.loadContent();
    return content.resources || [];
  }

  async loadVendors() {
    const content = await this.loadContent();
    return content.vendors || [];
  }

  async loadBeginnerPathway() {
    const content = await this.loadContent();
    return content.beginnersGuide || [];
  }
}
