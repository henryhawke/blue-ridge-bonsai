### Required HtmlComponent instances for Wix

This site uses postMessage-based communication and inline scripts inside embedded HTML. To make all interactive features work under Wix Studio and `wix dev`, add the following HtmlComponents in the Wix Editor with the exact IDs.

Notes

- Only the elements in the “Required” lists below must be HtmlComponents.
- Elements listed as “Text OK” can remain regular Text elements (they don’t use postMessage or inline scripts).

### Home page (`src/pages/Home.c1dmp.js`)

- Required: `#mainContainer`

  - Type: HtmlComponent
  - Purpose: Hosts the homepage UI built via injected HTML. Buttons inside the HTML use `window.parent.postMessage({ type: 'homeAction', action })`.
  - Page listens with: `$w('#mainContainer').onMessage(...)`
  - Messages expected: `{ type: 'homeAction', action: 'join' | 'events' | 'about' }`

- Required: `#eventsPreviewContainer`
  - Type: HtmlComponent
  - Purpose: Receives click messages from event cards rendered inside injected HTML.
  - Page listens with: `$w('#eventsPreviewContainer').onMessage(...)`
  - Messages expected: `{ type: 'eventClick', eventId: string }`

### About page (`src/pages/About BRBS.a28ns.js`)

- Required: `#boardMembersContainer`

  - Type: HtmlComponent
  - Purpose: Hosts board members HTML with inline `<script>` that posts messages up to the page.
  - Messages sent from iframe: `{ type: 'boardAction', action: 'contact' | 'join', payload?: { email, name } }`
  - Page listens with: `$w('#boardMembersContainer').onMessage(...)`

- Required: `#partnershipContainer`

  - Type: HtmlComponent
  - Messages sent from iframe: `{ type: 'partnershipAction', action: 'visitArboretum' | 'viewUpcomingWorkshops' }`
  - Page listens with: `$w('#partnershipContainer').onMessage(...)`

- Required: `#meetingInfoContainer`

  - Type: HtmlComponent
  - Messages sent from iframe: `{ type: 'meetingAction', action: 'viewUpcomingMeetings' | 'getDirections' }`
  - Page listens with: `$w('#meetingInfoContainer').onMessage(...)`

- Required: `#faqContainer`

  - Type: HtmlComponent
  - Purpose: The page injects an HTML “shell” and then sends FAQ data into it.
  - Page → iframe: `faqContainer.postMessage(faqItems)` (after the shell loads)
  - Iframe should listen via `window.onmessage` and render the FAQ list.

- Text OK (do not need HtmlComponent):
  - `#missionVisionContainer`, `#missionVisionSection`
  - `#boardMembersSection`
  - `#partnershipSection`
  - `#faqSection`
  - `#meetingInfoSection`
  - `#societyStatsContainer`, `#societyStatsSection`
  - `#achievementsContainer`, `#achievementsSection`

### Photos page (`src/pages/Photos.uutsy.js`)

- Required: `#mainContainer`
  - Type: HtmlComponent
  - Purpose: Hosts page structure and gallery cards built via injected HTML. Cards include inline `onclick` handlers (e.g., `onclick="wixLocation.to(...)"`), which require an HtmlComponent to execute.

### Optional/advanced components

- Optional: `css-injection` HtmlComponent (if you choose to use `src/pages/components/css-injection.html`)
  - Type: HtmlComponent
  - `src`: Hosted URL of `css-injection.html` (must be HTTPS). The file posts messages such as `CSS_COMPONENT_READY`, `CSS_INJECTION_SUCCESS`, `CSS_INJECTION_ERROR` to the parent.
  - Use only if you plan to manage CSS injection via an HtmlComponent; otherwise rely on Wix Studio’s CSS panel.

### How to add these in Wix Studio

1. In the Editor, add an HTML Embed element (HtmlComponent) where needed.
2. Set the element ID to match the names above (e.g., `mainContainer`).
3. Leave `src` empty if the page code injects HTML and only needs `onMessage`/`postMessage`. If you are loading a standalone HTML file, set `src` to an HTTPS URL hosting that file.
4. Ensure “Show on this page” is enabled and the element is visible.
5. Publish. Then run `wix dev` to verify postMessage events appear in the console and the UI is interactive.

### Messaging reference (quick)

- Home → Page receives
  - `{ type: 'homeAction', action: 'join' | 'events' | 'about' }`
- Events preview → Page receives
  - `{ type: 'eventClick', eventId }`
- Board members → Page receives
  - `{ type: 'boardAction', action: 'contact' | 'join', payload?: { email, name } }`
- Partnerships → Page receives
  - `{ type: 'partnershipAction', action: 'visitArboretum' | 'viewUpcomingWorkshops' }`
- Meetings → Page receives
  - `{ type: 'meetingAction', action: 'viewUpcomingMeetings' | 'getDirections' }`
- FAQ → Iframe receives from page
  - `faqItems` array via `postMessage`
