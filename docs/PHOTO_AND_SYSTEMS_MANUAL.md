### Google Drive Photos: Simple Setup That Works Every Time

- **Goal**: Organize pictures in Google Drive so the site can show galleries automatically.
- **Who this is for**: Anyone adding photos, no technical background required.

#### What You Need

- A main Google Drive folder to hold all galleries (one subfolder per gallery)
- The folder and its contents must be shared as “Anyone with the link can view”
- The site needs the main folder’s ID (a string from the URL) set by an admin

#### 1) Create the main folder

- Create a folder in Google Drive, for example: “BRBS Photo Galleries”.
- Right‑click the folder → Share → General access: “Anyone with the link” → Viewer.
- Open the folder and copy its ID from the URL. It looks like this example:
  - URL example: https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz123456
  - ID is the long string after `/folders/`: `1AbCdEfGhIjKlMnOpQrStUvWxYz123456`

(An admin will paste this ID into the site configuration file `src/public/config/gallery.config.js` as `DRIVE_ROOT_FOLDER_ID`.)

#### 2) Create one subfolder per gallery

Inside the main folder, create a subfolder for each gallery you want to show on the site. Examples:

- “2025 Spring Show”
- “Workshops – Juniper Styling – Aug 2025”
- “Monthly Meeting – October 2025”

For each subfolder:

- Right‑click → Share → General access: “Anyone with the link” → Viewer.
- Upload your photos into that subfolder. JPG and PNG work great.

That’s it. The site lists each subfolder as a gallery and shows the photos inside it.

#### 3) How cover images are chosen

- If the gallery folder contains a photo whose filename starts with “cover” or “thumbnail” (for example `cover.jpg`, `thumbnail_tree.png`, `cover-01.jpg`), the site will use that as the gallery’s cover.
- If none match, the first available photo is used automatically.

Tips:

- Use clear names like `cover.jpg` for the chosen cover image.
- Add descriptions inside Drive if you like; they’ll appear when supported.

#### 4) Common questions

- **Do I need to rename every photo?** No. Only the optional cover image benefits from the special name. Other files can have any name.
- **Do I need to make every photo public?** Sharing the folder as “Anyone with the link → Viewer” automatically covers its photos.
- **Do I need to resize images?** Not required. Large images work, but smaller files load faster.
- **Can I organize galleries by year/month?** Yes—use subfolders to group however you prefer. Each immediate subfolder under the main folder becomes a gallery on the site.

### Events System: How It Works (Plain English)

- **What it does**: Shows upcoming and past events (workshops, meetings, clinics), lets members register (for events that require it), and displays details like dates, locations, and capacity.
- **Where the data lives**: The site uses an internal “Events” list and “Event Registrations” list. Sample data is also present for development.

#### Key Concepts

- **Event**: A single listing with title, description, dates, location, category (e.g., Workshop, Meeting), difficulty, price (if any), and capacity.
- **Registration**: A record linking a member to an event. Tracks who registered and counts seats.

#### What you see on the website

- **Events page**: A grid/list of upcoming events with filters (category, difficulty, status). You can also switch to a calendar view.
- **Event details page**: Full information about one event with a “Register” or “Book” button if registration is required.

#### How registration works

- If an event needs registration and has space left, members can register.
- The system prevents duplicate registrations for the same member.
- When a registration is added, the event’s attendee count increases. When a registration is canceled, the count decreases.
- If the event is full, the Register button is disabled.

#### Status and capacity

- Events are marked “upcoming” or “past” based on the date.
- Capacity is enforced by comparing current attendees to the maximum.

#### Extras

- The site can generate an iCalendar (ICS) feed and an RSS-style summary of upcoming events.
- Events can be searched by title, description, instructor, and location.

### Membership System: How It Works (Plain English)

- **What it does**: Shows membership levels, lets people apply to join, and tracks membership status and dates.
- **Where the data lives**: The site keeps a list of membership levels and a member directory with profiles and status.

#### Membership levels

- Each level has a name, yearly price, benefits, and a duration (usually 12 months). Examples include Standard, Premium, and Digital.

#### Join page (application)

- The Join page shows available membership levels.
- Applicants fill out a simple form (name, email, selected level, etc.).
- When submitted, the application is stored and a confirmation email is sent to the applicant.

#### After you apply

- The application is marked “pending payment” until the treasurer processes payment.
- Once payment is confirmed, the applicant is activated as a member and gets access to member-only areas and benefits.

#### Current members

- The site can check if a logged‑in member is active, needs renewal soon, or has expired, based on the expiration date.
- Member profiles can include contact details and other optional information.

### Admin Notes (for site maintainers)

- **Photos (Google Drive)**

  - Make sure the Secrets Manager contains `GOOGLE_DRIVE_API_KEY` with Drive API enabled.
  - Paste the main folder ID into `src/public/config/gallery.config.js` as `DRIVE_ROOT_FOLDER_ID`.
  - The backend lists immediate subfolders of that main folder as galleries and lists images inside each subfolder.

- **Events**

  - Event data is modeled with fields like `_id`, `title`, `description`, `startDate`, `endDate`, `location`, `registrationRequired`, `maxAttendees`, `currentAttendees`, `category`, `price`, `difficulty`, `status`, and `featured`.
  - Registrations link a member to an event and update counts.

- **Membership**
  - Membership levels are stored with fields like `name`, `price`, `duration`, and `benefits`.
  - Applications are stored with applicant info and a status (for example, `pending_payment`).

If you follow the steps above for photos and add your events and memberships through the site’s standard screens, everything on the public website will display automatically without extra technical work.
