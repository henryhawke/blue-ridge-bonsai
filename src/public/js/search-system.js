// Blue Ridge Bonsai Society - Search System
// This file contains the logic for a site-wide search.

import { EventSystem } from 'public/js/event-system.js';
import { LearningSystem } from 'public/js/learning-system.js';
import { MembershipSystem } from 'public/js/membership-system.js';

/**
 * A class to perform a site-wide search across different data types.
 */
export class SearchSystem {
  constructor() {
    this.eventSystem = new EventSystem();
    this.learningSystem = new LearningSystem();
    this.membershipSystem = new MembershipSystem();
  }

  /**
   * Performs a search across all major content types.
   * @param {string} query - The search query.
   * @returns {Promise<object>} - An object containing arrays of results for each type.
   */
  async searchAll(query) {
    if (!query || query.trim() === "") {
      return { events: [], articles: [], resources: [] };
    }

    const lowerCaseQuery = query.toLowerCase();

    // Concurrently search all systems
    const [eventResults, articleResults, resourceResults] = await Promise.all([
      this.searchEvents(lowerCaseQuery),
      this.searchArticles(lowerCaseQuery),
      this.searchResources(lowerCaseQuery)
    ]);

    return {
      events: eventResults,
      articles: articleResults,
      resources: resourceResults,
    };
  }

  /**
   * Searches within the events data.
   * @param {string} query - The search query.
   * @returns {Promise<Array>}
   */
  async searchEvents(query) {
    const allEvents = await this.eventSystem.loadEvents({ status: 'all' });
    return allEvents.filter(event =>
      (event.title && event.title.toLowerCase().includes(query)) ||
      (event.description && event.description.toLowerCase().includes(query)) ||
      (event.tags && event.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  }

  /**
   * Searches within the articles data.
   * @param {string} query - The search query.
   * @returns {Promise<Array>}
   */
  async searchArticles(query) {
    const allArticles = await this.learningSystem.loadArticles();
    return allArticles.filter(article =>
      (article.title && article.title.toLowerCase().includes(query)) ||
      (article.content && article.content.toLowerCase().includes(query)) ||
      (article.tags && article.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  }

  /**
   * Searches within the resources data.
   * @param {string} query - The search query.
   * @returns {Promise<Array>}
   */
  async searchResources(query) {
    const allResources = await this.learningSystem.loadResources();
    return allResources.filter(resource =>
      (resource.name && resource.name.toLowerCase().includes(query)) ||
      (resource.description && resource.description.toLowerCase().includes(query))
    );
  }
}
