// @ts-nocheck
// Blue Ridge Bonsai Society - Membership Backend
// This file contains backend functions for membership operations

import wixData from "wix-data";
// Use Triggered Emails when available in Velo
// eslint-disable-next-line import/no-unresolved
import { triggeredEmails } from "wix-crm-backend";
import { getMembershipLevelFallbacks } from "backend/site-data";

/**
 * Gets all active membership levels
 */
export async function getMembershipLevels() {
  try {
    const levels = await wixData
      .query("MembershipLevels")
      .eq("isActive", true)
      .ascending("sortOrder")
      .find();

    return levels.items;
  } catch (error) {
    console.warn("Falling back to static membership levels:", error?.message || error);
    try {
      const fallback = await getMembershipLevelFallbacks();
      return fallback;
    } catch (fallbackError) {
      console.error("Error loading fallback membership levels:", fallbackError);
      throw new Error("Failed to load membership levels");
    }
  }
}

/**
 * Submits a new member application
 */
export async function submitMemberApplication(applicationData) {
  try {
    // Basic validation
    if (
      !applicationData.email ||
      !applicationData.firstName ||
      !applicationData.lastName
    ) {
      throw new Error("Email, first name, and last name are required.");
    }

    // Check if member already exists
    const existingMember = await wixData
      .query("Members")
      .eq("email", applicationData.email)
      .find();

    if (existingMember.items.length > 0) {
      throw new Error("A member with this email already exists.");
    }

    // Create the application record
    const newApplication = {
      ...applicationData,
      applicationDate: new Date(),
      status: "pending_payment",
      source: "website_application",
    };

    const result = await wixData.insert("MemberApplications", newApplication);

    // Send confirmation email (no-op if Triggered Emails not configured)
    await sendApplicationConfirmation(
      applicationData.email,
      applicationData.firstName
    ).catch(() => {});

    return result;
  } catch (error) {
    console.error("Error submitting application:", error);
    throw error;
  }
}

/**
 * Gets the current member's profile
 * Note: Backend has no concept of the current browser user. Prefer passing identifiers
 * from the frontend or using wix-members-frontend.currentMember in page code.
 */
export async function getCurrentMemberProfile() {
  try {
    return null;
  } catch (error) {
    console.error("Error getting current member profile:", error);
    return null;
  }
}

/**
 * Checks membership status (by email)
 */
export async function checkMembershipStatusByEmail(email) {
  try {
    const memberRes = await wixData.query("Members").eq("email", email).find();
    const member = memberRes.items[0];
    if (!member) {
      return {
        isActive: false,
        needsRenewal: false,
        daysUntilExpiry: 0,
        isExpired: true,
      };
    }

    const now = new Date();
    const expirationDate = new Date(member.expirationDate);
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      isActive: member.isActive && diffDays > 0,
      needsRenewal: diffDays <= 30 && diffDays > 0,
      daysUntilExpiry: diffDays > 0 ? diffDays : 0,
      isExpired: diffDays <= 0,
      levelName: member.membershipLevel,
      memberId: member._id,
    };
  } catch (error) {
    console.error("Error checking membership status:", error);
    return {
      isActive: false,
      needsRenewal: false,
      daysUntilExpiry: 0,
      isExpired: true,
    };
  }
}

/**
 * Sends application confirmation email via Triggered Emails (if configured).
 * Requires a Triggered Email with ID set in site settings.
 */
async function sendApplicationConfirmation(email, firstName) {
  try {
    const templateId = "application_confirmation"; // Replace with your Triggered Email ID
    if (!triggeredEmails || !triggeredEmails.emailContact) {
      return; // Not configured in local dev; safe no-op
    }
    // You must have a contactId to email a contact; skipping contact creation here.
    // Implement contact creation and store their ID if you want this active.
    return; // Intentional no-op unless site is configured
  } catch (error) {
    // Swallow errors to avoid blocking application workflow
    console.warn("Triggered email not sent:", error?.message || error);
  }
}

/**
 * Gets all members (admin function)
 */
export async function getAllMembers() {
  try {
    const members = await wixData.query("Members").ascending("lastName").find();

    return members.items;
  } catch (error) {
    console.error("Error getting all members:", error);
    return [];
  }
}

/**
 * Gets pending applications (admin function)
 */
export async function getPendingApplications() {
  try {
    const applications = await wixData
      .query("MemberApplications")
      .eq("status", "pending_payment")
      .descending("applicationDate")
      .find();

    return applications.items;
  } catch (error) {
    console.error("Error getting pending applications:", error);
    return [];
  }
}
