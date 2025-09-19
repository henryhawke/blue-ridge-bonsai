// @ts-nocheck
// Blue Ridge Bonsai Society - Learning Center page
// Provides four sections: Beginner pathway, knowledge base, resources, and vendors.

import wixLocation from "wix-location";
import { LearningSystem } from "public/js/learning-system.js";

const learningSystem = new LearningSystem();
let beginnerSteps = [];
let articles = [];
let resources = [];
let vendors = [];
let activeTab = "beginner";
let filters = {
  search: "",
  difficulty: "all",
  category: "all",
};
let debounceTimer;

$w.onReady(async function () {
  try {
    beginnerSteps = await learningSystem.loadBeginnerPathway();
    articles = await learningSystem.loadArticles();
    resources = await learningSystem.loadResources();
    vendors = await learningSystem.loadVendors();

    populateFilters();
    renderCurrentTab();
    setupHandlers();
    console.log("✅ Learning Center ready");
  } catch (error) {
    console.error("Learning Center initialization failed", error);
    showError("We couldn't load the learning content. Please refresh the page.");
  }
});

function populateFilters() {
  const categoryFilter = getElement("#learningCategory");
  const difficultyFilter = getElement("#learningDifficulty");

  if (categoryFilter) {
    const categories = new Set(["all"]);
    articles.forEach((article) => categories.add(article.category));
    categoryFilter.options = Array.from(categories).map((value) => ({
      label: value === "all" ? "All topics" : value,
      value,
    }));
    categoryFilter.value = filters.category;
  }

  if (difficultyFilter) {
    const difficulties = new Set(["all"]);
    articles.forEach((article) => {
      if (article.difficulty) difficulties.add(article.difficulty);
    });
    difficultyFilter.options = Array.from(difficulties).map((value) => ({
      label: value === "all" ? "All levels" : value,
      value,
    }));
    difficultyFilter.value = filters.difficulty;
  }
}

function setupHandlers() {
  bindTab("#tabBeginner", "beginner");
  bindTab("#tabKnowledge", "knowledge");
  bindTab("#tabResources", "resources");
  bindTab("#tabVendors", "vendors");

  const searchInput = getElement("#learningSearch");
  if (searchInput && typeof searchInput.onInput === "function") {
    searchInput.onInput(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        filters.search = searchInput.value || "";
        renderFilteredContent();
      }, 250);
    });
  }

  const categoryFilter = getElement("#learningCategory");
  if (categoryFilter && typeof categoryFilter.onChange === "function") {
    categoryFilter.onChange(() => {
      filters.category = categoryFilter.value || "all";
      renderFilteredContent();
    });
  }

  const difficultyFilter = getElement("#learningDifficulty");
  if (difficultyFilter && typeof difficultyFilter.onChange === "function") {
    difficultyFilter.onChange(() => {
      filters.difficulty = difficultyFilter.value || "all";
      renderFilteredContent();
    });
  }
}

function bindTab(selector, tabName) {
  const button = getElement(selector);
  if (button && typeof button.onClick === "function") {
    button.onClick(() => {
      activeTab = tabName;
      renderCurrentTab();
    });
  }
}

function renderCurrentTab() {
  toggleSection("#beginnersSection", activeTab === "beginner");
  toggleSection("#knowledgeSection", activeTab === "knowledge");
  toggleSection("#resourcesSection", activeTab === "resources");
  toggleSection("#vendorsSection", activeTab === "vendors");

  renderFilteredContent();
}

function toggleSection(selector, isVisible) {
  const element = getElement(selector);
  if (!element) return;
  if (isVisible) {
    if (typeof element.show === "function") element.show();
  } else if (typeof element.hide === "function") {
    element.hide();
  }
}

function renderFilteredContent() {
  if (activeTab === "beginner") {
    renderBeginnerSteps();
  } else if (activeTab === "knowledge") {
    renderArticles();
  } else if (activeTab === "resources") {
    renderResources();
  } else if (activeTab === "vendors") {
    renderVendors();
  }
}

function renderBeginnerSteps() {
  const repeater = getElement("#beginnerRepeater");
  if (!repeater) return;
  repeater.data = beginnerSteps;
  repeater.onItemReady(($item, step) => {
    setTextOnItem($item, "#stepTitle", step.title);
    setTextOnItem($item, "#stepSummary", step.summary);
    setTextOnItem($item, "#stepFocus", step.focus);
    const resourcesList = Array.isArray(step.resources) ? step.resources.join(", ") : step.resources;
    setTextOnItem($item, "#stepResources", resourcesList);
  });
}

function renderArticles() {
  const repeater = getElement("#knowledgeRepeater");
  const filtered = articles.filter((article) => {
    if (filters.category !== "all" && article.category !== filters.category) return false;
    if (filters.difficulty !== "all" && article.difficulty !== filters.difficulty) return false;
    if (filters.search) {
      const haystack = [article.title, article.excerpt, article.content]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(filters.search.toLowerCase())) return false;
    }
    return true;
  });

  if (!repeater) return;
  repeater.data = filtered;
  repeater.onItemReady(($item, article) => {
    setTextOnItem($item, "#articleTitle", article.title);
    setTextOnItem($item, "#articleExcerpt", article.excerpt);
    setTextOnItem($item, "#articleMeta", `${article.difficulty || "All Levels"} · ${article.readTime || 5} min read`);
    const button = $item("#articleReadButton");
    if (button && typeof button.onClick === "function") {
      button.onClick(() => {
        if (article.link) {
          wixLocation.to(article.link);
        }
      });
    }
  });
}

function renderResources() {
  const repeater = getElement("#resourcesRepeater");
  if (!repeater) return;
  const filtered = resources.filter((resource) => {
    if (filters.search) {
      const haystack = [resource.name, resource.description].filter(Boolean).join(" ").toLowerCase();
      if (!haystack.includes(filters.search.toLowerCase())) return false;
    }
    return true;
  });
  repeater.data = filtered;
  repeater.onItemReady(($item, resource) => {
    setTextOnItem($item, "#resourceName", resource.name);
    setTextOnItem($item, "#resourceDescription", resource.description);
    setTextOnItem($item, "#resourceMeta", resource.category || resource.type);
    const button = $item("#resourceLinkButton");
    if (button && typeof button.onClick === "function") {
      button.onClick(() => {
        if (resource.url) {
          wixLocation.to(resource.url);
        }
      });
    }
  });
}

function renderVendors() {
  const repeater = getElement("#vendorsRepeater");
  if (!repeater) return;
  repeater.data = vendors;
  repeater.onItemReady(($item, vendor) => {
    setTextOnItem($item, "#vendorName", vendor.name);
    setTextOnItem($item, "#vendorLocation", vendor.location);
    setTextOnItem($item, "#vendorNotes", vendor.specialties || vendor.notes);
    const button = $item("#vendorContactButton");
    if (button && typeof button.onClick === "function") {
      button.onClick(() => {
        if (vendor.contact) {
          wixLocation.to(vendor.contact.startsWith("http") ? vendor.contact : `mailto:${vendor.contact}`);
        }
      });
    }
  });
}

function showError(message) {
  const errorText = getElement("#learningErrorMessage");
  if (errorText) errorText.text = message;
  const errorBox = getElement("#learningErrorBox");
  if (errorBox && typeof errorBox.show === "function") errorBox.show();
}

function getElement(selector) {
  try {
    return $w(selector);
  } catch (error) {
    return null;
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
