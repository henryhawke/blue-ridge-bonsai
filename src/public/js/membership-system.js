// Blue Ridge Bonsai Society - Membership System
// This file contains the core logic for managing members, including applications,
// profiles, and membership levels. It uses Wix Data API to interact with collections.

import wixData from "wix-data";
import wixUsers from "wix-users";

/**
 * A comprehensive class for managing all membership-related functionality.
 */
export class MembershipSystem {
  constructor() {
    // Initialize collections
    this.membersCollection = wixData.query("Members");
    this.membershipLevelsCollection = wixData.query("MembershipLevels");
    this.memberApplicationsCollection = wixData.query("MemberApplications");
    this.memberInteractionsCollection = wixData.query("MemberInteractions");
  }

  /**
   * Gets the profile for the current member.
   * @returns {Promise<object|null>} - The member object or null if not logged in.
   */
  async getCurrentMemberProfile() {
    try {
      const currentUser = /** @type {any} */ (wixUsers.currentUser);
      if (!currentUser || !currentUser.email) {
        return null;
      }

      const currentUserQuery = await wixData
        .query("Members")
        .eq("loginEmail", currentUser.email)
        .find();

      return currentUserQuery.items.length > 0
        ? currentUserQuery.items[0]
        : null;
    } catch (error) {
      console.error("Error getting current member profile:", error);
      return null;
    }
  }

  /**
   * Loads all available membership levels.
   * @returns {Promise<Array>} - A promise that resolves to the membership levels.
   */
  async loadMembershipLevels() {
    try {
      const levels = await wixData
        .query("MembershipLevels")
        .eq("isActive", true)
        .ascending("sortOrder")
        .find();

      return levels.items;
    } catch (error) {
      console.error("Error loading membership levels:", error);
      return [];
    }
  }

  /**
   * Submits a new member application.
   * @param {object} applicationData - The data from the application form.
   * @returns {Promise<object>} - The newly created application record.
   */
  async submitMemberApplication(applicationData) {
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

      console.log("Application submitted successfully:", result);
      return result;
    } catch (error) {
      console.error("Error submitting application:", error);
      throw error;
    }
  }

  /**
   * Checks the membership status of the current member.
   * @returns {Promise<object>} - An object containing membership status details.
   */
  async checkMembershipStatus() {
    try {
      const member = await this.getCurrentMemberProfile();
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
      const diffTime = /** @type {number} */ (
        expirationDate.getTime() - now.getTime()
      );
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
   * Updates the current member's profile.
   * @param {object} updateData - The data to update.
   * @returns {Promise<object>} - The updated member object.
   */
  async updateMemberProfile(updateData) {
    try {
      const currentMember = await this.getCurrentMemberProfile();
      if (!currentMember) {
        throw new Error("No current member found.");
      }

      const updatedMember = await wixData.update("Members", {
        _id: currentMember._id,
        ...updateData,
      });

      return updatedMember;
    } catch (error) {
      console.error("Error updating member profile:", error);
      throw error;
    }
  }

  /**
   * Gets member interactions and activity.
   * @returns {Promise<Array>} - Array of member interactions.
   */
  async getMemberInteractions() {
    try {
      const currentMember = await this.getCurrentMemberProfile();
      if (!currentMember) {
        return [];
      }

      const interactions = await wixData
        .query("MemberInteractions")
        .eq("memberId", currentMember._id)
        .descending("date")
        .limit(50)
        .find();

      return interactions.items;
    } catch (error) {
      console.error("Error getting member interactions:", error);
      return [];
    }
  }

  /**
   * Records a new member interaction.
   * @param {string} type - The type of interaction.
   * @param {object} details - Additional details about the interaction.
   * @returns {Promise<object>} - The created interaction record.
   */
  async recordInteraction(type, details = {}) {
    try {
      const currentMember = await this.getCurrentMemberProfile();
      if (!currentMember) {
        throw new Error("No current member found.");
      }

      const interaction = {
        memberId: currentMember._id,
        type: type,
        date: new Date(),
        details: details,
      };

      const result = await wixData.insert("MemberInteractions", interaction);
      return result;
    } catch (error) {
      console.error("Error recording interaction:", error);
      throw error;
    }
  }

  /**
   * Gets all members (admin function).
   * @returns {Promise<Array>} - Array of all members.
   */
  async getAllMembers() {
    try {
      const members = await wixData
        .query("Members")
        .ascending("lastName")
        .find();

      return members.items;
    } catch (error) {
      console.error("Error getting all members:", error);
      return [];
    }
  }

  /**
   * Gets pending applications (admin function).
   * @returns {Promise<Array>} - Array of pending applications.
   */
  async getPendingApplications() {
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
}
