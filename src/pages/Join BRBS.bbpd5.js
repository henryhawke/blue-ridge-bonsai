/**
 * BLUE RIDGE BONSAI SOCIETY - JOIN BRBS MEMBERSHIP PAGE
 *
 * This page displays membership levels and provides an application form.
 * Uses Wix Velo framework to work with existing page elements.
 */

import { MembershipSystem } from "public/js/membership-system.js";

let membershipSystem;

$w.onReady(function () {
  console.log("🚀 Initializing Join BRBS Page");
  initializeJoinPage();
});

/**
 * Main function to orchestrate the page build-out.
 */
async function initializeJoinPage() {
  try {
    membershipSystem = new MembershipSystem();
    await displayMembershipLevels();
    setupEventHandlers();
    console.log("✅ Join BRBS Page initialization complete.");
  } catch (error) {
    console.error("❌ Error initializing Join BRBS Page:", error);
  }
}

/**
 * Fetches and displays the available membership levels.
 */
async function displayMembershipLevels() {
  try {
    const levels = await membershipSystem.loadMembershipLevels();
    console.log("✅ Membership levels loaded:", levels.length);

    // Log the levels for debugging
    levels.forEach((level) => {
      console.log(`- ${level.name}: $${level.price}/year`);
    });
  } catch (error) {
    console.error("❌ Error displaying membership levels:", error);
  }
}

/**
 * Sets up event handlers for the application form.
 */
function setupEventHandlers() {
  console.log("Setting up event handlers...");

  // Basic form submission handling
  try {
    // This will work if the form exists in the Wix editor
    const form = $w("#applicationForm");
    if (form) {
      form.onWixFormSubmit(async (event) => {
        event.preventDefault();
        console.log("Form submitted");
        await handleFormSubmission();
      });
    }
  } catch (error) {
    console.log("Form not found or error setting up form handler:", error);
  }
}

/**
 * Handles form submission with validation and feedback.
 */
async function handleFormSubmission() {
  console.log("Handling form submission...");

  try {
    // Collect form data - this will work if the fields exist
    const formData = {
      firstName: getFieldValue("#firstNameField"),
      lastName: getFieldValue("#lastNameField"),
      email: getFieldValue("#emailField"),
      phone: getFieldValue("#phoneField"),
      membershipLevel: getFieldValue("#membershipLevelSelect"),
      interests: getFieldValue("#interestsField"),
      bio: getFieldValue("#bioField"),
    };

    console.log("Form data collected:", formData);

    // Validate required fields
    const validationErrors = validateFormData(formData);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(", "));
    }

    const result = await membershipSystem.submitMemberApplication(formData);
    console.log("✅ Application submitted successfully:", result);

    // Show success message
    showFeedback(
      "Thank you! Your application has been received. Please check your email for payment instructions.",
      "success"
    );
  } catch (error) {
    console.error("❌ Error submitting application:", error);
    showFeedback(`Error: ${error.message}`, "error");
  }
}

/**
 * Gets the value of a form field.
 */
function getFieldValue(selector) {
  try {
    const field = $w(selector);
    return field ? field.value : "";
  } catch (error) {
    console.log(`Field ${selector} not found:`, error);
    return "";
  }
}

/**
 * Validates form data and returns array of error messages.
 */
function validateFormData(formData) {
  const errors = [];

  if (!formData.firstName) {
    errors.push("First name is required");
  }

  if (!formData.lastName) {
    errors.push("Last name is required");
  }

  if (!formData.email) {
    errors.push("Email is required");
  } else if (!validateEmail(formData.email)) {
    errors.push("Please enter a valid email address");
  }

  if (!formData.membershipLevel) {
    errors.push("Please select a membership level");
  }

  return errors;
}

/**
 * Validates email format.
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Shows feedback message to user.
 */
function showFeedback(message, type) {
  console.log(`${type.toUpperCase()}: ${message}`);

  try {
    const feedback = $w("#formFeedback");
    if (feedback) {
      feedback.text = message;
      feedback.style.backgroundColor =
        type === "success" ? "#d4edda" : "#f8d7da";
      feedback.show();
    }
  } catch (error) {
    console.log("Feedback element not found:", error);
  }
}
