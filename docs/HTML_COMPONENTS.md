# Wix Element Reference

The Blue Ridge Bonsai Society site now renders most content with native Wix elements addressed through `$w('#elementId')`. HtmlComponents are no longer required for the core pages—only the calendar embed on the Events page still uses one. Use this quick reference while working in the Wix Studio Editor to confirm the correct element types and IDs are present.

## General Guidance

- **Text vs. Html**: If the page code assigns to `.text`, the element must be a Text element. Only elements that intentionally receive HTML strings (for example the calendar container on the Events page or certain legacy member pages) should expose the `.html` property.
- **Repeaters**: Create the repeater, add the child elements inside one item, then assign the IDs listed below. The page code binds data in the `onItemReady` handlers.
- **Buttons/Links**: Buttons referenced in code expect the standard Wix Button element so the `.onClick` handler is available.
- **HtmlComponent usage**: The only HtmlComponent still in play is `#calendarHtml` on the Events page. All other interactive content uses native Wix elements.

## Page-by-Page Summary

### Home (`Home`)
- Text: `heroTitle`, `heroSubtitle`, `heroDescription`, `announcementText`, `statMembers`, `statEvents`, `statWorkshops`
- Buttons: `ctaJoinButton`, `ctaEventsButton`, `ctaLearningButton`, `ctaAboutButton`, `viewAllEventsButton`
- Repeater `eventsRepeater` with child IDs `eventTitle`, `eventDate`, `eventCategory`, `eventDescription`, `eventAvailability`, `eventActionButton` (Button), optional box `eventsEmptyState`
- Repeater `spotlightRepeater` with child IDs `spotlightName`, `spotlightBio`, `spotlightSpecialties`, `spotlightImage`, optional box `spotlightEmptyState`

### About (`About BRBS`)
- Text: `missionTitle`, `missionText`, `visionTitle`, `visionText`
- Repeaters: `valuesRepeater`, `boardRepeater`, `faqRepeater`
- Partnership section elements: `partnershipHeading`, `partnershipDescription`, `partnershipLinksRepeater` (button inside: `partnershipLinkButton`), `partnershipGallery`
- Meeting details: `meetingSchedule`, `meetingLocation`, `meetingNext`, `meetingVisitorPolicy`
- Stats: `aboutMemberCount`, `aboutWorkshopCount`, `aboutFounded`

### Events (`Events`)
- Filters: `categoryFilter`, `difficultyFilter`, `statusFilter`, `searchInput`
- Buttons: `gridViewBtn`, `calendarViewBtn`, `calendarPrevBtn`, `calendarNextBtn`
- State containers: `eventsGridSection`, `calendarSection`, `eventsLoading`, `eventsEmptyState`, `eventsErrorBox`, `eventsErrorMessage`
- Repeater `eventsRepeater` with child IDs `eventTitle`, `eventDate`, `eventLocation`, `eventCategory`, `eventDifficulty`, `eventAvailability`, `eventSummary`, `eventDetailsButton`
- HtmlComponent `calendarHtml` for the custom calendar markup

### Learning Center (`Beginner's Guide`)
- Tabs/Buttons: `tabBeginner`, `tabKnowledge`, `tabResources`, `tabVendors`
- Filters: `learningSearch`, `learningCategory`, `learningDifficulty`
- Sections: `beginnersSection`, `knowledgeSection`, `resourcesSection`, `vendorsSection`
- Repeaters: `beginnerRepeater` (`stepTitle`, `stepSummary`, `stepFocus`, `stepResources`), `knowledgeRepeater` (`articleTitle`, `articleExcerpt`, `articleMeta`, `articleReadButton`), `resourcesRepeater` (`resourceName`, `resourceDescription`, `resourceMeta`, `resourceLinkButton`), `vendorsRepeater` (`vendorName`, `vendorLocation`, `vendorNotes`, `vendorContactButton`)

### Photos (`Photos`)
- Repeater `galleriesRepeater` with child IDs `coverImage`, `galleryName`, `galleryDescription`, `photoCount`, `viewGalleryBtn`
- Boxes: `loadingBox`, `emptyStateBox`

### Gallery View (`Gallery View`)
- Wix Pro Gallery `proGallery1`
- Boxes: `loadingBox`, `emptyStateBox`

### Join (`Join BRBS`)
- Form container `applicationForm`
- Inputs: `firstNameField`, `lastNameField`, `emailField`, `phoneField`, `membershipLevelSelect`
- Text: `formFeedback`

### Event Details (`Event Details & Registration`)
- Buttons: `registerButton`, `cancelRegistrationButton`, `shareButton`
- Sections: `commentsSection`, `commentsContainer`, `relatedEventsSection`, `registrationFormSection`
- Ensure any text boxes referenced in the page code use Text elements or Rich Text elements so `.text`/`.html` assignments succeed

---

For the exhaustive deployment checklist—including collection definitions, secrets, and Google Drive setup—refer to [docs/MANUAL_SETUP.md](docs/MANUAL_SETUP.md).
