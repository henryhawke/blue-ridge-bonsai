// Blue Ridge Bonsai Society - Event System Core
// API Documentation: https://dev.wix.com/docs/velo/apis/wix-data/introduction

import wixData from 'wix-data';
import { currentMember } from 'wix-members-frontend';
import wixWindow from 'wix-window';

export class EventSystem {
    constructor() {
        this.eventFilters = {
            category: 'all',
            date: 'all',
            difficulty: 'all',
            status: 'upcoming'
        };
        this.categories = [
            'workshop',
            'meeting',
            'demonstration',
            'exhibition',
            'social',
            'field-trip',
            'competition'
        ];
        this.difficulties = [
            'beginner',
            'intermediate',
            'advanced',
            'all-levels'
        ];
    }

    // Load events with advanced filtering
    async loadEvents(filters = {}) {
        try {
            const query = wixData.query('Events')
                .limit(50);
            
            // Apply filters
            if (filters.category && filters.category !== 'all') {
                query.eq('category', filters.category);
            }
            
            if (filters.difficulty && filters.difficulty !== 'all') {
                query.eq('difficulty', filters.difficulty);
            }
            
            if (filters.status === 'upcoming') {
                query.gt('startDate', new Date());
                query.ascending('startDate');
            } else if (filters.status === 'past') {
                query.lt('startDate', new Date());
                query.descending('startDate');
            } else if (filters.status === 'featured') {
                query.eq('featured', true);
                query.gt('startDate', new Date());
                query.ascending('startDate');
            }
            
            // Date range filtering
            if (filters.dateRange) {
                const { start, end } = filters.dateRange;
                if (start) query.gt('startDate', start);
                if (end) query.lt('startDate', end);
            }
            
            // Search by title or description
            if (filters.search) {
                query.contains('title', filters.search);
            }
            
            const results = await query.find();
            return results.items;
        } catch (error) {
            console.error('Error loading events:', error);
            throw error;
        }
    }

    // Get single event by ID
    async getEvent(eventId) {
        try {
            const event = await wixData.get('Events', eventId);
            return event;
        } catch (error) {
            console.error('Error getting event:', error);
            throw error;
        }
    }

    // Get events by category
    async getEventsByCategory(category, limit = 10) {
        try {
            const events = await wixData.query('Events')
                .eq('category', category)
                .gt('startDate', new Date())
                .ascending('startDate')
                .limit(limit)
                .find();
            
            return events.items;
        } catch (error) {
            console.error('Error getting events by category:', error);
            return [];
        }
    }

    // Get featured events
    async getFeaturedEvents(limit = 5) {
        try {
            const events = await wixData.query('Events')
                .eq('featured', true)
                .gt('startDate', new Date())
                .ascending('startDate')
                .limit(limit)
                .find();
            
            return events.items;
        } catch (error) {
            console.error('Error getting featured events:', error);
            return [];
        }
    }

    // Check if user is registered for event
    async isUserRegistered(eventId) {
        try {
            const member = await currentMember.getMember();
            if (!member) return false;
            
            const registration = await wixData.query('EventRegistrations')
                .eq('eventId', eventId)
                .eq('memberEmail', member.loginEmail)
                .find();
            
            return registration.items.length > 0;
        } catch (error) {
            console.error('Error checking registration:', error);
            return false;
        }
    }

    // Register user for event
    async registerForEvent(eventId, registrationData = {}) {
        try {
            const member = await currentMember.getMember();
            if (!member) {
                throw new Error('Must be logged in to register for events');
            }

            // Check if already registered
            const existingRegistration = await wixData.query('EventRegistrations')
                .eq('eventId', eventId)
                .eq('memberEmail', member.loginEmail)
                .find();

            if (existingRegistration.items.length > 0) {
                throw new Error('Already registered for this event');
            }

            // Get event details to check capacity
            const event = await wixData.get('Events', eventId);
            if (event.maxAttendees && event.currentAttendees >= event.maxAttendees) {
                throw new Error('Event is at full capacity');
            }

            // Create registration record
            const registration = {
                eventId,
                memberEmail: member.loginEmail,
                memberName: `${member.contactDetails.firstName} ${member.contactDetails.lastName}`,
                phone: member.contactDetails.phone || '',
                registrationDate: new Date(),
                paymentStatus: 'pending',
                attendanceStatus: 'registered',
                notes: registrationData.notes || '',
                specialRequests: registrationData.specialRequests || '',
                emergencyContact: registrationData.emergencyContact || ''
            };

            const result = await wixData.insert('EventRegistrations', registration);

            // Update event attendee count
            await wixData.update('Events', {
                _id: eventId,
                currentAttendees: (event.currentAttendees || 0) + 1
            });

            return result;
        } catch (error) {
            console.error('Error registering for event:', error);
            throw error;
        }
    }

    // Cancel event registration
    async cancelRegistration(eventId) {
        try {
            const member = await currentMember.getMember();
            if (!member) {
                throw new Error('Must be logged in to cancel registration');
            }

            const registration = await wixData.query('EventRegistrations')
                .eq('eventId', eventId)
                .eq('memberEmail', member.loginEmail)
                .find();

            if (registration.items.length === 0) {
                throw new Error('No registration found for this event');
            }

            // Remove registration
            await wixData.remove('EventRegistrations', registration.items[0]._id);

            // Update event attendee count
            const event = await wixData.get('Events', eventId);
            await wixData.update('Events', {
                _id: eventId,
                currentAttendees: Math.max((event.currentAttendees || 1) - 1, 0)
            });

            return { success: true };
        } catch (error) {
            console.error('Error canceling registration:', error);
            throw error;
        }
    }

    // Get user's registered events
    async getUserRegistrations() {
        try {
            const member = await currentMember.getMember();
            if (!member) return [];

            const registrations = await wixData.query('EventRegistrations')
                .eq('memberEmail', member.loginEmail)
                .descending('registrationDate')
                .find();

            // Get event details for each registration
            const eventsWithRegistrations = await Promise.all(
                registrations.items.map(async (registration) => {
                    try {
                        const event = await wixData.get('Events', registration.eventId);
                        return {
                            ...event,
                            registration
                        };
                    } catch (error) {
                        console.error('Error getting event for registration:', error);
                        return null;
                    }
                })
            );

            return eventsWithRegistrations.filter(item => item !== null);
        } catch (error) {
            console.error('Error getting user registrations:', error);
            return [];
        }
    }

    // Generate RSS feed for events
    async generateRSSFeed() {
        try {
            const events = await this.loadEvents({ status: 'upcoming' });
            const rssItems = events.map(event => {
                return {
                    title: event.title,
                    description: event.description,
                    link: `${wixWindow.location.baseUrl}/event-details?eventId=${event._id}`,
                    pubDate: new Date(event.createdDate).toUTCString(),
                    guid: event._id,
                    category: event.category,
                    startDate: event.startDate,
                    location: event.location
                };
            });
            
            return {
                title: 'Blue Ridge Bonsai Society Events',
                description: 'Upcoming bonsai workshops, meetings, and events',
                link: `${wixWindow.location.baseUrl}/events`,
                lastBuildDate: new Date().toUTCString(),
                items: rssItems
            };
        } catch (error) {
            console.error('Error generating RSS feed:', error);
            throw error;
        }
    }

    // Export to iCal format
    generateICalFeed(events) {
        try {
            let icalContent = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//Blue Ridge Bonsai Society//Event Calendar//EN',
                'CALSCALE:GREGORIAN',
                'METHOD:PUBLISH'
            ];

            events.forEach(event => {
                const startDate = new Date(event.startDate);
                const endDate = new Date(event.endDate || event.startDate);
                
                // Add 2 hours if no end date specified
                if (!event.endDate) {
                    endDate.setHours(endDate.getHours() + 2);
                }

                icalContent.push(
                    'BEGIN:VEVENT',
                    `UID:${event._id}@blueridgebonsai.wixsite.com`,
                    `DTSTAMP:${this.formatICalDate(new Date())}`,
                    `DTSTART:${this.formatICalDate(startDate)}`,
                    `DTEND:${this.formatICalDate(endDate)}`,
                    `SUMMARY:${this.escapeICalText(event.title)}`,
                    `DESCRIPTION:${this.escapeICalText(event.description)}`,
                    `LOCATION:${this.escapeICalText(event.location || 'TBD')}`,
                    `URL:${wixWindow.location.baseUrl}/event-details?eventId=${event._id}`,
                    `CATEGORIES:${event.category.toUpperCase()}`,
                    'END:VEVENT'
                );
            });

            icalContent.push('END:VCALENDAR');
            return icalContent.join('\r\n');
        } catch (error) {
            console.error('Error generating iCal feed:', error);
            throw error;
        }
    }

    // Helper method to format dates for iCal
    formatICalDate(date) {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    }

    // Helper method to escape text for iCal
    escapeICalText(text) {
        if (!text) return '';
        return text.replace(/[\\;,\n]/g, (match) => {
            switch (match) {
                case '\\': return '\\\\';
                case ';': return '\\;';
                case ',': return '\\,';
                case '\n': return '\\n';
                default: return match;
            }
        });
    }

    // Get event statistics
    async getEventStats() {
        try {
            const [totalEvents, upcomingEvents, pastEvents, registrations] = await Promise.all([
                wixData.query('Events').count(),
                wixData.query('Events').gt('startDate', new Date()).count(),
                wixData.query('Events').lt('startDate', new Date()).count(),
                wixData.query('EventRegistrations').count()
            ]);

            return {
                total: totalEvents.totalCount,
                upcoming: upcomingEvents.totalCount,
                past: pastEvents.totalCount,
                totalRegistrations: registrations.totalCount
            };
        } catch (error) {
            console.error('Error getting event stats:', error);
            return {
                total: 0,
                upcoming: 0,
                past: 0,
                totalRegistrations: 0
            };
        }
    }

    // Format event date for display
    formatEventDate(date, includeTime = true) {
        try {
            const eventDate = new Date(date);
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };

            if (includeTime) {
                options.hour = 'numeric';
                options.minute = '2-digit';
                options.timeZoneName = 'short';
            }

            return eventDate.toLocaleDateString('en-US', options);
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Date TBD';
        }
    }

    // Get relative time until event
    getTimeUntilEvent(date) {
        try {
            const eventDate = new Date(date);
            const now = new Date();
            const diffMs = eventDate - now;
            
            if (diffMs < 0) {
                return 'Event has passed';
            }

            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

            if (diffDays > 0) {
                return `${diffDays} day${diffDays > 1 ? 's' : ''} away`;
            } else if (diffHours > 0) {
                return `${diffHours} hour${diffHours > 1 ? 's' : ''} away`;
            } else {
                return 'Starting soon';
            }
        } catch (error) {
            console.error('Error calculating time until event:', error);
            return 'Time TBD';
        }
    }

    // Check if event is full
    isEventFull(event) {
        return event.maxAttendees && event.currentAttendees >= event.maxAttendees;
    }

    // Get available spots for event
    getAvailableSpots(event) {
        if (!event.maxAttendees) return 'Unlimited';
        return Math.max(event.maxAttendees - (event.currentAttendees || 0), 0);
    }

    // Validate event data
    validateEventData(eventData) {
        const errors = [];

        if (!eventData.title || eventData.title.trim().length < 3) {
            errors.push('Event title must be at least 3 characters long');
        }

        if (!eventData.description || eventData.description.trim().length < 10) {
            errors.push('Event description must be at least 10 characters long');
        }

        if (!eventData.startDate) {
            errors.push('Start date is required');
        } else {
            const startDate = new Date(eventData.startDate);
            if (startDate < new Date()) {
                errors.push('Start date cannot be in the past');
            }
        }

        if (eventData.endDate) {
            const startDate = new Date(eventData.startDate);
            const endDate = new Date(eventData.endDate);
            if (endDate <= startDate) {
                errors.push('End date must be after start date');
            }
        }

        if (eventData.maxAttendees && eventData.maxAttendees < 1) {
            errors.push('Maximum attendees must be at least 1');
        }

        if (!eventData.category || !this.categories.includes(eventData.category)) {
            errors.push('Valid category is required');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Get events for calendar display
    async getCalendarEvents(startDate, endDate) {
        try {
            const events = await wixData.query('Events')
                .ge('startDate', startDate)
                .le('startDate', endDate)
                .find();

            return events.items.map(event => ({
                id: event._id,
                title: event.title,
                start: event.startDate,
                end: event.endDate || event.startDate,
                url: `/event-details?eventId=${event._id}`,
                backgroundColor: this.getCategoryColor(event.category),
                borderColor: this.getCategoryColor(event.category),
                textColor: '#ffffff',
                extendedProps: {
                    category: event.category,
                    difficulty: event.difficulty,
                    instructor: event.instructor,
                    location: event.location,
                    spotsLeft: this.getAvailableSpots(event),
                    description: event.description.substring(0, 100) + '...'
                }
            }));
        } catch (error) {
            console.error('Error getting calendar events:', error);
            return [];
        }
    }

    // Get category color for calendar display
    getCategoryColor(category) {
        const colors = {
            'workshop': '#6B8E6F',      // Mountain Sage
            'meeting': '#4A4A4A',       // Stone Gray
            'demonstration': '#8B7355',  // Earth Brown
            'exhibition': '#D4A574',     // Autumn Gold
            'social': '#5CB85C',         // Success Green
            'field-trip': '#5BC0DE',     // Info Blue
            'competition': '#F0AD4E'     // Warning Orange
        };
        return colors[category] || '#6B8E6F';
    }

    // Search events
    async searchEvents(query, filters = {}) {
        try {
            const searchTerms = query.toLowerCase().split(' ');
            const events = await this.loadEvents(filters);
            
            return events.filter(event => {
                const searchText = `${event.title} ${event.description} ${event.instructor || ''} ${event.location || ''}`.toLowerCase();
                return searchTerms.every(term => searchText.includes(term));
            });
        } catch (error) {
            console.error('Error searching events:', error);
            return [];
        }
    }
}