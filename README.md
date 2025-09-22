# Blue Ridge Bonsai Society 🌸

This repository contains the Wix Studio + Velo implementation for the Blue Ridge Bonsai Society. The code now leans on Wix-native services wherever possible—Wix Events v2 for the calendar and registrations, Wix Members/Groups for membership workflows, and Wix Pro Gallery for photo experiences backed by Google Drive. The static JSON fixtures that ship in the repo remain as development fallbacks so local editors and preview sandboxes have usable data even before the live services are connected.

---

## Highlights

- **Events powered by Wix Events v2** – `backend/site-data.jsw` normalizes Wix Events data and caches it for five minutes, falling back to the JSON fixtures when the API is unavailable.
- **Membership tied to Wix Members & Groups** – `backend/membership-backend.jsw` creates Wix Member accounts, syncs them into the configured Wix Group, and stores extended profile metadata in the `Members` collection for legacy fields.
- **Google Drive → Wix Pro Gallery bridge** – `backend/google-drive-gallery.jsw` transforms Google Drive folders into native Wix Pro Gallery items so front-end pages can use Wix’s gallery component without custom HTML embeds.
- **Front-end pages use native $w elements** – Repeaters, buttons, text, and the Pro Gallery are addressed through `$w('#elementId')` instead of injected HTML scaffolds.
- **Safe fallbacks for local development** – All backend data helpers gracefully fall back to JSON fixtures in `src/backend/data/` so that previews work even before the live collections/secrets are configured.

---

## Quick Setup Checklist

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure Wix Studio**
   - Add the **Wix Events** app and create your event categories + events.
   - Ensure **Wix Members** and **Wix Groups** are enabled; create the primary members group.
   - Add a Wix **Pro Gallery** to the Gallery View page and repeaters/buttons to the Photos page with the IDs listed in [docs/MANUAL_SETUP.md](docs/MANUAL_SETUP.md).
3. **Secrets & configuration**
   - Store a Google API key (Drive enabled) as `GOOGLE_DRIVE_API_KEY` in the Wix Secrets Manager.
   - Set the shared Drive folder ID in `src/public/config/gallery.config.js` → `DRIVE_ROOT_FOLDER_ID`.
   - Update `backend/config/user-management.config.js` with the Wix Group ID or slug you use for approved members.
4. **Create remaining collections**
   - `Members`, `MemberApplications`, and `MembershipLevels` remain custom Wix Data collections (details in the manual). Other content collections are optional—if omitted the static JSON fixtures are used.
5. **Publish and test**
   - Walk through the test checklist in [docs/MANUAL_SETUP.md](docs/MANUAL_SETUP.md#5-publish--test-checklist) after deploying.

---

## Repository Structure

```
├── src/
│   ├── backend/
│   │   ├── config/                    # Environment switches (user-management)
│   │   ├── data/                      # JSON fixtures for local fallback
│   │   ├── google-drive-gallery.jsw   # Web module for Drive → Wix Pro Gallery
│   │   ├── membership-backend.jsw     # Web module for membership actions
│   │   ├── site-data.jsw              # Centralized data access layer
│   │   └── rss-generator.jsw          # Existing RSS feed helper
│   ├── pages/                         # Page-level Velo code (uses native $w elements)
│   └── public/
│       ├── config/                    # Front-end configuration (gallery root ID)
│       ├── js/                        # Shared front-end systems (event, gallery, membership)
│       └── styles/                    # CSS assets mirrored in Wix Studio when needed
├── docs/                              # Project manuals and setup guides
├── README.md                          # You are here
└── package.json / eslint.config.mjs   # Tooling configuration
```

---

## Data & Integration Notes

| Area | Source | Code reference | Notes |
| --- | --- | --- | --- |
| Events & Registrations | Wix Events v2 (`wix-events.v2`) | `backend/site-data.jsw` (`loadWixEvents`, `registerMemberForEvent`) | Cached for 5 minutes. Falls back to `data/Events.json` in preview/editor without API access. |
| Member Directory | Wix Members + Wix Groups | `backend/membership-backend.jsw` (`getMemberDirectory`, `ensureMemberInPrimaryGroup`) | Queries the configured Wix Group first, then the Members app, then the custom collection as a last resort. |
| Membership Applications | Wix Data collection `MemberApplications` | `backend/membership-backend.jsw` (`submitMemberApplication`, `approveMemberApplication`) | Approvals create Wix Member accounts and insert extended profiles into `Members`. |
| Galleries | Google Drive + Wix Pro Gallery | `backend/google-drive-gallery.jsw`, `public/js/gdrive-gallery.js` | Requires `GOOGLE_DRIVE_API_KEY` secret and the Drive folder ID set in `public/config/gallery.config.js`. |
| Static content (board, FAQ, resources, vendors, articles) | JSON fixtures by default | `backend/site-data.jsw` | You can swap these with live collections if desired; the code checks the JSON fixtures when collections are absent. |

---

## Development Workflow

1. Use the Wix CLI (`wix dev`) to open the Local Editor if you want visual previews while editing code.
2. Keep element IDs in the Wix Editor aligned with the IDs referenced in the page code. The full reference lives in [docs/MANUAL_SETUP.md](docs/MANUAL_SETUP.md#4-wix-element-id-reference) and a condensed version in [docs/HTML_COMPONENTS.md](docs/HTML_COMPONENTS.md).
3. When developing gallery features locally without Google Drive access, leave `DRIVE_ROOT_FOLDER_ID` blank so the mock JSON is used.
4. For membership features, populate the `Members`, `MembershipLevels`, and `MemberApplications` collections with representative data, or rely on the included JSON seeds during early development.
5. Follow the backend permissions defined in `src/backend/permissions.json` if you mirror them in the Wix Editor.

---

## Testing & Quality

The repository currently provides linting via ESLint. Install any missing peer dependencies in your environment (for example `eslint-plugin-import`) before running:

```bash
npm run lint
```

Wix-hosted features (Events, Members, Groups, Pro Gallery) should be validated in a published Wix environment using the checklist from the manual.

---

## Additional Documentation

- [docs/MANUAL_SETUP.md](docs/MANUAL_SETUP.md) – Full deployment checklist for Wix Studio.
- [docs/PHOTO_AND_SYSTEMS_MANUAL.md](docs/PHOTO_AND_SYSTEMS_MANUAL.md) – Plain-language walkthroughs of the gallery, events, and membership systems.
- [docs/HTML_COMPONENTS.md](docs/HTML_COMPONENTS.md) – Element ID reference for the Wix Editor.
- [README-Implementation-Guide.md](README-Implementation-Guide.md) – Editor-focused guide for ensuring pages render the updated experiences.

For historical design context see `DESIGN.md` and `PLAN.md`.
