/*
  BRBS Scaffold Custom Element
  Purpose: Paste a single custom element into a Wix page to render a full set
  of placeholder UI elements for that page. This does NOT create native Wix ($w)
  elements; it renders HTML placeholders for quick scaffolding.

  Wix usage (Velo custom element):
  1) Place this file where your site can host it (public URL) or bundle to /public.
  2) In Wix Editor/Studio: Add → Embed & Social → Custom Element
  3) Choose Source: Server URL (external) or Velo file (if hosted under public/)
  4) Tag name: brbs-scaffold
  5) Attribute: page="home|about|events|learning|photos|gallery-view|join|event-details"
*/

(() => {
  const TAG_NAME = "brbs-scaffold";

  const createElement = (tagName, attributes = {}, textContent = "") => {
    const element = document.createElement(tagName);
    for (const [key, value] of Object.entries(attributes)) {
      if (value === undefined || value === null) continue;
      if (key === "class") {
        element.className = String(value);
      } else if (key === "dataset" && typeof value === "object") {
        for (const [dataKey, dataVal] of Object.entries(value)) {
          element.dataset[dataKey] = String(dataVal);
        }
      } else if (key in element) {
        try {
          element[key] = value;
        } catch {
          element.setAttribute(key, String(value));
        }
      } else {
        element.setAttribute(key, String(value));
      }
    }
    if (textContent) element.textContent = textContent;
    return element;
  };

  const SECTION_TITLE_CLASS = "brbs-section-title";
  const CARD_CLASS = "brbs-card";
  const REPEATER_CLASS = "brbs-repeater";
  const SKELETON_CLASS = "brbs-skeleton";

  const styleBlock = `
    .brbs-grid { display: grid; gap: 16px; }
    .brbs-row { display: flex; flex-wrap: wrap; gap: 12px; }
    .${SECTION_TITLE_CLASS} { font-weight: 600; font-size: 1.25rem; margin: 8px 0; }
    .${CARD_CLASS} { border: 1px solid rgba(0,0,0,0.1); border-radius: 8px; padding: 12px; background: rgba(255,255,255,0.65); backdrop-filter: blur(6px); }
    .${REPEATER_CLASS} { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
    .${SKELETON_CLASS} { background: linear-gradient(90deg, rgba(0,0,0,0.06), rgba(0,0,0,0.12), rgba(0,0,0,0.06)); background-size: 200% 100%; animation: brbs-skeleton 1.4s ease-in-out infinite; border-radius: 6px; }
    @keyframes brbs-skeleton { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    .brbs-btn { display: inline-block; padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.15); background: #FEFFFE; cursor: pointer; }
    .brbs-muted { color: rgba(0,0,0,0.65); font-size: 0.9rem; }
    .brbs-badge { display:inline-block; padding: 2px 6px; border-radius: 4px; background: rgba(0,0,0,0.06); font-size: 0.75rem; }
  `;

  const PAGE_SCAFFOLDS = {
    home: [
      { type: "text", id: "heroTitle", label: "Hero Title" },
      { type: "text", id: "heroSubtitle", label: "Hero Subtitle" },
      { type: "text", id: "heroDescription", label: "Hero Description" },
      { type: "button", id: "ctaJoinButton", label: "Join" },
      { type: "button", id: "ctaEventsButton", label: "Events" },
      { type: "button", id: "ctaLearningButton", label: "Learning" },
      { type: "button", id: "ctaAboutButton", label: "About" },
      { type: "text", id: "statMembers", label: "Members Count" },
      { type: "text", id: "statEvents", label: "Upcoming Events Count" },
      { type: "text", id: "statWorkshops", label: "Workshops Count" },
      { type: "repeater", id: "eventsRepeater", label: "Featured Events" },
      { type: "repeater", id: "spotlightRepeater", label: "Member Spotlights" },
      { type: "text", id: "announcementText", label: "Announcement" },
      { type: "button", id: "viewAllEventsButton", label: "View All Events" },
      { type: "box", id: "homeErrorBox", label: "Error Box" },
      { type: "text", id: "homeErrorMessage", label: "Error Message" },
    ],
    about: [
      { type: "text", id: "missionTitle", label: "Mission Title" },
      { type: "text", id: "missionText", label: "Mission Text" },
      { type: "text", id: "visionTitle", label: "Vision Title" },
      { type: "text", id: "visionText", label: "Vision Text" },
      { type: "repeater", id: "valuesRepeater", label: "Core Values" },
      { type: "repeater", id: "boardRepeater", label: "Board Members" },
      { type: "text", id: "partnershipHeading", label: "Partnership Heading" },
      {
        type: "text",
        id: "partnershipDescription",
        label: "Partnership Description",
      },
      {
        type: "repeater",
        id: "partnershipLinksRepeater",
        label: "Partnership Links",
      },
      {
        type: "gallery",
        id: "partnershipGallery",
        label: "Partnership Gallery",
      },
      { type: "repeater", id: "faqRepeater", label: "FAQ" },
      { type: "text", id: "meetingSchedule", label: "Meeting Schedule" },
      { type: "text", id: "meetingLocation", label: "Meeting Location" },
      { type: "text", id: "meetingNext", label: "Next Meeting" },
      { type: "text", id: "meetingVisitorPolicy", label: "Visitor Policy" },
      { type: "text", id: "aboutMemberCount", label: "About Member Count" },
      { type: "text", id: "aboutWorkshopCount", label: "About Workshop Count" },
      { type: "text", id: "aboutFounded", label: "Founded" },
      { type: "box", id: "aboutErrorBox", label: "Error Box" },
      { type: "text", id: "aboutErrorMessage", label: "Error Message" },
    ],
    events: [
      { type: "dropdown", id: "categoryFilter", label: "Category Filter" },
      { type: "dropdown", id: "difficultyFilter", label: "Difficulty Filter" },
      { type: "dropdown", id: "statusFilter", label: "Status Filter" },
      { type: "input", id: "searchInput", label: "Search" },
      { type: "button", id: "gridViewBtn", label: "Grid View" },
      { type: "button", id: "calendarViewBtn", label: "Calendar View" },
      { type: "box", id: "eventsGridSection", label: "Events Grid Section" },
      { type: "box", id: "calendarSection", label: "Calendar Section" },
      { type: "box", id: "eventsLoading", label: "Loading" },
      { type: "text", id: "eventsErrorMessage", label: "Error Message" },
      { type: "box", id: "eventsErrorBox", label: "Error Box" },
      { type: "text", id: "eventsCountText", label: "Count" },
      { type: "text", id: "statsUpcoming", label: "Upcoming Stat" },
      { type: "text", id: "statsFeatured", label: "Featured Stat" },
      { type: "text", id: "statsFillRate", label: "Fill Rate Stat" },
      { type: "repeater", id: "eventsRepeater", label: "Events Repeater" },
      { type: "box", id: "eventsEmptyState", label: "Empty State" },
      { type: "html", id: "calendarHtml", label: "Calendar HTML" },
      { type: "text", id: "calendarMonthLabel", label: "Calendar Month" },
      { type: "button", id: "calendarPrevBtn", label: "Prev Month" },
      { type: "button", id: "calendarNextBtn", label: "Next Month" },
    ],
    learning: [
      { type: "button", id: "tabBeginner", label: "Tab Beginner" },
      { type: "button", id: "tabKnowledge", label: "Tab Knowledge" },
      { type: "button", id: "tabResources", label: "Tab Resources" },
      { type: "button", id: "tabVendors", label: "Tab Vendors" },
      { type: "input", id: "learningSearch", label: "Search" },
      { type: "dropdown", id: "learningCategory", label: "Category" },
      { type: "dropdown", id: "learningDifficulty", label: "Difficulty" },
      { type: "box", id: "beginnersSection", label: "Beginners Section" },
      { type: "box", id: "knowledgeSection", label: "Knowledge Section" },
      { type: "box", id: "resourcesSection", label: "Resources Section" },
      { type: "box", id: "vendorsSection", label: "Vendors Section" },
      { type: "repeater", id: "beginnerRepeater", label: "Beginner Steps" },
      { type: "repeater", id: "knowledgeRepeater", label: "Articles" },
      { type: "repeater", id: "resourcesRepeater", label: "Resources" },
      { type: "repeater", id: "vendorsRepeater", label: "Vendors" },
      { type: "box", id: "learningErrorBox", label: "Error Box" },
      { type: "text", id: "learningErrorMessage", label: "Error Message" },
    ],
    photos: [
      { type: "repeater", id: "galleriesRepeater", label: "Galleries" },
      { type: "button", id: "viewGalleryBtn", label: "View Gallery" },
      { type: "box", id: "loadingBox", label: "Loading" },
      { type: "box", id: "emptyStateBox", label: "Empty State" },
    ],
    "gallery-view": [
      {
        type: "gallery",
        id: "proGallery1",
        label: "Wix Pro Gallery Placeholder",
      },
      { type: "box", id: "loadingBox", label: "Loading" },
      { type: "box", id: "emptyStateBox", label: "Empty State" },
    ],
    join: [
      { type: "box", id: "applicationForm", label: "Application Form" },
      { type: "input", id: "firstNameField", label: "First Name" },
      { type: "input", id: "lastNameField", label: "Last Name" },
      { type: "input", id: "emailField", label: "Email" },
      { type: "input", id: "phoneField", label: "Phone" },
      {
        type: "dropdown",
        id: "membershipLevelSelect",
        label: "Membership Level",
      },
      { type: "text", id: "formFeedback", label: "Form Feedback" },
    ],
    "event-details": [
      { type: "box", id: "commentsSection", label: "Comments Section" },
      { type: "box", id: "commentsContainer", label: "Comments Container" },
      { type: "box", id: "relatedEventsSection", label: "Related Events" },
      { type: "button", id: "registerButton", label: "Register" },
      {
        type: "button",
        id: "cancelRegistrationButton",
        label: "Cancel Registration",
      },
    ],
  };

  const renderPlaceholder = (spec) => {
    const commonAttrs = {
      class: `${CARD_CLASS}`,
      dataset: { wixId: spec.id, wixType: spec.type },
    };
    switch (spec.type) {
      case "text": {
        const el = createElement("div", commonAttrs);
        el.append(
          createElement(
            "div",
            { class: SECTION_TITLE_CLASS },
            spec.label || spec.id
          ),
          createElement("div", {
            class: `${SKELETON_CLASS}`,
            style: "height:18px;width:60%;",
          })
        );
        return el;
      }
      case "button": {
        const el = createElement("div", commonAttrs);
        el.append(
          createElement(
            "button",
            { class: "brbs-btn", type: "button" },
            spec.label || spec.id
          )
        );
        return el;
      }
      case "dropdown": {
        const el = createElement("div", commonAttrs);
        el.append(
          createElement("div", { class: "brbs-muted" }, spec.label || spec.id),
          createElement("select", { class: "brbs-btn" }, "")
        );
        el.querySelector("select")?.append(
          createElement("option", {}, "Option 1"),
          createElement("option", {}, "Option 2")
        );
        return el;
      }
      case "input": {
        const el = createElement("div", commonAttrs);
        el.append(
          createElement("div", { class: "brbs-muted" }, spec.label || spec.id),
          createElement("input", {
            class: "brbs-btn",
            type: "text",
            placeholder: spec.label || spec.id,
          })
        );
        return el;
      }
      case "repeater": {
        const el = createElement("div", { class: `${CARD_CLASS}` });
        const grid = createElement("div", {
          class: REPEATER_CLASS,
          dataset: { wixId: spec.id },
        });
        for (let i = 0; i < 4; i += 1) {
          const card = createElement("div", { class: CARD_CLASS });
          card.append(
            createElement("div", {
              class: `${SKELETON_CLASS}`,
              style: "height:120px;width:100%;margin-bottom:8px;",
            }),
            createElement("div", {
              class: `${SKELETON_CLASS}`,
              style: "height:16px;width:70%;margin-bottom:6px;",
            }),
            createElement("div", {
              class: `${SKELETON_CLASS}`,
              style: "height:12px;width:50%;",
            })
          );
          grid.append(card);
        }
        el.append(
          createElement(
            "div",
            { class: SECTION_TITLE_CLASS },
            spec.label || spec.id
          ),
          grid
        );
        return el;
      }
      case "gallery": {
        const el = createElement("div", commonAttrs);
        const row = createElement("div", { class: "brbs-row" });
        for (let i = 0; i < 6; i += 1) {
          row.append(
            createElement("div", {
              class: `${SKELETON_CLASS}`,
              style: "height:80px;width:120px;",
            })
          );
        }
        el.append(
          createElement(
            "div",
            { class: SECTION_TITLE_CLASS },
            spec.label || spec.id
          ),
          row
        );
        return el;
      }
      case "box": {
        const el = createElement("div", commonAttrs);
        el.append(
          createElement("div", { class: "brbs-muted" }, spec.label || spec.id)
        );
        return el;
      }
      case "html": {
        const el = createElement("div", commonAttrs);
        el.append(createElement("code", {}, `<div id="${spec.id}"></div>`));
        return el;
      }
      default: {
        const el = createElement("div", commonAttrs);
        el.append(
          createElement("div", { class: "brbs-muted" }, spec.label || spec.id)
        );
        return el;
      }
    }
  };

  const normalizePageKey = (value) =>
    String(value || "")
      .trim()
      .toLowerCase();

  class BrbsScaffold extends HTMLElement {
    static get observedAttributes() {
      return ["page"];
    }

    constructor() {
      super();
      this._renderedPage = "";
    }

    connectedCallback() {
      if (!this.querySelector("style[data-brbs-scaffold-style]")) {
        const style = createElement("style", {
          "data-brbs-scaffold-style": "true",
        });
        style.textContent = styleBlock;
        this.append(style);
      }
      this.render();
    }

    attributeChangedCallback() {
      this.render();
    }

    render() {
      const pageKey = normalizePageKey(this.getAttribute("page"));
      const specs = PAGE_SCAFFOLDS[pageKey];

      for (const node of Array.from(this.childNodes)) {
        if (
          !(
            node.nodeName === "STYLE" &&
            node.getAttribute("data-brbs-scaffold-style") === "true"
          )
        ) {
          this.removeChild(node);
        }
      }

      this.append(
        createElement("div", { class: SECTION_TITLE_CLASS }, "BRBS Scaffold"),
        createElement(
          "div",
          { class: "brbs-muted" },
          specs
            ? `Page: ${pageKey}`
            : 'Set the "page" attribute to render placeholders.'
        )
      );

      if (!specs) {
        const usage = createElement("div", { class: CARD_CLASS });
        usage.append(
          createElement("div", { class: "brbs-muted" }, "Usage:"),
          createElement(
            "code",
            {},
            '<brbs-scaffold page="home"></brbs-scaffold>'
          ),
          createElement(
            "div",
            { class: "brbs-muted", style: "margin-top:6px;" },
            "Pages: home, about, events, learning, photos, gallery-view, join, event-details"
          )
        );
        this.append(usage);
        this.dispatchEvent(
          new CustomEvent("brbs-scaffold-ready", {
            detail: { page: null, ids: [] },
            bubbles: true,
          })
        );
        return;
      }

      const grid = createElement("div", { class: "brbs-grid" });
      const createdIds = [];
      for (const spec of specs) {
        grid.append(renderPlaceholder(spec));
        createdIds.push(spec.id);
      }
      this.append(grid);

      this._renderedPage = pageKey;
      this.dispatchEvent(
        new CustomEvent("brbs-scaffold-ready", {
          detail: { page: pageKey, ids: createdIds },
          bubbles: true,
        })
      );
      try {
        console.info(
          `[${TAG_NAME}] Rendered ${createdIds.length} placeholders for page="${pageKey}"`,
          createdIds
        );
      } catch {}
    }

    getScaffoldInfo() {
      const pageKey = this._renderedPage;
      const ids = (PAGE_SCAFFOLDS[pageKey] || []).map((s) => s.id);
      return { page: pageKey, ids };
    }
  }

  if (!customElements.get(TAG_NAME)) {
    customElements.define(TAG_NAME, BrbsScaffold);
  }
})();
