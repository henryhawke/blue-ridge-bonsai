// Blue Ridge Bonsai Society - Membership System
// This file contains the core logic for managing members, including applications,
// profiles, and membership levels. It uses Wix Data API to interact with collections.

import wixData from "wix-data";
import { currentMember } from "wix-members-frontend";

/**
 * A comprehensive class for managing all membership-related functionality.
 */
export class MembershipSystem {
  constructor() {
    this.membershipLevels = [];
    this.currentProfile = null;
  }

  /**
   * Gets the profile for the current member, including extended data.
   * @returns {Promise<object|null>} - The member object or null if not logged in.
   */
  async getCurrentMemberProfile() {
    if (this.currentProfile) return this.currentProfile;

    const member = await currentMember.getMember();
    if (!member) return null;

    const extendedProfile = await wixData
      .get("Members", member._id)
      .catch(() => null);
    this.currentProfile = { ...member, ...extendedProfile };
    return this.currentProfile;
  }

  /**
   * Loads all available membership levels from the database.
   * @returns {Promise<Array>} - A promise that resolves to the membership levels.
   */
  async loadMembershipLevels() {
    const results = await wixData
      .query("MembershipLevels")
      .eq("isActive", true)
      .ascending("sortOrder")
      .find();
    this.membershipLevels = results.items;
    return this.membershipLevels;
  }

  /**
   * Submits a new member application to the 'MemberApplications' collection.
   * @param {object} applicationData
   * @returns {Promise<object>}
   */
  async submitMemberApplication(applicationData) {
    try {
      if (
        !applicationData.email ||
        !applicationData.firstName ||
        !applicationData.lastName
      ) {
        throw new Error("Email, first name, and last name are required.");
      }

      const existingMember = await wixData
        .query("Members")
        .eq("email", applicationData.email)
        .find();

      if (existingMember.items.length > 0) {
        throw new Error("A member with this email already exists.");
      }

      const newApplication = {
        ...applicationData,
        applicationDate: new Date(),
        status: "pending_payment",
        source: "website_application",
      };

      const result = await wixData.insert("MemberApplications", newApplication);
      return result;
    } catch (error) {
      console.error("Error submitting application:", error);
      throw error;
    }
  }

  /**
   * Checks the membership status of the current member.
   * @returns {Promise<object>} - {isActive, needsRenewal, daysUntilExpiry, isExpired, levelName, memberId}
   */
  async checkMembershipStatus() {
    try {
      const member = await this.getCurrentMemberProfile();
      if (!member || !member.expirationDate) {
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
        isActive: !!member.isActive && diffDays > 0,
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
   * Gets member interactions and activity.
   * @returns {Promise<Array>} - Array of member interactions.
   */
  async getMemberInteractions() {
    try {
      const member = await this.getCurrentMemberProfile();
      if (!member) return [];

      const interactions = await wixData
        .query("MemberInteractions")
        .eq("memberId", member._id)
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
   * @param {string} type
   * @param {object} details
   * @returns {Promise<object>}
   */
  async recordInteraction(type, details = {}) {
    try {
      const member = await this.getCurrentMemberProfile();
      if (!member) throw new Error("No current member found.");

      const interaction = {
        memberId: member._id,
        type,
        date: new Date(),
        details,
      };

      return wixData.insert("MemberInteractions", interaction);
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
