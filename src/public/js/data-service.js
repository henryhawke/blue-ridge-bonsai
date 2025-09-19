// Centralized frontend helper that wraps calls to backend/site-data.
// Provides lightweight caching so repeated requests on a single page do not
// trigger duplicate backend calls.

import {
  getHomepageContent,
  getEvents,
  getEventById,
  getEventFilters,
  getEventStats,
  getAboutContent,
  getLearningContent,
  getMembershipLevelFallbacks,
  registerMemberForEvent,
  listEventRegistrations,
  searchContent,
} from 'backend/site-data';

const cache = new Map();

function cacheKey(name, args = []) {
  try {
    return `${name}:${JSON.stringify(args)}`;
  } catch (error) {
    return `${name}`;
  }
}

async function cachedInvoke(name, fn, args = []) {
  const key = cacheKey(name, args);
  if (cache.has(key)) {
    return cache.get(key);
  }
  const result = await fn(...args);
  cache.set(key, result);
  return result;
}

export function fetchHomepageContent() {
  return cachedInvoke('homepage', getHomepageContent);
}

export function fetchEvents(filters = {}) {
  return cachedInvoke('events', getEvents, [filters]);
}

export function fetchEventById(eventId) {
  return cachedInvoke('eventById', getEventById, [eventId]);
}

export function fetchEventFilters() {
  return cachedInvoke('eventFilters', getEventFilters);
}

export function fetchEventStats() {
  return cachedInvoke('eventStats', getEventStats);
}

export function fetchAboutContent() {
  return cachedInvoke('aboutContent', getAboutContent);
}

export function fetchLearningContent() {
  return cachedInvoke('learningContent', getLearningContent);
}

export function fetchMembershipLevelsFallback() {
  return cachedInvoke('membershipLevelsFallback', getMembershipLevelFallbacks);
}

export function createEventRegistration(eventId, payload) {
  return registerMemberForEvent(eventId, payload);
}

export function fetchEventRegistrations(eventId) {
  return listEventRegistrations(eventId);
}

export function searchSiteContent(query) {
  return searchContent(query);
}

export function clearDataCache() {
  cache.clear();
}
