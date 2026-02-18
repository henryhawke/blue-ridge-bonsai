/**
 * membership-system.js  (public)
 *
 * MembershipSystem: membership status checks and form helpers.
 *
 * Required element IDs (per-page — set in Wix editor):
 *  Join BRBS page:
 *    #applicationForm        Container / Form
 *    #firstNameInput         TextInput
 *    #lastNameInput          TextInput
 *    #emailInput             TextInput
 *    #phoneInput             TextInput
 *    #membershipLevelSelect  Dropdown
 *    #experienceInput        TextArea
 *    #howDidYouHearInput     TextInput or Dropdown
 *    #submitButton           Button
 *    #successMessage         Container — shown after successful submission
 *    #errorMessage           Text     — shown on validation/submit failure
 *    #loadingIndicator       Container — shown while submitting
 *
 *  My Membership page:
 *    #memberName             Text
 *    #memberEmail            Text
 *    #membershipLevel        Text
 *    #memberStatus           Text
 *    #memberSince            Text
 *    #memberPhoto            Image
 *    #loggedOutState         Container — shown when not logged in
 *    #loggedInState          Container — shown when logged in
 *    #pendingState           Container — shown when status is pending
 *
 * Usage:
 *   import { MembershipSystem } from 'public/js/membership-system';
 *   const ms = new MembershipSystem($w);
 *   await ms.initJoinPage();
 */

import { getMembershipLevels, submitMemberApplication, getCurrentMemberProfile, checkMembershipStatus } from 'backend/membership-backend';

export class MembershipSystem {
  /**
   * @param {function} $w  — Wix selector function passed from page code
   */
  constructor($w) {
    this.$w = $w;
    this._levels = [];
  }

  // ─── Join Page ─────────────────────────────────────────────────────────────

  /**
   * Initialises the membership application form.
   * Call from Join BRBS page $w.onReady().
   */
  async initJoinPage() {
    await this._loadMembershipLevels();
    this._bindSubmitButton();
  }

  /**
   * Populates the #membershipLevelSelect dropdown with tier options
   * from the MembershipLevels CMS collection (or defaults).
   */
  async _loadMembershipLevels() {
    try {
      this._levels = await getMembershipLevels();
      const options = this._levels.map(l => ({
        label: `${l.name} — $${l.price}/${l.billingCycle}`,
        value: l.name,
      }));
      _safeSet(this.$w, '#membershipLevelSelect', el => { el.options = options; });
    } catch (err) {
      console.error('_loadMembershipLevels failed:', err.message);
    }
  }

  /**
   * Wires the submit button to validate and send the application.
   */
  _bindSubmitButton() {
    _safeSet(this.$w, '#submitButton', el => {
      el.onClick(() => this._handleSubmit());
    });
  }

  /**
   * Validates the form, calls the backend, and shows success/error state.
   */
  async _handleSubmit() {
    const $w = this.$w;

    const formData = {
      firstName:       _getValue($w, '#firstNameInput'),
      lastName:        _getValue($w, '#lastNameInput'),
      email:           _getValue($w, '#emailInput'),
      phone:           _getValue($w, '#phoneInput'),
      membershipLevel: _getValue($w, '#membershipLevelSelect'),
      experience:      _getValue($w, '#experienceInput'),
      howDidYouHear:   _getValue($w, '#howDidYouHearInput'),
    };

    // Clear previous error
    _safeSet($w, '#errorMessage', el => { el.text = ''; el.hide(); });

    // Basic client-side check
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.membershipLevel) {
      _safeSet($w, '#errorMessage', el => {
        el.text = 'Please fill in all required fields.';
        el.show();
      });
      return;
    }

    // Show loading
    _safeSet($w, '#submitButton',      el => el.disable());
    _safeSet($w, '#loadingIndicator',  el => el.show());

    try {
      const result = await submitMemberApplication(formData);

      if (result.success) {
        _safeSet($w, '#applicationForm', el => el.hide());
        _safeSet($w, '#successMessage',  el => el.show());
      } else {
        _safeSet($w, '#errorMessage', el => {
          el.text = result.error || 'Submission failed. Please try again.';
          el.show();
        });
        _safeSet($w, '#submitButton', el => el.enable());
      }
    } catch (err) {
      console.error('_handleSubmit failed:', err.message);
      _safeSet($w, '#errorMessage', el => {
        el.text = 'An unexpected error occurred. Please try again.';
        el.show();
      });
      _safeSet($w, '#submitButton', el => el.enable());
    } finally {
      _safeSet($w, '#loadingIndicator', el => el.hide());
    }
  }

  // ─── My Membership Page ────────────────────────────────────────────────────

  /**
   * Initialises the My Membership page.
   * Checks login state and populates member info.
   * Call from My Membership page $w.onReady().
   */
  async initMembershipPage() {
    _safeSet(this.$w, '#loggedOutState', el => el.show());
    _safeSet(this.$w, '#loggedInState',  el => el.hide());
    _safeSet(this.$w, '#pendingState',   el => el.hide());

    try {
      const status = await checkMembershipStatus();

      if (!status.isLoggedIn) {
        return; // loggedOutState already visible
      }

      const profile = await getCurrentMemberProfile();
      if (!profile) return;

      _safeSet(this.$w, '#loggedOutState', el => el.hide());

      if (profile.status === 'active') {
        _safeSet(this.$w, '#loggedInState', el => el.show());
        this._populateMemberProfile(profile);
      } else {
        _safeSet(this.$w, '#pendingState', el => el.show());
      }
    } catch (err) {
      console.error('initMembershipPage failed:', err.message);
    }
  }

  /**
   * Fills in the member profile fields.
   *
   * @param {object} profile
   */
  _populateMemberProfile(profile) {
    const $w = this.$w;

    _safeSet($w, '#memberName',        el => { el.text = profile.displayName || `${profile.firstName} ${profile.lastName}`.trim(); });
    _safeSet($w, '#memberEmail',       el => { el.text = profile.email || ''; });
    _safeSet($w, '#membershipLevel',   el => { el.text = profile.membershipLevel || 'Member'; });
    _safeSet($w, '#memberStatus',      el => {
      el.text = profile.status ? profile.status.charAt(0).toUpperCase() + profile.status.slice(1) : '';
      el.customClassList?.add(`brbs-status-${profile.status}`);
    });
    _safeSet($w, '#memberSince', el => {
      el.text = profile.memberSince
        ? new Date(profile.memberSince).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
        : '';
    });

    if (profile.photo) {
      _safeSet($w, '#memberPhoto', el => { el.src = profile.photo; });
    }
  }
}

// ─── Internal Helpers ─────────────────────────────────────────────────────────

function _safeSet($w, selector, fn) {
  try {
    fn($w(selector));
  } catch {
    // element not on this page — no-op
  }
}

function _getValue($w, selector) {
  try {
    return $w(selector).value || '';
  } catch {
    return '';
  }
}
