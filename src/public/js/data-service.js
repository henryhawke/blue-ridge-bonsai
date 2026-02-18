/**
 * data-service.js  (public)
 *
 * Thin frontend wrapper around backend web module calls.
 * Adds in-memory caching to avoid duplicate backend round-trips
 * within a single page session.
 *
 * Usage in page code:
 *   import { DataService } from 'public/js/data-service';
 *   const ds = new DataService();
 *   const events = await ds.getEvents();
 */

import { getEvents, getEventById, getEventCategories, getHomepageContent, getFaqItems, getResources } from 'backend/site-data';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export class DataService {
  constructor() {
    /** @type {Map<string, {value: any, expiresAt: number}>} */
    this._cache = new Map();
  }

  // ─── Events ─────────────────────────────────────────────────────────────────

  /** @param {object} [opts] */
  async getEvents(opts = {}) {
    const key = `events:${JSON.stringify(opts)}`;
    return this._cached(key, () => getEvents(opts));
  }

  /** @param {string} eventId */
  async getEventById(eventId) {
    return this._cached(`event:${eventId}`, () => getEventById(eventId));
  }

  async getEventCategories() {
    return this._cached('eventCategories', () => getEventCategories());
  }

  // ─── Homepage ────────────────────────────────────────────────────────────────

  async getHomepageContent() {
    return this._cached('homepage', () => getHomepageContent());
  }

  // ─── FAQ ─────────────────────────────────────────────────────────────────────

  async getFaqItems() {
    return this._cached('faq', () => getFaqItems());
  }

  // ─── Resources ───────────────────────────────────────────────────────────────

  /** @param {object} [opts] */
  async getResources(opts = {}) {
    const key = `resources:${JSON.stringify(opts)}`;
    return this._cached(key, () => getResources(opts));
  }

  // ─── Cache Internals ─────────────────────────────────────────────────────────

  /**
   * Returns cached value or fetches and stores it.
   *
   * @param {string} key
   * @param {function(): Promise<any>} fetcher
   */
  async _cached(key, fetcher) {
    const entry = this._cache.get(key);
    const now = Date.now();

    if (entry && entry.expiresAt > now) {
      return entry.value;
    }

    const value = await fetcher();
    this._cache.set(key, { value, expiresAt: now + CACHE_TTL_MS });
    return value;
  }

  /** Clears all cached data. */
  clearCache() {
    this._cache.clear();
  }
}

/** Singleton instance — reuse across a page session. */
export const dataService = new DataService();
