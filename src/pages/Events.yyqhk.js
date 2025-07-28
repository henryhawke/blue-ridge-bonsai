// Blue Ridge Bonsai Society - Events Page - Phase 1 Implementation
// API Reference: https://www.wix.com/velo/reference/api-overview/introduction

import wixData from "wix-data";
import wixLocation from "wix-location";
import wixWindow from "wix-window";
import { currentMember } from "wix-members-frontend";
let eventSystem;
let currentFilters = {
  category: "all",
  date: "upcoming",
  difficulty: "all",
  search: "",
  dateRange: null,
};

// Safe $w wrapper with error handling
function safeElement(selector) {
  try {
    const element = $w(selector);
    if (!element || element.length === 0) {
      console.warn(`Element not found: ${selector}`);
      return null;
    }
    return element;
  } catch (error) {
    console.warn(`Error selecting element ${selector}:`, error);
    return null;
  }
}

// Safe show/hide functions
function safeShow(selector) {
  try {
    const element = safeElement(selector);
    if (element && typeof element.show === "function") {
      element.show();
    } else {
      console.warn(`Cannot show element: ${selector}`);
    }
  } catch (error) {
    console.warn(`Error showing element ${selector}:`, error);
  }
}

function safeHide(selector) {
  try {
    const element = safeElement(selector);
    if (element && typeof element.hide === "function") {
      element.hide();
    } else {
      console.warn(`Cannot hide element: ${selector}`);
    }
  } catch (error) {
    console.warn(`Error hiding element ${selector}:`, error);
  }
}

// Safe element operations
function safeSetHtml(selector, html) {
  const element = safeElement(selector);
  if (element && element.html !== undefined) {
    element.html = html;
  }
}

function safeSetText(selector, text) {
  const element = safeElement(selector);
  if (element && element.text !== undefined) {
    element.text = text;
  }
}

function safeSetValue(selector, value) {
  const element = safeElement(selector);
  if (element && element.value !== undefined) {
    element.value = value;
  }
}

function safeGetValue(selector) {
  const element = safeElement(selector);
  if (element && element.value !== undefined) {
    return element.value;
  }
  return "";
}

function safeOnClick(selector, handler) {
  const element = safeElement(selector);
  if (element && typeof element.onClick === "function") {
    element.onClick(handler);
  }
}

function safeOnChange(selector, handler) {
  const element = safeElement(selector);
  if (element && typeof element.onChange === "function") {
    element.onChange(handler);
  }
}

function safeOnInput(selector, handler) {
  const element = safeElement(selector);
  if (element && typeof element.onInput === "function") {
    element.onInput(handler);
  }
}

$w.onReady(async function () {
  console.log(
    "Running the code for the Events page. To debug this code in your browser's dev tools, open yyqhk.js."
  );

  // Initialize event system
  try {
    // Check if the simple event system is available on window
    if (typeof window !== "undefined" && window.SimpleEventSystem) {
      eventSystem = new window.SimpleEventSystem();
    } else if (typeof window !== "undefined" && window.eventSystem) {
      eventSystem = window.eventSystem;
    } else {
      // Fallback mock system
      eventSystem = {
        async loadEvents() {
          return [];
        },
        async getEventStats() {
          return { total: 0, upcoming: 0, past: 0, totalRegistrations: 0 };
        },
        async getCalendarEvents() {
          return [];
        },
        formatEventDate(date) {
          return new Date(date).toLocaleDateString();
        },
        getTimeUntilEvent() {
          return "Loading...";
        },
        getAvailableSpots() {
          return "TBD";
        },
        isEventFull() {
          return false;
        },
        async registerForEvent() {
          throw new Error("Event system not available");
        },
        async generateRSSFeed() {
          throw new Error("RSS feed not available");
        },
        generateICalFeed() {
          throw new Error("iCal export not available");
        },
      };
      console.warn("Using fallback event system");
    }
  } catch (error) {
    console.error("Error initializing event system:", error);
    // Use fallback
    eventSystem = {
      async loadEvents() {
        return [];
      },
      async getEventStats() {
        return { total: 0, upcoming: 0, past: 0, totalRegistrations: 0 };
      },
      async getCalendarEvents() {
        return [];
      },
      formatEventDate(date) {
        return "Date TBD";
      },
      getTimeUntilEvent() {
        return "Loading...";
      },
      getAvailableSpots() {
        return "TBD";
      },
      isEventFull() {
        return false;
      },
      async registerForEvent() {
        throw new Error("Event system not available");
      },
      async generateRSSFeed() {
        throw new Error("RSS feed not available");
      },
      generateICalFeed() {
        throw new Error("iCal export not available");
      },
    };
  }

  // Initialize events page
  await initializeEventsPage();

  // Setup event handlers
  setupEventHandlers();

  // Handle URL parameters
  handleURLParameters();
});

async function initializeEventsPage() {
  try {
    // Create the main page structure
    createEventsPageStructure();

    // Setup filters
    setupFilters();

    // Load and display events
    await loadAndDisplayEvents();

    // Load event statistics
    await loadEventStats();

    // Initialize calendar view
    await initializeCalendarView();

    // Setup view toggles
    setupViewToggles();

    // Initialize animations
    initializeAnimations();
  } catch (error) {
    console.error("Error initializing events page:", error);
    displayErrorMessage("Failed to load events. Please try again later.");
  }
}

/**
 * Create the complete HTML structure for the events page
 */
function createEventsPageStructure() {
  try {
    // Find or create main container
    let mainContainer =
      safeElement("#main") ||
      safeElement("#page-content") ||
      safeElement("#content");

    if (!mainContainer) {
      // If no main container exists, create one in the body
      if (typeof document !== "undefined") {
        mainContainer = document.createElement("div");
        mainContainer.id = "main";
        document.body.appendChild(mainContainer);
      } else {
        console.warn("Cannot create page structure - document not available");
        return;
      }
    }

    const eventsPageHTML = `
      <div class="events-page-container">
        <!-- Page Header -->
        <div class="page-header">
          <h1>Upcoming Events & Workshops</h1>
          <p class="page-subtitle">Join us for bonsai workshops, meetings, and exhibitions</p>
        </div>

        <!-- Event Statistics -->
        <div id="eventStatsSection" class="stats-section">
          <div id="eventStatsContainer" class="stats-container">
            <!-- Stats will be loaded here -->
          </div>
        </div>

        <!-- Filters and Controls -->
        <div class="filters-and-controls">
          <div class="filters-container">
            <div class="filter-group">
              <label for="categoryFilter">Category:</label>
              <select id="categoryFilter" class="filter-select">
                <!-- Options will be populated by setupFilters() -->
              </select>
            </div>
            
            <div class="filter-group">
              <label for="dateFilter">Date Range:</label>
              <select id="dateFilter" class="filter-select">
                <!-- Options will be populated by setupFilters() -->
              </select>
            </div>
            
            <div class="filter-group">
              <label for="difficultyFilter">Difficulty:</label>
              <select id="difficultyFilter" class="filter-select">
                <!-- Options will be populated by setupFilters() -->
              </select>
            </div>
            
            <div class="filter-group search-group">
              <label for="searchInput">Search:</label>
              <input type="text" id="searchInput" class="search-input" placeholder="Search events...">
            </div>
          </div>
          
          <div class="view-controls">
            <div class="view-toggles">
              <button id="gridViewBtn" class="btn view-btn active">Grid View</button>
              <button id="calendarViewBtn" class="btn view-btn">Calendar</button>
            </div>
            
            <div class="export-buttons">
              <button id="rssFeedBtn" class="btn btn-outline">RSS Feed</button>
              <button id="icalExportBtn" class="btn btn-outline">Export Calendar</button>
            </div>
          </div>
        </div>

        <!-- Results Info -->
        <div class="results-info">
          <div id="resultsCount" class="results-count">Loading events...</div>
        </div>

        <!-- Loading Spinner -->
        <div id="loadingSpinner" class="loading-spinner" style="display: none;">
          <div class="spinner"></div>
          <p>Loading events...</p>
        </div>

        <!-- Error Message -->
        <div id="errorMessage" class="error-message" style="display: none;"></div>

        <!-- Events Grid View -->
        <div id="eventsGrid" class="events-view">
          <!-- Events will be loaded here -->
        </div>

        <!-- Calendar View -->
        <div id="calendarView" class="calendar-view" style="display: none;">
          <div id="calendarContainer" class="calendar-container">
            <!-- Calendar will be loaded here -->
          </div>
        </div>

        <!-- No Events Message -->
        <div id="noEventsMessage" class="no-events-message" style="display: none;">
          <!-- No events content will be generated here -->
        </div>
      </div>
    `;

    // Inject the HTML into the main container
    if (mainContainer.innerHTML !== undefined) {
      mainContainer.innerHTML = eventsPageHTML;
    } else if (mainContainer.html !== undefined) {
      mainContainer.html = eventsPageHTML;
    }

    console.log("✅ Events page structure created successfully");
  } catch (error) {
    console.error("Error creating events page structure:", error);
  }
}

function setupFilters() {
  // Category filter
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "workshop", label: "Workshops" },
    { value: "meeting", label: "Meetings" },
    { value: "demonstration", label: "Demonstrations" },
    { value: "exhibition", label: "Exhibitions" },
    { value: "social", label: "Social Events" },
    { value: "field-trip", label: "Field Trips" },
    { value: "competition", label: "Competitions" },
  ];

  const categoryHTML = categoryOptions
    .map((option) => `<option value="${option.value}">${option.label}</option>`)
    .join("");

  const categoryFilter = safeElement("#categoryFilter");
  if (categoryFilter && categoryFilter.html) {
    categoryFilter.html = categoryHTML;
  }

  // Date filter
  const dateOptions = [
    { value: "upcoming", label: "Upcoming Events" },
    { value: "this-month", label: "This Month" },
    { value: "next-month", label: "Next Month" },
    { value: "past", label: "Past Events" },
  ];

  const dateHTML = dateOptions
    .map((option) => `<option value="${option.value}">${option.label}</option>`)
    .join("");

  const dateFilter = safeElement("#dateFilter");
  if (dateFilter && dateFilter.html) {
    dateFilter.html = dateHTML;
  }

  // Difficulty filter
  const difficultyOptions = [
    { value: "all", label: "All Levels" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "all-levels", label: "All Levels Welcome" },
  ];

  const difficultyHTML = difficultyOptions
    .map((option) => `<option value="${option.value}">${option.label}</option>`)
    .join("");

  const difficultyFilter = safeElement("#difficultyFilter");
  if (difficultyFilter && difficultyFilter.html) {
    difficultyFilter.html = difficultyHTML;
  }
}

async function loadAndDisplayEvents() {
  try {
    // Show loading state
    showLoadingState();

    // Apply date range for specific filters
    const filters = { ...currentFilters };
    if (filters.date === "this-month") {
      const now = new Date();
      filters.dateRange = {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      };
      filters.date = "upcoming";
    } else if (filters.date === "next-month") {
      const now = new Date();
      filters.dateRange = {
        start: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        end: new Date(now.getFullYear(), now.getMonth() + 2, 0),
      };
      filters.date = "upcoming";
    }

    // Load events
    const events = await eventSystem.loadEvents(filters);

    // Display events
    if (events.length > 0) {
      displayEventsGrid(events);
      safeShow("#eventsGrid");
      safeHide("#noEventsMessage");
    } else {
      safeHide("#eventsGrid");
      displayNoEventsMessage();
    }

    // Update results count
    updateResultsCount(events.length);

    // Hide loading state
    hideLoadingState();
  } catch (error) {
    console.error("Error loading events:", error);
    hideLoadingState();
    displayErrorMessage("Failed to load events. Please try again.");
  }
}

function displayEventsGrid(events) {
  const eventsHTML = events
    .map((event) => {
      const isRegistered = false; // Will be checked dynamically
      const timeUntilEvent = eventSystem.getTimeUntilEvent(event.startDate);
      const availableSpots = eventSystem.getAvailableSpots(event);
      const isEventFull = eventSystem.isEventFull(event);

      return `
            <div class="glass-card event-card" data-event-id="${
              event._id
            }" data-aos="fade-up">
                <div class="event-header">
                    <div class="event-category ${event.category}">${
        event.category.charAt(0).toUpperCase() + event.category.slice(1)
      }</div>
                    ${
                      event.featured
                        ? '<div class="featured-badge">Featured</div>'
                        : ""
                    }
                </div>
                
                <div class="event-image-container">
                    <img src="${event.image || "/images/default-event.jpg"}" 
                         alt="${event.title}" 
                         class="event-image" />
                    <div class="event-date-overlay">
                        <div class="date-day">${new Date(
                          event.startDate
                        ).getDate()}</div>
                        <div class="date-month">${new Date(
                          event.startDate
                        ).toLocaleDateString("en-US", { month: "short" })}</div>
                    </div>
                </div>
                
                <div class="event-content">
                    <h3 class="event-title">${event.title}</h3>
                    <p class="event-description">${event.description.substring(
                      0,
                      120
                    )}...</p>
                    
                    <div class="event-meta">
                        <div class="meta-item">
                            <span class="meta-icon">🗓️</span>
                            <span class="meta-text">${eventSystem.formatEventDate(
                              event.startDate
                            )}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-icon">📍</span>
                            <span class="meta-text">${
                              event.location || "TBD"
                            }</span>
                        </div>
                        ${
                          event.instructor
                            ? `
                            <div class="meta-item">
                                <span class="meta-icon">👨‍🏫</span>
                                <span class="meta-text">${event.instructor}</span>
                            </div>
                        `
                            : ""
                        }
                        <div class="meta-item">
                            <span class="meta-icon">🎯</span>
                            <span class="meta-text">${
                              event.difficulty || "All Levels"
                            }</span>
                        </div>
                    </div>
                    
                    <div class="event-status">
                        <div class="time-until">${timeUntilEvent}</div>
                        <div class="availability">
                            ${
                              availableSpots === "Unlimited"
                                ? '<span class="spots-unlimited">Open Registration</span>'
                                : `<span class="spots-count ${
                                    isEventFull ? "full" : ""
                                  }">${availableSpots} spots left</span>`
                            }
                        </div>
                    </div>
                    
                    ${
                      event.price && event.price > 0
                        ? `
                        <div class="event-price">
                            <span class="price-label">Price:</span>
                            <span class="price-amount">$${event.price}</span>
                        </div>
                    `
                        : ""
                    }
                </div>
                
                <div class="event-actions">
                    <button class="btn btn-primary" onclick="viewEventDetails('${
                      event._id
                    }')">
                        Learn More
                    </button>
                    ${
                      !isEventFull
                        ? `
                        <button class="btn btn-outline" onclick="quickRegister('${
                          event._id
                        }')">
                            ${isRegistered ? "Registered" : "Register"}
                        </button>
                    `
                        : `
                        <button class="btn btn-disabled" disabled>
                            Event Full
                        </button>
                    `
                    }
                </div>
            </div>
        `;
    })
    .join("");

  $w("#eventsGrid").html = `
        <div class="events-grid">
            ${eventsHTML}
        </div>
    `;
}

function displayNoEventsMessage() {
  const message =
    currentFilters.date === "past"
      ? "No past events found with the current filters."
      : "No upcoming events found with the current filters.";

  $w("#noEventsMessage").html = `
        <div class="glass-card no-events-card">
            <div class="no-events-icon">📅</div>
            <h3>No Events Found</h3>
            <p>${message}</p>
            <div class="no-events-actions">
                <button class="btn btn-primary" onclick="clearFilters()">
                    Clear Filters
                </button>
                <button class="btn btn-outline" onclick="suggestEvent()">
                    Suggest an Event
                </button>
            </div>
        </div>
    `;
  $w("#noEventsMessage").show();
}

async function loadEventStats() {
  try {
    const stats = await eventSystem.getEventStats();

    $w("#eventStatsContainer").html = `
            <div class="stats-grid">
                <div class="stat-item glass-card">
                    <div class="stat-number">${stats.upcoming}</div>
                    <div class="stat-label">Upcoming Events</div>
                </div>
                <div class="stat-item glass-card">
                    <div class="stat-number">${stats.total}</div>
                    <div class="stat-label">Total Events</div>
                </div>
                <div class="stat-item glass-card">
                    <div class="stat-number">${stats.totalRegistrations}</div>
                    <div class="stat-label">Total Registrations</div>
                </div>
                <div class="stat-item glass-card">
                    <div class="stat-number">${new Date().getFullYear()}</div>
                    <div class="stat-label">Current Year</div>
                </div>
            </div>
        `;

    $w("#eventStatsSection").show();
  } catch (error) {
    console.error("Error loading event stats:", error);
    $w("#eventStatsSection").hide();
  }
}

async function initializeCalendarView() {
  try {
    // This would integrate with a calendar widget
    // For now, we'll create a simple month view
    const currentDate = new Date();
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const calendarEvents = await eventSystem.getCalendarEvents(
      firstDay,
      lastDay
    );

    // Simple calendar HTML generation
    const calendarHTML = generateCalendarHTML(currentDate, calendarEvents);

    $w("#calendarContainer").html = calendarHTML;
  } catch (error) {
    console.error("Error initializing calendar:", error);
    $w("#calendarContainer").hide();
  }
}

function generateCalendarHTML(currentDate, events) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  let calendarHTML = `
        <div class="calendar-header">
            <h3>${monthName}</h3>
            <div class="calendar-nav">
                <button class="btn btn-sm" onclick="changeMonth(-1)">‹</button>
                <button class="btn btn-sm" onclick="changeMonth(1)">›</button>
            </div>
        </div>
        <div class="calendar-grid">
            <div class="calendar-days-header">
                <div class="day-header">Sun</div>
                <div class="day-header">Mon</div>
                <div class="day-header">Tue</div>
                <div class="day-header">Wed</div>
                <div class="day-header">Thu</div>
                <div class="day-header">Fri</div>
                <div class="day-header">Sat</div>
            </div>
            <div class="calendar-days">
    `;

  const today = new Date();
  const currentMonth = month;

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const isCurrentMonth = date.getMonth() === currentMonth;
    const isToday = date.toDateString() === today.toDateString();
    const dayEvents = events.filter(
      (event) => new Date(event.start).toDateString() === date.toDateString()
    );

    calendarHTML += `
            <div class="calendar-day ${
              isCurrentMonth ? "current-month" : "other-month"
            } ${isToday ? "today" : ""}" 
                 data-date="${date.toISOString().split("T")[0]}">
                <div class="day-number">${date.getDate()}</div>
                ${
                  dayEvents.length > 0
                    ? `
                    <div class="day-events">
                        ${dayEvents
                          .slice(0, 2)
                          .map(
                            (event) => `
                            <div class="day-event" style="background-color: ${
                              event.backgroundColor
                            }" 
                                 onclick="viewEventDetails('${event.id}')">
                                ${event.title.substring(0, 10)}${
                              event.title.length > 10 ? "..." : ""
                            }
                            </div>
                        `
                          )
                          .join("")}
                        ${
                          dayEvents.length > 2
                            ? `<div class="more-events">+${
                                dayEvents.length - 2
                              } more</div>`
                            : ""
                        }
                    </div>
                `
                    : ""
                }
            </div>
        `;
  }

  calendarHTML += `
            </div>
        </div>
    `;

  return calendarHTML;
}

function setupViewToggles() {
  // Setup grid/calendar view toggle using safe wrappers
  safeOnClick("#gridViewBtn", () => {
    safeShow("#eventsGrid");
    safeHide("#calendarView");

    // Update button states
    const gridBtn = safeElement("#gridViewBtn");
    const calendarBtn = safeElement("#calendarViewBtn");

    if (gridBtn && gridBtn.classList) {
      gridBtn.classList.add("active");
    }
    if (calendarBtn && calendarBtn.classList) {
      calendarBtn.classList.remove("active");
    }
  });

  safeOnClick("#calendarViewBtn", () => {
    safeHide("#eventsGrid");
    safeShow("#calendarView");

    // Update button states
    const gridBtn = safeElement("#gridViewBtn");
    const calendarBtn = safeElement("#calendarViewBtn");

    if (calendarBtn && calendarBtn.classList) {
      calendarBtn.classList.add("active");
    }
    if (gridBtn && gridBtn.classList) {
      gridBtn.classList.remove("active");
    }
  });
}

function setupEventHandlers() {
  // Filter change handlers using safe wrappers
  safeOnChange("#categoryFilter", async () => {
    currentFilters.category = safeGetValue("#categoryFilter");
    await loadAndDisplayEvents();
  });

  safeOnChange("#dateFilter", async () => {
    currentFilters.date = safeGetValue("#dateFilter");
    await loadAndDisplayEvents();
  });

  safeOnChange("#difficultyFilter", async () => {
    currentFilters.difficulty = safeGetValue("#difficultyFilter");
    await loadAndDisplayEvents();
  });

  // Search handler using safe wrapper
  safeOnInput("#searchInput", async () => {
    currentFilters.search = safeGetValue("#searchInput");
    // Debounce search
    if (typeof window !== "undefined") {
      clearTimeout(window.searchTimeout);
      window.searchTimeout = setTimeout(async () => {
        await loadAndDisplayEvents();
      }, 500);
    } else {
      // Immediate search if window not available
      await loadAndDisplayEvents();
    }
  });

  // RSS feed button using safe wrapper
  safeOnClick("#rssFeedBtn", async () => {
    try {
      const rssData = await eventSystem.generateRSSFeed();
      if (typeof wixWindow !== "undefined") {
        wixWindow.openLightbox("rss-feed-modal", rssData);
      } else {
        console.log("RSS Feed Data:", rssData);
      }
    } catch (error) {
      console.error("Error generating RSS feed:", error);
    }
  });

  // iCal export button using safe wrapper
  safeOnClick("#icalExportBtn", async () => {
    try {
      const events = await eventSystem.loadEvents({ status: "upcoming" });
      const icalData = eventSystem.generateICalFeed(events);

      // Create download link if in browser environment
      if (typeof window !== "undefined" && typeof document !== "undefined") {
        const blob = new Blob([icalData], { type: "text/calendar" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "brbs-events.ics";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        console.log("iCal Data:", icalData);
      }
    } catch (error) {
      console.error("Error exporting iCal:", error);
    }
  });
}

function handleURLParameters() {
  const url = new URL(wixLocation.url);
  const params = url.searchParams;

  // Apply URL parameters to filters
  if (params.get("category")) {
    currentFilters.category = params.get("category");
    $w("#categoryFilter").value = currentFilters.category;
  }

  if (params.get("date")) {
    currentFilters.date = params.get("date");
    $w("#dateFilter").value = currentFilters.date;
  }

  if (params.get("difficulty")) {
    currentFilters.difficulty = params.get("difficulty");
    $w("#difficultyFilter").value = currentFilters.difficulty;
  }

  if (params.get("search")) {
    currentFilters.search = params.get("search");
    $w("#searchInput").value = currentFilters.search;
  }
}

function updateResultsCount(count) {
  const filterText = getFilterDescription();
  safeSetText(
    "#resultsCount",
    `Showing ${count} event${count !== 1 ? "s" : ""} ${filterText}`
  );
}

function getFilterDescription() {
  const parts = [];

  if (currentFilters.category !== "all") {
    parts.push(`in ${currentFilters.category}`);
  }

  if (currentFilters.difficulty !== "all") {
    parts.push(`for ${currentFilters.difficulty} level`);
  }

  if (currentFilters.date !== "upcoming") {
    parts.push(`for ${currentFilters.date.replace("-", " ")}`);
  }

  if (currentFilters.search) {
    parts.push(`matching "${currentFilters.search}"`);
  }

  return parts.length > 0 ? parts.join(" ") : "";
}

function showLoadingState() {
  safeShow("#loadingSpinner");
  safeHide("#eventsGrid");
  safeHide("#noEventsMessage");
}

function hideLoadingState() {
  safeHide("#loadingSpinner");
}

function displayErrorMessage(message) {
  safeSetText("#errorMessage", message);
  safeShow("#errorMessage");
  setTimeout(() => {
    safeHide("#errorMessage");
  }, 5000);
}

function initializeAnimations() {
  // AOS (Animate On Scroll) initialization would go here
  // For now, we'll use basic intersection observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe all event cards
  setTimeout(() => {
    const cards = document.querySelectorAll(".event-card");
    cards.forEach((card) => observer.observe(card));
  }, 500);
}

// Global functions for dynamic interactions
window.viewEventDetails = function (eventId) {
  wixLocation.to(`/event-details?eventId=${eventId}`);
};

window.quickRegister = async function (eventId) {
  try {
    const member = await currentMember.getMember();
    if (!member) {
      wixWindow.openLightbox("login-modal");
      return;
    }

    const result = await eventSystem.registerForEvent(eventId);
    if (result) {
      wixWindow.openLightbox("registration-success-modal", { eventId });
      await loadAndDisplayEvents(); // Refresh to show updated registration status
    }
  } catch (error) {
    console.error("Error with quick registration:", error);
    wixWindow.openLightbox("error-modal", { message: error.message });
  }
};

window.clearFilters = async function () {
  currentFilters = {
    category: "all",
    date: "upcoming",
    difficulty: "all",
    search: "",
  };

  $w("#categoryFilter").value = "all";
  $w("#dateFilter").value = "upcoming";
  $w("#difficultyFilter").value = "all";
  $w("#searchInput").value = "";

  await loadAndDisplayEvents();
};

window.suggestEvent = function () {
  wixWindow.openLightbox("suggest-event-modal");
};

window.changeMonth = async function (direction) {
  // Calendar navigation logic would go here
  console.log("Change month:", direction);
};

// Add CSS for Events page styling
if (typeof window !== "undefined") {
  const eventsPageStyles = `
    <style id="events-page-styles">
      /* Page Layout */
      .events-page-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
        font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .page-header {
        text-align: center;
        margin-bottom: 3rem;
      }
      
      .page-header h1 {
        color: #4A4A4A;
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0 0 1rem 0;
      }
      
      .page-subtitle {
        color: #6B8E6F;
        font-size: 1.1rem;
        margin: 0;
      }
      
      /* Filters and Controls */
      .filters-and-controls {
        background: rgba(254, 255, 254, 0.9);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 4px 16px rgba(107, 142, 111, 0.1);
      }
      
      .filters-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      
      .filter-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .filter-group label {
        font-weight: 600;
        color: #4A4A4A;
        font-size: 0.9rem;
      }
      
      .filter-select, .search-input {
        padding: 0.75rem;
        border: 1px solid #DDE4EA;
        border-radius: 8px;
        background: #FEFFFE;
        color: #4A4A4A;
        font-family: inherit;
        transition: border-color 0.2s ease;
      }
      
      .filter-select:focus, .search-input:focus {
        outline: none;
        border-color: #6B8E6F;
        box-shadow: 0 0 0 3px rgba(107, 142, 111, 0.1);
      }
      
      .view-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
      }
      
      .view-toggles {
        display: flex;
        gap: 0.5rem;
      }
      
      .view-btn {
        padding: 0.5rem 1rem;
        border: 2px solid #6B8E6F;
        background: transparent;
        color: #6B8E6F;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-weight: 500;
      }
      
      .view-btn.active, .view-btn:hover {
        background: #6B8E6F;
        color: #FEFFFE;
      }
      
      .export-buttons {
        display: flex;
        gap: 0.5rem;
      }
      
      .btn {
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        text-decoration: none;
        display: inline-block;
        transition: all 0.2s ease;
        border: none;
        font-family: inherit;
      }
      
      .btn-outline {
        background: transparent;
        border: 1px solid #6B8E6F;
        color: #6B8E6F;
      }
      
      .btn-outline:hover {
        background: #6B8E6F;
        color: #FEFFFE;
      }
      
      /* Results Info */
      .results-info {
        margin-bottom: 1rem;
      }
      
      .results-count {
        color: #4A4A4A;
        font-size: 0.9rem;
      }
      
      /* Loading and Error States */
      .loading-spinner {
        text-align: center;
        padding: 3rem;
        color: #6B8E6F;
      }
      
      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #DDE4EA;
        border-top: 4px solid #6B8E6F;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem auto;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .error-message {
        background: #f8d7da;
        color: #721c24;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
        text-align: center;
        border: 1px solid #f5c6cb;
      }
      
      /* Events Grid */
      .events-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 2rem;
        margin: 2rem 0;
      }
            
            .event-card {
                position: relative;
                overflow: hidden;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .event-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 15px 35px rgba(107, 142, 111, 0.2);
            }
            
            .event-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }
            
            .event-category {
                padding: 0.25rem 0.75rem;
                border-radius: 15px;
                font-size: 0.8rem;
                font-weight: 600;
                text-transform: capitalize;
            }
            
            .event-category.workshop { background: #6B8E6F; color: white; }
            .event-category.meeting { background: #4A4A4A; color: white; }
            .event-category.demonstration { background: #8B7355; color: white; }
            .event-category.exhibition { background: #D4A574; color: white; }
            .event-category.social { background: #5CB85C; color: white; }
            .event-category.field-trip { background: #5BC0DE; color: white; }
            .event-category.competition { background: #F0AD4E; color: white; }
            
            .featured-badge {
                background: linear-gradient(45deg, #FFD700, #FFA500);
                color: #333;
                padding: 0.25rem 0.5rem;
                border-radius: 12px;
                font-size: 0.7rem;
                font-weight: 700;
                text-transform: uppercase;
            }
            
            .event-image-container {
                position: relative;
                margin: -1rem -1rem 1rem -1rem;
                height: 200px;
                overflow: hidden;
            }
            
            .event-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
            }
            
            .event-card:hover .event-image {
                transform: scale(1.05);
            }
            
            .event-date-overlay {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: rgba(254, 255, 254, 0.95);
                padding: 0.5rem;
                border-radius: var(--radius-md);
                text-align: center;
                min-width: 60px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            
            .date-day {
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--mountain-sage);
                line-height: 1;
            }
            
            .date-month {
                font-size: 0.8rem;
                color: var(--stone-gray);
                text-transform: uppercase;
            }
            
            .event-title {
                color: var(--stone-gray);
                margin-bottom: 0.5rem;
                font-size: 1.25rem;
            }
            
            .event-description {
                color: var(--stone-gray);
                line-height: 1.6;
                margin-bottom: 1rem;
            }
            
            .event-meta {
                margin: 1rem 0;
            }
            
            .meta-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin: 0.5rem 0;
                font-size: 0.9rem;
            }
            
            .meta-icon {
                font-size: 1rem;
                width: 20px;
                text-align: center;
            }
            
            .meta-text {
                color: var(--stone-gray);
            }
            
            .event-status {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 1rem 0;
                padding: 0.5rem;
                background: var(--mountain-haze);
                border-radius: var(--radius-md);
            }
            
            .time-until {
                font-size: 0.9rem;
                color: var(--earth-brown);
                font-weight: 600;
            }
            
            .spots-unlimited {
                color: var(--mountain-sage);
                font-weight: 600;
            }
            
            .spots-count {
                font-weight: 600;
            }
            
            .spots-count.full {
                color: #D9534F;
            }
            
            .event-price {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 1rem 0;
                font-weight: 600;
            }
            
            .price-amount {
                color: var(--mountain-sage);
                font-size: 1.1rem;
            }
            
            .event-actions {
                display: flex;
                gap: 0.5rem;
                margin-top: 1rem;
            }
            
            .event-actions .btn {
                flex: 1;
            }
            
            .btn-disabled {
                background: #ccc !important;
                color: #666 !important;
                cursor: not-allowed !important;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                margin: 2rem 0;
            }
            
            .stat-item {
                text-align: center;
                padding: 1.5rem 1rem;
            }
            
            .stat-number {
                font-size: 2.5rem;
                font-weight: 700;
                color: var(--mountain-sage);
                margin-bottom: 0.5rem;
            }
            
            .stat-label {
                font-size: 0.9rem;
                color: var(--stone-gray);
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            
            .filters-container {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin: 2rem 0;
                padding: 1.5rem;
                background: var(--glass-white);
                border-radius: var(--radius-lg);
            }
            
            .view-toggles {
                display: flex;
                gap: 0.5rem;
                margin: 1rem 0;
            }
            
            .view-toggles .btn {
                flex: 1;
            }
            
            .view-toggles .btn.active {
                background: var(--mountain-sage);
                color: var(--cloud-white);
            }
            
            .calendar-grid {
                background: var(--glass-white);
                border-radius: var(--radius-lg);
                padding: 1rem;
                margin: 2rem 0;
            }
            
            .calendar-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid var(--mountain-haze);
            }
            
            .calendar-nav {
                display: flex;
                gap: 0.5rem;
            }
            
            .calendar-days-header {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 1px;
                margin-bottom: 1rem;
            }
            
            .day-header {
                text-align: center;
                font-weight: 600;
                padding: 0.5rem;
                color: var(--mountain-sage);
                font-size: 0.9rem;
            }
            
            .calendar-days {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 1px;
                background: var(--mountain-haze);
            }
            
            .calendar-day {
                background: var(--cloud-white);
                min-height: 100px;
                padding: 0.5rem;
                cursor: pointer;
                transition: background-color 0.2s ease;
            }
            
            .calendar-day:hover {
                background: var(--mountain-haze);
            }
            
            .calendar-day.other-month {
                opacity: 0.5;
            }
            
            .calendar-day.today {
                background: var(--mountain-sage);
                color: var(--cloud-white);
            }
            
            .day-number {
                font-weight: 600;
                margin-bottom: 0.25rem;
            }
            
            .day-events {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }
            
            .day-event {
                background: var(--mountain-sage);
                color: white;
                padding: 2px 4px;
                border-radius: 3px;
                font-size: 0.7rem;
                cursor: pointer;
                transition: opacity 0.2s ease;
            }
            
            .day-event:hover {
                opacity: 0.8;
            }
            
            .more-events {
                font-size: 0.7rem;
                color: var(--earth-brown);
                font-weight: 600;
                margin-top: 2px;
            }
            
            .no-events-card {
                text-align: center;
                padding: 3rem 2rem;
            }
            
            .no-events-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }
            
            .no-events-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-top: 2rem;
            }
            
            .export-buttons {
                display: flex;
                gap: 0.5rem;
                margin: 1rem 0;
            }
            
            .loading-spinner {
                text-align: center;
                padding: 3rem;
                font-size: 1.5rem;
                color: var(--mountain-sage);
            }
            
            .error-message {
                background: #f8d7da;
                color: #721c24;
                padding: 1rem;
                border-radius: var(--radius-md);
                margin: 1rem 0;
                text-align: center;
            }
            
            .animate-in {
                animation: slideInUp 0.6s ease-out;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @media (max-width: 768px) {
                .events-grid {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }
                
                .filters-container {
                    grid-template-columns: 1fr;
                    gap: 0.5rem;
                }
                
                .stats-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
                
                .event-actions {
                    flex-direction: column;
                }
                
                .calendar-days {
                    gap: 0;
                }
                
                .calendar-day {
                    min-height: 80px;
                    padding: 0.25rem;
                }
                
                .no-events-actions {
                    flex-direction: column;
                    align-items: center;
                }
            }
        </style>
    `;

  if (!document.getElementById("events-page-styles")) {
    document.head.insertAdjacentHTML("beforeend", eventsPageStyles);
  }
}
