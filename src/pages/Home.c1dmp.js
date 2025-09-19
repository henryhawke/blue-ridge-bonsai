// @ts-nocheck
// Blue Ridge Bonsai Society - Homepage logic
// Renders hero content, upcoming events, member spotlights, and site statistics
// using data supplied by backend/site-data.

import wixLocation from "wix-location";
import { currentMember } from "wix-members-frontend";
import { fetchHomepageContent } from "public/js/data-service.js";
import { EventSystem } from "public/js/event-system.js";

let homepageData;
const eventSystem = new EventSystem();

$w.onReady(async function () {
  try {
    homepageData = await fetchHomepageContent();
    await renderHero(homepageData.hero);
    renderStats(homepageData.stats);
    renderEvents(homepageData.upcomingEvents || []);
    renderSpotlights(homepageData.spotlights || []);
    await renderAnnouncements();
    setupCtas();
    console.log("✅ Homepage ready");
  } catch (error) {
    console.error("Failed to initialize homepage", error);
    showError("We had trouble loading the homepage content. Please refresh the page.");
  }
});

async function renderHero(hero = {}) {
  const member = await currentMember.getMember().catch(() => null);
  const greeting = member
    ? `${hero.memberHeading || "Welcome back"}, ${
        member.contactDetails?.firstName || member.firstName || "member"
      }!`
    : hero.guestHeading || "Cultivate your artistry";

  setText("#heroTitle", greeting);
  setText("#heroSubtitle", hero.subtitle || "Hands-on bonsai community in Western North Carolina.");
  setText(
    "#heroDescription",
    hero.description ||
      "The Blue Ridge Bonsai Society hosts monthly meetings, seasonal workshops, and special exhibitions with the North Carolina Arboretum."
  );
}

function renderStats(stats = {}) {
  setText("#statMembers", formatNumber(stats.memberCount) || "–");
  setText("#statEvents", formatNumber(stats.upcomingEventCount) || "–");
  setText("#statWorkshops", formatNumber(stats.activeWorkshops) || "–");
}

function renderEvents(events) {
  const repeater = getElement("#eventsRepeater");
  const emptyState = getElement("#eventsEmptyState");
  const section = getElement("#eventsSection");

  if (!repeater) {
    console.warn("Homepage: #eventsRepeater not found");
    return;
  }

  if (!events || events.length === 0) {
    repeater.data = [];
    if (emptyState && typeof emptyState.show === "function") emptyState.show();
    if (section && typeof section.show === "function") section.show();
    return;
  }

  const mapped = events.map((event) => ({
    ...event,
    formattedDate: formatEventDate(event),
    availability: eventSystem.isEventFull(event) ? "Waitlist" : "Open",
  }));

  repeater.data = mapped;
  repeater.onItemReady(($item, itemData) => {
    setTextOnItem($item, "#eventTitle", itemData.title);
    setTextOnItem($item, "#eventDate", itemData.formattedDate);
    setTextOnItem($item, "#eventCategory", itemData.category);
    setTextOnItem($item, "#eventDescription", itemData.description);
    setTextOnItem($item, "#eventAvailability", itemData.availability);

    const button = $item("#eventActionButton");
    if (button) {
      if ("label" in button) {
        button.label = itemData.registrationRequired ? "Register" : "View Details";
      } else if ("text" in button) {
        button.text = itemData.registrationRequired ? "Register" : "View Details";
      }
      if (typeof button.onClick === "function") {
        button.onClick(() => wixLocation.to(`/event-details?eventId=${itemData._id}`));
      }
    }
  });

  if (emptyState && typeof emptyState.hide === "function") emptyState.hide();
  if (section && typeof section.show === "function") section.show();
}

function renderSpotlights(spotlights) {
  const repeater = getElement("#spotlightRepeater");
  const emptyState = getElement("#spotlightEmptyState");
  if (!repeater) {
    console.warn("Homepage: #spotlightRepeater not found");
    return;
  }

  if (!spotlights || spotlights.length === 0) {
    repeater.data = [];
    if (emptyState && typeof emptyState.show === "function") emptyState.show();
    return;
  }

  repeater.data = spotlights;
  repeater.onItemReady(($item, itemData) => {
    setTextOnItem($item, "#spotlightName", itemData.name);
    setTextOnItem($item, "#spotlightBio", itemData.bio);
    setTextOnItem($item, "#spotlightSpecialties", itemData.specialties);
    const image = $item("#spotlightImage");
    if (image && itemData.profileImage) {
      image.src = itemData.profileImage;
      if ("alt" in image) image.alt = `${itemData.name} bonsai member`;
    }
  });

  if (emptyState && typeof emptyState.hide === "function") emptyState.hide();
}

async function renderAnnouncements() {
  const announcementsText = getElement("#announcementText");
  if (!announcementsText) return;

  const events = await eventSystem.loadEvents({ status: "upcoming" });
  const highlighted = events
    .filter((event) => event.featured)
    .slice(0, 1)
    .map((event) => `${event.title} on ${formatEventDate(event)}`);

  if (highlighted.length > 0) {
    announcementsText.text = `Featured: ${highlighted[0]}`;
  } else {
    announcementsText.text = "Our next monthly meeting is just around the corner—see the Events page for details.";
  }
}

function setupCtas() {
  bindNavigation("#ctaJoinButton", "/join-brbs");
  bindNavigation("#ctaEventsButton", "/events");
  bindNavigation("#ctaLearningButton", "/learn");
  bindNavigation("#ctaAboutButton", "/about-brbs");
  const allEventsButton = getElement("#viewAllEventsButton");
  if (allEventsButton && typeof allEventsButton.onClick === "function") {
    allEventsButton.onClick(() => wixLocation.to("/events"));
  }
}

function bindNavigation(selector, url) {
  const element = getElement(selector);
  if (!element || typeof element.onClick !== "function") return;
  element.onClick(() => wixLocation.to(url));
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
  const start = ensureDate(event.startDate);
  const end = ensureDate(event.endDate) || start;
  if (!start) return "Date TBA";

  const dateOptions = { month: "short", day: "numeric" };
  const timeOptions = { hour: "numeric", minute: "2-digit" };
  const startDate = start.toLocaleDateString("en-US", dateOptions);
  const startTime = start.toLocaleTimeString("en-US", timeOptions);
  const endTime = end ? end.toLocaleTimeString("en-US", timeOptions) : null;
  return endTime ? `${startDate} · ${startTime} – ${endTime}` : `${startDate} · ${startTime}`;
}

function ensureDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatNumber(value) {
  if (value === null || value === undefined) return "";
  return Number(value).toLocaleString();
}

function showError(message) {
  setText("#homeErrorMessage", message);
  const errorBox = getElement("#homeErrorBox");
  if (errorBox && typeof errorBox.show === "function") errorBox.show();
}
