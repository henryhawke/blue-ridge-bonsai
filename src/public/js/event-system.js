// Blue Ridge Bonsai Society - Event System Core
// This file is adapted to use MOCK DATA for development purposes.
// The wixData calls have been replaced with functions that operate on local JSON data.

// Mock Data (simulating Wix Collections)
const mockData = {
    Events: [
      { "_id": "evt001", "title": "Beginner's Bonsai Workshop", "description": "A comprehensive, hands-on workshop designed for those new to the art of bonsai.", "richDescription": "...", "startDate": "2025-09-13T10:00:00Z", "endDate": "2025-09-13T13:00:00Z", "location": "NC Arboretum, Education Center Room A", "registrationRequired": true, "maxAttendees": 20, "currentAttendees": 12, "category": "Workshop", "price": 75.00, "difficulty": "Beginner", "status": "upcoming", "featured": true, "tags": ["beginner", "workshop"], "createdDate": "2025-07-15T14:30:00Z" },
      { "_id": "evt002", "title": "October Monthly Meeting", "description": "This month's topic is 'Preparing Your Trees for Winter'.", "richDescription": "...", "startDate": "2025-10-04T10:00:00Z", "endDate": "2025-10-04T12:00:00Z", "location": "Community Center, Asheville", "registrationRequired": false, "maxAttendees": 100, "currentAttendees": 45, "category": "Meeting", "price": 0.00, "difficulty": "All Levels", "status": "upcoming", "featured": false, "tags": ["meeting", "winter care"], "createdDate": "2025-07-10T11:00:00Z" },
      { "_id": "evt003", "title": "Advanced Repotting Clinic", "description": "An intensive clinic for experienced members focusing on advanced repotting techniques.", "richDescription": "...", "startDate": "2025-11-08T09:00:00Z", "endDate": "2025-11-08T12:00:00Z", "location": "NC Arboretum, Greenhouse", "registrationRequired": true, "maxAttendees": 10, "currentAttendees": 7, "category": "Clinic", "price": 25.00, "difficulty": "Advanced", "status": "upcoming", "featured": false, "tags": ["repotting", "advanced"], "createdDate": "2025-08-01T18:00:00Z" }
    ],
    EventRegistrations: [
      { "_id": "reg001", "eventId": "evt001", "memberEmail": "jane.doe@example.com", "memberName": "Jane Doe" },
      { "_id": "reg002", "eventId": "evt001", "memberEmail": "bob.smith@example.com", "memberName": "Bob Smith" }
    ],
    Members: [
        { "_id": "mem001", "loginEmail": "jane.doe@example.com", "contactDetails": { "firstName": "Jane", "lastName": "Doe", "phone": "555-1111" } }
    ]
};

// Mock Wix APIs
const wixWindow = { location: { baseUrl: 'https://www.blueridgebonsaisociety.com' } };
const currentMember = {
    getMember: async () => mockData.Members[0] // Assume a user is logged in
};


export class EventSystem {
    constructor() {
        this.eventFilters = {
            category: 'all',
            date: 'all',
            difficulty: 'all',
            status: 'upcoming'
        };
        this.categories = [
            'Workshop', 'Meeting', 'Clinic', 'Exhibition', 'Social'
        ];
        this.difficulties = [
            'Beginner', 'Intermediate', 'Advanced', 'All Levels'
        ];
    }

    // Load events with advanced filtering from MOCK DATA
    async loadEvents(filters = {}) {
        console.log("Loading events with filters:", filters);
        let results = mockData.Events;

        // Apply filters
        if (filters.category && filters.category !== 'all') {
            results = results.filter(event => event.category === filters.category);
        }

        if (filters.difficulty && filters.difficulty !== 'all') {
            results = results.filter(event => event.difficulty === filters.difficulty);
        }

        const now = new Date();
        if (filters.status === 'upcoming') {
            results = results.filter(event => new Date(event.startDate) > now);
            results.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        } else if (filters.status === 'past') {
            results = results.filter(event => new Date(event.startDate) <= now);
            results.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        }

        console.log("Filtered events:", results);
        return results;
    }

    // Get single event by ID from MOCK DATA
    async getEvent(eventId) {
        const event = mockData.Events.find(e => e._id === eventId);
        return event || null;
    }

    // Get events by category
    async getEventsByCategory(category, limit = 10) {
        const results = mockData.Events.filter(event => event.category === category && new Date(event.startDate) > new Date());
        results.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        return results.slice(0, limit);
    }

    // Get featured events
    async getFeaturedEvents(limit = 5) {
        const results = mockData.Events.filter(event => event.featured && new Date(event.startDate) > new Date());
        results.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        return results.slice(0, limit);
    }

    // Check if user is registered for event
    async isUserRegistered(eventId) {
        const member = await currentMember.getMember();
        if (!member) return false;

        const registration = mockData.EventRegistrations.find(reg => reg.eventId === eventId && reg.memberEmail === member.loginEmail);
        return !!registration;
    }

    // Register user for event
    async registerForEvent(eventId, registrationData = {}) {
        const member = await currentMember.getMember();
        if (!member) {
            throw new Error('Must be logged in to register for events');
        }

        if (await this.isUserRegistered(eventId)) {
            throw new Error('Already registered for this event');
        }

        const event = await this.getEvent(eventId);
        if (this.isEventFull(event)) {
            throw new Error('Event is at full capacity');
        }

        const newRegistration = {
            _id: `reg${new Date().getTime()}`,
            eventId,
            memberEmail: member.loginEmail,
            memberName: `${member.contactDetails.firstName} ${member.contactDetails.lastName}`,
            ...registrationData,
            registrationDate: new Date().toISOString()
        };

        mockData.EventRegistrations.push(newRegistration);
        event.currentAttendees++;

        return newRegistration;
    }

    // Cancel event registration
    async cancelRegistration(eventId) {
        const member = await currentMember.getMember();
        if (!member) {
            throw new Error('Must be logged in to cancel registration');
        }

        const regIndex = mockData.EventRegistrations.findIndex(reg => reg.eventId === eventId && reg.memberEmail === member.loginEmail);

        if (regIndex === -1) {
            throw new Error('No registration found for this event');
        }

        mockData.EventRegistrations.splice(regIndex, 1);

        const event = await this.getEvent(eventId);
        if (event) {
            event.currentAttendees = Math.max((event.currentAttendees || 1) - 1, 0);
        }

        return { success: true };
    }

    // Get user's registered events
    async getUserRegistrations() {
        const member = await currentMember.getMember();
        if (!member) return [];

        const registrations = mockData.EventRegistrations.filter(reg => reg.memberEmail === member.loginEmail);

        const eventsWithRegistrations = await Promise.all(
            registrations.map(async (registration) => {
                const event = await this.getEvent(registration.eventId);
                return event ? { ...event, registration } : null;
            })
        );

        return eventsWithRegistrations.filter(item => item !== null);
    }

    // Generate RSS feed for events
    async generateRSSFeed() {
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
        const now = new Date();
        const upcomingCount = mockData.Events.filter(e => new Date(e.startDate) > now).length;
        const pastCount = mockData.Events.filter(e => new Date(e.startDate) <= now).length;

        return {
            total: mockData.Events.length,
            upcoming: upcomingCount,
            past: pastCount,
            totalRegistrations: mockData.EventRegistrations.length
        };
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
        const events = mockData.Events.filter(event => {
            const eventDate = new Date(event.startDate);
            return eventDate >= startDate && eventDate <= endDate;
        });

        return events.map(event => ({
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
        const searchTerms = query.toLowerCase().split(' ');
        const events = await this.loadEvents(filters);

        return events.filter(event => {
            const searchText = `${event.title} ${event.description} ${event.instructor || ''} ${event.location || ''}`.toLowerCase();
            return searchTerms.every(term => searchText.includes(term));
        });
    }
}