// @ts-nocheck
/**
 * BLUE RIDGE BONSAI SOCIETY - ABOUT US PAGE
 */
import wixData from "wix-data";
import wixLocation from "wix-location";
import wixWindow from "wix-window";

$w.onReady(function () {
  console.log("🚀 Initializing About Us Page");
  initializeAboutPage();
});

function stripHtml(input) {
  return String(input)
    .replace(/<[^>]*>/g, "")
    .trim();
}

function setContent(selector, htmlString) {
  try {
    const el = $w(selector);
    if (!el) {
      console.warn(`Element not found: ${selector}`);
      return false;
    }
    console.log(`Rendering into ${selector} (type: ${el.type || "unknown"})`);
    if (typeof el.html === "string" || typeof el.html === "undefined") {
      if ("html" in el) {
        el.html = htmlString;
        return true;
      }
    }
    if ("text" in el) {
      el.text = stripHtml(htmlString);
      return true;
    }
    console.warn(`Element ${selector} does not support html/text. Skipping.`);
    return false;
  } catch (e) {
    console.error(`Failed to set content for ${selector}:`, e);
    return false;
  }
}

function setContentAnywhere(preferredSelectors, htmlString) {
  for (const selector of preferredSelectors) {
    if (setContent(selector, htmlString)) return true;
  }
  try {
    const texts = $w("Text");
    if (texts && texts.length) {
      const target = texts.find((t) => t.visible && "html" in t) || texts[0];
      if (target && "html" in target) {
        target.html = htmlString;
        console.warn(
          `Fallback: rendered into first Text element with id ${
            target.id || "(unknown)"
          }`
        );
        return true;
      }
      if (target && "text" in target) {
        target.text = stripHtml(htmlString);
        console.warn(
          `Fallback: rendered text into first Text element with id ${
            target.id || "(unknown)"
          }`
        );
        return true;
      }
    }
  } catch (e) {
    console.error("Fallback rendering failed:", e);
  }
  console.warn("No writable container found for content.");
  return false;
}

async function initializeAboutPage() {
  try {
    setupEventHandlers();
    await displayMissionVision();
    await loadBoardMembers();
    await displayPartnershipInfo();
    await loadFAQ();
    await displayMeetingInfo();
    await loadDynamicContent();
    initializeAnimations();
    if (typeof document !== "undefined") {
      console.log("BRBS About: code executed");
    }
    console.log("✅ About Us Page initialization complete.");
  } catch (error) {
    console.error("❌ Error initializing About page:", error);
  }
}

function displayMissionVision() {
  const missionContent = `...`; // Content omitted for brevity
  setContentAnywhere(["#missionVisionContainer"], missionContent);
  $w("#missionVisionSection").show();
}

async function loadBoardMembers() {
  // This would fetch from a 'BoardMembers' collection in a real app
  const boardMembers = {
    items: [
      /* Mock data */
    ],
  };
  if (boardMembers.items.length > 0) {
    displayBoardMembers(boardMembers.items);
  } else {
    displayDefaultBoard();
  }
  $w("#boardMembersSection").show();
}

function displayBoardMembers(members) {
  const boardHTML = members.map((member) => `...`).join("");
  const content = `
        <html><head><style>...</style></head><body>
        <div class="board-header">...</div>
        <div class="board-members-grid" id="board-grid">${boardHTML}</div>
        <script>
            document.getElementById('board-grid').addEventListener('click', (event) => {
                const button = event.target.closest('button[data-action]');
                if (button) {
                    window.parent.postMessage({
                        type: 'boardAction',
                        action: button.dataset.action,
                        payload: { email: button.dataset.email, name: button.dataset.name }
                    }, '*');
                }
            });
        <\/script>
        </body></html>`;
  setContentAnywhere(["#boardMembersContainer"], content);
}

function displayDefaultBoard() {
  const boardHTML = `...`;
  const content = `
        <html><head><style>...</style></head><body>
        <div class="board-header">...</div>
        <div class="board-members-grid" id="board-grid">${boardHTML}</div>
        <script>
            document.getElementById('board-grid').addEventListener('click', (event) => {
                const button = event.target.closest('button[data-action]');
                if (button && button.dataset.action === 'join') {
                    window.parent.postMessage({ type: 'boardAction', action: 'join' }, '*');
                }
            });
        <\/script>
        </body></html>`;
  setContentAnywhere(["#boardMembersContainer"], content);
}

function displayPartnershipInfo() {
  const partnershipContent = `...`; // HTML with postMessage script
  setContentAnywhere(["#partnershipContainer"], partnershipContent);
  $w("#partnershipSection").show();
}

async function loadFAQ() {
  const faqItems = {
    items: [
      /* Mock data */
    ],
  };
  if (faqItems.items.length > 0) {
    displayFAQ(faqItems.items);
  } else {
    displayDefaultFAQ();
  }
  $w("#faqSection").show();
}

function displayFAQ(faqItems) {
  const faqShell = `...`; // HTML with postMessage script
  const faqContainer = $w("#faqContainer");
  if (faqContainer && typeof faqContainer.onMessage === "function") {
    faqContainer.html = faqShell;
    setTimeout(() => faqContainer.postMessage(faqItems), 100);
  } else {
    // Fallback render as plain HTML/text if not an HtmlComponent
    setContentAnywhere(
      ["#faqContainer"],
      `<div>${(faqItems || []).map(() => "...").join("")}</div>`
    );
  }
}

function displayDefaultFAQ() {
  const defaultFAQ = [
    /* Mock data */
  ];
  displayFAQ(defaultFAQ);
}

function displayMeetingInfo() {
  const meetingContent = `...`; // HTML with postMessage script
  setContentAnywhere(["#meetingInfoContainer"], meetingContent);
  $w("#meetingInfoSection").show();
}

function initializeAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("animate-in");
      });
    },
    { threshold: 0.1 }
  );

  setTimeout(() => {
    const cards = document.querySelectorAll(".glass-card");
    cards.forEach((card) => observer.observe(card));
  }, 500);
}

async function loadDynamicContent() {
  await loadSocietyStats();
  await loadRecentAchievements();
}

async function loadSocietyStats() {
  const memberCount = await wixData
    .query("Members")
    .eq("isActive", true)
    .count();
  // ... more logic
  setContentAnywhere(["#societyStatsContainer"], `...`);
  $w("#societyStatsSection").show();
}

async function loadRecentAchievements() {
  // ... logic
  setContentAnywhere(["#achievementsContainer"], `...`);
  $w("#achievementsSection").show();
}

function setupEventHandlers() {
  const componentMap = {
    "#boardMembersContainer": handleBoardAction,
    "#partnershipContainer": handlePartnershipAction,
    "#meetingInfoContainer": handleMeetingAction,
  };

  for (const selector in componentMap) {
    const element = $w(selector);
    if (element && element.onMessage) {
      element.onMessage((event) => componentMap[selector](event.data));
    }
  }
}

function handleBoardAction(data) {
  if (data && data.type === "boardAction") {
    if (data.action === "contact" && data.payload) {
      const { email, name } = data.payload;
      wixLocation.to(
        `mailto:${email}?subject=Inquiry from BRBS Website - ${name}`
      );
    } else if (data.action === "join") {
      wixLocation.to("/join-brbs");
    }
  }
}

function handlePartnershipAction(data) {
  if (data && data.type === "partnershipAction") {
    if (data.action === "visitArboretum") {
      wixWindow.openLightbox("arboretum-info");
    } else if (data.action === "viewUpcomingWorkshops") {
      wixLocation.to("/events?category=workshop&location=arboretum");
    }
  }
}

function handleMeetingAction(data) {
  if (data && data.type === "meetingAction") {
    if (data.action === "viewUpcomingMeetings") {
      wixLocation.to("/events?category=meeting");
    } else if (data.action === "getDirections") {
      wixWindow.openLightbox("directions-modal");
    }
  }
}
