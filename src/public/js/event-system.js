// Blue Ridge Bonsai Society - Event System Core
// Provides a thin wrapper around backend/site-data so page code can work with
// events in a consistent way. The class mirrors the legacy API but now reads
// from the shared data-service helper and supports the Wix Members APIs.

import wixWindow from 'wix-window';
import { currentMember } from 'wix-members-frontend';
import {
  fetchEvents,
  fetchEventById,
  fetchEventStats,
  createEventRegistration,
  fetchEventRegistrations,
} from 'public/js/data-service.js';

function ensureDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export class EventSystem {
  constructor() {
    this.defaultFilters = {
      category: 'all',
      difficulty: 'all',
      status: 'upcoming',
    };
  }

  async loadEvents(filters = {}) {
    const response = await fetchEvents({ ...this.defaultFilters, ...filters });
    return response.items || [];
  }

  async getEvent(eventId) {
    if (!eventId) return null;
    return fetchEventById(eventId);
  }

  async getEventsByCategory(category, limit = 10) {
    if (!category) return [];
    const { items } = await fetchEvents({ category, status: 'upcoming' });
    return (items || []).slice(0, limit);
  }

  async getFeaturedEvents(limit = 5) {
    const { items } = await fetchEvents({ status: 'upcoming', featured: true });
    return (items || []).slice(0, limit);
  }

  async isUserRegistered(eventId) {
    if (!eventId) return false;
    const member = await currentMember.getMember().catch(() => null);
    if (!member) return false;

    const emailCandidates = [
      member.loginEmail,
      member.email,
      member.primaryEmail,
      member.contactDetails?.primaryEmail,
    ].filter(Boolean);

    const registrations = await fetchEventRegistrations(eventId);
    return registrations.some((registration) =>
      emailCandidates.includes(registration.memberEmail),
    );
  }

  async registerForEvent(eventId, registrationData = {}) {
    const member = await currentMember.getMember();
    if (!member) {
      throw new Error('Must be logged in to register for events.');
    }

    if (await this.isUserRegistered(eventId)) {
      throw new Error('You are already registered for this event.');
    }

    const event = await this.getEvent(eventId);
    if (!event) {
      throw new Error('Event not found.');
    }
    if (this.isEventFull(event)) {
      throw new Error('This event has reached capacity.');
    }

    const payload = {
      memberName: `${member.contactDetails?.firstName || ''} ${
        member.contactDetails?.lastName || ''
      }`.trim(),
      memberEmail:
        member.loginEmail ||
        member.email ||
        member.contactDetails?.emails?.[0]?.email ||
        registrationData.email,
      registrationDate: new Date().toISOString(),
      ...registrationData,
    };

    return createEventRegistration(eventId, payload);
  }

  async cancelRegistration() {
    throw new Error('Canceling registrations requires a Wix Data collection.');
  }

  async getUserRegistrations() {
    const member = await currentMember.getMember().catch(() => null);
    if (!member) return [];

    const events = await this.loadEvents({ status: 'all' });
    const emailCandidates = [
      member.loginEmail,
      member.email,
      member.primaryEmail,
      member.contactDetails?.primaryEmail,
    ].filter(Boolean);

    const lookups = await Promise.all(
      events.map(async (event) => {
        const registrations = await fetchEventRegistrations(event._id);
        const match = registrations.find((registration) =>
          emailCandidates.includes(registration.memberEmail),
        );
        return match ? { ...event, registration: match } : null;
      }),
    );

    return lookups.filter((entry) => entry !== null);
  }

  async generateRSSFeed() {
    const events = await this.loadEvents({ status: 'upcoming' });
    const items = events.map((event) => ({
      title: event.title,
      description: event.description,
      link: `${wixWindow.location.baseUrl}/event-details?eventId=${event._id}`,
      pubDate: ensureDate(event.createdDate)?.toUTCString() || new Date().toUTCString(),
      guid: event._id,
      category: event.category,
      startDate: event.startDate,
      location: event.location,
    }));

    return {
      title: 'Blue Ridge Bonsai Society Events',
      description: 'Upcoming bonsai workshops, meetings, and exhibitions.',
      link: `${wixWindow.location.baseUrl}/events`,
      lastBuildDate: new Date().toUTCString(),
      items,
    };
  }

  generateICalFeed(events) {
    const list = events || [];
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Blue Ridge Bonsai Society//Events//EN'];
    list.forEach((event) => {
      const start = ensureDate(event.startDate);
      const end = ensureDate(event.endDate) || start;
      if (!start) return;
      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${event._id}@blueridgebonsai`);
      lines.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
      lines.push(`DTSTART:${start.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
      if (end) {
        lines.push(`DTEND:${end.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
      }
      lines.push(`SUMMARY:${event.title}`);
      lines.push(`DESCRIPTION:${(event.description || '').replace(/\n/g, '\\n')}`);
      lines.push(`LOCATION:${event.location || ''}`);
      lines.push('END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    return lines.join('\n');
  }

  async getStats() {
    return fetchEventStats();
  }

  isEventFull(event) {
    if (!event) return false;
    if (!event.maxAttendees) return false;
    return (event.currentAttendees || 0) >= event.maxAttendees;
  }

  getTimeUntilEvent(date) {
    const target = ensureDate(date);
    if (!target) return '';
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays > 1) {
      return `${diffDays} days away`;
    }
    if (diffDays === 1) {
      return 'Tomorrow';
    }
    if (diffDays === 0) {
      return 'Today';
    }
    return `${Math.abs(diffDays)} days ago`;
  }
}
