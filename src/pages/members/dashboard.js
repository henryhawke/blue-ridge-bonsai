// Member Dashboard Page - Blue Ridge Bonsai Society
// This page provides a personalized dashboard for logged-in members.

import { MembershipSystem } from 'public/js/membership-system.js';
import { EventSystem } from 'public/js/event-system.js';
import wixLocationFrontend from 'wix-location-frontend'; // Keep for navigation

let membershipSystem;
let eventSystem;
let currentMember;

$w.onReady(function () {
    console.log('🏡 Member Dashboard Page Loaded');
    initializeMemberDashboard();
});

/**
 * Initialize member dashboard with authentication checks
 */
async function initializeMemberDashboard() {
    membershipSystem = new MembershipSystem();
    eventSystem = new EventSystem();

    try {
        currentMember = await membershipSystem.getCurrentMemberProfile();
        
        if (!currentMember) {
            // In a real site, this would redirect to a login page.
            console.log("No member logged in. Showing public view or redirecting.");
            $w('#mainContainer').html = "<h1>Please log in to view your dashboard.</h1>";
            // wixLocationFrontend.to('/login');
            return;
        }
        
        // Setup dashboard for authenticated member
        await setupMemberDashboard();
        
    } catch (error) {
        console.error('❌ Error initializing member dashboard:', error);
        $w('#mainContainer').html = "<h1>Error loading dashboard.</h1>";
        // wixLocationFrontend.to('/');
    }
}

/**
 * Setup member dashboard interface
 */
async function setupMemberDashboard() {
    createDashboardStructure();
    displayMemberInfo();
    await loadUpcomingEvents();
    initializeDashboardWidgets();
    setupDashboardNavigation();
    console.log('✅ Member dashboard initialized successfully');
}

/**
 * Creates the HTML structure for the dashboard.
 */
function createDashboardStructure() {
    const dashboardHTML = `
        <div class="dashboard-container">
            <div id="welcomeMessage"></div>
            <div class="dashboard-grid">
                <div id="memberInfo" class="dashboard-widget"></div>
                <div id="membershipStatus" class="dashboard-widget"></div>
                <div id="quickActions" class="dashboard-widget full-width"></div>
                <div id="upcomingEvents" class="dashboard-widget"></div>
                <div id="memberStats" class="dashboard-widget"></div>
                <div id="recentActivity" class="dashboard-widget"></div>
            </div>
        </div>
    `;
    $w('#mainContainer').html = dashboardHTML;
}

/**
 * Display member information in the dashboard
 */
function displayMemberInfo() {
    $w('#welcomeMessage').html = `<h1>Welcome back, ${currentMember.firstName}!</h1>`;

    $w('#memberInfo').html = `
        <div class="glass-card">
            <h3>Your Information</h3>
            <img src="${currentMember.profileImage}" alt="Profile" style="width: 80px; height: 80px; border-radius: 50%;"/>
            <p><strong>Name:</strong> ${currentMember.firstName} ${currentMember.lastName}</p>
            <p><strong>Email:</strong> ${currentMember.email}</p>
            <p><strong>Member Since:</strong> ${new Date(currentMember.joinDate).toLocaleDateString()}</p>
        </div>
    `;
}

// This function is merged into createDashboardStructure and individual render functions.
// function setupDashboardSections() { ... }

/**
 * Setup quick action button handlers
 */
function setupQuickActionHandlers() {
    // Add event listeners to quick action buttons
    document.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', (e) => {
            const action = e.target.getAttribute('data-action');
            handleQuickAction(action);
        });
    });
}

/**
 * Handle quick action button clicks
 */
function handleQuickAction(action) {
    switch (action) {
        case 'add-bonsai':
            // Navigate to add bonsai page or open modal
            openAddBonsaiModal();
            break;
        case 'view-events':
            wixLocationFrontend.to('/events');
            break;
        case 'forum':
            wixLocationFrontend.to('/members/forum');
            break;
        case 'resources':
            wixLocationFrontend.to('/learn');
            break;
        default:
            console.log('Unknown action:', action);
    }
}

/**
 * Open modal for adding new bonsai to portfolio
 */
function openAddBonsaiModal() {
    const modal = $w('#addBonsaiModal');
    if (modal) {
        modal.show();
        
        // Setup form handlers
        const saveButton = $w('#saveBonsaiButton');
        if (saveButton) {
            saveButton.onClick(() => saveBonsaiToPortfolio());
        }
    }
}

/**
 * Save new bonsai to member's portfolio
 */
async function saveBonsaiToPortfolio() {
    try {
        // Get form data
        const name = $w('#bonsaiName').value;
        const species = $w('#bonsaiSpecies').value;
        const description = $w('#bonsaiDescription').value;
        
        // Validate form
        if (!name || !species) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Create bonsai object
        const bonsaiData = {
            name,
            species,
            description,
            dateAdded: new Date(),
            memberId: (await currentMember.getMember())._id
        };
        
        // Save to database (implement with Wix Data API)
        console.log('Saving bonsai:', bonsaiData);
        
        // Close modal and refresh portfolio
        $w('#addBonsaiModal').hide();
        await loadMemberPortfolio(await currentMember.getMember());
        
        showNotification('Bonsai added to your portfolio successfully!', 'success');
        
    } catch (error) {
        console.error('❌ Error saving bonsai:', error);
        showNotification('Error saving bonsai. Please try again.', 'error');
    }
}

/**
 * Load member's bonsai portfolio
 */
async function loadMemberPortfolio(member) {
    try {
        const portfolioSection = $w('#memberPortfolio');
        if (!portfolioSection) return;
        
        // Mock portfolio data (replace with actual database query)
        const portfolio = [
            {
                name: 'Japanese Maple',
                species: 'Acer palmatum',
                description: 'Beautiful red leaves, perfect for beginners',
                image: '/images/placeholder-bonsai.jpg',
                dateAdded: new Date('2024-01-15')
            },
            {
                name: 'Juniper Cascade',
                species: 'Juniperus procumbens',
                description: 'Stunning cascade style with 5 years of development',
                image: '/images/placeholder-bonsai-2.jpg',
                dateAdded: new Date('2024-03-20')
            }
        ];
        
        // Render portfolio
        const portfolioHTML = `
            <div class="glass-card dashboard-section">
                <h3>My Bonsai Portfolio (${portfolio.length})</h3>
                <div class="portfolio-grid">
                    ${portfolio.map(bonsai => `
                        <div class="glass-card bonsai-card">
                            <img src="${bonsai.image}" alt="${bonsai.name}" class="bonsai-image" />
                            <div class="bonsai-info">
                                <h4>${bonsai.name}</h4>
                                <p class="species"><em>${bonsai.species}</em></p>
                                <p class="description">${bonsai.description}</p>
                                <small>Added: ${bonsai.dateAdded.toLocaleDateString()}</small>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="btn-atmospheric btn-atmospheric--primary" onclick="openAddBonsaiModal()">
                    Add New Bonsai
                </button>
            </div>
        `;
        
        portfolioSection.html = portfolioHTML;
        
    } catch (error) {
        console.error('❌ Error loading member portfolio:', error);
    }
}

/**
 * Load upcoming events for member using the EventSystem
 */
async function loadUpcomingEvents() {
    const registrations = await eventSystem.getUserRegistrations();
    const upcomingEvents = registrations.filter(reg => new Date(reg.startDate) > new Date());

    let eventsHTML = '<h3>Your Upcoming Registered Events</h3>';
    if (upcomingEvents.length > 0) {
        eventsHTML += upcomingEvents.map(event => `
            <div class="event-item-widget glass-card">
                <p><strong>${event.title}</strong></p>
                <p>${new Date(event.startDate).toLocaleDateString()}</p>
            </div>
        `).join('');
    } else {
        eventsHTML += '<p>You have no upcoming registered events.</p>';
    }
    $w('#upcomingEvents').html = `<div class="glass-card">${eventsHTML}</div>`;
}

/**
 * Setup dashboard navigation
 */
function setupDashboardNavigation() {
    // Dashboard tabs navigation
    const tabButtons = $w('.dashboard-tab');
    tabButtons.forEach(tab => {
        tab.onClick(() => {
            const tabId = tab.getAttribute('data-tab');
            switchDashboardTab(tabId);
        });
    });
}

/**
 * Switch between dashboard tabs
 */
function switchDashboardTab(tabId) {
    // Hide all tab content
    $w('.dashboard-tab-content').forEach(content => {
        content.hide();
    });
    
    // Remove active class from all tabs
    $w('.dashboard-tab').forEach(tab => {
        tab.removeClass('active');
    });
    
    // Show selected tab content and mark tab as active
    const selectedContent = $w(`#${tabId}Content`);
    const selectedTab = $w(`[data-tab="${tabId}"]`);
    
    if (selectedContent) selectedContent.show();
    if (selectedTab) selectedTab.addClass('active');
}

/**
 * Initialize dashboard widgets
 */
function initializeDashboardWidgets() {
    // Member stats widget
    initializeMemberStats();
    
    // Learning progress widget
    initializeLearningProgress();
    
    // Community engagement widget
    initializeCommunityWidget();
}

/**
 * Initialize dashboard widgets using data from the member and other systems
 */
async function initializeDashboardWidgets() {
    // Membership Status Widget
    const status = await membershipSystem.checkMembershipStatus();
    $w('#membershipStatus').html = `
        <div class="glass-card">
            <h3>Membership Status</h3>
            <p><strong>Level:</strong> ${status.levelName}</p>
            <p><strong>Status:</strong> ${status.isActive ? 'Active' : 'Expired'}</p>
            ${status.isActive ? `<p>Expires in ${status.daysUntilExpiry} days.</p>` : ''}
            ${status.needsRenewal ? '<button class="btn btn-primary">Renew Now</button>' : ''}
        </div>
    `;

    // Quick Actions
    $w('#quickActions').html = `
        <div class="glass-card">
            <h3>Quick Actions</h3>
            <div class="action-buttons">
                <button id="goToEvents" class="btn-atmospheric">View Events</button>
                <button id="goToLearn" class="btn-atmospheric">Learning Center</button>
                <button id="editProfile" class="btn-atmospheric">Edit Profile</button>
            </div>
        </div>
    `;

    // Member Stats
    const interactions = await membershipSystem.getMemberInteractions();
    $w('#memberStats').html = `
        <div class="glass-card">
            <h3>Your Stats</h3>
            <p><strong>Trees in Portfolio:</strong> ${currentMember.bonsaiCollection ? currentMember.bonsaiCollection.split(',').length : 0}</p>
            <p><strong>Years of Experience:</strong> ${currentMember.yearsExperience || 'New'}</p>
            <p><strong>Total Interactions:</strong> ${interactions.length}</p>
        </div>
    `;

    // Recent Activity
    let activityHTML = '<h3>Recent Activity</h3>';
    if(interactions.length > 0) {
        activityHTML += interactions.slice(0, 3).map(item => `<p>${item.type}: ${item.description}</p>`).join('');
    } else {
        activityHTML += '<p>No recent activity.</p>';
    }
    $w('#recentActivity').html = `<div class="glass-card">${activityHTML}</div>`;
}

// This function is simplified and included in initializeDashboardWidgets
// function initializeLearningProgress() { ... }

/**
 * Initialize community engagement widget
 */
function initializeCommunityWidget() {
    const communityWidget = $w('#communityWidget');
    if (communityWidget) {
        communityWidget.html = `
            <div class="glass-card community-widget">
                <h3>Community</h3>
                <div class="community-stats">
                    <p><strong>Latest Forum Activity:</strong> 2 hours ago</p>
                    <p><strong>Unread Messages:</strong> 3</p>
                    <p><strong>Next Event:</strong> Spring Workshop (March 15)</p>
                </div>
                <div class="community-actions">
                    <button class="btn-atmospheric" onclick="window.location.href='/members/forum'">
                        Visit Forum
                    </button>
                    <button class="btn-atmospheric" onclick="window.location.href='/members/messages'">
                        Messages
                    </button>
                </div>
            </div>
        `;
    }
}

/**
 * Show notification to user
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="glass-card notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Expose functions globally for button onclick handlers
global.openAddBonsaiModal = openAddBonsaiModal;
global.showNotification = showNotification;
