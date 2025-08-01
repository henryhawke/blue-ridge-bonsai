/**
 * BLUE RIDGE BONSAI SOCIETY - ABOUT US PAGE
 */
import wixData from "wix-data";
import wixLocation from "wix-location";
import wixWindow from "wix-window";
import wix_ui from 'wix-ui-core/ui';

$w.onReady(function () {
  console.log("🚀 Initializing About Us Page");
  initializeAboutPage();
});

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
    console.log("✅ About Us Page initialization complete.");
  } catch (error) {
    console.error("❌ Error initializing About page:", error);
  }
}

function displayMissionVision() {
    const missionContent = `...`; // Content omitted for brevity
    ($w("#missionVisionContainer") as wix_ui.HtmlComponent).html = missionContent;
    $w("#missionVisionSection").show();
}

async function loadBoardMembers() {
    // This would fetch from a 'BoardMembers' collection in a real app
    const boardMembers = { items: [ /* Mock data */ ] };
    if (boardMembers.items.length > 0) {
        displayBoardMembers(boardMembers.items);
    } else {
        displayDefaultBoard();
    }
    $w("#boardMembersSection").show();
}

function displayBoardMembers(members) {
    const boardHTML = members.map(member => `...`).join('');
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
    ($w("#boardMembersContainer") as wix_ui.HtmlComponent).html = content;
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
    ($w("#boardMembersContainer") as wix_ui.HtmlComponent).html = content;
}

function displayPartnershipInfo() {
    const partnershipContent = `...`; // HTML with postMessage script
    ($w("#partnershipContainer") as wix_ui.HtmlComponent).html = partnershipContent;
    $w("#partnershipSection").show();
}

async function loadFAQ() {
    const faqItems = { items: [ /* Mock data */ ] };
    if (faqItems.items.length > 0) {
        displayFAQ(faqItems.items);
    } else {
        displayDefaultFAQ();
    }
    $w("#faqSection").show();
}

function displayFAQ(faqItems) {
    const faqShell = `...`; // HTML with postMessage script
    const faqContainer = $w("#faqContainer") as wix_ui.HtmlComponent;
    if (faqContainer) {
        faqContainer.html = faqShell;
        setTimeout(() => faqContainer.postMessage(faqItems), 100);
    }
}

function displayDefaultFAQ() {
    const defaultFAQ = [ /* Mock data */ ];
    displayFAQ(defaultFAQ);
}

function displayMeetingInfo() {
    const meetingContent = `...`; // HTML with postMessage script
    ($w("#meetingInfoContainer") as wix_ui.HtmlComponent).html = meetingContent;
    $w("#meetingInfoSection").show();
}

function initializeAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("animate-in");
    });
  }, { threshold: 0.1 });

  setTimeout(() => {
    const cards = document.querySelectorAll(".glass-card");
    cards.forEach(card => observer.observe(card));
  }, 500);
}

async function loadDynamicContent() {
    await loadSocietyStats();
    await loadRecentAchievements();
}

async function loadSocietyStats() {
    const memberCount = await wixData.query("Members").eq("isActive", true).count();
    // ... more logic
    ($w("#societyStatsContainer") as wix_ui.HtmlComponent).html = `...`;
    $w("#societyStatsSection").show();
}

async function loadRecentAchievements() {
    // ... logic
    ($w("#achievementsContainer") as wix_ui.HtmlComponent).html = `...`;
    $w("#achievementsSection").show();
}

function setupEventHandlers() {
    const componentMap = {
        "#boardMembersContainer": handleBoardAction,
        "#partnershipContainer": handlePartnershipAction,
        "#meetingInfoContainer": handleMeetingAction
    };

    for (const selector in componentMap) {
        const element = $w(selector) as wix_ui.HtmlComponent;
        if (element && element.onMessage) {
            element.onMessage((event) => componentMap[selector](event.data));
        }
    }
}

function handleBoardAction(data) {
    if (data && data.type === 'boardAction') {
        if (data.action === 'contact' && data.payload) {
            const { email, name } = data.payload;
            wixLocation.to(`mailto:${email}?subject=Inquiry from BRBS Website - ${name}`);
        } else if (data.action === 'join') {
            wixLocation.to("/join-brbs");
        }
    }
}

function handlePartnershipAction(data) {
    if (data && data.type === 'partnershipAction') {
        if (data.action === 'visitArboretum') {
            wixWindow.openLightbox("arboretum-info");
        } else if (data.action === 'viewUpcomingWorkshops') {
            wixLocation.to("/events?category=workshop&location=arboretum");
        }
    }
}

function handleMeetingAction(data) {
    if (data && data.type === 'meetingAction') {
        if (data.action === 'viewUpcomingMeetings') {
            wixLocation.to("/events?category=meeting");
        } else if (data.action === 'getDirections') {
            wixWindow.openLightbox("directions-modal");
        }
    }
}
