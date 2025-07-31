// Blue Ridge Bonsai Society - Join BRBS Page
// This page displays membership levels and provides an application form.

import { MembershipSystem } from 'public/js/membership-system.js';

let membershipSystem;

$w.onReady(function () {
    console.log("🚀 Initializing Join BRBS Page");
    initializeJoinPage();
});

/**
 * Main function to orchestrate the page build-out.
 */
async function initializeJoinPage() {
    membershipSystem = new MembershipSystem();
    createPageStructure();
    await displayMembershipLevels();
    setupEventHandlers();
    console.log("✅ Join BRBS Page initialization complete.");
}

/**
 * Creates the static HTML structure for the page.
 */
function createPageStructure() {
    const pageHTML = `
        <div id="joinPageContainer" class="join-page-container">
            <div class="page-header text-center">
                <h1>Join Our Community</h1>
                <p>Become a member of the Blue Ridge Bonsai Society and grow with us.</p>
            </div>

            <!-- Membership Levels Section -->
            <section id="membershipLevelsSection" class="membership-levels-section">
                <div class="section-header text-center">
                    <h2>Choose Your Membership</h2>
                    <p>We offer several levels to fit your needs and interests.</p>
                </div>
                <div id="levelsContainer" class="levels-grid">
                    <!-- Membership level cards will be rendered here -->
                </div>
            </section>

            <!-- Application Form Section -->
            <section id="applicationSection" class="application-section glass-card">
                <div class="section-header text-center">
                    <h2>New Member Application</h2>
                    <p>Fill out the form below to begin your membership journey.</p>
                </div>
                <form id="applicationForm" class="application-form">
                    <div class="form-grid">
                        <div class="form-field">
                            <label for="firstName">First Name*</label>
                            <input type="text" id="firstName" name="firstName" required />
                        </div>
                        <div class="form-field">
                            <label for="lastName">Last Name*</label>
                            <input type="text" id="lastName" name="lastName" required />
                        </div>
                        <div class="form-field full-width">
                            <label for="email">Email Address*</label>
                            <input type="email" id="email" name="email" required />
                        </div>
                        <div class="form-field">
                            <label for="phone">Phone Number</label>
                            <input type="tel" id="phone" name="phone" />
                        </div>
                        <div class="form-field">
                            <label for="membershipLevel">Choose a Level*</label>
                            <select id="membershipLevelSelect" name="membershipLevel" required>
                                <!-- Options will be populated here -->
                            </select>
                        </div>
                        <div class="form-field full-width">
                            <label for="interests">What are you interested in? (Optional)</label>
                            <input type="text" id="interests" name="interests" placeholder="e.g., Styling, specific trees, workshops..." />
                        </div>
                        <div class="form-field full-width">
                            <label for="bio">Tell us about your bonsai journey (Optional)</label>
                            <textarea id="bio" name="bio" rows="4"></textarea>
                        </div>
                    </div>
                    <div id="formFeedback" class="form-feedback" style="display: none;"></div>
                    <div class="form-actions">
                        <button type="submit" id="submitButton" class="btn btn-primary btn-large">Submit Application</button>
                    </div>
                </form>
            </section>
        </div>
    `;
    $w('#mainContainer').html(pageHTML);
}

/**
 * Fetches and displays the available membership levels.
 */
async function displayMembershipLevels() {
    const levels = await membershipSystem.loadMembershipLevels();
    const levelsContainer = $w('#levelsContainer');
    const levelSelect = $w('#membershipLevelSelect');

    const levelOptions = levels.map(level => ({ label: `${level.name} - $${level.price}/year`, value: level._id }));
    levelSelect.options = levelOptions;

    const levelsHTML = levels.map(level => `
        <div class="membership-card glass-card" style="border-top: 5px solid ${level.color};">
            <h3 class="level-name">${level.name}</h3>
            <div class="level-price">
                <span class="price-amount">$${level.price}</span>
                <span class="price-period">/ year</span>
            </div>
            <p class="level-description">${level.description}</p>
            <ul class="level-benefits">
                ${level.benefits.map(benefit => `<li>${benefit}</li>`).join("")}
            </ul>
            <button class="btn btn-outline" data-level-id="${level._id}">Select this Level</button>
        </div>
    `).join("");

    levelsContainer.html = levelsHTML;

    // Add click handler for the "Select this Level" buttons
    $w('.membership-card button').onClick((event) => {
        const levelId = event.target.dataset.levelId;
        levelSelect.value = levelId;
        // Scroll to the form
        $w('#applicationSection').scrollTo();
    });
}

/**
 * Sets up event handlers for the application form.
 */
function setupEventHandlers() {
    $w('#applicationForm').onWixFormSubmit(async (event) => {
        event.preventDefault();
        const submitButton = $w('#submitButton');
        const feedback = $w('#formFeedback');

        submitButton.disable();
        submitButton.label = "Submitting...";

        try {
            const formData = {
                firstName: $w('#firstName').value,
                lastName: $w('#lastName').value,
                email: $w('#email').value,
                phone: $w('#phone').value,
                membershipLevel: $w('#membershipLevelSelect').value,
                interests: $w('#interests').value,
                bio: $w('#bio').value,
            };

            const result = await membershipSystem.submitMemberApplication(formData);

            feedback.text = `Thank you! Your application has been received (ID: ${result._id}). Please check your email for payment instructions.`;
            feedback.style.backgroundColor = '#d4edda'; // Success color
            feedback.show();

            // Reset form
            $w('#applicationForm').reset();

        } catch (error) {
            feedback.text = `Error: ${error.message}`;
            feedback.style.backgroundColor = '#f8d7da'; // Error color
            feedback.show();
        } finally {
            submitButton.enable();
            submitButton.label = "Submit Application";
        }
    });
}
