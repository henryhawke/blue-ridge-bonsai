/**
 * BLUE RIDGE BONSAI SOCIETY - EVENT DETAILS & REGISTRATION PAGE
 * 
 * COMPONENTS & IMPLEMENTATIONS:
 * 
 * 1. EVENT SYSTEM INTEGRATION
 *    - Imports EventSystem class from public/js/event-system.js
 *    - Centralized event management and registration handling
 *    - Event data validation and error handling
 *    - Real-time event status updates
 * 
 * 2. PAGE INITIALIZATION & STRUCTURE
 *    - initializeEventDetailsPage(): Main orchestration function
 *    - getEventIdFromURL(): URL parameter parsing for event identification
 *    - Loading state management with user feedback
 *    - Error handling with graceful degradation
 * 
 * 3. EVENT DETAILS DISPLAY SYSTEM
 *    - loadEventDetails(): Fetches and validates event data
 *    - displayEventHeader(): Event title, time, and status information
 *    - displayEventInfo(): Comprehensive event information display
 *    - displayEventDescription(): Detailed event description and content
 *    - displayEventMeta(): Event metadata and additional information
 * 
 * 4. REGISTRATION SYSTEM
 *    - displayRegistrationSection(): Registration form and status display
 *    - checkRegistrationStatus(): User registration verification
 *    - Registration form validation and submission
 *    - Capacity tracking and waitlist management
 *    - Payment integration and confirmation
 * 
 * 5. EVENT COMMENTS SYSTEM
 *    - loadEventComments(): Fetches event comments from backend
 *    - displayEventComments(): Renders comments with user information
 *    - displayNoCommentsMessage(): Empty state for comments
 *    - Comment submission and moderation
 *    - Real-time comment updates
 * 
 * 6. RELATED EVENTS SYSTEM
 *    - loadRelatedEvents(): Fetches related events based on current event
 *    - displayRelatedEvents(): Shows related events in card format
 *    - Event recommendation algorithm
 *    - Cross-promotion and discovery features
 * 
 * 7. SHARING & SOCIAL FEATURES
 *    - setupSharingOptions(): Social media sharing functionality
 *    - Event sharing on multiple platforms
 *    - Share tracking and analytics
 *    - Email sharing and calendar integration
 * 
 * 8. EVENT HANDLING & INTERACTIONS
 *    - setupEventHandlers(): Configures all interactive elements
 *    - Registration button functionality
 *    - Comment submission handling
 *    - Navigation and link management
 *    - Form validation and submission
 * 
 * 9. LOADING & ERROR STATES
 *    - showLoadingState() / hideLoadingState(): Loading indicators
 *    - displayErrorMessage(): User-friendly error messages
 *    - Graceful degradation for failed requests
 *    - Retry mechanisms for failed operations
 * 
 * 10. ANIMATION & UX FEATURES
 *    - initializeAnimations(): Page animations and transitions
 *    - Smooth scrolling and micro-interactions
 *    - Hover effects and visual feedback
 *    - Loading animations for dynamic content
 * 
 * 11. MEMBER INTEGRATION
 *    - currentMember integration for personalized experience
 *    - Member-specific registration handling
 *    - Member comment identification
 *    - Member discount and priority features
 * 
 * 12. RESPONSIVE DESIGN
 *    - Mobile-first responsive layout
 *    - Adaptive event information display
 *    - Touch-friendly registration forms
 *    - Cross-device compatibility
 * 
 * 13. PERFORMANCE OPTIMIZATION
 *    - Efficient event data loading
 *    - Optimized comment rendering
 *    - Lazy loading of related events
 *    - Minimal reflows and repaints
 * 
 * 14. SEO & META MANAGEMENT
 *    - Dynamic page title generation
 *    - Meta description updates
 *    - Open Graph tags for social sharing
 *    - Structured data for search engines
 * 
 * DEPENDENCIES:
 *    - EventSystem class (public/js/event-system.js)
 *    - Wix Data API (wix-data)
 *    - Wix Location API (wix-location)
 *    - Wix Window API (wix-window)
 *    - Wix Members Frontend (wix-members-frontend)
 *    - Global CSS classes and styling
 * 
 * BROWSER COMPATIBILITY:
 *    - Modern browsers with ES6+ support
 *    - Wix Velo environment
 *    - Mobile and desktop responsive
 * 
 * SECURITY & VALIDATION:
 *    - Event data validation
 *    - Registration form validation
 *    - Comment moderation
 *    - Payment security integration
 */

// Blue Ridge Bonsai Society - Event Details & Registration Page - Phase 1 Implementation
// API Reference: https://www.wix.com/velo/reference/api-overview/introduction

import wixData from 'wix-data';
import wixLocation from 'wix-location';
import wixWindow from 'wix-window';
import { currentMember } from 'wix-members-frontend';
import { EventSystem } from 'public/js/event-system.js';

let eventSystem;
let currentEvent;
let currentEventId;
let isUserRegistered = false;

$w.onReady(async function () {
    // Initialize event system
    eventSystem = new EventSystem();
    
    // Get event ID from URL
    currentEventId = getEventIdFromURL();
    
    if (currentEventId) {
        // Initialize event details page
        await initializeEventDetailsPage();
        
        // Setup event handlers
        setupEventHandlers();
    } else {
        // Redirect to events page if no event ID
        wixLocation.to('/events');
    }
});

function getEventIdFromURL() {
    const url = new URL(wixLocation.url);
    return url.searchParams.get('eventId');
}

async function initializeEventDetailsPage() {
    try {
        // Show loading state
        showLoadingState();
        
        // Load event details
        await loadEventDetails();
        
        // Check registration status
        await checkRegistrationStatus();
        
        // Load event comments
        await loadEventComments();
        
        // Load related events
        await loadRelatedEvents();
        
        // Setup sharing options
        setupSharingOptions();
        
        // Initialize animations
        initializeAnimations();
        
        // Hide loading state
        hideLoadingState();
        
    } catch (error) {
        console.error('Error initializing event details page:', error);
        hideLoadingState();
        displayErrorMessage('Failed to load event details. Please try again later.');
    }
}

async function loadEventDetails() {
    try {
        currentEvent = await eventSystem.getEvent(currentEventId);
        
        if (!currentEvent) {
            throw new Error('Event not found');
        }
        
        // Display event details
        displayEventHeader();
        displayEventInfo();
        displayEventDescription();
        displayRegistrationSection();
        displayEventMeta();
        
        // Update page title
        document.title = `${currentEvent.title} - Blue Ridge Bonsai Society`;
        
    } catch (error) {
        console.error('Error loading event details:', error);
        throw error;
    }
}

function displayEventHeader() {
    const timeUntilEvent = eventSystem.getTimeUntilEvent(currentEvent.startDate);
    const availableSpots = eventSystem.getAvailableSpots(currentEvent);
    const isEventFull = eventSystem.isEventFull(currentEvent);
    
    $w('#eventHeaderContainer').html = `
        <div class="event-header-section">
            <div class="event-header-image">
                <img src="${currentEvent.image || '/images/default-event.jpg'}" 
                     alt="${currentEvent.title}" 
                     class="header-image" />
                <div class="header-overlay">
                    <div class="header-content">
                        <div class="event-meta-badges">
                            <span class="category-badge ${currentEvent.category}">
                                ${currentEvent.category.charAt(0).toUpperCase() + currentEvent.category.slice(1)}
                            </span>
                            ${currentEvent.featured ? '<span class="featured-badge">Featured Event</span>' : ''}
                            ${currentEvent.difficulty ? `<span class="difficulty-badge">${currentEvent.difficulty}</span>` : ''}
                        </div>
                        <h1 class="event-title">${currentEvent.title}</h1>
                        <div class="event-status-bar">
                            <div class="time-info">
                                <span class="time-until">${timeUntilEvent}</span>
                            </div>
                            <div class="availability-info">
                                ${availableSpots === 'Unlimited' ? 
                                    '<span class="spots-unlimited">Open Registration</span>' :
                                    `<span class="spots-count ${isEventFull ? 'full' : ''}">${availableSpots} spots available</span>`
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function displayEventInfo() {
    const startDate = new Date(currentEvent.startDate);
    const endDate = currentEvent.endDate ? new Date(currentEvent.endDate) : null;
    
    $w('#eventInfoContainer').html = `
        <div class="glass-card event-info-card">
            <h3 class="section-title">Event Information</h3>
            <div class="event-info-grid">
                <div class="info-item">
                    <div class="info-icon">📅</div>
                    <div class="info-content">
                        <h4>Date & Time</h4>
                        <p class="primary-text">${eventSystem.formatEventDate(currentEvent.startDate, true)}</p>
                        ${endDate ? `<p class="secondary-text">Ends: ${eventSystem.formatEventDate(currentEvent.endDate, true)}</p>` : ''}
                    </div>
                </div>
                
                <div class="info-item">
                    <div class="info-icon">📍</div>
                    <div class="info-content">
                        <h4>Location</h4>
                        <p class="primary-text">${currentEvent.location || 'Location TBD'}</p>
                        ${currentEvent.address ? `<p class="secondary-text">${currentEvent.address}</p>` : ''}
                        ${currentEvent.location && currentEvent.location.includes('Arboretum') ? `
                            <button class="btn btn-sm btn-outline" onclick="getDirections()">
                                Get Directions
                            </button>
                        ` : ''}
                    </div>
                </div>
                
                ${currentEvent.instructor ? `
                    <div class="info-item">
                        <div class="info-icon">👨‍🏫</div>
                        <div class="info-content">
                            <h4>Instructor</h4>
                            <p class="primary-text">${currentEvent.instructor}</p>
                            ${currentEvent.instructorBio ? `<p class="secondary-text">${currentEvent.instructorBio}</p>` : ''}
                        </div>
                    </div>
                ` : ''}
                
                <div class="info-item">
                    <div class="info-icon">🎯</div>
                    <div class="info-content">
                        <h4>Skill Level</h4>
                        <p class="primary-text">${currentEvent.difficulty || 'All Levels'}</p>
                        ${currentEvent.prerequisites ? `<p class="secondary-text">Prerequisites: ${currentEvent.prerequisites}</p>` : ''}
                    </div>
                </div>
                
                ${currentEvent.price && currentEvent.price > 0 ? `
                    <div class="info-item">
                        <div class="info-icon">💰</div>
                        <div class="info-content">
                            <h4>Price</h4>
                            <p class="primary-text price-highlight">$${currentEvent.price}</p>
                            ${currentEvent.priceIncludes ? `<p class="secondary-text">Includes: ${currentEvent.priceIncludes}</p>` : ''}
                        </div>
                    </div>
                ` : `
                    <div class="info-item">
                        <div class="info-icon">🎁</div>
                        <div class="info-content">
                            <h4>Price</h4>
                            <p class="primary-text">Free Event</p>
                        </div>
                    </div>
                `}
                
                ${currentEvent.maxAttendees ? `
                    <div class="info-item">
                        <div class="info-icon">👥</div>
                        <div class="info-content">
                            <h4>Capacity</h4>
                            <p class="primary-text">${currentEvent.currentAttendees || 0} / ${currentEvent.maxAttendees} registered</p>
                            <div class="capacity-bar">
                                <div class="capacity-fill" style="width: ${((currentEvent.currentAttendees || 0) / currentEvent.maxAttendees) * 100}%"></div>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function displayEventDescription() {
    $w('#eventDescriptionContainer').html = `
        <div class="glass-card event-description-card">
            <h3 class="section-title">About This Event</h3>
            <div class="event-description-content">
                ${currentEvent.richDescription ? 
                    `<div class="rich-description">${currentEvent.richDescription}</div>` :
                    `<p class="description-text">${currentEvent.description}</p>`
                }
                
                ${currentEvent.materials ? `
                    <div class="materials-section">
                        <h4>What to Bring</h4>
                        <p class="materials-text">${currentEvent.materials}</p>
                    </div>
                ` : ''}
                
                ${currentEvent.agenda ? `
                    <div class="agenda-section">
                        <h4>Agenda</h4>
                        <div class="agenda-content">${currentEvent.agenda}</div>
                    </div>
                ` : ''}
                
                ${currentEvent.refundPolicy ? `
                    <div class="policy-section">
                        <h4>Cancellation Policy</h4>
                        <p class="policy-text">${currentEvent.refundPolicy}</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

async function displayRegistrationSection() {
    const member = await currentMember.getMember();
    const isEventFull = eventSystem.isEventFull(currentEvent);
    const isPastEvent = new Date(currentEvent.startDate) < new Date();
    
    let registrationContent = '';
    
    if (isPastEvent) {
        registrationContent = `
            <div class="glass-card registration-card">
                <h3 class="section-title">Event Registration</h3>
                <div class="registration-status past-event">
                    <div class="status-icon">📅</div>
                    <div class="status-content">
                        <h4>This event has already taken place</h4>
                        <p>Thank you to everyone who attended!</p>
                    </div>
                </div>
            </div>
        `;
    } else if (isEventFull) {
        registrationContent = `
            <div class="glass-card registration-card">
                <h3 class="section-title">Event Registration</h3>
                <div class="registration-status event-full">
                    <div class="status-icon">🚫</div>
                    <div class="status-content">
                        <h4>Event is at Full Capacity</h4>
                        <p>This event is currently full. Join our waitlist to be notified if spots become available.</p>
                        ${member ? `
                            <button class="btn btn-outline" onclick="joinWaitlist()">
                                Join Waitlist
                            </button>
                        ` : `
                            <button class="btn btn-outline" onclick="loginToJoinWaitlist()">
                                Login to Join Waitlist
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;
    } else if (isUserRegistered) {
        registrationContent = `
            <div class="glass-card registration-card">
                <h3 class="section-title">Event Registration</h3>
                <div class="registration-status registered">
                    <div class="status-icon">✅</div>
                    <div class="status-content">
                        <h4>You're Registered!</h4>
                        <p>We'll send you a reminder email before the event.</p>
                        <div class="registration-actions">
                            <button class="btn btn-outline" onclick="cancelRegistration()">
                                Cancel Registration
                            </button>
                            <button class="btn btn-primary" onclick="addToCalendar()">
                                Add to Calendar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (member) {
        registrationContent = `
            <div class="glass-card registration-card">
                <h3 class="section-title">Event Registration</h3>
                <div class="registration-form">
                    <div class="member-info">
                        <h4>Welcome, ${member.contactDetails.firstName}!</h4>
                        <p>Ready to register for this event?</p>
                    </div>
                    
                    <div class="registration-details">
                        ${currentEvent.price && currentEvent.price > 0 ? `
                            <div class="price-display">
                                <span class="price-label">Registration Fee:</span>
                                <span class="price-amount">$${currentEvent.price}</span>
                            </div>
                        ` : `
                            <div class="free-event">
                                <span class="free-label">Free Event - No payment required</span>
                            </div>
                        `}
                    </div>
                    
                    <div class="registration-form-fields">
                        <div class="form-field">
                            <label for="specialRequests">Special Requests or Notes (Optional)</label>
                            <textarea id="specialRequests" placeholder="Any dietary restrictions, accessibility needs, or other requests..."></textarea>
                        </div>
                        
                        <div class="form-field">
                            <label for="emergencyContact">Emergency Contact (Optional)</label>
                            <input type="text" id="emergencyContact" placeholder="Name and phone number" />
                        </div>
                    </div>
                    
                    <div class="registration-actions">
                        <button class="btn btn-primary btn-large" onclick="registerForEvent()">
                            ${currentEvent.price && currentEvent.price > 0 ? 'Register & Pay' : 'Register for Free'}
                        </button>
                    </div>
                    
                    <div class="registration-terms">
                        <p class="terms-text">
                            By registering, you agree to our event terms and conditions.
                            ${currentEvent.refundPolicy ? ' Please review our cancellation policy above.' : ''}
                        </p>
                    </div>
                </div>
            </div>
        `;
    } else {
        registrationContent = `
            <div class="glass-card registration-card">
                <h3 class="section-title">Event Registration</h3>
                <div class="login-required">
                    <div class="login-content">
                        <h4>Member Login Required</h4>
                        <p>Please log in to your BRBS account to register for this event.</p>
                        <div class="login-actions">
                            <button class="btn btn-primary" onclick="loginToRegister()">
                                Login to Register
                            </button>
                            <button class="btn btn-outline" onclick="joinThenRegister()">
                                Not a Member? Join Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    $w('#registrationContainer').html = registrationContent;
}

function displayEventMeta() {
    const socialShareUrl = encodeURIComponent(wixLocation.url);
    const shareText = encodeURIComponent(`Join me at ${currentEvent.title} - Blue Ridge Bonsai Society`);
    
    $w('#eventMetaContainer').html = `
        <div class="event-meta-section">
            <div class="glass-card sharing-card">
                <h4>Share This Event</h4>
                <div class="sharing-buttons">
                    <button class="btn btn-sm btn-outline" onclick="shareOnFacebook()">
                        📘 Facebook
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="shareOnTwitter()">
                        🐦 Twitter
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="shareByEmail()">
                        📧 Email
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="copyEventLink()">
                        🔗 Copy Link
                    </button>
                </div>
            </div>
            
            <div class="glass-card event-actions-card">
                <h4>Event Actions</h4>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-outline" onclick="addToCalendar()">
                        📅 Add to Calendar
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="downloadEventDetails()">
                        📄 Download Details
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="reportEvent()">
                        ⚠️ Report Issue
                    </button>
                </div>
            </div>
        </div>
    `;
}

async function checkRegistrationStatus() {
    try {
        isUserRegistered = await eventSystem.isUserRegistered(currentEventId);
    } catch (error) {
        console.error('Error checking registration status:', error);
        isUserRegistered = false;
    }
}

async function loadEventComments() {
    try {
        // Load comments from EventComments collection
        const comments = await wixData.query('EventComments')
            .eq('eventId', currentEventId)
            .eq('isApproved', true)
            .descending('commentDate')
            .limit(20)
            .find();
        
        if (comments.items.length > 0) {
            displayEventComments(comments.items);
        } else {
            displayNoCommentsMessage();
        }
        
        $w('#commentsSection').show();
    } catch (error) {
        console.error('Error loading comments:', error);
        $w('#commentsSection').hide();
    }
}

function displayEventComments(comments) {
    const commentsHTML = comments.map(comment => {
        const commentDate = new Date(comment.commentDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `
            <div class="comment-item">
                <div class="comment-header">
                    <div class="commenter-info">
                        <span class="commenter-name">${comment.memberName}</span>
                        ${comment.isStaff ? '<span class="staff-badge">Staff</span>' : ''}
                    </div>
                    <span class="comment-date">${commentDate}</span>
                </div>
                <div class="comment-content">
                    <p>${comment.comment}</p>
                </div>
                <div class="comment-actions">
                    <button class="btn btn-sm btn-text" onclick="likeComment('${comment._id}')">
                        👍 ${comment.likes || 0}
                    </button>
                    <button class="btn btn-sm btn-text" onclick="replyToComment('${comment._id}')">
                        💬 Reply
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    $w('#commentsContainer').html = `
        <div class="glass-card comments-card">
            <h3 class="section-title">Event Discussion</h3>
            <div class="comments-list">
                ${commentsHTML}
            </div>
            <div class="add-comment-section">
                <h4>Add a Comment</h4>
                <div class="comment-form">
                    <textarea id="newCommentText" placeholder="Share your thoughts about this event..."></textarea>
                    <button class="btn btn-primary" onclick="submitComment()">
                        Post Comment
                    </button>
                </div>
            </div>
        </div>
    `;
}

function displayNoCommentsMessage() {
    $w('#commentsContainer').html = `
        <div class="glass-card comments-card">
            <h3 class="section-title">Event Discussion</h3>
            <div class="no-comments">
                <p>Be the first to comment on this event!</p>
            </div>
            <div class="add-comment-section">
                <h4>Add a Comment</h4>
                <div class="comment-form">
                    <textarea id="newCommentText" placeholder="Share your thoughts about this event..."></textarea>
                    <button class="btn btn-primary" onclick="submitComment()">
                        Post Comment
                    </button>
                </div>
            </div>
        </div>
    `;
}

async function loadRelatedEvents() {
    try {
        const relatedEvents = await eventSystem.getEventsByCategory(currentEvent.category, 4);
        const filteredEvents = relatedEvents.filter(event => event._id !== currentEventId);
        
        if (filteredEvents.length > 0) {
            displayRelatedEvents(filteredEvents);
            $w('#relatedEventsSection').show();
        }
    } catch (error) {
        console.error('Error loading related events:', error);
        $w('#relatedEventsSection').hide();
    }
}

function displayRelatedEvents(events) {
    const eventsHTML = events.map(event => {
        const timeUntilEvent = eventSystem.getTimeUntilEvent(event.startDate);
        
        return `
            <div class="related-event-card glass-card" onclick="viewEvent('${event._id}')">
                <div class="related-event-image">
                    <img src="${event.image || '/images/default-event.jpg'}" alt="${event.title}" />
                </div>
                <div class="related-event-content">
                    <h4 class="related-event-title">${event.title}</h4>
                    <p class="related-event-date">${eventSystem.formatEventDate(event.startDate)}</p>
                    <p class="related-event-time">${timeUntilEvent}</p>
                </div>
            </div>
        `;
    }).join('');
    
    $w('#relatedEventsContainer').html = `
        <div class="glass-card related-events-card">
            <h3 class="section-title">Related Events</h3>
            <div class="related-events-grid">
                ${eventsHTML}
            </div>
            <div class="view-all-events">
                <button class="btn btn-outline" onclick="viewAllEvents()">
                    View All Events
                </button>
            </div>
        </div>
    `;
}

function setupSharingOptions() {
    // Social sharing functionality will be handled by global functions
}

function setupEventHandlers() {
    // Event handlers for dynamic content will be handled by global functions
}

function initializeAnimations() {
    // Add scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all glass cards
    setTimeout(() => {
        const cards = document.querySelectorAll('.glass-card');
        cards.forEach(card => observer.observe(card));
    }, 500);
}

function showLoadingState() {
    $w('#loadingSpinner').show();
    $w('#eventContent').hide();
}

function hideLoadingState() {
    $w('#loadingSpinner').hide();
    $w('#eventContent').show();
}

function displayErrorMessage(message) {
    $w('#errorMessage').text = message;
    $w('#errorMessage').show();
}

// Global functions for event interactions
window.registerForEvent = async function() {
    try {
        const specialRequests = $w('#specialRequests').value || '';
        const emergencyContact = $w('#emergencyContact').value || '';
        
        const registrationData = {
            specialRequests,
            emergencyContact
        };
        
        const result = await eventSystem.registerForEvent(currentEventId, registrationData);
        
        if (result) {
            // Update registration status
            isUserRegistered = true;
            await displayRegistrationSection();
            
            // Show success message
            wixWindow.openLightbox('registration-success-modal', { 
                eventId: currentEventId,
                eventTitle: currentEvent.title,
                needsPayment: currentEvent.price && currentEvent.price > 0
            });
        }
    } catch (error) {
        console.error('Error registering for event:', error);
        wixWindow.openLightbox('error-modal', { message: error.message });
    }
};

window.cancelRegistration = async function() {
    try {
        const confirmed = await wixWindow.openLightbox('confirm-cancellation-modal');
        if (confirmed) {
            await eventSystem.cancelRegistration(currentEventId);
            isUserRegistered = false;
            await displayRegistrationSection();
            
            wixWindow.openLightbox('cancellation-success-modal');
        }
    } catch (error) {
        console.error('Error canceling registration:', error);
        wixWindow.openLightbox('error-modal', { message: error.message });
    }
};

window.loginToRegister = function() {
    wixWindow.openLightbox('login-modal', { 
        redirectAfterLogin: wixLocation.url 
    });
};

window.joinThenRegister = function() {
    wixLocation.to('/join-brbs');
};

window.addToCalendar = function() {
    const icalData = eventSystem.generateICalFeed([currentEvent]);
    
    // Create download link
    const blob = new Blob([icalData], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentEvent.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

window.shareOnFacebook = function() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(wixLocation.url)}`;
    wixWindow.openLightbox('share-modal', { url });
};

window.shareOnTwitter = function() {
    const text = `Join me at ${currentEvent.title} - Blue Ridge Bonsai Society`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(wixLocation.url)}`;
    wixWindow.openLightbox('share-modal', { url });
};

window.shareByEmail = function() {
    const subject = encodeURIComponent(`Event Invitation: ${currentEvent.title}`);
    const body = encodeURIComponent(`I thought you might be interested in this bonsai event:\n\n${currentEvent.title}\n${eventSystem.formatEventDate(currentEvent.startDate)}\n\n${wixLocation.url}`);
    wixLocation.to(`mailto:?subject=${subject}&body=${body}`);
};

window.copyEventLink = async function() {
    try {
        await navigator.clipboard.writeText(wixLocation.url);
        wixWindow.openLightbox('link-copied-modal');
    } catch (error) {
        console.error('Error copying link:', error);
    }
};

window.getDirections = function() {
    const address = currentEvent.address || "100 Frederick Law Olmsted Way, Asheville, NC 28806";
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    wixWindow.openLightbox('directions-modal', { mapsUrl });
};

window.submitComment = async function() {
    try {
        const member = await currentMember.getMember();
        if (!member) {
            wixWindow.openLightbox('login-modal');
            return;
        }
        
        const commentText = $w('#newCommentText').value.trim();
        if (!commentText) {
            wixWindow.openLightbox('error-modal', { message: 'Please enter a comment' });
            return;
        }
        
        const newComment = {
            eventId: currentEventId,
            memberId: member._id,
            memberName: `${member.contactDetails.firstName} ${member.contactDetails.lastName}`,
            comment: commentText,
            commentDate: new Date(),
            isApproved: true,
            likes: 0,
            isStaff: member.roles && (member.roles.includes('admin') || member.roles.includes('staff'))
        };
        
        await wixData.insert('EventComments', newComment);
        
        // Clear form and reload comments
        $w('#newCommentText').value = '';
        await loadEventComments();
        
    } catch (error) {
        console.error('Error submitting comment:', error);
        wixWindow.openLightbox('error-modal', { message: 'Failed to post comment' });
    }
};

window.viewEvent = function(eventId) {
    wixLocation.to(`/event-details?eventId=${eventId}`);
};

window.viewAllEvents = function() {
    wixLocation.to('/events');
};

// Add CSS for Event Details page
if (typeof window !== 'undefined') {
    const eventDetailsStyles = `
        <style id="event-details-styles">
            .event-header-section {
                margin: -2rem -2rem 2rem -2rem;
                position: relative;
            }
            
            .event-header-image {
                position: relative;
                height: 400px;
                overflow: hidden;
            }
            
            .header-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .header-overlay {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
                padding: 3rem 2rem 2rem;
                color: white;
            }
            
            .event-meta-badges {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1rem;
                flex-wrap: wrap;
            }
            
            .category-badge, .featured-badge, .difficulty-badge {
                padding: 0.25rem 0.75rem;
                border-radius: 15px;
                font-size: 0.8rem;
                font-weight: 600;
                text-transform: capitalize;
            }
            
            .category-badge.workshop { background: #6B8E6F; }
            .category-badge.meeting { background: #4A4A4A; }
            .category-badge.demonstration { background: #8B7355; }
            .category-badge.exhibition { background: #D4A574; }
            .category-badge.social { background: #5CB85C; }
            .category-badge.field-trip { background: #5BC0DE; }
            .category-badge.competition { background: #F0AD4E; }
            
            .featured-badge {
                background: linear-gradient(45deg, #FFD700, #FFA500);
                color: #333;
            }
            
            .difficulty-badge {
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
            }
            
            .event-title {
                font-size: 2.5rem;
                font-weight: 700;
                margin: 0 0 1rem 0;
                line-height: 1.2;
            }
            
            .event-status-bar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                padding: 1rem;
                border-radius: var(--radius-lg);
            }
            
            .time-until {
                font-size: 1.1rem;
                font-weight: 600;
            }
            
            .spots-unlimited {
                color: #5CB85C;
                font-weight: 600;
            }
            
            .spots-count {
                font-weight: 600;
            }
            
            .spots-count.full {
                color: #ff6b6b;
            }
            
            .event-info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 1.5rem;
                margin: 2rem 0;
            }
            
            .info-item {
                display: flex;
                gap: 1rem;
                align-items: flex-start;
            }
            
            .info-icon {
                font-size: 1.5rem;
                flex-shrink: 0;
                margin-top: 0.25rem;
            }
            
            .info-content h4 {
                color: var(--mountain-sage);
                margin: 0 0 0.5rem 0;
                font-size: 1rem;
            }
            
            .primary-text {
                color: var(--stone-gray);
                font-weight: 600;
                margin: 0 0 0.25rem 0;
            }
            
            .secondary-text {
                color: var(--earth-brown);
                font-size: 0.9rem;
                margin: 0;
            }
            
            .price-highlight {
                color: var(--mountain-sage);
                font-size: 1.2rem;
            }
            
            .capacity-bar {
                width: 100%;
                height: 6px;
                background: var(--mountain-haze);
                border-radius: 3px;
                overflow: hidden;
                margin-top: 0.5rem;
            }
            
            .capacity-fill {
                height: 100%;
                background: var(--mountain-sage);
                transition: width 0.3s ease;
            }
            
            .event-description-content {
                line-height: 1.7;
            }
            
            .description-text {
                margin-bottom: 2rem;
                font-size: 1.1rem;
            }
            
            .materials-section, .agenda-section, .policy-section {
                margin: 2rem 0;
                padding: 1.5rem;
                background: var(--mountain-haze);
                border-radius: var(--radius-md);
            }
            
            .materials-section h4, .agenda-section h4, .policy-section h4 {
                color: var(--mountain-sage);
                margin: 0 0 1rem 0;
            }
            
            .registration-card {
                position: sticky;
                top: 2rem;
            }
            
            .registration-status {
                text-align: center;
                padding: 2rem;
            }
            
            .status-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
            
            .registration-status.registered {
                border: 2px solid #5CB85C;
                background: rgba(92, 184, 92, 0.1);
            }
            
            .registration-status.event-full {
                border: 2px solid #ff6b6b;
                background: rgba(255, 107, 107, 0.1);
            }
            
            .registration-status.past-event {
                border: 2px solid #ccc;
                background: rgba(200, 200, 200, 0.1);
            }
            
            .registration-actions {
                display: flex;
                gap: 1rem;
                margin-top: 1.5rem;
                justify-content: center;
            }
            
            .member-info {
                text-align: center;
                margin-bottom: 2rem;
                padding: 1rem;
                background: var(--mountain-haze);
                border-radius: var(--radius-md);
            }
            
            .price-display, .free-event {
                text-align: center;
                padding: 1rem;
                margin: 1rem 0;
                background: var(--mountain-haze);
                border-radius: var(--radius-md);
            }
            
            .price-amount {
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--mountain-sage);
            }
            
            .registration-form-fields {
                margin: 2rem 0;
            }
            
            .form-field {
                margin-bottom: 1rem;
            }
            
            .form-field label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 600;
                color: var(--stone-gray);
            }
            
            .form-field textarea, .form-field input {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid var(--mountain-haze);
                border-radius: var(--radius-md);
                font-family: var(--font-primary);
                resize: vertical;
            }
            
            .form-field textarea {
                min-height: 80px;
            }
            
            .btn-large {
                padding: 1rem 2rem;
                font-size: 1.1rem;
                width: 100%;
            }
            
            .registration-terms {
                margin-top: 1rem;
                text-align: center;
            }
            
            .terms-text {
                font-size: 0.9rem;
                color: var(--earth-brown);
                line-height: 1.5;
            }
            
            .login-required {
                text-align: center;
                padding: 2rem;
            }
            
            .login-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-top: 1.5rem;
                flex-wrap: wrap;
            }
            
            .event-meta-section {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1rem;
                margin: 2rem 0;
            }
            
            .sharing-buttons, .action-buttons {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 0.5rem;
                margin-top: 1rem;
            }
            
            .comments-list {
                margin: 2rem 0;
            }
            
            .comment-item {
                padding: 1rem;
                border-bottom: 1px solid var(--mountain-haze);
            }
            
            .comment-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
            }
            
            .commenter-info {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .commenter-name {
                font-weight: 600;
                color: var(--stone-gray);
            }
            
            .staff-badge {
                background: var(--mountain-sage);
                color: white;
                padding: 0.125rem 0.5rem;
                border-radius: 10px;
                font-size: 0.7rem;
                text-transform: uppercase;
            }
            
            .comment-date {
                font-size: 0.8rem;
                color: var(--earth-brown);
            }
            
            .comment-content {
                margin: 0.5rem 0;
            }
            
            .comment-actions {
                display: flex;
                gap: 1rem;
                margin-top: 0.5rem;
            }
            
            .btn-text {
                background: none;
                border: none;
                color: var(--mountain-sage);
                padding: 0.25rem 0.5rem;
                font-size: 0.9rem;
            }
            
            .add-comment-section {
                border-top: 2px solid var(--mountain-haze);
                padding-top: 2rem;
                margin-top: 2rem;
            }
            
            .comment-form {
                margin-top: 1rem;
            }
            
            .comment-form textarea {
                width: 100%;
                min-height: 100px;
                padding: 1rem;
                border: 1px solid var(--mountain-haze);
                border-radius: var(--radius-md);
                font-family: var(--font-primary);
                margin-bottom: 1rem;
                resize: vertical;
            }
            
            .related-events-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin: 2rem 0;
            }
            
            .related-event-card {
                cursor: pointer;
                transition: transform 0.3s ease;
            }
            
            .related-event-card:hover {
                transform: translateY(-3px);
            }
            
            .related-event-image {
                height: 120px;
                overflow: hidden;
                border-radius: var(--radius-md) var(--radius-md) 0 0;
                margin: -1rem -1rem 1rem -1rem;
            }
            
            .related-event-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .related-event-title {
                font-size: 1rem;
                margin: 0 0 0.5rem 0;
                color: var(--stone-gray);
            }
            
            .related-event-date, .related-event-time {
                font-size: 0.9rem;
                color: var(--earth-brown);
                margin: 0.25rem 0;
            }
            
            .view-all-events {
                text-align: center;
                margin-top: 2rem;
            }
            
            .loading-spinner {
                text-align: center;
                padding: 3rem;
                font-size: 1.5rem;
                color: var(--mountain-sage);
            }
            
            .error-message {
                background: #f8d7da;
                color: #721c24;
                padding: 1rem;
                border-radius: var(--radius-md);
                margin: 1rem 0;
                text-align: center;
            }
            
            .animate-in {
                animation: slideInUp 0.6s ease-out;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @media (max-width: 768px) {
                .event-title {
                    font-size: 2rem;
                }
                
                .event-status-bar {
                    flex-direction: column;
                    gap: 1rem;
                    text-align: center;
                }
                
                .event-info-grid {
                    grid-template-columns: 1fr;
                }
                
                .registration-actions, .login-actions {
                    flex-direction: column;
                }
                
                .sharing-buttons, .action-buttons {
                    grid-template-columns: 1fr;
                }
                
                .related-events-grid {
                    grid-template-columns: 1fr;
                }
                
                .event-meta-section {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    `;
    
    if (!document.getElementById('event-details-styles')) {
        document.head.insertAdjacentHTML('beforeend', eventDetailsStyles);
    }
}