// @ts-nocheck
// Blue Ridge Bonsai Society - Events page
// Implements filtering, search, grid/calendar view toggles, and statistics.

import wixLocation from "wix-location";
import {
  fetchEvents,
  fetchEventFilters,
  fetchEventStats,
} from "public/js/data-service.js";

let currentEvents = [];
let activeFilters = {
  category: "all",
  difficulty: "all",
  status: "upcoming",
  search: "",
};
let calendarMonthOffset = 0;
let debounceTimer;

$w.onReady(async function () {
  try {
    await initializeFilters();
    applyQueryFilters();
    await loadEvents();
    await loadStats();
    setupHandlers();
    console.log("✅ Events page ready");
  } catch (error) {
    console.error("Events page initialization failed", error);
    showError("We couldn't load the events feed. Please refresh the page.");
  }
});

async function initializeFilters() {
  const filters = await fetchEventFilters();

  const categoryFilter = getElement("#categoryFilter");
  if (categoryFilter && filters.categories) {
    categoryFilter.options = filters.categories.map((value) => ({
      label: value === "all" ? "All categories" : value,
      value,
    }));
    categoryFilter.value = activeFilters.category;
  }

  const difficultyFilter = getElement("#difficultyFilter");
  if (difficultyFilter && filters.difficulties) {
    difficultyFilter.options = filters.difficulties.map((value) => ({
      label: value === "all" ? "All levels" : value,
      value,
    }));
    difficultyFilter.value = activeFilters.difficulty;
  }

  const statusFilter = getElement("#statusFilter");
  if (statusFilter && filters.statuses) {
    statusFilter.options = filters.statuses.map((value) => ({
      label: value === "all" ? "All events" : value.charAt(0).toUpperCase() + value.slice(1),
      value,
    }));
    statusFilter.value = activeFilters.status;
  }
}

function applyQueryFilters() {
  const query = wixLocation.query || {};
  if (query.category) activeFilters.category = query.category;
  if (query.status) activeFilters.status = query.status;
  if (query.difficulty) activeFilters.difficulty = query.difficulty;
  if (query.search) {
    activeFilters.search = query.search;
    const searchInput = getElement("#searchInput");
    if (searchInput) searchInput.value = activeFilters.search;
  }
}

async function loadEvents() {
  showLoading();
  const response = await fetchEvents(activeFilters);
  currentEvents = response.items || [];
  bindEventsRepeater(currentEvents);
  renderCalendar(currentEvents);
  updateCounts(currentEvents.length);
  hideLoading();
}

async function loadStats() {
  const stats = await fetchEventStats();
  setText("#statsUpcoming", `${stats.upcomingCount || 0}`);
  setText("#statsFeatured", `${stats.featuredCount || 0}`);
  setText("#statsFillRate", stats.averageFillRate ? `${stats.averageFillRate}% avg fill` : "");
}

function bindEventsRepeater(events) {
  const repeater = getElement("#eventsRepeater");
  const emptyState = getElement("#eventsEmptyState");
  if (!repeater) {
    console.warn("Events page: #eventsRepeater not found");
    return;
  }

  if (!events || events.length === 0) {
    repeater.data = [];
    if (emptyState && typeof emptyState.show === "function") emptyState.show();
    return;
  }

  repeater.data = events.map((event) => ({
    ...event,
    formattedDate: formatEventDate(event),
    availability: event.registrationRequired
      ? event.maxAttendees
        ? `${Math.max(0, event.maxAttendees - (event.currentAttendees || 0))} spots left`
        : "Registration required"
      : "Open to guests",
  }));

  repeater.onItemReady(($item, itemData) => {
    setTextOnItem($item, "#eventTitle", itemData.title);
    setTextOnItem($item, "#eventDate", itemData.formattedDate);
    setTextOnItem($item, "#eventLocation", itemData.location);
    setTextOnItem($item, "#eventCategory", itemData.category);
    setTextOnItem($item, "#eventDifficulty", itemData.difficulty);
    setTextOnItem($item, "#eventAvailability", itemData.availability);
    setTextOnItem($item, "#eventSummary", itemData.description);

    const button = $item("#eventDetailsButton");
    if (button && typeof button.onClick === "function") {
      button.onClick(() => wixLocation.to(`/event-details?eventId=${itemData._id}`));
    }

    const card = $item("#eventCard");
    if (card && typeof card.onClick === "function") {
      card.onClick(() => wixLocation.to(`/event-details?eventId=${itemData._id}`));
    }
  });

  if (emptyState && typeof emptyState.hide === "function") emptyState.hide();
}

function setupHandlers() {
  const categoryFilter = getElement("#categoryFilter");
  if (categoryFilter && typeof categoryFilter.onChange === "function") {
    categoryFilter.onChange(() => {
      activeFilters.category = categoryFilter.value || "all";
      refreshEvents();
    });
  }

  const difficultyFilter = getElement("#difficultyFilter");
  if (difficultyFilter && typeof difficultyFilter.onChange === "function") {
    difficultyFilter.onChange(() => {
      activeFilters.difficulty = difficultyFilter.value || "all";
      refreshEvents();
    });
  }

  const statusFilter = getElement("#statusFilter");
  if (statusFilter && typeof statusFilter.onChange === "function") {
    statusFilter.onChange(() => {
      activeFilters.status = statusFilter.value || "upcoming";
      refreshEvents();
    });
  }

  const searchInput = getElement("#searchInput");
  if (searchInput && typeof searchInput.onInput === "function") {
    searchInput.onInput(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        activeFilters.search = searchInput.value || "";
        refreshEvents();
      }, 300);
    });
  }

  const gridBtn = getElement("#gridViewBtn");
  const calendarBtn = getElement("#calendarViewBtn");
  if (gridBtn && typeof gridBtn.onClick === "function") {
    gridBtn.onClick(() => switchView("grid"));
  }
  if (calendarBtn && typeof calendarBtn.onClick === "function") {
    calendarBtn.onClick(() => switchView("calendar"));
  }

  const prevMonth = getElement("#calendarPrevBtn");
  const nextMonth = getElement("#calendarNextBtn");
  if (prevMonth && typeof prevMonth.onClick === "function") {
    prevMonth.onClick(() => {
      calendarMonthOffset -= 1;
      renderCalendar(currentEvents);
    });
  }
  if (nextMonth && typeof nextMonth.onClick === "function") {
    nextMonth.onClick(() => {
      calendarMonthOffset += 1;
      renderCalendar(currentEvents);
    });
  }
}

async function refreshEvents() {
  await loadEvents();
}

function renderCalendar(events) {
  const calendarComponent = getElement("#calendarHtml");
  const monthLabel = getElement("#calendarMonthLabel");
  if (!calendarComponent || !("html" in calendarComponent)) return;

  const today = new Date();
  const displayDate = new Date(today.getFullYear(), today.getMonth() + calendarMonthOffset, 1);
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  if (monthLabel && "text" in monthLabel) {
    monthLabel.text = displayDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: "", events: [] });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const current = new Date(year, month, day);
    const dayEvents = (events || []).filter((event) => {
      const start = new Date(event.startDate);
      return start.getFullYear() === year && start.getMonth() === month && start.getDate() === day;
    });
    cells.push({ day, events: dayEvents });
  }

  const html = `
    <style>
      .brbs-calendar { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; font-family: 'Inter', sans-serif; }
      .brbs-calendar-day { min-height: 120px; padding: 0.75rem; background: rgba(255,255,255,0.65); backdrop-filter: blur(10px); border-radius: 12px; box-shadow: 0 8px 24px rgba(44,62,80,0.08); display: flex; flex-direction: column; }
      .brbs-calendar-day h4 { margin: 0 0 0.5rem; font-size: 0.9rem; color: #2a3b2e; }
      .brbs-calendar-event { font-size: 0.75rem; margin-bottom: 0.4rem; padding: 0.4rem 0.5rem; border-radius: 8px; background: rgba(111, 143, 113, 0.15); color: #2a3b2e; }
      .brbs-calendar-event strong { display: block; font-weight: 600; }
    </style>
    <div class="brbs-calendar">
      ${cells
        .map((cell) => {
          if (!cell.day) {
            return '<div class="brbs-calendar-day"></div>';
          }
          const eventsHtml = cell.events
            .map(
              (event) => `
                <div class="brbs-calendar-event">
                  <strong>${event.title}</strong>
                  <span>${formatTime(event.startDate)}</span>
                </div>
              `,
            )
            .join("") || '<div class="brbs-calendar-event" style="background:rgba(107,142,111,0.08); color:#4d5b4f;">No events</div>';
          return `
            <div class="brbs-calendar-day">
              <h4>${cell.day}</h4>
              ${eventsHtml}
            </div>
          `;
        })
        .join("")}
    </div>
  `;

  calendarComponent.html = html;
}

function switchView(view) {
  const gridSection = getElement("#eventsGridSection");
  const calendarSection = getElement("#calendarSection");
  if (view === "calendar") {
    if (gridSection && typeof gridSection.hide === "function") gridSection.hide();
    if (calendarSection && typeof calendarSection.show === "function") calendarSection.show();
  } else {
    if (gridSection && typeof gridSection.show === "function") gridSection.show();
    if (calendarSection && typeof calendarSection.hide === "function") calendarSection.hide();
  }
}

function updateCounts(count) {
  setText("#eventsCountText", count ? `${count} events` : "No events match your filters yet.");
}

function showLoading() {
  const loading = getElement("#eventsLoading");
  if (loading && typeof loading.show === "function") loading.show();
}

function hideLoading() {
  const loading = getElement("#eventsLoading");
  if (loading && typeof loading.hide === "function") loading.hide();
}

function showError(message) {
  setText("#eventsErrorMessage", message);
  const errorBox = getElement("#eventsErrorBox");
  if (errorBox && typeof errorBox.show === "function") errorBox.show();
}

function setText(selector, value) {
  const element = getElement(selector);
  if (!element) return;
  if ("text" in element) {
    element.text = value || "";
  } else if ("html" in element) {
    element.html = value || "";
  }
}

function setTextOnItem($item, selector, value) {
  try {
    const element = $item(selector);
    if (!element) return;
    if ("text" in element) {
      element.text = value || "";
    } else if ("html" in element) {
      element.html = value || "";
    }
  } catch (error) {
    console.log(`Unable to set text for ${selector}`, error);
  }
}

function getElement(selector) {
  try {
    return $w(selector);
  } catch (error) {
    return null;
  }
}

function formatEventDate(event) {
  const start = new Date(event.startDate);
  if (Number.isNaN(start.getTime())) return "Date TBA";
  const end = event.endDate ? new Date(event.endDate) : null;
  const date = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const startTime = formatTime(start);
  const endTime = end ? formatTime(end) : null;
  return endTime ? `${date} · ${startTime} – ${endTime}` : `${date} · ${startTime}`;
}

function formatTime(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
