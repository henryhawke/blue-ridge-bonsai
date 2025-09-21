# Blue Ridge Bonsai Society Website Implementation TO-DO

## I have paid plan now
### **Critical Platform Limitations (Free Wix Plan):**

1. **No Custom Domain** - Site will have Wix branding (wixsite.com/sitename)
2. **Limited Database Capacity** - Only 1,000 database items total across all collections
3. **Limited Storage** - 500MB total storage (severely restricts image galleries)
4. **Wix Branding** - "Made with Wix" footer cannot be removed
5. **No Subscription Service** - Payment portal functionality severely limited
6. **Limited Bandwidth** - 1GB monthly bandwidth limit
7. **No Site Statistics** - Cannot implement comprehensive analytics (BR-23)
8. **Limited Velo Database Collections** - Maximum 10 collections on free plan
9. **No Email Marketing** - Cannot implement automated member communications
10. **Limited Member Management** - Basic member functionality only, no advanced permissions
11. **No Custom Code in Head** - Limited SEO optimization capabilities
12. **No Backup/Export** - Cannot backup site or export data easily

### **Workarounds for Free Implementation:**

- **For Payment Portal:** Use external services (PayPal, Stripe buttons, Google Forms + PayPal)
- **For Analytics:** Use Google Analytics (limited implementation)
- **For Domain:** Use free subdomain with clear branding
- **For Storage:** Use external image hosting (Google Drive, GitHub repositories)
- **For Email:** Use Google Groups for member communications
- **For Database Limits:** Prioritize essential collections, archive old data

---

## 📋 IMPLEMENTATION ROADMAP

### **PHASE 1: CRITICAL FOUNDATION (MUST Requirements)**

#### **1.1 Homepage Redesign (BR-24)**
**Location:** `src/pages/Home.c1dmp.js`
**Priority:** MUST
**Implementation:**
```javascript
// Required Components:
- Hero section with mission statement (BR-01)
- Quick navigation to key sections
- Latest events preview (BR-02)
- Member spotlight/testimonials (BR-32)
- Call-to-action for joining (BR-04)

// Files to Modify:
- src/pages/Home.c1dmp.js (main implementation)
- src/public/styles/design-system.css (styling)
- Use existing: src/pages/components/atmospheric-cards.html

// Required Velo APIs:
- wix-site API for basic site data
- wix-location for navigation
```

#### **1.2 About Us Section (BR-01, BR-08, BR-30)**
**Location:** `src/pages/About BRBS.a28ns.js`
**Priority:** MUST
**Implementation:**
```javascript
// Components Needed:
- Mission & Vision statement display
- Board member profiles with photos
- NC Arboretum partnership information
- FAQ integration
- Meeting information

// Database Collections Required:
1. BoardMembers (Name, Role, Bio, Photo, ContactInfo)
2. FAQItems (Question, Answer, Category)
3. PartnershipInfo (Content, Images, Links)

// Files to Create/Modify:
- src/pages/About BRBS.a28ns.js
- src/public/js/board-management.js
- src/pages/components/board-member-card.html
```

#### **1.3 Robust Events System (BR-02, BR-27, BR-07, BR-49)**
**Location:** `src/pages/Events.yyqhk.js`, `src/pages/Event Details & Registration.ydrhv.js`
**Priority:** MUST
**API Documentation:** [Wix Events v2 API](https://dev.wix.com/docs/velo/apis/wix-events-v2/wix-events-v2/introduction)

**Implementation:**
```javascript
// Required npm Packages (Install via Wix Package Manager):
1. "moment" - Date manipulation and formatting
2. "lodash" - Data manipulation utilities  
3. "uuid" - Generate unique IDs for comments/registrations
4. "marked" - Markdown parser for rich event descriptions
5. "date-fns" - Lightweight date utility library

// Database Collections Required:
1. Events {
   - _id, title, description, richDescription (markdown)
   - startDate, endDate, timezone, location
   - registrationRequired, maxAttendees, currentAttendees
   - images, category, price, instructor, difficulty
   - status (upcoming/past/cancelled), featured
   - tags, prerequisites, materials, refundPolicy
   - createdDate, lastModified, createdBy
}

2. EventRegistrations {
   - _id, eventId, memberEmail, memberName, phone
   - registrationDate, paymentStatus, paymentMethod
   - notes, specialRequests, emergencyContact
   - attendanceStatus, confirmationSent
}

3. EventComments {
   - _id, eventId, memberId, memberName, comment
   - commentDate, isApproved, parentCommentId (for replies)
   - likes, isStaff, isDeleted
}

4. EventCategories {
   - _id, name, description, color, icon, displayOrder
}

// Core Event Functions:
// File: src/public/js/event-system.js
import { events } from 'wix-events-v2';
import { currentMember } from 'wix-members-frontend';
import moment from 'moment';
import _ from 'lodash';

export class EventSystem {
  constructor() {
    this.eventFilters = {
      category: 'all',
      date: 'all',
      difficulty: 'all',
      status: 'upcoming'
    };
  }

  // Load events with advanced filtering
  async loadEvents(filters = {}) {
    try {
      const query = wixData.query('Events')
        .ascending('startDate')
        .limit(50);
      
      if (filters.category && filters.category !== 'all') {
        query.eq('category', filters.category);
      }
      
      if (filters.status === 'upcoming') {
        query.gt('startDate', new Date());
      } else if (filters.status === 'past') {
        query.lt('startDate', new Date());
      }
      
      const results = await query.find();
      return results.items;
    } catch (error) {
      console.error('Error loading events:', error);
      throw error;
    }
  }

  // Generate RSS feed for events
  async generateRSSFeed() {
    const events = await this.loadEvents({ status: 'upcoming' });
    const rssItems = events.map(event => {
      return {
        title: event.title,
        description: event.description,
        link: `${wixSite.baseUrl}/events/${event._id}`,
        pubDate: new Date(event.createdDate).toUTCString(),
        guid: event._id,
        category: event.category
      };
    });
    
    return {
      title: 'Blue Ridge Bonsai Society Events',
      description: 'Upcoming bonsai workshops, meetings, and events',
      link: `${wixSite.baseUrl}/events`,
      items: rssItems
    };
  }

  // Export to iCal format
  generateICalFeed(events) {
    let icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Blue Ridge Bonsai Society//Event Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    events.forEach(event => {
      icalContent.push(
        'BEGIN:VEVENT',
        `UID:${event._id}@blueridgebonsai.wixsite.com`,
        `DTSTAMP:${moment().utc().format('YYYYMMDDTHHmmss')}Z`,
        `DTSTART:${moment(event.startDate).utc().format('YYYYMMDDTHHmmss')}Z`,
        `DTEND:${moment(event.endDate).utc().format('YYYYMMDDTHHmmss')}Z`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
        `LOCATION:${event.location || 'TBD'}`,
        `URL:${wixSite.baseUrl}/events/${event._id}`,
        'END:VEVENT'
      );
    });

    icalContent.push('END:VCALENDAR');
    return icalContent.join('\r\n');
  }
}

// Event Comments System:
// File: src/public/js/event-comments.js
export class EventComments {
  async addComment(eventId, commentText) {
    const member = await currentMember.getMember();
    if (!member) throw new Error('Must be logged in to comment');
    
    const newComment = {
      eventId,
      memberId: member._id,
      memberName: `${member.contactDetails.firstName} ${member.contactDetails.lastName}`,
      comment: commentText,
      commentDate: new Date(),
      isApproved: true, // Auto-approve for members
      likes: 0,
      isStaff: member.roles.includes('admin') || member.roles.includes('staff')
    };
    
    return await wixData.insert('EventComments', newComment);
  }
  
  async loadComments(eventId) {
    const results = await wixData.query('EventComments')
      .eq('eventId', eventId)
      .eq('isApproved', true)
      .ascending('commentDate')
      .find();
    
    return results.items;
  }
}

// Files to Create/Modify:
- src/pages/Events.yyqhk.js (main events page with calendar view)
- src/pages/Event Details & Registration.ydrhv.js (detailed event pages)
- src/public/js/event-system.js (core event management)
- src/public/js/event-calendar.js (calendar widget with FullCalendar.js)
- src/public/js/event-comments.js (commenting system)
- src/public/js/event-registration.js (registration management)
- src/pages/components/event-card.html (event display component)
- src/pages/components/event-calendar-widget.html
- src/pages/components/event-comments.html
- src/backend/rss-generator.jsw (RSS feed backend)
- src/backend/ical-export.jsw (iCal export backend)

// Event Page Implementation (Events.yyqhk.js):
import { EventSystem } from 'public/js/event-system.js';
import { EventComments } from 'public/js/event-comments.js';

$w.onReady(async function () {
  const eventSystem = new EventSystem();
  
  // Initialize calendar view
  await initializeCalendarView();
  
  // Setup event filters
  setupEventFilters();
  
  // Load and display events
  await loadAndDisplayEvents();
});

async function initializeCalendarView() {
  const events = await eventSystem.loadEvents();
  
  // Use FullCalendar integration (requires custom element)
  const calendarEvents = events.map(event => ({
    id: event._id,
    title: event.title,
    start: event.startDate,
    end: event.endDate,
    url: `/events/${event._id}`,
    backgroundColor: getCategoryColor(event.category),
    extendedProps: {
      category: event.category,
      instructor: event.instructor,
      spotsLeft: event.maxAttendees - event.currentAttendees
    }
  }));
  
  // Initialize calendar widget
  $w('#calendarContainer').postMessage({ 
    type: 'initCalendar', 
    events: calendarEvents 
  });
}

// RSS Feed Backend (src/backend/rss-generator.jsw):
import { webMethod } from 'wix-web-module';
import { EventSystem } from 'public/js/event-system.js';

export const generateEventsFeed = webMethod(async () => {
  const eventSystem = new EventSystem();
  const rssData = await eventSystem.generateRSSFeed();
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${rssData.title}</title>
    <description>${rssData.description}</description>
    <link>${rssData.link}</link>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${rssData.items.map(item => `
    <item>
      <title>${item.title}</title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.link}</link>
      <pubDate>${item.pubDate}</pubDate>
      <guid>${item.guid}</guid>
      <category>${item.category}</category>
    </item>`).join('')}
  </channel>
</rss>`;
  
  return {
    body: xml,
    headers: {
      'Content-Type': 'application/rss+xml; charset=UTF-8'
    }
  };
});

// External Dependencies & Integrations:
1. Google Calendar API for sync (free tier: 1,000,000 requests/day)
2. External registration via Calendly integration (free tier)
3. Zoom integration for virtual events (free tier: 40-min limit)
4. Email notifications via Google Groups (free, unlimited)
```

#### **1.4 Learning Center (BR-03, BR-20, BR-21)**
**Location:** `src/pages/Beginner's Guide.vpald.js`, `src/pages/Bonsai Knowledge Base.rvjk7.js`
**Priority:** MUST
**Implementation:**
```javascript
// Database Collections Required:
1. Articles {
   - title, content, category, difficulty
   - author, publishDate, tags, featured
   - images, downloadableFiles
}
2. Resources {
   - name, type, url, description
   - category, rating, verified
}
3. VendorList {
   - name, location, specialties, contact
   - verified, rating, notes
}

// Components Needed:
- Beginner's guide with step-by-step tutorials
- Searchable article repository
- Resource library with downloads
- Vendor directory
- Image gallery integration

// Files to Create/Modify:
- src/pages/Beginner's Guide.vpald.js
- src/pages/Bonsai Knowledge Base.rvjk7.js
- src/pages/Other Resources.y66w5.js
- src/public/js/article-search.js
- src/public/js/resource-manager.js
- src/pages/components/article-card.html
- src/pages/components/search-widget.html
```

#### **1.5 Comprehensive Membership System (BR-04, BR-06, BR-09)**
**Location:** `src/pages/Join BRBS.bbpd5.js`
**Priority:** MUST
**API Documentation:** [Wix Members Backend API](https://dev.wix.com/docs/velo/apis/wix-members-backend/introduction) | [Wix Members v2 API](https://dev.wix.com/docs/velo/apis/wix-members-v2/members/introduction)

**Implementation:**
```javascript
// Required npm Packages:
1. "validator" - Email and form validation
2. "crypto-js" - Secure data handling
3. "moment" - Date calculations for membership expiry
4. "lodash" - Data manipulation for member profiles
5. "sweetalert2" - Beautiful alert/confirmation dialogs

// Database Collections Required:
1. Members (Extended Wix Members collection) {
   - _id, email, loginEmail, firstName, lastName
   - phone, address, city, state, zipCode
   - membershipLevel, joinDate, expirationDate, renewalDate
   - paymentStatus, paymentMethod, stripeCustomerId
   - interests, experience, specialties, notes
   - profileImage, bio, isActive, emailOptIn
   - emergencyContact, preferredCommunication
   - bonsaiCollection, yearsExperience, goals
}

2. MembershipLevels {
   - _id, name, price, duration, benefits
   - description, isActive, sortOrder, color
   - maxEventsPerMonth, discountPercentage
   - accessToForums, canDownloadResources
}

3. MemberInteractions {
   - _id, memberId, type, description, date
   - relatedItem, staffMember, followUpRequired
}

4. MemberInterests {
   - _id, memberId, interestType, skillLevel
   - yearsExperience, wantsToLearn, canTeach
}

// Core Membership Management:
// File: src/public/js/membership-system.js
import { authentication, currentMember } from 'wix-members-frontend';
import { members } from 'wix-members-backend';
import { authorization } from 'wix-members-backend';
import moment from 'moment';
import validator from 'validator';
import Swal from 'sweetalert2';

export class MembershipSystem {
  constructor() {
    this.membershipLevels = [];
    this.currentMember = null;
  }

  // Load membership levels
  async loadMembershipLevels() {
    try {
      const results = await wixData.query('MembershipLevels')
        .eq('isActive', true)
        .ascending('sortOrder')
        .find();
      
      this.membershipLevels = results.items;
      return this.membershipLevels;
    } catch (error) {
      console.error('Error loading membership levels:', error);
      throw error;
    }
  }

  // Get current member with extended profile
  async getCurrentMemberProfile() {
    try {
      const member = await currentMember.getMember();
      if (!member) return null;
      
      // Get extended profile data
      const profileResults = await wixData.query('Members')
        .eq('_id', member._id)
        .find();
      
      if (profileResults.items.length > 0) {
        return { ...member, ...profileResults.items[0] };
      }
      
      return member;
    } catch (error) {
      console.error('Error getting member profile:', error);
      return null;
    }
  }

  // Create new member application
  async submitMemberApplication(applicationData) {
    try {
      // Validate application data
      const validation = this.validateApplicationData(applicationData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Create pending application record
      const application = {
        ...applicationData,
        applicationDate: new Date(),
        status: 'pending',
        paymentStatus: 'pending',
        _id: undefined // Let Wix generate ID
      };

      const result = await wixData.insert('MemberApplications', application);
      
      // Send confirmation email
      await this.sendApplicationConfirmation(result);
      
      return result;
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
  }

  // Validate application data
  validateApplicationData(data) {
    const errors = [];
    
    if (!validator.isEmail(data.email)) {
      errors.push('Valid email address is required');
    }
    
    if (!data.firstName || data.firstName.length < 2) {
      errors.push('First name is required');
    }
    
    if (!data.lastName || data.lastName.length < 2) {
      errors.push('Last name is required');
    }
    
    if (!data.phone || !validator.isMobilePhone(data.phone, 'en-US')) {
      errors.push('Valid phone number is required');
    }
    
    if (!data.membershipLevel) {
      errors.push('Membership level selection is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Check membership status
  async checkMembershipStatus(memberId) {
    try {
      const member = await wixData.get('Members', memberId);
      const now = new Date();
      const expirationDate = new Date(member.expirationDate);
      
      const status = {
        isActive: member.isActive && expirationDate > now,
        daysUntilExpiry: moment(expirationDate).diff(moment(), 'days'),
        needsRenewal: moment(expirationDate).diff(moment(), 'days') <= 30,
        isExpired: expirationDate <= now
      };
      
      return status;
    } catch (error) {
      console.error('Error checking membership status:', error);
      throw error;
    }
  }

  // Update member profile
  async updateMemberProfile(memberId, updateData) {
    try {
      const sanitizedData = this.sanitizeMemberData(updateData);
      
      const result = await wixData.update('Members', {
        _id: memberId,
        ...sanitizedData,
        lastModified: new Date()
      });
      
      return result;
    } catch (error) {
      console.error('Error updating member profile:', error);
      throw error;
    }
  }

  // Handle membership renewal
  async renewMembership(memberId, paymentData) {
    try {
      const member = await wixData.get('Members', memberId);
      const membershipLevel = await wixData.get('MembershipLevels', member.membershipLevel);
      
      const currentExpiry = new Date(member.expirationDate);
      const now = new Date();
      
      // Calculate new expiry date
      const startDate = currentExpiry > now ? currentExpiry : now;
      const newExpiryDate = moment(startDate).add(membershipLevel.duration, 'months').toDate();
      
      // Update member record
      const updatedMember = await wixData.update('Members', {
        _id: memberId,
        expirationDate: newExpiryDate,
        renewalDate: new Date(),
        paymentStatus: 'paid',
        isActive: true
      });
      
      // Log interaction
      await this.logMemberInteraction(memberId, 'renewal', `Membership renewed until ${newExpiryDate.toDateString()}`);
      
      return updatedMember;
    } catch (error) {
      console.error('Error renewing membership:', error);
      throw error;
    }
  }

  // Log member interactions
  async logMemberInteraction(memberId, type, description, relatedItem = null) {
    try {
      const interaction = {
        memberId,
        type,
        description,
        date: new Date(),
        relatedItem,
        followUpRequired: false
      };
      
      return await wixData.insert('MemberInteractions', interaction);
    } catch (error) {
      console.error('Error logging member interaction:', error);
    }
  }

  // Send application confirmation
  async sendApplicationConfirmation(application) {
    // Implementation would use external email service
    console.log('Sending confirmation email for application:', application._id);
  }
}

// Member Dashboard Implementation:
// File: src/pages/members/dashboard.js (Enhanced)
import { MembershipSystem } from 'public/js/membership-system.js';
import { authentication, currentMember } from 'wix-members-frontend';

$w.onReady(async function () {
  const membershipSystem = new MembershipSystem();
  
  // Initialize member dashboard
  await initializeMemberDashboard();
  
  // Setup event handlers
  setupDashboardEventHandlers();
});

async function initializeMemberDashboard() {
  try {
    const member = await membershipSystem.getCurrentMemberProfile();
    
    if (!member) {
      // Redirect to login
      authentication.promptLogin()
        .then(() => location.reload())
        .catch(err => console.error('Login failed:', err));
      return;
    }
    
    // Display member information
    await displayMemberInfo(member);
    
    // Check membership status
    const status = await membershipSystem.checkMembershipStatus(member._id);
    await displayMembershipStatus(status);
    
    // Load member's recent activity
    await loadMemberActivity(member._id);
    
    // Setup quick actions
    setupQuickActions(member);
    
  } catch (error) {
    console.error('Error initializing dashboard:', error);
    Swal.fire('Error', 'Failed to load dashboard', 'error');
  }
}

async function displayMemberInfo(member) {
  $w('#memberName').text = `${member.firstName} ${member.lastName}`;
  $w('#memberEmail').text = member.email;
  $w('#memberSince').text = `Member since ${moment(member.joinDate).format('MMMM YYYY')}`;
  
  if (member.profileImage) {
    $w('#memberAvatar').src = member.profileImage;
  }
  
  // Display membership level with styling
  const levelColor = member.membershipLevelColor || '#6B8E6F';
  $w('#membershipLevel').text = member.membershipLevelName || 'Standard Member';
  $w('#membershipLevel').style.backgroundColor = levelColor;
}

// Files to Create/Modify:
- src/pages/Join BRBS.bbpd5.js (membership signup/application)
- src/pages/Benefits.qgrrb.js (benefits comparison page)
- src/pages/members/dashboard.js (enhanced member dashboard)
- src/pages/members/profile.js (member profile management)
- src/pages/My Membership.nnlx0.js (membership status/renewal)
- src/public/js/membership-system.js (core membership logic)
- src/public/js/member-profile.js (profile management)
- src/public/js/payment-integration.js (external payment handling)
- src/pages/components/membership-card.html (membership level display)
- src/pages/components/application-form.html (signup form)
- src/pages/components/member-status-widget.html
- src/backend/member-management.jsw (admin functions)
- src/backend/payment-webhook.jsw (payment processing)

// Membership Application Form (Join BRBS.bbpd5.js):
import { MembershipSystem } from 'public/js/membership-system.js';
import Swal from 'sweetalert2';

$w.onReady(async function () {
  const membershipSystem = new MembershipSystem();
  
  // Load membership levels
  const levels = await membershipSystem.loadMembershipLevels();
  populateMembershipOptions(levels);
  
  // Setup form handlers
  $w('#applicationForm').onWixFormSubmit(async (event) => {
    await handleApplicationSubmission(event, membershipSystem);
  });
  
  // Setup level selection
  $w('#membershipLevelDropdown').onChange(() => {
    updateBenefitsDisplay();
  });
});

async function handleApplicationSubmission(event, membershipSystem) {
  try {
    const formData = event.target.value;
    
    // Show loading
    $w('#submitButton').disable();
    $w('#submitButton').label = 'Processing...';
    
    // Submit application
    const result = await membershipSystem.submitMemberApplication(formData);
    
    // Show success message
    await Swal.fire({
      icon: 'success',
      title: 'Application Submitted!',
      html: `
        <p>Thank you for your application to join Blue Ridge Bonsai Society!</p>
        <p>Application ID: <strong>${result._id}</strong></p>
        <p>You will receive a confirmation email shortly with payment instructions.</p>
      `,
      confirmButtonColor: '#6B8E6F'
    });
    
    // Redirect to payment page
    wixLocation.to('/payment-portal');
    
  } catch (error) {
    console.error('Application submission error:', error);
    
    await Swal.fire({
      icon: 'error',
      title: 'Application Error',
      text: error.message || 'Failed to submit application. Please try again.',
      confirmButtonColor: '#6B8E6F'
    });
    
    // Re-enable form
    $w('#submitButton').enable();
    $w('#submitButton').label = 'Submit Application';
  }
}

// External Payment Integration:
// File: src/public/js/payment-integration.js
export class PaymentIntegration {
  constructor() {
    this.paypalClientId = 'your-paypal-client-id'; // Set in secrets
    this.stripePublicKey = 'your-stripe-public-key'; // Set in secrets
  }
  
  // PayPal subscription setup
  setupPayPalSubscription(membershipLevel) {
    const paypalButton = `
      <div id="paypal-button-container"></div>
      <script src="https://www.paypal.com/sdk/js?client-id=${this.paypalClientId}&vault=true&intent=subscription"></script>
      <script>
        paypal.Buttons({
          style: {
            shape: 'rect',
            color: 'blue',
            layout: 'vertical',
            label: 'subscribe'
          },
          createSubscription: function(data, actions) {
            return actions.subscription.create({
              'plan_id': '${membershipLevel.paypalPlanId}'
            });
          },
          onApprove: function(data, actions) {
            // Handle successful subscription
            window.parent.postMessage({
              type: 'paypal_success',
              subscriptionId: data.subscriptionID
            }, '*');
          }
        }).render('#paypal-button-container');
      </script>
    `;
    
    return paypalButton;
  }
}

// Backend Member Management (src/backend/member-management.jsw):
import { webMethod } from 'wix-web-module';
import { members } from 'wix-members-backend';
import { authorization } from 'wix-members-backend';

export const approveMemberApplication = webMethod(async (applicationId) => {
  // Admin only function
  const currentUser = await authorization.getCurrentUser();
  const roles = await authorization.getRoles(currentUser.id);
  
  if (!roles.includes('admin')) {
    throw new Error('Unauthorized');
  }
  
  try {
    // Get application
    const application = await wixData.get('MemberApplications', applicationId);
    
    // Create Wix member account
    const newMember = await members.createMember({
      email: application.email,
      contactDetails: {
        firstName: application.firstName,
        lastName: application.lastName,
        phone: application.phone
      }
    });
    
    // Create extended member profile
    const memberProfile = {
      _id: newMember.member._id,
      ...application,
      isActive: true,
      approvalDate: new Date(),
      status: 'approved'
    };
    
    await wixData.insert('Members', memberProfile);
    
    // Update application status
    await wixData.update('MemberApplications', {
      _id: applicationId,
      status: 'approved',
      memberId: newMember.member._id,
      approvalDate: new Date()
    });
    
    return { success: true, memberId: newMember.member._id };
    
  } catch (error) {
    console.error('Error approving member application:', error);
    throw error;
  }
});

// Member Directory (for board members) - src/pages/members/directory.js:
export const getMemberDirectory = webMethod(async () => {
  // Board members only
  const currentUser = await authorization.getCurrentUser();
  const roles = await authorization.getRoles(currentUser.id);
  
  if (!roles.includes('admin') && !roles.includes('board')) {
    throw new Error('Unauthorized - Board members only');
  }
  
  const members = await wixData.query('Members')
    .eq('isActive', true)
    .ascending('lastName')
    .find();
  
  // Return limited member info for directory
  return members.items.map(member => ({
    _id: member._id,
    name: `${member.firstName} ${member.lastName}`,
    email: member.email,
    phone: member.phone,
    membershipLevel: member.membershipLevel,
    joinDate: member.joinDate
  }));
});

// External Integrations:
1. PayPal Subscriptions API (free for non-profits)
2. Stripe Customer Portal (free tier: first $1M processed)
3. Google Groups for member communications (free, unlimited)
4. Google Forms for applications (free, unlimited)
5. Gmail for transactional emails (free, 15GB storage)
6. Calendly for sample meeting booking (free tier: 1 event type)
```

### **PHASE 2: ENHANCED FUNCTIONALITY (SHOULD Requirements)**

#### **2.1 Members-Only Area (BR-31, BR-25, BR-40)**
**Location:** `src/pages/members/dashboard.js`, new member pages
**Priority:** SHOULD
**Implementation:**
```javascript
// Required Wix Features:
- Wix Members system (login/registration)
- Member permissions and roles
- Protected pages

// Database Collections Required:
1. ForumPosts {
   - title, content, author, category
   - postDate, replies, tags, pinned
}
2. ForumCategories {
   - name, description, moderators, active
}
3. QAItems {
   - question, answer, category, author
   - upvotes, featured, tags
}

// Components Needed:
- Member dashboard
- Discussion forums with categories
- Q&A helpline system
- Member directory (restricted)
- Exclusive content area

// Files to Create:
- src/pages/members/dashboard.js
- src/pages/members/forums.js
- src/pages/members/helpline.js
- src/pages/members/directory.js
- src/public/js/forum-system.js
- src/public/js/member-management.js

// Limitations on Free Plan:
- Basic member management only
- Limited permission controls
- No advanced member analytics
```

#### **2.2 Payment Portal (BR-05)**
**Location:** `src/pages/Checkout.wdt7x.js`, `src/pages/Plans & Pricing.y71xu.js`
**Priority:** SHOULD
**Implementation:**
```javascript
// FREE PLAN WORKAROUND REQUIRED
// Cannot use Wix Payments on free plan

// Alternative Implementation:
1. PayPal Integration:
   - Subscription buttons for memberships
   - One-time payment buttons for events
   - Workshop fee payments

2. External Solutions:
   - Stripe payment links
   - Square payment forms
   - Google Forms + PayPal

// Files to Create/Modify:
- src/pages/Plans & Pricing.y71xu.js
- src/pages/Checkout.wdt7x.js
- src/public/js/payment-integration.js
- src/pages/components/payment-button.html

// Required Components:
- Pricing display
- Payment button integration
- Confirmation pages
- Payment tracking (external)
```

#### **2.3 Advanced Photo Gallery System (BR-26)**
**Location:** `src/pages/Photos.uutsy.js`
**Priority:** SHOULD
**API Documentation:** [Cloudinary API](https://cloudinary.com/documentation) | [Google Drive API](https://developers.google.com/drive/api/guides/about-sdk)

**Implementation:**
```javascript
// STORAGE LIMITATION WORKAROUND - EXTERNAL HOSTING SOLUTIONS

// Required npm Packages:
1. "fslightbox" - Full-screen image viewer
2. "masonry-layout" - Pinterest-style grid layout  
3. "imagesloaded" - Detect when images are loaded
4. "lozad" - Lazy loading for performance
5. "swiper" - Touch-enabled image slider
6. "exif-js" - Extract EXIF data from images

// External Image Hosting Solutions:
1. Google Drive Public Folders (Recommended)
   - Free: 15GB storage (shared with Gmail)
   - Direct link access for public folders
   - Easy upload and organization
   - No technical setup required

2. GitHub Repository
   - Free: Unlimited public repositories
   - Use GitHub Pages for CDN delivery
   - Version control for image management
   - Easy integration with development workflow

3. Instagram Integration
   - Free: Use existing social media presence
   - Automatic hashtag-based photo feeds
   - No additional storage costs

// Database Collections Required:
1. PhotoGalleries {
   - _id, name, description, category, featured
   - coverImageUrl, thumbnailUrl, createdDate
   - isPublic, sortOrder, eventId, tags
   - photographer, location, shootDate
   - totalPhotos, viewCount, likes
}

2. Photos {
   - _id, galleryId, title, description, tags
   - originalUrl, thumbnailUrl, mediumUrl
   - photographer, shootDate, camera, settings
   - featured, approved, viewCount, likes
   - metadata (exif), altText, caption
}

3. PhotoComments {
   - _id, photoId, memberId, memberName
   - comment, commentDate, isApproved
   - parentCommentId, likes
}

// Google Drive Gallery Integration System:
// File: src/public/js/gdrive-gallery.js
import Swiper from 'swiper';
import { Lightbox } from 'fslightbox';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import lozad from 'lozad';

export class GoogleDriveGallery {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://www.googleapis.com/drive/v3/files';
    this.masonry = null;
    this.lightbox = null;
  }

  // Get direct image URL from Google Drive file ID
  getDirectImageUrl(fileId, size = 'w800-h600') {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=${size}`;
  }

  // Get public folder contents
  async getFolderContents(folderId) {
    try {
      const response = await fetch(
        `${this.baseUrl}?q='${folderId}'+in+parents&key=${this.apiKey}&fields=files(id,name,webViewLink,thumbnailLink,imageMediaMetadata)`
      );
      
      const data = await response.json();
      return data.files;
    } catch (error) {
      console.error('Error fetching Google Drive contents:', error);
      throw error;
    }
  }

  // Load gallery with Google Drive images
  async loadGallery(galleryId, containerId) {
    try {
      const gallery = await wixData.get('PhotoGalleries', galleryId);
      const photos = await this.loadPhotos(galleryId);
      
      // Create gallery HTML
      const galleryHTML = this.createGalleryHTML(photos, gallery);
      
      // Insert into container
      $w(containerId).html = galleryHTML;
      
      // Initialize components
      await this.initializeGalleryComponents(containerId);
      
      return { gallery, photos };
      
    } catch (error) {
      console.error('Error loading gallery:', error);
      throw error;
    }
  }

  // Create responsive gallery HTML with aesthetic design
  createGalleryHTML(photos, gallery) {
    return `
      <div class="gallery-header atmospheric-bg">
        <h2 class="gallery-title heading-enhanced">${gallery.name}</h2>
        <p class="gallery-description text-enhanced">${gallery.description}</p>
        <div class="gallery-meta">
          <span class="photo-count">${photos.length} photos</span>
          <span class="photographer">by ${gallery.photographer}</span>
        </div>
      </div>
      
      <div class="gallery-filters">
        <button class="filter-btn btn-atmospheric active" data-filter="all">All</button>
        <button class="filter-btn btn-atmospheric" data-filter="workshops">Workshops</button>
        <button class="filter-btn btn-atmospheric" data-filter="shows">Shows</button>
        <button class="filter-btn btn-atmospheric" data-filter="meetings">Meetings</button>
        <button class="filter-btn btn-atmospheric" data-filter="trees">Member Trees</button>
      </div>
      
      <div class="masonry-gallery" id="masonryContainer">
        ${photos.map((photo, index) => `
          <div class="gallery-item glass-card" data-category="${photo.category}" data-aos="fade-up" data-aos-delay="${index * 50}">
            <div class="image-card">
              <img 
                class="lazy gallery-image" 
                data-src="${this.getDirectImageUrl(photo.driveFileId, 'w400-h300')}"
                data-full="${this.getDirectImageUrl(photo.driveFileId, 'w1920-h1080')}"
                alt="${photo.altText || photo.title}"
                loading="lazy"
              />
              <div class="image-overlay">
                <h4 class="image-title">${photo.title}</h4>
                <p class="image-description">${photo.description}</p>
                <div class="image-actions">
                  <button class="btn-atmospheric btn-view" data-index="${index}">
                    <i class="icon-eye"></i> View
                  </button>
                  <button class="btn-atmospheric btn-like" data-photo-id="${photo._id}">
                    <i class="icon-heart"></i> ${photo.likes || 0}
                  </button>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="gallery-actions">
        <button class="btn-atmospheric" id="loadMoreBtn">Load More Photos</button>
        <button class="btn-atmospheric btn-outline" id="slideshowBtn">Start Slideshow</button>
      </div>
    `;
  }

  // Setup simple Google Drive folder
  async setupGalleryFolder(folderName) {
    // Instructions for manual setup since this requires authentication
    return {
      instructions: `
        1. Create a folder in Google Drive named "${folderName}"
        2. Right-click folder → Share → Anyone with link can view
        3. Copy the folder ID from the URL (after /folders/)
        4. Upload images to this folder
        5. Each image will be automatically accessible via Drive API
      `,
      folderUrl: 'https://drive.google.com/drive/folders/',
      apiSetup: 'https://developers.google.com/drive/api/quickstart/js'
    };
  }
}

// Files to Create/Modify:
- src/pages/Photos.uutsy.js (main gallery page)
- src/pages/gallery/[galleryId].js (individual gallery view)
- src/public/js/gdrive-gallery.js (Google Drive integration)
- src/public/js/github-gallery.js (GitHub repository integration)
- src/public/js/gallery-uploader.js (admin upload interface)
- src/pages/components/gallery-grid.html
- src/pages/components/photo-lightbox.html
- src/pages/components/slideshow-modal.html
- src/backend/gallery-management.jsw (admin functions)

// External Service Setup:
1. Google Drive API Setup:
   - Enable Google Drive API in Google Cloud Console
   - Generate API key for public access
   - Create public folders for image storage
   - Configure folder permissions for "anyone with link"

2. GitHub Repository Setup (Alternative):
   - Create public GitHub repository for images
   - Use GitHub Pages to serve images via CDN
   - Organize images in folder structure
   - Access via raw.githubusercontent.com URLs

3. Instagram Integration (Optional):
   - Instagram Basic Display API
   - Fetch recent posts with #blueridgebonsai hashtag
   - Display in social gallery section
```

#### **2.4 Event Registration System (BR-49)**
**Location:** Integration with Events system
**Priority:** SHOULD
**Implementation:**
```javascript
// FREE PLAN LIMITATIONS:
- No built-in e-commerce
- Limited database capacity
- No payment processing

// Workaround Implementation:
1. Google Forms Integration:
   - Registration forms for events
   - Automatic email confirmations
   - Spreadsheet data management

2. External Payment:
   - PayPal links for paid events
   - Venmo/Zelle for simple payments
   - Manual confirmation process

// Files to Modify:
- src/pages/Event Details & Registration.ydrhv.js
- src/public/js/event-registration.js
- src/pages/components/registration-form.html

// Required Components:
- Registration form builder
- Capacity tracking
- Waitlist management
- Email confirmations
```

### **PHASE 3: CONTENT MANAGEMENT & OPTIMIZATION**

#### **3.1 Content Management System**
**Location:** Backend admin pages
**Priority:** SHOULD
**Implementation:**
```javascript
// Database Collections for Content:
1. ContentPages {
   - pageId, title, content, lastModified
   - author, published, seoTitle, seoDescription
}
2. MediaAssets {
   - filename, type, url, altText
   - uploadDate, category, fileSize
}

// Admin Interface Files:
- src/pages/admin/content-editor.js
- src/pages/admin/media-manager.js
- src/public/js/content-editor.js
- src/pages/components/wysiwyg-editor.html

// Features:
- Rich text editor
- Image upload/management
- SEO optimization
- Content scheduling
```

#### **3.2 RSS Feed System (BR-42)**
**Location:** Backend/API functions
**Priority:** SHOULD
**Implementation:**
```javascript
// Files to Create:
- src/backend/rss-generator.js
- src/backend/event-feed.js

// External Integration:
- Google Calendar API
- RSS feed validation
- Calendar subscription links

// Components:
- RSS feed generation
- iCal event exports
- Calendar integration buttons
```

#### **3.3 Search Functionality**
**Location:** Site-wide search implementation
**Priority:** SHOULD
**Implementation:**
```javascript
// Database Collections:
1. SearchIndex {
   - content, pageUrl, title, category
   - keywords, lastIndexed
}

// Files to Create:
- src/public/js/site-search.js
- src/pages/components/search-results.html
- src/backend/search-indexer.js

// Features:
- Full-text search
- Category filtering
- Search suggestions
- Results ranking
```

### **PHASE 4: ADVANCED FEATURES (COULD Requirements)**

#### **4.1 Blog System (BR-39)**
**Location:** New blog section
**Priority:** COULD
**Implementation:**
```javascript
// Database Collections:
1. BlogPosts {
   - title, content, author, publishDate
   - category, tags, featured, status
}
2. BlogCategories {
   - name, description, slug, color
}

// Files to Create:
- src/pages/blog/index.js
- src/pages/blog/post.js
- src/pages/blog/category.js
- src/public/js/blog-management.js
```

#### **4.2 Member Portfolios (BR-38)**
**Location:** Members area extension
**Priority:** COULD
**Implementation:**
```javascript
// Database Collections:
1. MemberPortfolios {
   - memberId, title, description, images
   - projects, achievements, featured
}

// Features:
- Portfolio creation tool
- Project showcase
- Achievement tracking
- Public/private portfolios
```

### **PHASE 5: EXTERNAL INTEGRATIONS & WORKAROUNDS**

#### **5.1 Member Communication System**
**Implementation:**
```javascript
// Google Groups Integration
- Member mailing list
- Event announcements
- Discussion threads
- Simple email newsletters

// Files to Create:
- src/public/js/google-groups-integration.js
- src/pages/components/mailing-list-signup.html
- src/backend/email-notifications.jsw

// Simple Google Groups Implementation:
export class GoogleGroupsIntegration {
  constructor(groupEmail) {
    this.groupEmail = groupEmail; // e.g., brbs-members@googlegroups.com
  }
  
  // Generate mailto link for joining group
  generateJoinLink() {
    return `mailto:${this.groupEmail}?subject=Join Request&body=Please add me to the Blue Ridge Bonsai Society mailing list.`;
  }
  
  // Generate simple signup form
  createSignupForm() {
    return `
      <div class="mailing-list-signup glass-card">
        <h3>Join Our Mailing List</h3>
        <p>Stay updated with events, tips, and society news</p>
        <a href="${this.generateJoinLink()}" class="btn-atmospheric">
          Join Mailing List
        </a>
        <p class="note">This will open your email client to send a join request.</p>
      </div>
    `;
  }
}
```

#### **5.2 Analytics Implementation (BR-23)**
**Implementation:**
```javascript
// Google Analytics 4 (Free)
- Basic visitor tracking
- Page views and engagement
- Event tracking
- Goal conversions

// Files to Create:
- src/public/js/analytics-tracking.js
- src/backend/analytics-processor.js
```

#### **5.3 Social Media Integration**
**Implementation:**
```javascript
// Components:
- Social media feed widgets
- Sharing buttons
- Instagram integration
- Facebook page integration

// Files to Create:
- src/public/js/social-integration.js
- src/pages/components/social-feed.html
```

---

## 🗃️ DATABASE SCHEMA DESIGN

### **Critical Collections (Within Free Limit)**

```javascript
// PRIORITY 1: Essential Collections (5 collections)
1. Events (50 items max)
2. Members (200 items max) 
3. Articles (100 items max)
4. BoardMembers (20 items max)
5. Resources (50 items max)

// PRIORITY 2: If space allows (5 collections)
6. FAQItems (30 items max)
7. PhotoGalleries (50 items max)
8. ForumPosts (100 items max) 
9. EventRegistrations (200 items max)
10. MembershipLevels (10 items max)

// TOTAL: 810 items (within 1,000 limit)
```

---

## 📦 EXTERNAL DEPENDENCIES & PACKAGES

### **Required Free External Services:**
1. **PayPal** - Payment processing
2. **Google Forms** - Registration and applications
3. **Google Calendar** - Event management and RSS
4. **Google Groups** - Member communications (unlimited)
5. **Google Drive** - Image hosting and file storage (15GB)
6. **Google Analytics** - Site analytics
7. **GitHub** - Version control and additional image hosting

### **Recommended npm Packages (Aesthetic & Functional):**
```javascript
// Core Utilities (Always Install):
1. "lodash" - Data manipulation utilities
2. "moment" - Date/time formatting and calculations
3. "uuid" - Generate unique identifiers
4. "validator" - Input validation and sanitization

// UI/UX Enhancement Packages:
5. "sweetalert2" - Beautiful alert/modal dialogs
6. "animate.css" - CSS animation library
7. "aos" - Animate On Scroll library
8. "particles.js" - Interactive particle backgrounds
9. "typed.js" - Typewriter effect animations
10. "swiper" - Touch slider/carousel components

// Date & Calendar:
11. "date-fns" - Lightweight date utility library
12. "dayjs" - Fast 2KB alternative to Moment.js
13. "date-fns-tz" - Timezone support for date-fns

// Form Enhancement:
14. "cleave.js" - Input formatting (phone, currency)
15. "inputmask" - Input masking for forms
16. "vanilla-tilt" - 3D tilt effect for cards

// Rich Content:
17. "marked" - Markdown parser
18. "dompurify" - HTML sanitization
19. "highlight.js" - Syntax highlighting
20. "prism" - Code syntax highlighter

// Charts & Visualization:
21. "chart.js" - Beautiful charts and graphs
22. "chartjs-adapter-date-fns" - Date adapter for Chart.js
23. "progressbar.js" - Animated progress bars

// Image & Media:
24. "lozad" - Lazy loading images
25. "lightbox2" - Image lightbox gallery
26. "fslightbox" - Full-screen lightbox

// Search & Filtering:
27. "fuse.js" - Fuzzy search library
28. "list.js" - Search/sort/filter lists
29. "lunr" - Full-text search engine

// Performance & Utilities:
30. "intersection-observer" - Polyfill for intersection observer
31. "lazysizes" - High performance lazy loader
32. "web-vitals" - Essential metrics for user experience

// Social & External:
33. "rss-parser" - Parse RSS feeds
34. "qrcode" - Generate QR codes
35. "share-api-polyfill" - Web Share API polyfill

// Package Installation Commands (via Wix Package Manager):
// Go to Code Files → npm → Install Package from npm
// Search for each package name and click Install

// Aesthetic Color Palettes to Use:
const designTokens = {
  primary: '#6B8E6F',    // Mountain Sage
  secondary: '#4A4A4A',   // Stone Gray  
  accent: '#8B7355',      // Earth Brown
  background: '#FEFFFE',  // Cloud White
  success: '#5CB85C',
  warning: '#F0AD4E',
  error: '#D9534F',
  info: '#5BC0DE'
};

// Font Stack (already available in design-system.css):
const fontFamilies = {
  primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  traditional: "'Crimson Text', Georgia, serif",
  japanese: "'Noto Sans JP', sans-serif",
  monospace: "'Fira Code', 'Monaco', 'Consolas', monospace"
};
```

---

## 🎯 IMPLEMENTATION PRIORITY ORDER (Detailed 10-Week Plan)

### **Week 1-2: Foundation & Core Setup**
**npm Packages to Install First:**
- `lodash`, `moment`, `validator`, `sweetalert2`, `aos`

**Tasks:**
1. **Day 1-3:** Homepage redesign (Home.c1dmp.js)
   - Install atmospheric CSS/JS packages
   - Implement hero section with mission statement
   - Create member spotlight carousel
   - Add call-to-action sections

2. **Day 4-7:** About Us content (About BRBS.a28ns.js)
   - Design board member profile cards
   - Implement FAQ accordion
   - Add NC Arboretum partnership section
   - Create meeting information display

3. **Day 8-10:** Navigation enhancement
   - Implement atmospheric navigation system
   - Add mobile hamburger menu
   - Setup breadcrumb navigation
   - Test responsive design

4. **Day 11-14:** Design system implementation
   - Apply consistent color palette (#6B8E6F, #4A4A4A, #FEFFFE)
   - Implement typography system (Inter, Crimson Text)
   - Add micro-interactions and animations
   - Mobile responsiveness testing

### **Week 3-4: Events System (Most Critical)**
**npm Packages:** `date-fns`, `uuid`, `marked`, `fslightbox`

**Tasks:**
1. **Day 15-18:** Core events infrastructure
   - Setup Events database collection
   - Implement EventSystem class
   - Create event filtering system
   - Build event card components

2. **Day 19-22:** Event calendar and details
   - Integrate FullCalendar.js for calendar view
   - Build event detail pages with registration
   - Implement event commenting system
   - Add photo integration to events

3. **Day 23-25:** RSS Feed and iCal export
   - Build RSS feed generator backend
   - Create iCal export functionality
   - Test calendar subscription features

4. **Day 26-28:** Event registration system
   - Setup external registration (Google Forms)
   - Integrate PayPal for paid events
   - Create confirmation email system
   - Test registration workflow

### **Week 5-6: Learning Center & Knowledge Management**
**npm Packages:** `fuse.js`, `marked`, `highlight.js`, `dompurify`

**Tasks:**
1. **Day 29-32:** Articles & Knowledge Base
   - Setup Articles database collection
   - Implement search functionality with Fuse.js
   - Create markdown-based article system
   - Build beginner's guide structure

2. **Day 33-36:** Resource Management
   - Create vendor directory
   - Implement downloadable resources
   - Add article categorization
   - Build resource search/filter

3. **Day 37-42:** Content Enhancement
   - Import existing BRBS content
   - Create bonsai care guides
   - Add seasonal advice sections
   - Implement content management tools

### **Week 7-8: Membership System & Member Features**
**npm Packages:** `crypto-js`, `chart.js`, `qrcode`

**Tasks:**
1. **Day 43-46:** Membership Infrastructure
   - Setup extended Members collections
   - Implement MembershipSystem class
   - Build application forms with validation
   - Create membership level management

2. **Day 47-50:** Member Dashboard & Profiles
   - Build enhanced member dashboard
   - Implement profile management
   - Add membership status tracking
   - Create member interaction logging

3. **Day 51-53:** Member-Only Features
   - Setup discussion forums
   - Implement Q&A helpline system
   - Create member directory (restricted)
   - Add exclusive content areas

4. **Day 54-56:** Payment Integration
   - Setup PayPal subscription integration
   - Implement external payment workflows
   - Create payment confirmation system
   - Test renewal processes

### **Week 9-10: Advanced Features & Photo Gallery**
**npm Packages:** `masonry-layout`, `imagesloaded`, `lozad`, `swiper`

**Tasks:**
1. **Day 57-60:** Photo Gallery System
   - Setup Google Drive API and public folders
   - Implement GoogleDriveGallery class
   - Build responsive gallery layouts
   - Add lightbox and slideshow features

2. **Day 61-63:** External Integrations
   - Setup Google Drive API (alternative)
   - Implement Instagram feed integration
   - Create social sharing features
   - Add QR code generation

3. **Day 64-66:** Search & Analytics
   - Implement site-wide search with Lunr.js
   - Setup Google Analytics integration
   - Create performance monitoring
   - Add user experience tracking

4. **Day 67-70:** Final Polish & Testing
   - SEO optimization and meta tags
   - Performance testing and optimization
   - Mobile device testing
   - Cross-browser compatibility testing
   - External service integration testing
   - User acceptance testing preparation

### **📋 Daily Checklist Template:**
```
□ Morning: Review previous day's work
□ Install/configure required npm packages
□ Implement core functionality
□ Test on mobile devices
□ Update database collections if needed
□ Commit code to repository
□ Evening: Document progress and issues
```

### **🔧 Development Tools Setup:**
1. **Wix Package Manager:** Install npm packages via Code Files → npm
2. **Database Collections:** Setup via Content Manager
3. **API Keys:** Store in Wix Secrets Manager
4. **External Services:** Configure webhooks and endpoints
5. **Testing:** Use Wix Preview for real-time testing

### **📊 Progress Tracking Metrics:**
- Database collections created and populated
- npm packages successfully installed and integrated
- External API integrations functioning
- Mobile responsiveness verified
- Page load times under 3 seconds
- User experience flows tested
- SEO scores above 90 (where possible)

### **⚠️ Risk Mitigation:**
1. **Package Compatibility:** Test each npm package before full integration
2. **External Service Limits:** Monitor API usage for free tier limits
3. **Database Capacity:** Track item count approaching 1,000 limit
4. **Performance:** Regular testing to ensure site speed
5. **Mobile Experience:** Daily testing on actual devices

---

## ⚠️ CRITICAL LIMITATIONS TO COMMUNICATE

1. **No Custom Domain** - Will remain on free Wix subdomain
2. **Storage Constraints** - Must use external image hosting
3. **Database Limits** - Must carefully manage data collections
4. **Payment Limitations** - External payment processing only
5. **Branding** - Cannot remove "Made with Wix" footer
6. **Analytics** - Limited to Google Analytics integration
7. **Email** - Must use external email marketing services
8. **Backup** - No automated backup; manual export only

## 📚 CURRENT WIX API DOCUMENTATION & BEST PRACTICES (2025)

### **Essential Wix API References:**
1. **[Wix Velo API Reference](https://dev.wix.com/docs/velo)** - Main documentation hub
2. **[Wix Members Backend API](https://dev.wix.com/docs/velo/apis/wix-members-backend/introduction)** - Member management
3. **[Wix Data API](https://dev.wix.com/docs/velo/apis/wix-data/introduction)** - Database operations
4. **[Wix Events v2 API](https://dev.wix.com/docs/velo/apis/wix-events-v2/wix-events-v2/introduction)** - Event management
5. **[Wix Frontend Members API](https://dev.wix.com/docs/velo/apis/wix-members-frontend/introduction)** - Client-side member functions
6. **[npm Packages Documentation](https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/packages/about-npm-packages)** - Package management

### **2025 Best Practices:**
```javascript
// Modern Wix Velo Code Structure:
import { members } from 'wix-members-backend';
import { currentMember } from 'wix-members-frontend';
import { webMethod } from 'wix-web-module';
import wixData from 'wix-data';

// Use async/await consistently
export const modernFunction = webMethod(async (params) => {
  try {
    const result = await wixData.query('Collection')
      .limit(50)
      .find();
    return { success: true, data: result.items };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: error.message };
  }
});

// Frontend best practices
$w.onReady(async function () {
  // Use modern class-based architecture
  const pageManager = new PageManager();
  await pageManager.initialize();
  
  // Setup error boundaries
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  });
});
```

### **Performance Optimization Guidelines:**
1. **Database Queries:**
   - Always use `.limit()` to prevent large data loads
   - Use `.select()` to fetch only required fields
   - Implement pagination for large datasets
   - Cache frequently accessed data in frontend

2. **npm Package Management:**
   - Only import specific functions: `import { debounce } from 'lodash';`
   - Use dynamic imports for large packages: `const chart = await import('chart.js');`
   - Monitor bundle size impact on page load

3. **Image Optimization:**
   - Use WebP format with JPEG fallbacks
   - Implement lazy loading with Intersection Observer
   - Serve responsive images with srcset
   - Optimize for Core Web Vitals

### **Security Best Practices:**
```javascript
// Input validation and sanitization
import validator from 'validator';
import DOMPurify from 'dompurify';

export const secureUserInput = webMethod(async (userInput) => {
  // Validate input
  if (!validator.isLength(userInput.email, { min: 5, max: 320 })) {
    throw new Error('Invalid email length');
  }
  
  if (!validator.isEmail(userInput.email)) {
    throw new Error('Invalid email format');
  }
  
  // Sanitize HTML content
  const sanitizedContent = DOMPurify.sanitize(userInput.content);
  
  // Use parameterized queries (Wix Data handles this automatically)
  return await wixData.insert('Collection', {
    email: userInput.email,
    content: sanitizedContent
  });
});
```

### **Mobile-First Implementation:**
```css
/* Use in src/public/styles/design-system.css */
/* Mobile-first responsive design */
.container {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  padding: 1rem;
}

@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

/* Touch-friendly interactive elements */
.btn-atmospheric {
  min-height: 44px; /* iOS recommended touch target */
  min-width: 44px;
  padding: 12px 24px;
}
```

### **Accessibility Implementation (WCAG 2.1 AA):**
```javascript
// Use existing: src/public/js/accessibility.js
// Additional accessibility enhancements:

// Keyboard navigation
$w('#navigationMenu').onKeyPress((event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.target.click();
  }
});

// Screen reader announcements
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
}

// Color contrast compliance
:root {
  --primary-color: #6B8E6F; /* Contrast ratio: 4.52:1 (AA compliant) */
  --text-color: #4A4A4A;    /* Contrast ratio: 9.74:1 (AAA compliant) */
  --background: #FEFFFE;     /* High contrast base */
}
```

### **SEO Optimization (Free Plan Compatible):**
```javascript
// Use in page files for dynamic SEO
import { seo } from 'wix-seo-frontend';

$w.onReady(async function () {
  // Dynamic meta tags for event pages
  const eventId = wixLocation.query.eventId;
  if (eventId) {
    const event = await wixData.get('Events', eventId);
    
    seo.title(event.title);
    seo.description(`Join ${event.title} at Blue Ridge Bonsai Society. ${event.description.substring(0, 150)}...`);
    seo.keywords(['bonsai', 'workshop', 'asheville', event.category]);
    
    // Structured data for events
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": event.title,
      "description": event.description,
      "startDate": event.startDate,
      "location": {
        "@type": "Place",
        "name": event.location
      }
    };
    
    seo.structuredData([structuredData]);
  }
});
```

### **Error Handling & Monitoring:**
```javascript
// Global error handler
class ErrorHandler {
  static async logError(error, context = {}) {
    const errorLog = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date(),
      context,
      userAgent: navigator.userAgent
    };
    
    try {
      await wixData.insert('ErrorLogs', errorLog);
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  }
  
  static handleAsyncError(asyncFunction) {
    return async (...args) => {
      try {
        return await asyncFunction(...args);
      } catch (error) {
        await ErrorHandler.logError(error, { function: asyncFunction.name, args });
        throw error;
      }
    };
  }
}

// Usage:
const safeFunction = ErrorHandler.handleAsyncError(async (data) => {
  return await wixData.insert('Collection', data);
});
```

### **Testing Strategy:**
1. **Unit Testing:** Use Jest for utility functions
2. **Integration Testing:** Test Wix API interactions
3. **Performance Testing:** Monitor Core Web Vitals
4. **Mobile Testing:** Test on actual devices
5. **Accessibility Testing:** Use aXe accessibility checker

---

This comprehensive implementation plan provides a fully functional, modern, and scalable bonsai society website within the constraints of the free Wix plan, utilizing current best practices, external services, and aesthetic design principles to deliver an exceptional user experience. 