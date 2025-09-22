### Google Drive Photos: Simple Setup That Works Every Time

- **Goal**: Organize pictures in Google Drive so the Wix Pro Gallery on the site can show galleries automatically.
- **Who this is for**: Anyone adding photos—no coding background required.

#### What You Need

- A main Google Drive folder to hold all galleries (one subfolder per gallery)
- The folder and its contents must be shared as “Anyone with the link can view”
- The site needs the main folder’s ID (a string from the URL) set by an admin in `src/public/config/gallery.config.js`
- A Wix Secret named `GOOGLE_DRIVE_API_KEY` that stores a Google API key with the Drive API enabled

#### 1) Create the main folder

- Create a folder in Google Drive, for example: “BRBS Photo Galleries”.
- Right‑click the folder → **Share** → General access: “Anyone with the link” → **Viewer**.
- Open the folder and copy its ID from the URL. Example:
  - URL: `https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz123456`
  - ID: `1AbCdEfGhIjKlMnOpQrStUvWxYz123456`
- Paste that ID into `src/public/config/gallery.config.js` → `DRIVE_ROOT_FOLDER_ID`. (Leave it blank only if you intentionally want to use the mock JSON data.)

#### 2) Create one subfolder per gallery

Inside the main folder, create a subfolder for each gallery you want to show on the site. Examples:

- “2025 Spring Show”
- “Workshops – Juniper Styling – Aug 2025”
- “Monthly Meeting – October 2025”

For each subfolder:

- Right‑click → **Share** → General access: “Anyone with the link” → **Viewer**.
- Upload your photos into that subfolder. JPG, PNG, and MP4 files all work; the Wix Pro Gallery will detect image vs. video.

The site lists each subfolder as a gallery and shows the photos inside it. The Photos page uses a repeater, and the Gallery View page feeds those items straight into a Wix **Pro Gallery** component (`#proGallery1`).

#### 3) How cover images are chosen

- If the gallery folder contains a file whose name starts with “cover” or “thumbnail” (for example `cover.jpg`, `thumbnail_tree.png`, `cover-01.jpg`), the site will use that as the gallery’s cover image.
- If none match, the first available photo is used automatically.

Tips:

- Use clear names like `cover.jpg` for the chosen cover image.
- Add descriptions inside Drive if you like; they show up in the gallery info when present.

#### 4) Common questions

- **Do I need to rename every photo?** No—only the optional cover image benefits from the special name. Other files can have any name.
- **Do I need to make every photo public?** Sharing the folder as “Anyone with the link → Viewer” automatically covers its photos.
- **Do I need to resize images?** Not required. Large images work, but smaller files load faster.
- **Can I organize galleries by year/month?** Yes—use subfolders to group however you prefer. Each immediate subfolder under the main folder becomes a gallery on the site.

---

### Events System: How It Works (Plain English)

- **What it does**: Shows upcoming and past events (workshops, meetings, clinics), lets members register (for events that require it), and displays details like dates, locations, and capacity.
- **Where the data lives**: Real events come straight from **Wix Events v2**. The backend caches the results and falls back to the sample JSON (`src/backend/data/Events.json`) only when the API is unavailable (for example in an unpublished sandbox).

#### Key Concepts

- **Event**: Managed inside Wix Events. Each event carries the title, description, dates, location, category (e.g., Workshop, Meeting), difficulty, price (if any), capacity, featured flag, and optional media.
- **Registration**: Created through Wix Events. The site forwards registration requests to Wix Events so attendees appear in the Events dashboard. If the API cannot be reached, the mock data under `EventRegistrations.json` provides a safe fallback for testing.

#### What you see on the website

- **Events page**: A grid/list of upcoming events with filters (category, difficulty, status). You can switch to a calendar view rendered inside an HtmlComponent (`#calendarHtml`).
- **Event details page**: Full information about one event with “Register” or “Book” buttons if registration is required. Related events and discussion/comments appear when the supporting collections are present.

#### How registration works

- If an event requires registration and has space left, members can register via the Wix Events API.
- Wix Events prevents duplicate registrations for the same attendee. The code also blocks duplicate submissions on the client.
- When a registration is added, Wix Events updates the attendee count. Canceling a registration lowers the count in the dashboard.
- If the event is full, the Register button switches to a waitlist-style message.

#### Extras

- The site can generate an iCalendar (ICS) feed and an RSS-style summary of upcoming events through `backend/rss-generator.jsw`.
- Events can be searched by title, description, instructor, tags, and location.

---

### Membership System: How It Works (Plain English)

- **What it does**: Shows membership levels, lets people apply to join, tracks membership status/dates, and syncs approved members into a Wix Group for access to members-only content.
- **Where the data lives**: Core accounts live in **Wix Members**. The repo adds a `Members` collection to store extended profile fields (bio, specialties, expiration date). Applications go into the `MemberApplications` collection; membership levels live in `MembershipLevels`.

#### Membership levels

- Each level has a name, yearly price, optional benefits, and a `sortOrder`. You manage these records in the `MembershipLevels` collection or through the Wix Editor’s Content Manager.

#### Join page (application)

- The Join page shows available membership levels (sourced from the collection or the JSON fallback).
- Applicants fill out a simple form (name, email, selected level, etc.).
- On submit, the application is stored in `MemberApplications` and a confirmation email is sent via Wix’s backend email service.

#### Approving members

- Approving an application (through the backend function `approveMemberApplication`) creates a Wix Member account if one does not already exist, copies data into the `Members` collection, marks the application approved, and adds the member to the configured Wix Group (`backend/config/user-management.config.js`).
- Members can then log in, see member-only pages, and appear in the member directory. The directory pulls from the Wix Group first, then the Members app, then the `Members` collection as a fallback.

#### Membership status

- The site checks if a logged‑in member is active, needs renewal soon, or has expired based on `expirationDate` in the `Members` collection.
- Member profiles can include contact details, profile photo, specialties, and notes—these fields are optional but help power the homepage spotlight.

---

### Admin Notes (for site maintainers)

- **Photos (Google Drive + Wix Pro Gallery)**
  - Make sure the Secrets Manager contains `GOOGLE_DRIVE_API_KEY`.
  - Paste the main folder ID into `src/public/config/gallery.config.js` as `DRIVE_ROOT_FOLDER_ID`.
  - The backend lists immediate subfolders of that main folder as galleries and lists images inside each subfolder. Items are formatted so the Wix Pro Gallery (`#proGallery1`) receives the expected `src`/`thumbnailSrc` fields.

- **Events**
  - Manage events and registrations in Wix Events. The site mirrors that data automatically and caches responses for five minutes.
  - Keep event categories and difficulty levels consistent so the filters make sense.
  - Optional `EventComments` collection powers the comments section on the event details page.

- **Membership**
  - `Members`, `MembershipLevels`, and `MemberApplications` collections are required. `MemberInteractions` is optional and supports the members-only dashboard if you use it.
  - Configure `backend/config/user-management.config.js` with either the Wix Group ID or slug so the backend can auto-invite approved members.

If you follow the steps above for photos, events, and membership, everything on the public website will display automatically without extra technical work.
