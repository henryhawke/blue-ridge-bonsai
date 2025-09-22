# Blue Ridge Bonsai Society – Implementation Guide

This guide is for the Wix Studio editor who needs to make sure the published site reflects the functionality in this repository. The code already handles data fetching, rendering, and fallbacks; your job in the Editor is to line up the Wix-native components, IDs, and collections so those scripts can run without further tweaks.

---

## 1. Before You Begin

- **Install Wix Events** and add your real events. Categories such as “Workshop”, “Meeting”, and “Exhibition” should match the filters shown on the Events page.
- **Enable Wix Members & Wix Groups**. Decide which group represents active members—you will reference its ID or slug in `backend/config/user-management.config.js`.
- **Prepare a shared Google Drive folder** for the photo galleries. Set “Anyone with the link” to **Viewer** and note the folder ID.
- Collect a **Google API key** (Drive API enabled) and store it in Wix Secrets Manager as `GOOGLE_DRIVE_API_KEY`.

If you are staging in a sandbox or do not have production data yet, the backend will automatically use the JSON fixtures stored under `src/backend/data/` so the pages still render meaningful examples.

---

## 2. Align Page Elements in the Wix Editor

The front-end files rely on native Wix elements with specific IDs. Add or rename the following elements in the corresponding pages. (See [docs/MANUAL_SETUP.md](docs/MANUAL_SETUP.md#4-wix-element-id-reference) for the full list.)

| Page | Key elements |
| --- | --- |
| **Home** | Text: `heroTitle`, `heroSubtitle`, `heroDescription`, `announcementText`, `statMembers`, `statEvents`, `statWorkshops`; Buttons: `ctaJoinButton`, `ctaEventsButton`, `ctaLearningButton`, `ctaAboutButton`, `viewAllEventsButton`; Repeater: `eventsRepeater` (items `eventTitle`, `eventDate`, `eventCategory`, `eventDescription`, `eventAvailability`, button `eventActionButton`, optional `eventsEmptyState`); Repeater: `spotlightRepeater` (items `spotlightName`, `spotlightBio`, `spotlightSpecialties`, `spotlightImage`, optional `spotlightEmptyState`). |
| **About BRBS** | Text: `missionTitle`, `missionText`, `visionTitle`, `visionText`; Repeaters: `valuesRepeater`, `boardRepeater`, `faqRepeater`; Partnership section: `partnershipHeading`, `partnershipDescription`, `partnershipLinksRepeater`, `partnershipGallery`; Meeting info: `meetingSchedule`, `meetingLocation`, `meetingNext`, `meetingVisitorPolicy`. |
| **Events** | Filters: `categoryFilter`, `difficultyFilter`, `statusFilter`, `searchInput`; Buttons: `gridViewBtn`, `calendarViewBtn`, `calendarPrevBtn`, `calendarNextBtn`; Sections: `eventsGridSection`, `calendarSection`, `eventsLoading`, `eventsEmptyState`, `eventsErrorBox`; Repeater: `eventsRepeater` with text elements `eventTitle`, `eventDate`, `eventLocation`, `eventCategory`, `eventDifficulty`, `eventAvailability`, `eventSummary`, button `eventDetailsButton`; HTML Component `calendarHtml` for the calendar markup. |
| **Photos** | Repeater `galleriesRepeater` with `coverImage`, `galleryName`, `galleryDescription`, `photoCount`, `viewGalleryBtn`; state boxes `loadingBox`, `emptyStateBox`. |
| **Gallery View** | Wix **Pro Gallery** with ID `proGallery1`; loading/empty boxes `loadingBox`, `emptyStateBox`. |
| **Join BRBS** | Form container `applicationForm`; inputs `firstNameField`, `lastNameField`, `emailField`, `phoneField`, `membershipLevelSelect`; text `formFeedback`. |

> 💡 If an element exposes both `text` and `html` properties, ensure it is a Text element. For repeaters, create the child elements first, then assign IDs to match the list above.

---

## 3. Configure Data Sources

### 3.1 Wix Events

- Manage all real events in the Wix Events dashboard. The front end reads from Wix Events v2 via `backend/site-data.jsw`.
- Registrations are forwarded to Wix Events. Configure your registration form fields inside Wix Events (name, email, phone, custom questions) to match what the site displays.
- For testing in environments without events access, the static data in `src/backend/data/Events.json` and `EventRegistrations.json` is returned automatically.

### 3.2 Membership & Groups

- Update `backend/config/user-management.config.js` with your Wix Group ID or slug. Publish so the backend can resolve the group when approving members.
- Collections required in Wix Data:
  - `Members` – Extended profile information linked to Wix Members (fields for bio, expiration date, specialties, etc.).
  - `MembershipLevels` – Level name, price, description, `isActive`, and `sortOrder`.
  - `MemberApplications` – Stores submissions from the Join page (`status`, `applicationDate`, `approvalDate`, notes, etc.).
- Optional collections used by specialized pages: `EventComments`, `MemberInteractions`, and any static content collections if you prefer not to rely on the JSON fixtures.
- When an application is approved the backend will create the Wix Member, add them to the configured group, store extended profile details in `Members`, and update the application record.

### 3.3 Google Drive Galleries

1. Share the parent folder (and every subfolder) so “Anyone with the link” can view.
2. Set the folder ID in `src/public/config/gallery.config.js` (`DRIVE_ROOT_FOLDER_ID`).
3. Store the API key as `GOOGLE_DRIVE_API_KEY` in Secrets Manager.
4. Add a Wix Pro Gallery to the Gallery View page with ID `proGallery1`; no dataset binding is required.
5. Each immediate subfolder under the root becomes a gallery card. Files whose names start with `cover` or `thumbnail` are treated as preferred cover images.

---

## 4. Testing & Verification

Work through these checks after publishing changes:

1. **Homepage** – Confirm hero copy personalizes for logged-in members, stats populate, and the events/spotlight repeaters display content.
2. **Events** – Verify the repeater loads real Wix Events data, filters work, and the calendar view renders in the `calendarHtml` component.
3. **Event Details** – Visit `/event-details?eventId=<your-event-id>`; verify registration buttons, comments, and related events populate. Ensure registrations reach Wix Events if you submit a test entry.
4. **Photos & Gallery View** – Confirm the Photos page lists Google Drive folders and the Gallery View page displays those items in the Wix Pro Gallery.
5. **Join BRBS** – Submit an application. Check that `MemberApplications` contains the new record and, when approved via the backend function, that the Wix Member is created and added to the configured group.
6. **Member directory** – On a members-only page, verify the directory loads from the Wix Group when present.

Refer to [docs/MANUAL_SETUP.md](docs/MANUAL_SETUP.md) for deeper configuration details and the full element ID list.
