# Blue Ridge Bonsai Society – Manual Setup Checklist

This checklist keeps the live Wix Studio site in sync with the code in this repository. Complete each section after deploying new code or connecting a fresh Wix site so the Wix-native integrations (Events, Members/Groups, and Pro Gallery) work without additional ad-hoc edits.

---

## 1. Secrets, Configuration, and Environment Switches

| Location | Key / Setting | Required Value | Notes |
| --- | --- | --- | --- |
| **Wix Secrets Manager** | `GOOGLE_DRIVE_API_KEY` | Google API key with the Drive API enabled | Required for loading gallery images from Google Drive. Create the key in Google Cloud, enable the Drive API, and store it under **Settings → Secrets Manager**. |
| **`src/public/config/gallery.config.js`** | `DRIVE_ROOT_FOLDER_ID` | Google Drive folder ID | Paste the ID of the shared parent folder that contains one subfolder per gallery. Leave blank to fall back to mock JSON data. |
| **`backend/config/user-management.config.js`** | `PRIMARY_GROUP_ID` or `PRIMARY_GROUP_SLUG` | Wix Group identifier for active members | Use the group that represents paid/approved members. If you do not have the ID, set the slug and leave the ID empty—the backend will resolve it automatically. |

> ℹ️ During development you can leave the Google Drive folder ID empty. The backend will return the mock JSON fixtures in `src/backend/data/` until the real services are connected.

---

## 2. Enable Wix Native Services

### 2.1 Install and Configure **Wix Events**

1. Add the **Wix Events** app to the site if it is not already installed.
2. Create event categories (Workshop, Meeting, Exhibition, etc.) that match what the frontend filters expect.
3. Enter upcoming events inside the Wix Events dashboard. The backend (`backend/site-data.jsw`) reads directly from Wix Events v2 and caches results for five minutes.
4. Optional: if you use registration, configure the registration form inside Wix Events so fields (name, email, phone) align with what the frontend displays. `registerMemberForEvent` proxies calls to `wix-events.v2`.
5. For sandbox or editor preview without real data, the static JSON fixtures under `src/backend/data/Events.json` and `EventRegistrations.json` are used automatically as a fallback.

### 2.2 Align **Members & Groups**

1. Ensure **Wix Members** is enabled so visitors can log in.
2. Create (or identify) a **Wix Group** that represents current members. Note the group’s ID or slug and update `backend/config/user-management.config.js` accordingly.
3. Confirm site members are routed into that group when they are approved. The backend will:
   - Create Wix Member accounts via `members.createMember`.
   - Add the member to the configured group using the Wix Groups API.
   - Store extended profile data in the custom `Members` collection for legacy fields (bio, specialties, expiration date, etc.).
4. Review any triggered emails or automations associated with new member approvals. The backend automatically sends a confirmation email via `sendEmail` when applications are submitted.

### 2.3 Prepare the **Wix Pro Gallery** integration

1. Share the Google Drive parent folder so that “Anyone with the link” can view.
2. Place one gallery per immediate subfolder. Optional: name a cover image `cover*.jpg` or `thumbnail*.png` to control the gallery thumbnail Wix shows.
3. On the **Photos** page add a Repeater with ID `galleriesRepeater`, a loading box (`loadingBox`), an empty state box (`emptyStateBox`), and buttons/images inside the repeater (`coverImage`, `galleryName`, `galleryDescription`, `photoCount`, `viewGalleryBtn`).
4. On the **Gallery View** page add a Wix **Pro Gallery** element with ID `proGallery1` plus loading/empty state boxes (`loadingBox`, `emptyStateBox`).
5. After those elements exist the frontend will populate the repeater and Pro Gallery directly with Drive media—no dataset connections are required.

---

## 3. Wix Data Collections Still in Use

Only a handful of custom collections remain. Create them with the fields below (types are suggestions; adjust if you already have structured data). All other dynamic content sources (events, galleries, user accounts) now come from the Wix-native services above.

### 3.1 `Members`

Extended profile information for Wix Members. This collection stores fields that are not part of the built-in Members app.

| Field | Type | Notes |
| --- | --- | --- |
| `_id` | Text | Match the Wix Member ID so joins work both ways. |
| `firstName`, `lastName`, `email`, `loginEmail`, `phone` | Text | Optional overrides for the member contact record. |
| `membershipLevel` | Text | Displayed throughout the site. |
| `isActive` | Boolean | Used for directory filtering. |
| `joinDate`, `expirationDate`, `approvalDate` | Date & Time | Renewal logic relies on `expirationDate`. |
| `profileImage` | Image | Used on the homepage spotlights. |
| `bio`, `specialties`, `notes` | Rich Text / Text | Optional profile details. |

### 3.2 `MembershipLevels`

| Field | Type | Notes |
| --- | --- | --- |
| `_id` | Text | Internal identifier. |
| `name` | Text | Level name shown on Join page. |
| `price` | Number | Displayed in USD by default. |
| `sortOrder` | Number | Controls display order. |
| `description`, `benefits` | Rich Text / Text | Optional marketing copy. |
| `isActive` | Boolean | Only active levels are shown. |

### 3.3 `MemberApplications`

| Field | Type | Notes |
| --- | --- | --- |
| `_id` | Text (auto) | Wix will auto-generate if omitted. |
| `firstName`, `lastName`, `email`, `phone` | Text | Captured from the Join form. |
| `membershipLevel` | Text | Selected level. |
| `applicationDate`, `approvalDate` | Date & Time | Used for workflow tracking. |
| `status` | Text | `pending_payment`, `approved`, `rejected`, etc. |
| `notes` | Rich Text | Internal admin notes. |

### 3.4 Optional collections used by legacy pages

Create these only if you rely on the related page experiences:

- `EventComments` – Stores moderated comments for the event-details page. Fields: `_id`, `eventId`, `memberId`, `memberName`, `comment`, `commentDate`, `isApproved`, `likes`.
- `MemberInteractions` – Tracks admin/member touchpoints shown on the member dashboard.
- Any of the static content collections (BoardMembers, FAQItems, Resources, VendorList, Articles) if you prefer to manage them via Wix Data instead of the JSON fixtures. The backend automatically falls back to `src/backend/data/*.json` when the collection does not exist.

---

## 4. Wix Element ID Reference

The frontend code uses `$w('#elementId')` extensively. Make sure these IDs exist on the corresponding pages. (All IDs are case-sensitive.)

### Homepage (`Home`)

- Text: `heroTitle`, `heroSubtitle`, `heroDescription`, `announcementText`, `statMembers`, `statEvents`, `statWorkshops`
- Buttons: `ctaJoinButton`, `ctaEventsButton`, `ctaLearningButton`, `ctaAboutButton`, `viewAllEventsButton`
- Repeater: `eventsRepeater` (item elements `eventTitle`, `eventDate`, `eventCategory`, `eventDescription`, `eventAvailability`, button `eventActionButton`, optional box `eventsEmptyState`)
- Repeater: `spotlightRepeater` (item elements `spotlightName`, `spotlightBio`, `spotlightSpecialties`, `spotlightImage`, optional box `spotlightEmptyState`)

### About (`About BRBS`)

- Text: `missionTitle`, `missionText`, `visionTitle`, `visionText`
- Repeaters: `valuesRepeater`, `boardRepeater`, `faqRepeater`
- Partnership section: `partnershipHeading`, `partnershipDescription`, `partnershipLinksRepeater` (button `partnershipLinkButton`), `partnershipGallery`
- Meeting info: `meetingSchedule`, `meetingLocation`, `meetingNext`, `meetingVisitorPolicy`
- Stats: `aboutMemberCount`, `aboutWorkshopCount`, `aboutFounded`
- Error state: `aboutErrorMessage`, `aboutErrorBox`

### Events (`Events`)

- Filters: `categoryFilter`, `difficultyFilter`, `statusFilter`, `searchInput`
- View toggles: `gridViewBtn`, `calendarViewBtn`
- Sections/boxes: `eventsGridSection`, `calendarSection`, `eventsLoading`, `eventsEmptyState`, `eventsErrorBox`, `eventsErrorMessage`
- Text: `eventsCountText`, `statsUpcoming`, `statsFeatured`, `statsFillRate`, `calendarMonthLabel`
- Buttons: `calendarPrevBtn`, `calendarNextBtn`
- Repeater: `eventsRepeater` with text elements `eventTitle`, `eventDate`, `eventLocation`, `eventCategory`, `eventDifficulty`, `eventAvailability`, `eventSummary`, button `eventDetailsButton`
- HTML Component (calendar): `calendarHtml`

### Learning Center (`Beginner's Guide`)

- Tabs/Buttons: `tabBeginner`, `tabKnowledge`, `tabResources`, `tabVendors`
- Filters: `learningSearch`, `learningCategory`, `learningDifficulty`
- Sections: `beginnersSection`, `knowledgeSection`, `resourcesSection`, `vendorsSection`
- Repeaters: `beginnerRepeater` (`stepTitle`, `stepSummary`, `stepFocus`, `stepResources`), `knowledgeRepeater` (`articleTitle`, `articleExcerpt`, `articleMeta`, `articleReadButton`), `resourcesRepeater` (`resourceName`, `resourceDescription`, `resourceMeta`, `resourceLinkButton`), `vendorsRepeater` (`vendorName`, `vendorLocation`, `vendorNotes`, `vendorContactButton`)
- Error state: `learningErrorMessage`, `learningErrorBox`

### Photos (`Photos`) & Gallery View (`Gallery View`)

- Photos page Repeater: `galleriesRepeater` (items `coverImage`, `galleryName`, `galleryDescription`, `photoCount`, button `viewGalleryBtn`)
- Photos page states: `loadingBox`, `emptyStateBox`
- Gallery view page: `proGallery1`, `loadingBox`, `emptyStateBox`

### Join (`Join BRBS`)

- Form container: `applicationForm`
- Inputs: `firstNameField`, `lastNameField`, `emailField`, `phoneField`, `membershipLevelSelect`
- Feedback text: `formFeedback`

### Event Details (`Event Details & Registration`)

- Buttons: `registerButton`, `cancelRegistrationButton`, `shareButton`
- Sections: `commentsSection`, `commentsContainer`, `relatedEventsSection`, `registrationFormSection`
- Text boxes for event metadata as laid out in the page code

---

## 5. Publish & Test Checklist

1. **Homepage** – Confirm hero text personalizes for signed-in members, stats populate, and events/spotlights display.
2. **Events** – Verify Wix Events data loads, filters update the repeater, and the calendar view renders.
3. **Event Details** – Open `/event-details?eventId=<wix-event-id>` and confirm registration buttons, comments, and related events populate.
4. **Photos** – Ensure the repeater lists Google Drive galleries and clicking a card opens the Gallery View page with the Wix Pro Gallery populated.
5. **Join** – Submit the form and confirm the record appears in `MemberApplications` and that a Wix Member record + group membership is created when approved from the backend.
6. **Member Directory/Admin tools** – Spot-check `getMemberDirectory` (members-only pages) to ensure group membership syncing works.

Keep this checklist with the deployment notes so future updates stay aligned with the live site configuration.
