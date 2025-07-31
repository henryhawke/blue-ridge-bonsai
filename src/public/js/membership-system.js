// Blue Ridge Bonsai Society - Membership System
// This file contains the core logic for managing members, including applications,
// profiles, and membership levels. It's designed to be used by various
// membership-related pages on the site.

// Mock Data (simulating Wix Collections)
import membersData from 'backend/data/Members.json';
import membershipLevelsData from 'backend/data/MembershipLevels.json';
import memberInteractionsData from 'backend/data/MemberInteractions.json';

// Mock the current member for development purposes
const MOCK_CURRENT_MEMBER_ID = 'mem001'; // 'mem001' for logged-in, null for logged-out

/**
 * A comprehensive class for managing all membership-related functionality.
 */
export class MembershipSystem {
  constructor() {
    this.members = membersData;
    this.levels = membershipLevelsData;
    this.interactions = memberInteractionsData;
  }

  /**
   * Gets the profile for the current member.
   * @returns {Promise<object|null>} - The member object or null if not logged in.
   */
  async getCurrentMemberProfile() {
    if (!MOCK_CURRENT_MEMBER_ID) {
      return null;
    }
    const member = this.members.find(m => m._id === MOCK_CURRENT_MEMBER_ID);
    return member || null;
  }

  /**
   * Loads all available membership levels.
   * @returns {Promise<Array>} - A promise that resolves to the membership levels.
   */
  async loadMembershipLevels() {
    return this.levels.filter(level => level.isActive);
  }

  /**
   * Simulates submitting a new member application.
   * In a real app, this would insert into a 'MemberApplications' collection.
   * @param {object} applicationData - The data from the application form.
   * @returns {Promise<object>} - The newly created application record.
   */
  async submitMemberApplication(applicationData) {
    console.log("Submitting application:", applicationData);

    // Basic validation
    if (!applicationData.email || !applicationData.firstName || !applicationData.lastName) {
      throw new Error("Email, first name, and last name are required.");
    }

    const newApplication = {
      _id: `app${new Date().getTime()}`,
      ...applicationData,
      applicationDate: new Date().toISOString(),
      status: 'pending_payment'
    };

    // In a real system, you would save this to a database.
    // For mock purposes, we just log it and return it.
    console.log("Mock application created:", newApplication);

    return newApplication;
  }

  /**
   * Checks the membership status of the current member.
   * @returns {Promise<object>} - An object containing membership status details.
   */
  async checkMembershipStatus() {
    const member = await this.getCurrentMemberProfile();
    if (!member) {
        return { isActive: false, needsRenewal: false, daysUntilExpiry: 0, isExpired: true };
    }

    const now = new Date();
    const expirationDate = new Date(member.expirationDate);
    const diffTime = expirationDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      isActive: member.isActive && diffDays > 0,
      needsRenewal: diffDays <= 30 && diffDays > 0,
      daysUntilExpiry: diffDays > 0 ? diffDays : 0,
      isExpired: diffDays <= 0,
      levelName: member.membershipLevel
    };
  }

  /**
   * Updates the current member's profile.
   * @param {object} updateData - The data to update.
   * @returns {Promise<object>} - The updated member object.
   */
  async updateMemberProfile(updateData) {
    const member = await this.getCurrentMemberProfile();
    if (!member) {
      throw new Error("No member logged in.");
    }

    // Find the member in our mock data and update them
    const memberIndex = this.members.findIndex(m => m._id === member._id);
    if (memberIndex > -1) {
      this.members[memberIndex] = { ...this.members[memberIndex], ...updateData };
      console.log("Updated member profile:", this.members[memberIndex]);
      return this.members[memberIndex];
    }

    throw new Error("Could not find member to update.");
  }

  /**
   * Gets the interaction history for the current member.
   * @returns {Promise<Array>}
   */
  async getMemberInteractions() {
      const member = await this.getCurrentMemberProfile();
      if (!member) return [];

      return this.interactions.filter(i => i.memberId === member._id);
  }
}
