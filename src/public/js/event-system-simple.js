// Blue Ridge Bonsai Society - Simplified Event System
// Compatible with Wix Velo environment

// Simple EventSystem implementation for Wix
window.SimpleEventSystem = class {
  constructor() {
    this.eventFilters = {
      category: "all",
      date: "all",
      difficulty: "all",
      status: "upcoming",
    };
  }

  // Load events with basic filtering
  async loadEvents(filters = {}) {
    try {
      console.log("Loading events with filters:", filters);

      // Mock data for testing - replace with actual wixData calls
      const mockEvents = [
        {
          _id: "1",
          title: "Beginner Bonsai Workshop",
          description:
            "Learn the basics of bonsai cultivation and styling in this hands-on workshop.",
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          endDate: null,
          location: "NC Arboretum",
          category: "workshop",
          difficulty: "beginner",
          instructor: "Master Chen",
          maxAttendees: 15,
          currentAttendees: 8,
          price: 45,
          featured: true,
          image: "/images/workshop-demo.jpg",
        },
        {
          _id: "2",
          title: "Monthly Club Meeting",
          description:
            "Join us for our monthly meeting featuring member presentations and Q&A.",
          startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
          endDate: null,
          location: "Community Center",
          category: "meeting",
          difficulty: "all-levels",
          instructor: null,
          maxAttendees: null,
          currentAttendees: 0,
          price: 0,
          featured: false,
          image: "/images/meeting.jpg",
        },
      ];

      // Apply basic filtering
      let filteredEvents = mockEvents;

      if (filters.category && filters.category !== "all") {
        filteredEvents = filteredEvents.filter(
          (event) => event.category === filters.category
        );
      }

      if (filters.difficulty && filters.difficulty !== "all") {
        filteredEvents = filteredEvents.filter(
          (event) => event.difficulty === filters.difficulty
        );
      }

      if (filters.status === "upcoming") {
        filteredEvents = filteredEvents.filter(
          (event) => new Date(event.startDate) > new Date()
        );
      } else if (filters.status === "past") {
        filteredEvents = filteredEvents.filter(
          (event) => new Date(event.startDate) <= new Date()
        );
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredEvents = filteredEvents.filter(
          (event) =>
            event.title.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm)
        );
      }

      return filteredEvents;
    } catch (error) {
      console.error("Error loading events:", error);
      return [];
    }
  }

  // Get event statistics
  async getEventStats() {
    try {
      const events = await this.loadEvents();
      const upcoming = events.filter(
        (event) => new Date(event.startDate) > new Date()
      );
      const past = events.filter(
        (event) => new Date(event.startDate) <= new Date()
      );

      return {
        total: events.length,
        upcoming: upcoming.length,
        past: past.length,
        totalRegistrations: events.reduce(
          (sum, event) => sum + (event.currentAttendees || 0),
          0
        ),
      };
    } catch (error) {
      console.error("Error getting event stats:", error);
      return {
        total: 0,
        upcoming: 0,
        past: 0,
        totalRegistrations: 0,
      };
    }
  }

  // Format event date for display
  formatEventDate(date, includeTime = true) {
    try {
      const eventDate = new Date(date);
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      if (includeTime) {
        options.hour = "numeric";
        options.minute = "2-digit";
        options.timeZoneName = "short";
      }

      return eventDate.toLocaleDateString("en-US", options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date TBD";
    }
  }

  // Get relative time until event
  getTimeUntilEvent(date) {
    try {
      const eventDate = new Date(date);
      const now = new Date();
      const diffMs = eventDate - now;

      if (diffMs < 0) {
        return "Event has passed";
      }

      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? "s" : ""} away`;
      } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? "s" : ""} away`;
      } else {
        return "Starting soon";
      }
    } catch (error) {
      console.error("Error calculating time until event:", error);
      return "Time TBD";
    }
  }

  // Check if event is full
  isEventFull(event) {
    return event.maxAttendees && event.currentAttendees >= event.maxAttendees;
  }

  // Get available spots for event
  getAvailableSpots(event) {
    if (!event.maxAttendees) return "Unlimited";
    return Math.max(event.maxAttendees - (event.currentAttendees || 0), 0);
  }

  // Get events for calendar display
  async getCalendarEvents(startDate, endDate) {
    try {
      const events = await this.loadEvents();

      return events
        .filter((event) => {
          const eventDate = new Date(event.startDate);
          return eventDate >= startDate && eventDate <= endDate;
        })
        .map((event) => ({
          id: event._id,
          title: event.title,
          start: event.startDate,
          end: event.endDate || event.startDate,
          url: `/event-details?eventId=${event._id}`,
          backgroundColor: this.getCategoryColor(event.category),
          borderColor: this.getCategoryColor(event.category),
          textColor: "#ffffff",
        }));
    } catch (error) {
      console.error("Error getting calendar events:", error);
      return [];
    }
  }

  // Get category color for calendar display
  getCategoryColor(category) {
    const colors = {
      workshop: "#6B8E6F", // Mountain Sage
      meeting: "#4A4A4A", // Stone Gray
      demonstration: "#8B7355", // Earth Brown
      exhibition: "#D4A574", // Autumn Gold
      social: "#5CB85C", // Success Green
      "field-trip": "#5BC0DE", // Info Blue
      competition: "#F0AD4E", // Warning Orange
    };
    return colors[category] || "#6B8E6F";
  }

  // Mock registration function
  async registerForEvent(eventId) {
    console.log("Mock registration for event:", eventId);
    return { success: true, message: "Registration successful (mock)" };
  }

  // Mock RSS feed generation
  async generateRSSFeed() {
    console.log("Mock RSS feed generation");
    return {
      title: "Blue Ridge Bonsai Society Events",
      description: "Upcoming bonsai workshops, meetings, and events",
      items: [],
    };
  }

  // Mock iCal generation
  generateICalFeed(events) {
    console.log("Mock iCal generation for", events.length, "events");
    return "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Blue Ridge Bonsai Society//Event Calendar//EN\nEND:VCALENDAR";
  }
};

// Initialize the event system
if (typeof window !== "undefined") {
  window.eventSystem = new window.SimpleEventSystem();
  console.log("✅ Simple Event System initialized");
}
