// Blue Ridge Bonsai Society - Membership System
// This file contains the core logic for managing members, including applications,
// profiles, and membership levels. It's designed to be used by various
// membership-related pages on the site.

import wixData from 'wix-data';
import { currentMember } from 'wix-members-frontend';
import { approveMemberApplication } from 'backend/membership-backend.jsw';

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

    const extendedProfile = await wixData.get('Members', member._id).catch(() => null);

    this.currentProfile = { ...member, ...extendedProfile };
    return this.currentProfile;
  }

  /**
   * Loads all available membership levels from the database.
   * @returns {Promise<Array>} - A promise that resolves to the membership levels.
   */
  async loadMembershipLevels() {
    const results = await wixData.query('MembershipLevels')
        .eq('isActive', true)
        .ascending('sortOrder')
        .find();
    this.membershipLevels = results.items;
    return this.membershipLevels;
  }

  /**
   * Submits a new member application to the 'MemberApplications' collection.
   * @param {object} applicationData - The data from the application form.
   * @returns {Promise<object>} - The newly created application record.
   */
  async submitMemberApplication(applicationData) {
    console.log("Submitting application:", applicationData);

    // Basic validation
    if (!applicationData.email || !applicationData.firstName || !applicationData.lastName) {
      throw new Error("Email, first name, and last name are required.");
    }

    const applicationToInsert = {
      ...applicationData,
      applicationDate: new Date(),
      status: 'pending_payment'
    };

    return wixData.insert('MemberApplications', applicationToInsert);
  }

  /**
   * Checks the membership status of the current member.
   * @returns {Promise<object>} - An object containing membership status details.
   */
  async checkMembershipStatus() {
    const member = await this.getCurrentMemberProfile();
    if (!member || !member.expirationDate) {
        return { isActive: false, needsRenewal: false, daysUntilExpiry: 0, isExpired: true };
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
      levelName: member.membershipLevel
    };
  }

  /**
   * Updates the current member's extended profile in the 'Members' collection.
   * @param {object} updateData - The data to update.
   * @returns {Promise<object>} - The updated member object.
   */
  async updateMemberProfile(updateData) {
    const member = await this.getCurrentMemberProfile();
    if (!member) {
      throw new Error("No member logged in.");
    }

    const dataToUpdate = {
        _id: member._id,
        ...updateData
    };

    return wixData.update('Members', dataToUpdate);
  }

  /**
   * Calls the backend function to approve an application.
   * NOTE: This is an admin-only function.
   * @param {string} applicationId - The ID of the application to approve.
   * @returns {Promise<any>}
   */
  async approveApplication(applicationId) {
      return approveMemberApplication(applicationId);
  }
}
