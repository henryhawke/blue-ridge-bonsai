// Blue Ridge Bonsai Society Homepage - Phase 1 Implementation
// This script builds the homepage dynamically, ensuring all requirements from the TO-DO.md are met.
// It uses functions to create the structure and load content, making it maintainable and clear.
// API Reference: https://www.wix.com/velo/reference/api-overview/introduction

$w.onReady(function () {
    console.log("🚀 Initializing Blue Ridge Bonsai Society Homepage");
    initializeHomepage();
});

/**
 * Main function to orchestrate the homepage initialization.
 */
async function initializeHomepage() {
    try {
        // 1. Set up the core HTML structure of the page.
        createHomePageStructure();

        // 2. Load all dynamic content sections concurrently.
        await loadDynamicContent();

        // 3. Set up all interactive element event handlers.
        setupEventHandlers();

        // 4. Initialize animations for a polished feel.
        initializeAnimations();

        console.log("✅ Homepage initialization complete.");
    } catch (error) {
        console.error("❌ Error initializing homepage:", error);
        // Display a user-friendly error message on the page
        $w('#mainContainer').html = `<div style="text-align: center; padding: 4rem;">
            <h2>We're sorry, something went wrong.</h2>
            <p>The homepage content could not be loaded. Please try refreshing the page.</p>
        </div>`;
    }
}

/**
 * Creates the main HTML structure for the homepage within the #mainContainer element.
 * This function ensures all required sections from the plan are present.
 */
function createHomePageStructure() {
    const homePageHTML = `
        <div id="homePageContainer" class="home-page-container">
            <!-- Hero Section (BR-01, BR-04) -->
            <section id="heroSection" class="hero-section glass-card">
                <div class="hero-content">
                    <h1 id="heroTitle" class="hero-title">Welcome to Blue Ridge Bonsai Society</h1>
                    <p id="heroSubtitle" class="hero-subtitle">Cultivating the ancient art of bonsai in the heart of Asheville, North Carolina.</p>
                    <div id="heroActions" class="hero-actions">
                        <button id="ctaJoinButton" class="btn btn-primary">Join Our Community</button>
                        <button id="ctaEventsButton" class="btn btn-outline">View Events</button>
                    </div>
                </div>
                <div class="hero-image">
                    <img src="https://static.wixstatic.com/media/nsplsh_b28663b715a3461287e134a0a27d94b3~mv2.jpg/v1/fill/w_1185,h_790,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/nsplsh_b28663b715a3461287e134a0a27d94b3~mv2.jpg" alt="A beautiful bonsai tree on display" />
                </div>
            </section>

            <!-- Events Preview Section (BR-02) -->
            <section id="eventsSection" class="events-section">
                <div class="section-header">
                    <h2>Upcoming Events</h2>
                    <p>Join us for workshops, meetings, and exhibitions.</p>
                </div>
                <div id="eventsPreviewContainer" class="events-preview-container">
                    <!-- Event cards will be loaded here -->
                </div>
                <div class="events-cta">
                    <button id="viewAllEventsButton" class="btn btn-primary">View All Events</button>
                </div>
            </section>

            <!-- Member Spotlight Section (BR-32) -->
            <section id="memberSpotlightSection" class="spotlight-section glass-card">
                <div class="section-header">
                    <h2>Member Spotlight</h2>
                    <p>Get to know our wonderful community members.</p>
                </div>
                <div id="spotlightContainer" class="spotlight-container">
                    <!-- Member spotlight will be loaded here -->
                </div>
            </section>

            <!-- About Preview & Partnership Section (BR-08) -->
            <section class="about-preview-section">
                <div class="about-content">
                    <div class="about-text">
                        <h2>Our Society & Partnership</h2>
                        <p>We are a community of bonsai enthusiasts dedicated to learning, sharing, and celebrating the art of bonsai. We are proud to partner with <strong>The North Carolina Arboretum</strong> for special exhibitions and educational programs, fostering a deep appreciation for nature and art.</p>
                        <button id="ctaAboutButton" class="btn btn-outline">Learn More About Us</button>
                    </div>
                    <div class="about-image">
                        <img src="https://static.wixstatic.com/media/c837a6_f82fed81323f4b86a333f11082f55979~mv2.jpg/v1/fill/w_980,h_654,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/c837a6_f82fed81323f4b86a333f11082f55979~mv2.jpg" alt="The North Carolina Arboretum" />
                    </div>
                </div>
            </section>
        </div>
    `;
    $w('#mainContainer').html = homePageHTML;
}

/**
 * Loads all dynamic content for the page from the database.
 * Uses mock data for now, as specified in TO-DO.md.
 */
function loadDynamicContent() {
    // Mock data for development - this will be replaced with wixData queries
    const mockData = {
        events: [
            { _id: "evt1", title: "Spring Bonsai Workshop", startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), description: "A hands-on workshop for beginners.", location: "NC Arboretum", category: "Workshop" },
            { _id: "evt2", title: "Monthly Club Meeting", startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), description: "Guest speaker and tree critiques.", location: "Community Center", category: "Meeting" },
            { _id: "evt3", title: "Advanced Styling Techniques", startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), description: "Master advanced wiring and shaping.", location: "NC Arboretum", category: "Workshop" }
        ],
        spotlight: {
            memberName: "Sarah Johnson",
            testimonial: "Joining BRBS transformed my understanding of bonsai. The community support and expert guidance have been invaluable.",
            memberPhoto: "https://static.wixstatic.com/media/c837a6_4d805090299442e38c3538f0d242751f~mv2.jpg/v1/fill/w_200,h_200,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/c837a6_4d805090299442e38c3538f0d242751f~mv2.jpg"
        }
    };

    // Render each section with the mock data
    renderEventsPreview(mockData.events);
    renderMemberSpotlight(mockData.spotlight);
}

/**
 * Renders the upcoming events preview.
 * @param {Array} events - An array of event objects.
 */
function renderEventsPreview(events) {
    if (!events || events.length === 0) {
        $w('#eventsPreviewContainer').html = "<p>No upcoming events at this time. Please check back soon!</p>";
        return;
    }

    const eventsHTML = events.map(event => {
        const eventDate = new Date(event.startDate);
        const formattedDate = eventDate.toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
        return `
            <div class="event-preview-card glass-card" data-event-id="${event._id}">
                <div class="event-date">
                    <span class="date-text">${formattedDate}</span>
                </div>
                <div class="event-content">
                    <h4 class="event-title">${event.title}</h4>
                    <p class="event-description">${event.description}</p>
                </div>
                <div class="event-actions">
                    <button class="btn btn-outline" data-event-id="${event._id}">Details</button>
                </div>
            </div>
        `;
    }).join("");

    $w('#eventsPreviewContainer').html = `<div class="events-preview-grid">${eventsHTML}</div>`;
}

/**
 * Renders the member spotlight section.
 * @param {object} spotlight - The spotlight member object.
 */
function renderMemberSpotlight(spotlight) {
    if (!spotlight) {
        $w('#spotlightContainer').html = "<p>Our community is full of amazing members. Spotlights coming soon!</p>";
        return;
    }

    const spotlightHTML = `
        <div class="spotlight-card">
            <div class="spotlight-image">
                <img src="${spotlight.memberPhoto}" alt="${spotlight.memberName}" />
            </div>
            <div class="spotlight-content">
                <blockquote class="spotlight-quote">"${spotlight.testimonial}"</blockquote>
                <p class="spotlight-attribution">- ${spotlight.memberName}, BRBS Member</p>
            </div>
        </div>
    `;
    $w('#spotlightContainer').html = spotlightHTML;
}

/**
 * Sets up all the event handlers for the homepage's interactive elements.
 */
function setupEventHandlers() {
    // Use wix-location for navigation
    const wixLocation = require('wix-location');

    $w('#ctaJoinButton').onClick(() => wixLocation.to('/join-brbs'));
    $w('#ctaEventsButton').onClick(() => wixLocation.to('/events'));
    $w('#viewAllEventsButton').onClick(() => wixLocation.to('/events'));
    $w('#ctaAboutButton').onClick(() => wixLocation.to('/about-brbs'));

    // Event delegation for dynamically created event cards
    $w('#eventsPreviewContainer').onClick((event) => {
        const eventId = event.target.dataset.eventId;
        if (eventId) {
            wixLocation.to(`/event-details?eventId=${eventId}`);
        }
    });
}

/**
 * Initializes scroll-triggered animations for a more dynamic feel.
 */
function initializeAnimations() {
    // This is a placeholder for Velo animations.
    // In a real Velo environment, you would use the wix-animations API.
    // For now, we rely on the CSS classes from the design system.
    console.log("✨ Animations initialized (CSS-based).");
}
