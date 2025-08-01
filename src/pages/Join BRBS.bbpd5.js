/**
 * BLUE RIDGE BONSAI SOCIETY - JOIN BRBS MEMBERSHIP PAGE
 * This page displays membership levels and provides an application form.
 */

// Import backend functions
import {
  getMembershipLevels,
  submitMemberApplication
} from "backend/membership-backend.jsw";
import { MembershipSystem } from "public/js/membership-system.js";
import wix_ui from 'wix-ui-core/ui';

let membershipSystem;

$w.onReady(function () {
  console.log("🚀 Initializing Join BRBS Page");
  initializeJoinPage();
});

async function initializeJoinPage() {
  try {
    await displayMembershipLevels();
    setupEventHandlers();
    console.log("✅ Join BRBS Page initialization complete.");
  } catch (error) {
    console.error("❌ Error initializing Join BRBS Page:", error);
    showFeedback("Could not initialize the page. Please refresh and try again.", "error");
  }
}

async function displayMembershipLevels() {
  try {
// <<<<<<< fix-velo-errors
//     const levels = await membershipSystem.loadMembershipLevels();
//     const options = levels.map(level => ({
//       label: `${level.name} - $${level.price}/year`,
//       value: level._id
//     }));

//     const membershipSelect = $w<wix_ui.Dropdown>("#membershipLevelSelect");
//     if (membershipSelect) {
//         membershipSelect.options = options;
//         membershipSelect.placeholder = "Choose a membership level";
//     } else {
//         console.warn("Warning: #membershipLevelSelect dropdown not found on page.");
//     }

// =======
    const levels = await getMembershipLevels();
    console.log("✅ Membership levels loaded:", levels.length);

    // Log the levels for debugging
    levels.forEach((level) => {
      console.log(`- ${level.name}: $${level.price}/year`);
    });

    // Populate dropdown if it exists
    try {
      const levelSelect = $w("#membershipLevelSelect");
      if (levelSelect) {
        const levelOptions = levels.map((level) => ({
          label: `${level.name} - $${level.price}/year`,
          value: level._id,
        }));
        levelSelect.options = levelOptions;
      }
    } catch (error) {
      console.log("Membership level dropdown not found:", error);
    }
// >>>>>>> main
  } catch (error) {
    console.error("❌ Error displaying membership levels:", error);
    showFeedback("Could not load membership levels.", "error");
  }
}

function setupEventHandlers() {
  try {
    const form = $w<wix_ui.FormElement>("#applicationForm");
    if (form && typeof form.onWixFormSubmit === 'function') {
      form.onWixFormSubmit(handleFormSubmission);
    } else {
        console.error("❌ Critical Error: #applicationForm is not a Wix Form or does not exist. Form submission will not work.");
        showFeedback("The application form is currently unavailable. Please contact support.", "error");
    }
  } catch (error) {
    console.error("❌ Error setting up form submission handler:", error);
  }
}

async function handleFormSubmission() {
  try {
    showFeedback("Submitting application...", "info");

    const formData = {
      firstName: ($w<wix_ui.TextInput>("#firstNameField")).value,
      lastName: ($w<wix_ui.TextInput>("#lastNameField")).value,
      email: ($w<wix_ui.TextInput>("#emailField")).value,
      phone: ($w<wix_ui.TextInput>("#phoneField")).value,
      membershipLevel: ($w<wix_ui.Dropdown>("#membershipLevelSelect")).value,
    };

    const validationErrors = validateFormData(formData);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join("
"));
    }

    const result = await submitMemberApplication(formData);
    console.log("✅ Application submitted successfully:", result);
    showFeedback("Thank you! Your application has been received. Please check your email for payment instructions.", "success");

    $w<wix_ui.FormElement>("#applicationForm").reset();

  } catch (error) {
    console.error("❌ Error submitting application:", error);
    showFeedback(`Application Error: ${error.message}`, "error");
  }
}

function validateFormData(formData) {
  const errors = [];
  if (!formData.firstName) errors.push("First name is required.");
  if (!formData.lastName) errors.push("Last name is required.");
  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.push("A valid email is required.");
  if (!formData.membershipLevel) errors.push("Please select a membership level.");
  return errors;
}

function showFeedback(message, type) {
  const feedback = $w<wix_ui.Text>("#formFeedback");
  if (!feedback) {
    console.warn("Warning: #formFeedback element not found.");
    return;
  }

  feedback.text = message;
  const colors = {
      success: "#d4edda",
      error: "#f8d7da",
      info: "#cce5ff"
  };
  feedback.style.backgroundColor = colors[type] || "#ffffff";
  feedback.expand();
}
