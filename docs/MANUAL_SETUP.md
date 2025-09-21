# Blue Ridge Bonsai Society – Manual Setup Checklist

This checklist covers the manual work required inside Wix Studio after deploying the code in this repository. Complete each section to ensure that the Velo code runs without additional tweaks in the in-browser editor.

---

## 1. Secrets Manager

| Secret Key             | Value                                 | Notes                                                                                                                                                                         |
| ---------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GOOGLE_DRIVE_API_KEY` | Google API key with Drive API enabled | Required for the Google Drive photo gallery integration. Create the key in Google Cloud, enable the Drive API, and add it under **Settings → Secrets Manager** in Wix Studio. |

---

## 2. Database Collections

Create the following collections (dynamic datasets) in Wix Data. Field names must match exactly; use the suggested types.

### 2.1 `Events`

- `_id` (Text) – unique event ID (e.g. `evt001`)
- `title` (Text)
- `description` (Rich Text or Text)
- `richDescription` (Rich Text)
- `startDate` (Date & Time)
- `endDate` (Date & Time)
- `timezone` (Text)
- `location` (Text)
- `registrationRequired` (Boolean)
- `maxAttendees` (Number)
- `currentAttendees` (Number)
- `category` (Text)
- `difficulty` (Text)
- `price` (Number)
- `instructor` (Text)
- `featured` (Boolean)
- `tags` (Tags)
- `images` (Image: multiple)
- `createdDate` (Date & Time)

### 2.2 `EventRegistrations`

- `_id` (Text)
- `eventId` (Reference → Events or Text)
- `memberEmail` (Text)
- `memberName` (Text)
- `registrationDate` (Date & Time)
- `paymentStatus` (Text)
- `paymentMethod` (Text)
- `notes` (Rich Text)

### 2.3 `EventComments` _(optional – only if using comments section)_

- `_id` (Text)
- `eventId` (Reference → Events)
- `memberId` (Reference → Members)
- `memberName` (Text)
- `comment` (Rich Text)
- `commentDate` (Date & Time)
- `isApproved` (Boolean)

### 2.4 `BoardMembers`

- `_id` (Text)
- `name` (Text)
- `role` (Text)
- `bio` (Rich Text)
- `photo` (Image)
- `contactInfo` (Text, email or URL)

### 2.5 `FAQItems`

- `_id` (Text)
- `question` (Text)
- `answer` (Rich Text)
- `category` (Text)

### 2.6 `PartnershipInfo`

- `_id` (Text)
- `partnerName` (Text)
- `content` (Rich Text)
- `images` (Image: multiple)
- `links` (Rich Text or JSON – store as multi-reference or dataset for buttons)

### 2.7 `Members`

- Standard Wix Members collection extended with:
  - `membershipLevel` (Text)
  - `profileImage` (Image)
  - `yearsExperience` (Number)
  - `bio` (Rich Text)
  - `specialties` (Text)
  - `isActive` (Boolean)

### 2.8 `Articles`

- `_id` (Text)
- `title` (Text)
- `content` (Rich Text)
- `excerpt` (Text)
- `category` (Text)
- `difficulty` (Text)
- `author` (Text)
- `publishDate` (Date)
- `readTime` (Number)
- `tags` (Tags)
- `link` (Text/URL) _(optional – for external resources)_

### 2.9 `Resources`

- `_id` (Text)
- `name` (Text)
- `description` (Rich Text)
- `type` (Text)
- `category` (Text)
- `url` (Text/URL)

### 2.10 `VendorList`

- `_id` (Text)
- `name` (Text)
- `location` (Text)
- `specialties` (Rich Text)
- `contact` (Text/URL)
- `notes` (Rich Text)
- `rating` (Number)

Populate the collections with the sample JSON provided in `src/backend/data/` to match the code’s expectations.

---

## 3. Page Element IDs

All IDs are case-sensitive. Add the specified elements to each page in the Wix Editor, then set the **ID** in the properties panel.

> Quick scaffolding option (Custom Element): If you just want to paste a single element to render placeholders for the required IDs, add a Custom Element and set its source to the `brbs-scaffold` script. Use the examples below per page. This renders HTML placeholders, not native $w elements.

### 3.1 Homepage (`Home` page)

| Element Type               | ID                                                                                  | Purpose                             |
| -------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------- |
| Text                       | `heroTitle`                                                                         | Heading showing dynamic greeting    |
| Text                       | `heroSubtitle`                                                                      | Subheading summary                  |
| Text (Rich text OK)        | `heroDescription`                                                                   | Body copy under hero                |
| Button                     | `ctaJoinButton`                                                                     | Join link                           |
| Button                     | `ctaEventsButton`                                                                   | Events link                         |
| Button                     | `ctaLearningButton`                                                                 | Learning center link                |
| Button                     | `ctaAboutButton`                                                                    | About page link                     |
| Text                       | `statMembers`                                                                       | Member count                        |
| Text                       | `statEvents`                                                                        | Upcoming event count                |
| Text                       | `statWorkshops`                                                                     | Workshop count                      |
| Repeater                   | `eventsRepeater`                                                                    | Container for featured events       |
| Text (inside repeater)     | `eventTitle`, `eventDate`, `eventCategory`, `eventDescription`, `eventAvailability` | Event card data                     |
| Button (inside repeater)   | `eventActionButton`                                                                 | Event detail navigation             |
| Box (optional)             | `eventsEmptyState`                                                                  | Shown when no upcoming events       |
| Repeater                   | `spotlightRepeater`                                                                 | Member spotlight cards              |
| Text/Image inside repeater | `spotlightName`, `spotlightBio`, `spotlightSpecialties`, `spotlightImage`           | Spotlight details                   |
| Box (optional)             | `spotlightEmptyState`                                                               | Spotlight fallback                  |
| Text                       | `announcementText`                                                                  | Featured message                    |
| Button                     | `viewAllEventsButton`                                                               | Link to Events page                 |
| Text                       | `homeErrorMessage`                                                                  | Error copy                          |
| Box                        | `homeErrorBox`                                                                      | Error container (hidden by default) |

Paste-in scaffold (optional):

```html
<brbs-scaffold page="home"></brbs-scaffold>
```

### 3.2 About Page (`About BRBS`)

| Element Type               | ID                                                                          | Purpose                         |
| -------------------------- | --------------------------------------------------------------------------- | ------------------------------- |
| Text                       | `missionTitle`, `missionText`, `visionTitle`, `visionText`                  | Mission & vision copy           |
| Repeater                   | `valuesRepeater`                                                            | Core values cards               |
| Text inside repeater       | `valueTitle`, `valueDescription`                                            | Value content                   |
| Repeater                   | `boardRepeater`                                                             | Board member cards              |
| Text/Image inside repeater | `boardName`, `boardRole`, `boardBio`, `boardImage`                          | Board details                   |
| Button inside repeater     | `boardContactButton`                                                        | `mailto:` or contact navigation |
| Text                       | `partnershipHeading`, `partnershipDescription`                              | Partnership summary             |
| Repeater (or List)         | `partnershipLinksRepeater` with button `partnershipLinkButton`              | Partnership CTA buttons         |
| Pro Gallery / Gallery      | `partnershipGallery`                                                        | Partnership imagery             |
| Repeater                   | `faqRepeater`                                                               | FAQ list                        |
| Text inside repeater       | `faqQuestion`, `faqAnswer`                                                  | FAQ content                     |
| Text                       | `meetingSchedule`, `meetingLocation`, `meetingNext`, `meetingVisitorPolicy` | Meeting details                 |
| Text                       | `aboutMemberCount`, `aboutWorkshopCount`, `aboutFounded`                    | Stats cards                     |
| Text & Box                 | `aboutErrorMessage`, `aboutErrorBox`                                        | Error display                   |

Paste-in scaffold (optional):

```html
<brbs-scaffold page="about"></brbs-scaffold>
```

### 3.3 Events Page (`Events`)

| Element Type              | ID                                                                                                                  | Purpose                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| Dropdown                  | `categoryFilter`, `difficultyFilter`, `statusFilter`                                                                | Filter controls            |
| Text Input                | `searchInput`                                                                                                       | Search field               |
| Button                    | `gridViewBtn`, `calendarViewBtn`                                                                                    | View toggles               |
| Box/Section               | `eventsGridSection`, `calendarSection`                                                                              | Containers toggled by view |
| Box                       | `eventsLoading`                                                                                                     | Loading skeleton           |
| Text/Box                  | `eventsErrorMessage`, `eventsErrorBox`                                                                              | Error state                |
| Text                      | `eventsCountText`                                                                                                   | Summary count              |
| Text                      | `statsUpcoming`, `statsFeatured`, `statsFillRate`                                                                   | Event statistics           |
| Repeater                  | `eventsRepeater`                                                                                                    | Event cards                |
| Inside repeater           | `eventTitle`, `eventDate`, `eventLocation`, `eventCategory`, `eventDifficulty`, `eventAvailability`, `eventSummary` | Event fields               |
| Button inside repeater    | `eventDetailsButton`                                                                                                | Navigates to event details |
| Container inside repeater | `eventCard`                                                                                                         | Optional clickable card    |
| Box                       | `eventsEmptyState`                                                                                                  | Empty results state        |
| HTML Component            | `calendarHtml`                                                                                                      | Calendar markup target     |
| Text                      | `calendarMonthLabel`                                                                                                | Calendar header            |
| Button                    | `calendarPrevBtn`, `calendarNextBtn`                                                                                | Month navigation           |

Paste-in scaffold (optional):

```html
<brbs-scaffold page="events"></brbs-scaffold>
```

### 3.4 Learning Center (`Beginner's Guide`)

| Element Type | ID                                                                                                                 | Purpose             |
| ------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------- |
| Button       | `tabBeginner`, `tabKnowledge`, `tabResources`, `tabVendors`                                                        | Tab navigation      |
| Text Input   | `learningSearch`                                                                                                   | Global search       |
| Dropdown     | `learningCategory`, `learningDifficulty`                                                                           | Filter controls     |
| Section/Box  | `beginnersSection`, `knowledgeSection`, `resourcesSection`, `vendorsSection`                                       | Toggleable sections |
| Repeater     | `beginnerRepeater` with fields `stepTitle`, `stepSummary`, `stepFocus`, `stepResources`                            | Beginner pathway    |
| Repeater     | `knowledgeRepeater` with fields `articleTitle`, `articleExcerpt`, `articleMeta`, button `articleReadButton`        | Article list        |
| Repeater     | `resourcesRepeater` with fields `resourceName`, `resourceDescription`, `resourceMeta`, button `resourceLinkButton` | Resource cards      |
| Repeater     | `vendorsRepeater` with fields `vendorName`, `vendorLocation`, `vendorNotes`, button `vendorContactButton`          | Vendor directory    |
| Text & Box   | `learningErrorMessage`, `learningErrorBox`                                                                         | Error display       |

Paste-in scaffold (optional):

```html
<brbs-scaffold page="learning"></brbs-scaffold>
```

### 3.5 Photos Page (`Photos`)

| Repeater | `galleriesRepeater` | Gallery cards |
| Image/Text inside | `coverImage`, `galleryName`, `galleryDescription`, `photoCount` |
| Button | `viewGalleryBtn` | Navigates to gallery view |
| Box | `loadingBox` | Loading state |
| Box | `emptyStateBox` | Empty galleries state |

Paste-in scaffold (optional):

```html
<brbs-scaffold page="photos"></brbs-scaffold>
```

### 3.6 Gallery View (`Gallery View` page)

| Element Type    | ID              | Purpose                 |
| --------------- | --------------- | ----------------------- |
| Wix Pro Gallery | `proGallery1`   | Displays gallery images |
| Box             | `loadingBox`    | Loading state           |
| Box             | `emptyStateBox` | Empty state             |

Paste-in scaffold (optional):

```html
<brbs-scaffold page="gallery-view"></brbs-scaffold>
```

### 3.7 Join Page (`Join BRBS`)

Ensure the existing form uses:

- Form | `applicationForm`
- Input | `firstNameField`, `lastNameField`, `emailField`, `phoneField`
- Dropdown | `membershipLevelSelect`
- Text | `formFeedback`

Paste-in scaffold (optional):

```html
<brbs-scaffold page="join"></brbs-scaffold>
```

### 3.8 Event Details & Registration

Confirm elements referenced in the existing script remain:

- Text IDs for headers, descriptions, meta sections
- Boxes for `commentsSection`, `commentsContainer`, `relatedEventsSection`
- Buttons for `registerButton`, `cancelRegistrationButton`, etc.

Paste-in scaffold (optional):

```html
<brbs-scaffold page="event-details"></brbs-scaffold>
```

---

## 4. Google Drive Galleries

1. Share the Google Drive root folder so “Anyone with the link” can view.
2. Note the folder ID (the long string in the URL) and set it in `src/public/config/gallery.config.js` → `DRIVE_ROOT_FOLDER_ID`.
3. Ensure the Wix Secrets Manager contains `GOOGLE_DRIVE_API_KEY` (see Section 1).
4. On the Photos page, connect the repeater to any Wix dataset only if you need design overrides—the code populates the repeater data directly.
5. On the Gallery View page, add a Wix Pro Gallery with ID `proGallery1`. No dataset binding is required; items are set by code.

---

## 5. Membership Workflow

- Create a Wix Form with ID `applicationForm` on the Join page and connect the inputs listed above.
- Grant backend permissions for members to insert into the `MemberApplications` collection.
- Optional: configure a Triggered Email with ID `application_confirmation` and update `membership-backend.js` if you want automatic confirmations.

---

## 6. Navigation & Master Page

- Ensure the global navigation links target `/`, `/about-brbs`, `/events`, `/learn`, `/join-brbs`, `/photos`.
- Add the `brbs-styles` custom element (from `src/custom-elements`) to the site header if you want the glassmorphism theme.
- Confirm the master page includes a footer element `#SITE_FOOTER` if you intend to add dynamic footer links manually.

---

## 7. Testing Checklist

After setting everything up:

1. **Homepage** – Confirm hero text updates, events repeater shows three upcoming events, and member spotlights rotate.
2. **Events Page** – Change category/difficulty/status filters, search for “workshop”, toggle between grid and calendar views.
3. **Event Details** – Open an event via `/event-details?eventId=evt001` and verify details render.
4. **Learning Center** – Switch tabs, filter by category/difficulty, ensure resource buttons link out correctly.
5. **Photos** – Verify galleries load from Google Drive (or fallback JSON if no folder ID is provided).
6. **Join** – Submit the membership form and confirm data appears in `MemberApplications`.

Follow this manual for any future environments to guarantee the Velo code runs as-is without further editor adjustments.
