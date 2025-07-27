// Member Dashboard Page - Blue Ridge Bonsai Society
// Phase 3: Member Dashboard and Authentication Flows

import { currentMember } from 'wix-members';
import wixLocationFrontend from 'wix-location-frontend';

$w.onReady(function () {
    console.log('🏡 Member Dashboard Page Loaded');
    
    // Initialize member dashboard
    initializeMemberDashboard();
});

/**
 * Initialize member dashboard with authentication checks
 */
async function initializeMemberDashboard() {
    try {
        // Check if user is logged in
        const member = await currentMember.getMember();
        
        if (!member) {
            // Redirect to login if not authenticated
            wixLocationFrontend.to('/login');
            return;
        }
        
        // Setup dashboard for authenticated member
        await setupMemberDashboard(member);
        
    } catch (error) {
        console.error('❌ Error initializing member dashboard:', error);
        // Redirect to home page on error
        wixLocationFrontend.to('/');
    }
}

/**
 * Setup member dashboard interface
 */
async function setupMemberDashboard(member) {
    // Display member information
    displayMemberInfo(member);
    
    // Setup dashboard sections
    setupDashboardSections();
    
    // Load member's bonsai portfolio
    await loadMemberPortfolio(member);
    
    // Setup dashboard navigation
    setupDashboardNavigation();
    
    // Initialize dashboard widgets
    initializeDashboardWidgets();
    
    console.log('✅ Member dashboard initialized successfully');
}

/**
 * Display member information in the dashboard
 */
function displayMemberInfo(member) {
    try {
        // Update welcome message
        const welcomeText = $w('#welcomeText');
        if (welcomeText) {
            welcomeText.text = `Welcome back, ${member.profile.nickname || member.loginEmail}!`;
        }
        
        // Update member avatar
        const memberAvatar = $w('#memberAvatar');
        if (memberAvatar && member.profile.photo) {
            memberAvatar.src = member.profile.photo;
        }
        
        // Display member details
        const memberDetails = $w('#memberDetails');
        if (memberDetails) {
            memberDetails.html = `
                <div class="glass-card member-info">
                    <h3>Member Information</h3>
                    <p><strong>Email:</strong> ${member.loginEmail}</p>
                    <p><strong>Member Since:</strong> ${new Date(member.dateCreated).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> Active Member</p>
                </div>
            `;
        }
        
    } catch (error) {
        console.error('❌ Error displaying member info:', error);
    }
}

/**
 * Setup dashboard sections with atmospheric styling
 */
function setupDashboardSections() {
    // Quick Actions Section
    const quickActions = $w('#quickActions');
    if (quickActions) {
        quickActions.html = `
            <div class="glass-card dashboard-section">
                <h3>Quick Actions</h3>
                <div class="action-buttons">
                    <button class="btn-atmospheric" data-action="add-bonsai">Add New Bonsai</button>
                    <button class="btn-atmospheric" data-action="view-events">View Events</button>
                    <button class="btn-atmospheric" data-action="forum">Visit Forum</button>
                    <button class="btn-atmospheric" data-action="resources">Learning Resources</button>
                </div>
            </div>
        `;
        
        // Setup quick action handlers
        setupQuickActionHandlers();
    }
    
    // Recent Activity Section
    const recentActivity = $w('#recentActivity');
    if (recentActivity) {
        recentActivity.html = `
            <div class="glass-card dashboard-section">
                <h3>Recent Activity</h3>
                <div class="activity-feed">
                    <div class="activity-item">
                        <span class="activity-icon">🌱</span>
                        <div class="activity-content">
                            <p>Welcome to Blue Ridge Bonsai Society!</p>
                            <small>Just now</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Upcoming Events Section
    const upcomingEvents = $w('#upcomingEvents');
    if (upcomingEvents) {
        loadUpcomingEvents();
    }
}

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
 * Load upcoming events for member
 */
async function loadUpcomingEvents() {
    try {
        const eventsSection = $w('#upcomingEvents');
        if (!eventsSection) return;
        
        // Mock events data (replace with actual database query)
        const events = [
            {
                title: 'Spring Repotting Workshop',
                date: new Date('2025-03-15'),
                description: 'Learn proper repotting techniques for spring'
            },
            {
                title: 'Monthly Club Meeting',
                date: new Date('2025-02-20'),
                description: 'General club meeting and bonsai show-and-tell'
            }
        ];
        
        const eventsHTML = `
            <div class="glass-card dashboard-section">
                <h3>Upcoming Events</h3>
                <div class="events-list">
                    ${events.map(event => `
                        <div class="event-item glass-card">
                            <div class="event-date">
                                <span class="month">${event.date.toLocaleDateString('en', {month: 'short'})}</span>
                                <span class="day">${event.date.getDate()}</span>
                            </div>
                            <div class="event-details">
                                <h4>${event.title}</h4>
                                <p>${event.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="btn-atmospheric" onclick="window.location.href='/events'">
                    View All Events
                </button>
            </div>
        `;
        
        eventsSection.html = eventsHTML;
        
    } catch (error) {
        console.error('❌ Error loading upcoming events:', error);
    }
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
 * Initialize member statistics widget
 */
function initializeMemberStats() {
    const statsWidget = $w('#memberStats');
    if (statsWidget) {
        const stats = {
            bonsaiCount: 2,
            eventsAttended: 5,
            forumPosts: 12,
            memberSince: '2024'
        };
        
        statsWidget.html = `
            <div class="glass-card stats-widget">
                <h3>Your Statistics</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-number">${stats.bonsaiCount}</span>
                        <span class="stat-label">Bonsai in Portfolio</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${stats.eventsAttended}</span>
                        <span class="stat-label">Events Attended</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${stats.forumPosts}</span>
                        <span class="stat-label">Forum Contributions</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${stats.memberSince}</span>
                        <span class="stat-label">Member Since</span>
                    </div>
                </div>
            </div>
        `;
    }
}

/**
 * Initialize learning progress widget
 */
function initializeLearningProgress() {
    const progressWidget = $w('#learningProgress');
    if (progressWidget) {
        progressWidget.html = `
            <div class="glass-card progress-widget">
                <h3>Learning Progress</h3>
                <div class="progress-items">
                    <div class="progress-item">
                        <span class="progress-label">Basic Bonsai Care</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 80%"></div>
                        </div>
                        <span class="progress-percent">80%</span>
                    </div>
                    <div class="progress-item">
                        <span class="progress-label">Wiring Techniques</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 45%"></div>
                        </div>
                        <span class="progress-percent">45%</span>
                    </div>
                    <div class="progress-item">
                        <span class="progress-label">Styling & Design</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 25%"></div>
                        </div>
                        <span class="progress-percent">25%</span>
                    </div>
                </div>
                <button class="btn-atmospheric" onclick="window.location.href='/learn'">
                    Continue Learning
                </button>
            </div>
        `;
    }
}

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
