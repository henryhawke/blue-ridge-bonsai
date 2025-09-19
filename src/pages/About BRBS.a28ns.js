// @ts-nocheck
// Blue Ridge Bonsai Society - About page logic
// Loads mission, board, FAQ, and partnership information from backend/site-data.

import wixLocation from "wix-location";
import { fetchAboutContent } from "public/js/data-service.js";

let aboutContent;

$w.onReady(async function () {
  try {
    aboutContent = await fetchAboutContent();
    renderMissionAndVision(aboutContent);
    renderValues(aboutContent.coreValues);
    renderBoard(aboutContent.board);
    renderPartnership(aboutContent.partnership);
    renderFaq(aboutContent.faq);
    renderMeetingInfo(aboutContent.meetingInfo, aboutContent.statistics);
    console.log("✅ About page ready");
  } catch (error) {
    console.error("Failed to initialize About page", error);
    setText("#aboutErrorMessage", "We could not load our society details right now.");
    const errorBox = getElement("#aboutErrorBox");
    if (errorBox && typeof errorBox.show === "function") errorBox.show();
  }
});

function renderMissionAndVision(content) {
  if (!content) return;
  setText("#missionTitle", "Our Mission");
  setText("#missionText", content.mission);
  setText("#visionTitle", "Our Vision");
  setText("#visionText", content.vision);
}

function renderValues(values) {
  const repeater = getElement("#valuesRepeater");
  if (!repeater || !values) return;

  repeater.data = values;
  repeater.onItemReady(($item, itemData) => {
    setTextOnItem($item, "#valueTitle", itemData.title);
    setTextOnItem($item, "#valueDescription", itemData.description);
  });
}

function renderBoard(boardMembers) {
  const repeater = getElement("#boardRepeater");
  if (!repeater || !Array.isArray(boardMembers)) return;

  repeater.data = boardMembers;
  repeater.onItemReady(($item, member) => {
    setTextOnItem($item, "#boardName", member.name);
    setTextOnItem($item, "#boardRole", member.role);
    setTextOnItem($item, "#boardBio", member.bio);

    const image = $item("#boardImage");
    if (image && member.photo) {
      image.src = member.photo;
      if ("alt" in image) image.alt = `${member.name} portrait`;
    }

    const contactButton = $item("#boardContactButton");
    if (contactButton && typeof contactButton.onClick === "function") {
      const mailto = member.contactInfo ? `mailto:${member.contactInfo}` : "/contact";
      contactButton.onClick(() => wixLocation.to(mailto));
    }
  });
}

function renderPartnership(partnership) {
  if (!partnership) return;
  setText("#partnershipHeading", partnership.partnerName || "Community Partnership");
  setText("#partnershipDescription", partnership.content);

  const linkRepeater = getElement("#partnershipLinksRepeater");
  if (linkRepeater && partnership.links) {
    linkRepeater.data = partnership.links;
    linkRepeater.onItemReady(($item, link) => {
      const button = $item("#partnershipLinkButton");
      if (button) {
        if ("label" in button) button.label = link.title;
        if (typeof button.onClick === "function") {
          button.onClick(() => wixLocation.to(link.url));
        }
      }
    });
  }

  const gallery = getElement("#partnershipGallery");
  if (gallery && partnership.images && Array.isArray(partnership.images) && gallery.items !== undefined) {
    gallery.items = partnership.images.map((src) => ({ src, title: partnership.partnerName }));
  }
}

function renderFaq(faqItems) {
  const repeater = getElement("#faqRepeater");
  if (!repeater || !faqItems) return;

  repeater.data = faqItems;
  repeater.onItemReady(($item, itemData) => {
    setTextOnItem($item, "#faqQuestion", itemData.question);
    setTextOnItem($item, "#faqAnswer", itemData.answer);
  });
}

function renderMeetingInfo(info, stats) {
  if (!info) return;
  setText("#meetingSchedule", info.schedule);
  setText("#meetingLocation", info.location);
  if (info.nextMeeting) {
    const nextDate = new Date(info.nextMeeting);
    setText(
      "#meetingNext",
      `Next meeting: ${nextDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
    );
  } else {
    setText("#meetingNext", "Check our Events page for the next meeting date.");
  }
  setText("#meetingVisitorPolicy", info.visitorPolicy);

  if (stats) {
    setText("#aboutMemberCount", `${stats.activeMembers || "–"} active members`);
    setText("#aboutWorkshopCount", `${stats.annualPrograms || "–"} annual workshops`);
    setText("#aboutFounded", `Founded in ${stats.yearsActive}`);
  }
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
