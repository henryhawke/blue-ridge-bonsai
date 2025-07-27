// Event Management & Booking System - Blue Ridge Bonsai Society
// Phase 3: Event Management and Workshop Booking

class EventBookingSystem {
    constructor() {
        this.events = [];
        this.bookings = new Map();
        this.init();
    }

    /**
     * Initialize the event booking system
     */
    async init() {
        console.log('🎋 Initializing Event Booking System');
        
        await this.loadEvents();
        this.setupEventHandlers();
        this.applyAtmosphericStyling();
        
        console.log('✅ Event Booking System initialized');
    }

    /**
     * Load events from data source
     */
    async loadEvents() {
        // Mock event data - replace with actual API calls
        this.events = [
            {
                id: 'evt_001',
                title: 'Winter Styling Workshop',
                type: 'workshop',
                description: 'Learn winter styling techniques for deciduous bonsai trees. Perfect for beginners and intermediate practitioners.',
                instructor: 'Master Chen Wei',
                date: '2024-02-15',
                time: '10:00 AM',
                duration: '4 hours',
                location: 'Blue Ridge Community Center',
                address: '123 Mountain View Drive, Asheville, NC',
                capacity: 20,
                enrolled: 14,
                price: 85,
                memberPrice: 65,
                image: '/images/workshops/winter-styling.jpg',
                prerequisites: ['Basic bonsai knowledge'],
                materials: ['Pruning tools', 'Wire', 'Soil'],
                category: 'styling',
                difficulty: 'intermediate',
                tags: ['winter', 'deciduous', 'styling', 'hands-on']
            },
            {
                id: 'evt_002',
                title: 'Monthly Club Meeting',
                type: 'meeting',
                description: 'February club meeting featuring presentations on spring preparation and member tree critiques.',
                speaker: 'Club Members',
                date: '2024-02-08',
                time: '7:00 PM',
                duration: '2 hours',
                location: 'Asheville Library',
                address: '67 Haywood Street, Asheville, NC',
                capacity: 50,
                enrolled: 32,
                price: 0,
                memberPrice: 0,
                image: '/images/events/club-meeting.jpg',
                agenda: [
                    'Welcome & introductions',
                    'Spring preparation techniques',
                    'Member tree showcase',
                    'Q&A session'
                ],
                category: 'meeting',
                difficulty: 'all-levels',
                tags: ['meeting', 'community', 'spring-prep']
            },
            {
                id: 'evt_003',
                title: 'Advanced Wiring Techniques',
                type: 'workshop',
                description: 'Master advanced wiring techniques for complex branch positioning and movement.',
                instructor: 'Kenji Nakamura',
                date: '2024-03-05',
                time: '9:00 AM',
                duration: '6 hours',
                location: 'Blue Ridge Bonsai Studio',
                address: '456 Craft Circle, Black Mountain, NC',
                capacity: 12,
                enrolled: 8,
                price: 125,
                memberPrice: 95,
                image: '/images/workshops/advanced-wiring.jpg',
                prerequisites: ['Basic wiring experience', 'Own bonsai tools'],
                materials: ['Various wire gauges', 'Practice branches'],
                category: 'wiring',
                difficulty: 'advanced',
                tags: ['wiring', 'advanced', 'techniques', 'positioning']
            },
            {
                id: 'evt_004',
                title: 'Beginner Bonsai Basics',
                type: 'workshop',
                description: 'Perfect introduction to bonsai for newcomers. Learn fundamental concepts and create your first tree.',
                instructor: 'Sarah Mitchell',
                date: '2024-02-22',
                time: '1:00 PM',
                duration: '3 hours',
                location: 'Asheville Botanical Gardens',
                address: '151 W.T. Weaver Blvd, Asheville, NC',
                capacity: 25,
                enrolled: 18,
                price: 65,
                memberPrice: 45,
                image: '/images/workshops/beginner-basics.jpg',
                prerequisites: ['None - all materials provided'],
                materials: ['Starter tree', 'Basic tools', 'Pot', 'Soil'],
                category: 'basics',
                difficulty: 'beginner',
                tags: ['beginner', 'basics', 'starter', 'hands-on']
            }
        ];

        console.log(`Loaded ${this.events.length} events`);
    }

    /**
     * Setup event handlers
     */
    setupEventHandlers() {
        // Filter and search handlers
        this.setupFilterHandlers();
        this.setupSearchHandlers();
        
        // Booking handlers
        this.setupBookingHandlers();
        
        // Navigation handlers
        this.setupNavigationHandlers();
    }

    /**
     * Setup filter handlers
     */
    setupFilterHandlers() {
        const filters = {
            type: document.getElementById('eventTypeFilter'),
            category: document.getElementById('eventCategoryFilter'),
            difficulty: document.getElementById('difficultyFilter'),
            date: document.getElementById('dateFilter')
        };

        Object.entries(filters).forEach(([key, element]) => {
            if (element) {
                element.addEventListener('change', () => this.applyFilters());
            }
        });
    }

    /**
     * Setup search handlers
     */
    setupSearchHandlers() {
        const searchInput = document.getElementById('eventSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchEvents(e.target.value);
            });
        }
    }

    /**
     * Setup booking handlers
     */
    setupBookingHandlers() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('book-event-btn')) {
                const eventId = e.target.dataset.eventId;
                this.showBookingModal(eventId);
            }
            
            if (e.target.classList.contains('view-event-btn')) {
                const eventId = e.target.dataset.eventId;
                this.showEventDetails(eventId);
            }
        });
    }

    /**
     * Setup navigation handlers
     */
    setupNavigationHandlers() {
        const viewButtons = document.querySelectorAll('.view-toggle-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                this.switchView(view);
            });
        });
    }

    /**
     * Render events list
     */
    renderEvents(events = this.events) {
        const container = document.getElementById('eventsContainer');
        if (!container) return;

        if (events.length === 0) {
            container.innerHTML = `
                <div class="glass-card no-events">
                    <div class="no-events-icon">📅</div>
                    <h3>No events found</h3>
                    <p>Try adjusting your filters or check back later for new events.</p>
                </div>
            `;
            return;
        }

        const eventsHTML = events.map(event => this.renderEventCard(event)).join('');
        container.innerHTML = eventsHTML;
    }

    /**
     * Render individual event card
     */
    renderEventCard(event) {
        const isFullyBooked = event.enrolled >= event.capacity;
        const availableSpots = event.capacity - event.enrolled;
        const eventDate = new Date(event.date);
        const isUpcoming = eventDate > new Date();
        
        return `
            <div class="glass-card event-card ${event.type}" data-event-id="${event.id}">
                <div class="event-image">
                    <img src="${event.image}" alt="${event.title}" loading="lazy">
                    <div class="event-type-badge ${event.type}">${event.type.toUpperCase()}</div>
                    ${event.difficulty !== 'all-levels' ? `<div class="difficulty-badge ${event.difficulty}">${event.difficulty}</div>` : ''}
                </div>
                
                <div class="event-content">
                    <div class="event-header">
                        <h3 class="event-title">${event.title}</h3>
                        <div class="event-meta">
                            <div class="event-date">
                                <span class="date">${this.formatDate(event.date)}</span>
                                <span class="time">${event.time}</span>
                            </div>
                            <div class="event-duration">${event.duration}</div>
                        </div>
                    </div>
                    
                    <div class="event-description">
                        <p>${event.description}</p>
                    </div>
                    
                    <div class="event-details">
                        <div class="event-instructor">
                            <strong>Instructor:</strong> ${event.instructor || event.speaker}
                        </div>
                        <div class="event-location">
                            <strong>Location:</strong> ${event.location}
                        </div>
                        <div class="event-capacity">
                            <strong>Capacity:</strong> ${event.enrolled}/${event.capacity} enrolled
                            ${availableSpots <= 5 && availableSpots > 0 ? `<span class="spots-remaining">(${availableSpots} spots left)</span>` : ''}
                        </div>
                    </div>
                    
                    ${event.price > 0 ? `
                        <div class="event-pricing">
                            <div class="price-info">
                                <span class="regular-price">Regular: $${event.price}</span>
                                <span class="member-price">Members: $${event.memberPrice}</span>
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="event-tags">
                        ${event.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    
                    <div class="event-actions">
                        <button class="btn-atmospheric view-event-btn" data-event-id="${event.id}">
                            View Details
                        </button>
                        ${isUpcoming && !isFullyBooked ? `
                            <button class="btn-atmospheric btn-atmospheric--primary book-event-btn" data-event-id="${event.id}">
                                ${event.price > 0 ? 'Book Now' : 'Register'}
                            </button>
                        ` : isFullyBooked ? `
                            <button class="btn-atmospheric" disabled>Fully Booked</button>
                        ` : `
                            <button class="btn-atmospheric" disabled>Past Event</button>
                        `}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Show event details modal
     */
    showEventDetails(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        const modal = this.createModal('event-details', 'Event Details');
        const modalContent = `
            <div class="event-details-modal">
                <div class="event-header-modal">
                    <img src="${event.image}" alt="${event.title}" class="event-image-modal">
                    <div class="event-info">
                        <h2>${event.title}</h2>
                        <div class="event-meta-modal">
                            <div class="meta-item">
                                <strong>Date:</strong> ${this.formatDate(event.date)}
                            </div>
                            <div class="meta-item">
                                <strong>Time:</strong> ${event.time}
                            </div>
                            <div class="meta-item">
                                <strong>Duration:</strong> ${event.duration}
                            </div>
                            <div class="meta-item">
                                <strong>Instructor:</strong> ${event.instructor || event.speaker}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="event-body-modal">
                    <div class="description-section">
                        <h3>Description</h3>
                        <p>${event.description}</p>
                    </div>
                    
                    <div class="location-section">
                        <h3>Location</h3>
                        <p><strong>${event.location}</strong></p>
                        <p>${event.address}</p>
                    </div>
                    
                    ${event.prerequisites ? `
                        <div class="prerequisites-section">
                            <h3>Prerequisites</h3>
                            <ul>
                                ${event.prerequisites.map(req => `<li>${req}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${event.materials ? `
                        <div class="materials-section">
                            <h3>Materials Provided</h3>
                            <ul>
                                ${event.materials.map(material => `<li>${material}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${event.agenda ? `
                        <div class="agenda-section">
                            <h3>Agenda</h3>
                            <ul>
                                ${event.agenda.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    <div class="booking-section">
                        <div class="capacity-info">
                            <strong>Enrollment:</strong> ${event.enrolled}/${event.capacity} participants
                        </div>
                        ${event.price > 0 ? `
                            <div class="pricing-info">
                                <div class="price-row">
                                    <span>Regular Price:</span>
                                    <span>$${event.price}</span>
                                </div>
                                <div class="price-row member-price">
                                    <span>Member Price:</span>
                                    <span>$${event.memberPrice}</span>
                                </div>
                            </div>
                        ` : ''}
                        
                        <div class="booking-actions">
                            ${event.enrolled < event.capacity ? `
                                <button class="btn-atmospheric btn-atmospheric--primary book-event-btn" data-event-id="${event.id}">
                                    ${event.price > 0 ? 'Book This Event' : 'Register Now'}
                                </button>
                            ` : `
                                <button class="btn-atmospheric" disabled>Fully Booked</button>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.querySelector('.modal-body').innerHTML = modalContent;
        this.showModal(modal);
    }

    /**
     * Show booking modal
     */
    showBookingModal(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        const modal = this.createModal('booking-modal', 'Book Event');
        const modalContent = `
            <div class="booking-modal">
                <div class="booking-event-info">
                    <h3>${event.title}</h3>
                    <p class="booking-date">${this.formatDate(event.date)} at ${event.time}</p>
                    <p class="booking-location">${event.location}</p>
                </div>
                
                <form id="bookingForm" class="booking-form">
                    <div class="form-section">
                        <h4>Participant Information</h4>
                        <div class="form-group">
                            <label for="participantName">Full Name *</label>
                            <input type="text" id="participantName" name="participantName" required class="form-input">
                        </div>
                        <div class="form-group">
                            <label for="participantEmail">Email Address *</label>
                            <input type="email" id="participantEmail" name="participantEmail" required class="form-input">
                        </div>
                        <div class="form-group">
                            <label for="participantPhone">Phone Number</label>
                            <input type="tel" id="participantPhone" name="participantPhone" class="form-input">
                        </div>
                        <div class="form-group">
                            <label for="experience">Bonsai Experience Level</label>
                            <select id="experience" name="experience" class="form-input">
                                <option value="beginner">Beginner (0-1 years)</option>
                                <option value="intermediate">Intermediate (2-5 years)</option>
                                <option value="advanced">Advanced (5+ years)</option>
                                <option value="expert">Expert/Professional</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="specialRequests">Special Requests or Notes</label>
                            <textarea id="specialRequests" name="specialRequests" rows="3" class="form-input" placeholder="Dietary restrictions, accessibility needs, etc."></textarea>
                        </div>
                    </div>
                    
                    ${event.price > 0 ? `
                        <div class="form-section">
                            <h4>Membership & Pricing</h4>
                            <div class="membership-check">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="isMember" name="isMember">
                                    <span class="checkmark"></span>
                                    I am a current BRBS member
                                </label>
                            </div>
                            <div class="pricing-summary">
                                <div class="price-line">
                                    <span>Event Price:</span>
                                    <span id="displayPrice">$${event.price}</span>
                                </div>
                                <div class="price-line total">
                                    <span>Total:</span>
                                    <span id="totalPrice">$${event.price}</span>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="form-actions">
                        <button type="button" class="btn-atmospheric" onclick="closeModal()">Cancel</button>
                        <button type="submit" class="btn-atmospheric btn-atmospheric--primary">
                            ${event.price > 0 ? 'Complete Booking' : 'Register'}
                        </button>
                    </div>
                </form>
            </div>
        `;

        modal.querySelector('.modal-body').innerHTML = modalContent;
        this.showModal(modal);
        
        // Setup booking form handlers
        this.setupBookingForm(event);
    }

    /**
     * Setup booking form handlers
     */
    setupBookingForm(event) {
        const form = document.getElementById('bookingForm');
        const isMemberCheckbox = document.getElementById('isMember');
        const displayPrice = document.getElementById('displayPrice');
        const totalPrice = document.getElementById('totalPrice');

        // Handle member pricing
        if (isMemberCheckbox && displayPrice && totalPrice) {
            isMemberCheckbox.addEventListener('change', (e) => {
                const price = e.target.checked ? event.memberPrice : event.price;
                displayPrice.textContent = `$${price}`;
                totalPrice.textContent = `$${price}`;
            });
        }

        // Handle form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processBooking(event, new FormData(form));
        });
    }

    /**
     * Process event booking
     */
    async processBooking(event, formData) {
        try {
            // Show loading state
            const submitButton = document.querySelector('#bookingForm button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.innerHTML = '<div class="loading-spinner"></div> Processing...';

            // Collect booking data
            const bookingData = {
                eventId: event.id,
                eventTitle: event.title,
                participantName: formData.get('participantName'),
                participantEmail: formData.get('participantEmail'),
                participantPhone: formData.get('participantPhone'),
                experience: formData.get('experience'),
                specialRequests: formData.get('specialRequests'),
                isMember: formData.get('isMember') === 'on',
                price: formData.get('isMember') === 'on' ? event.memberPrice : event.price,
                bookingDate: new Date().toISOString(),
                status: 'confirmed'
            };

            // Simulate booking processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Store booking
            const bookingId = 'booking_' + Date.now();
            this.bookings.set(bookingId, bookingData);

            // Update event enrollment
            const eventIndex = this.events.findIndex(e => e.id === event.id);
            if (eventIndex !== -1) {
                this.events[eventIndex].enrolled += 1;
            }

            // Show success message
            this.showBookingSuccess(bookingData, bookingId);
            
            // Re-render events to show updated enrollment
            this.renderEvents();

            console.log('Booking completed:', bookingData);

        } catch (error) {
            console.error('Booking error:', error);
            this.showBookingError(error.message);
        } finally {
            // Reset button
            const submitButton = document.querySelector('#bookingForm button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        }
    }

    /**
     * Show booking success
     */
    showBookingSuccess(bookingData, bookingId) {
        this.closeModal();
        
        const successModal = this.createModal('booking-success', 'Booking Confirmed');
        const successContent = `
            <div class="booking-success">
                <div class="success-icon">🎉</div>
                <h3>Booking Confirmed!</h3>
                <p>Your registration for <strong>${bookingData.eventTitle}</strong> has been confirmed.</p>
                
                <div class="booking-details">
                    <div class="detail-item">
                        <strong>Booking ID:</strong> ${bookingId}
                    </div>
                    <div class="detail-item">
                        <strong>Participant:</strong> ${bookingData.participantName}
                    </div>
                    <div class="detail-item">
                        <strong>Email:</strong> ${bookingData.participantEmail}
                    </div>
                    ${bookingData.price > 0 ? `
                        <div class="detail-item">
                            <strong>Amount Paid:</strong> $${bookingData.price}
                        </div>
                    ` : ''}
                </div>
                
                <p class="confirmation-note">
                    A confirmation email has been sent to ${bookingData.participantEmail} with event details and directions.
                </p>
                
                <div class="success-actions">
                    <button class="btn-atmospheric btn-atmospheric--primary" onclick="closeModal()">
                        Continue
                    </button>
                </div>
            </div>
        `;

        successModal.querySelector('.modal-body').innerHTML = successContent;
        this.showModal(successModal);
    }

    /**
     * Show booking error
     */
    showBookingError(message) {
        this.showNotification(`Booking failed: ${message}`, 'error');
    }

    /**
     * Apply filters to events
     */
    applyFilters() {
        const filters = {
            type: document.getElementById('eventTypeFilter')?.value || '',
            category: document.getElementById('eventCategoryFilter')?.value || '',
            difficulty: document.getElementById('difficultyFilter')?.value || '',
            date: document.getElementById('dateFilter')?.value || ''
        };

        let filteredEvents = this.events;

        // Apply type filter
        if (filters.type) {
            filteredEvents = filteredEvents.filter(event => event.type === filters.type);
        }

        // Apply category filter
        if (filters.category) {
            filteredEvents = filteredEvents.filter(event => event.category === filters.category);
        }

        // Apply difficulty filter
        if (filters.difficulty) {
            filteredEvents = filteredEvents.filter(event => 
                event.difficulty === filters.difficulty || event.difficulty === 'all-levels'
            );
        }

        // Apply date filter
        if (filters.date) {
            const now = new Date();
            filteredEvents = filteredEvents.filter(event => {
                const eventDate = new Date(event.date);
                switch (filters.date) {
                    case 'upcoming':
                        return eventDate > now;
                    case 'this-month':
                        return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
                    case 'past':
                        return eventDate < now;
                    default:
                        return true;
                }
            });
        }

        this.renderEvents(filteredEvents);
    }

    /**
     * Search events
     */
    searchEvents(query) {
        if (!query.trim()) {
            this.renderEvents();
            return;
        }

        const searchQuery = query.toLowerCase();
        const filteredEvents = this.events.filter(event => {
            return event.title.toLowerCase().includes(searchQuery) ||
                   event.description.toLowerCase().includes(searchQuery) ||
                   event.instructor?.toLowerCase().includes(searchQuery) ||
                   event.speaker?.toLowerCase().includes(searchQuery) ||
                   event.tags.some(tag => tag.toLowerCase().includes(searchQuery));
        });

        this.renderEvents(filteredEvents);
    }

    /**
     * Switch view (list/grid/calendar)
     */
    switchView(view) {
        const container = document.getElementById('eventsContainer');
        if (!container) return;

        // Update active button
        document.querySelectorAll('.view-toggle-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`)?.classList.add('active');

        // Update container class
        container.className = `events-container ${view}-view`;

        // Re-render events for new view
        this.renderEvents();
    }

    /**
     * Utility functions
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    createModal(id, title) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = id;
        modal.innerHTML = `
            <div class="modal-container glass-card">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body"></div>
            </div>
        `;
        return modal;
    }

    showModal(modal) {
        document.body.appendChild(modal);
        // Trigger animation
        setTimeout(() => modal.classList.add('show'), 10);
    }

    closeModal() {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="glass-card notification-content">
                <div class="notification-message">${message}</div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 6000);
    }

    /**
     * Apply atmospheric styling
     */
    applyAtmosphericStyling() {
        const styles = document.createElement('style');
        styles.textContent = `
            .events-container {
                display: grid;
                gap: 2rem;
                padding: 2rem 0;
            }
            
            .events-container.grid-view {
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            }
            
            .events-container.list-view {
                grid-template-columns: 1fr;
            }
            
            .event-card {
                position: relative;
                overflow: hidden;
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .event-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 20px 40px rgba(107, 142, 111, 0.15);
            }
            
            .event-image {
                position: relative;
                height: 200px;
                overflow: hidden;
            }
            
            .event-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
            }
            
            .event-card:hover .event-image img {
                transform: scale(1.05);
            }
            
            .event-type-badge {
                position: absolute;
                top: 1rem;
                left: 1rem;
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 600;
                text-transform: uppercase;
                background: rgba(107, 142, 111, 0.9);
                color: white;
            }
            
            .difficulty-badge {
                position: absolute;
                top: 1rem;
                right: 1rem;
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 600;
                color: white;
            }
            
            .difficulty-badge.beginner { background: #28a745; }
            .difficulty-badge.intermediate { background: #ffc107; color: #000; }
            .difficulty-badge.advanced { background: #dc3545; }
            
            .event-content {
                padding: 1.5rem;
            }
            
            .event-title {
                margin: 0 0 1rem 0;
                color: #2c3e2d;
                font-size: 1.25rem;
                font-weight: 600;
            }
            
            .event-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
                font-size: 0.9rem;
                color: #6B8E6F;
            }
            
            .event-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin: 1rem 0;
            }
            
            .tag {
                padding: 0.25rem 0.5rem;
                background: rgba(107, 142, 111, 0.1);
                border: 1px solid rgba(107, 142, 111, 0.2);
                border-radius: 12px;
                font-size: 0.75rem;
                color: #6B8E6F;
            }
            
            .event-actions {
                display: flex;
                gap: 1rem;
                margin-top: 1.5rem;
            }
            
            .spots-remaining {
                color: #dc3545;
                font-weight: 600;
            }
            
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .modal-overlay.show {
                opacity: 1;
            }
            
            .modal-container {
                max-width: 600px;
                max-height: 90vh;
                overflow-y: auto;
                margin: 2rem;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .modal-overlay.show .modal-container {
                transform: scale(1);
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid rgba(107, 142, 111, 0.1);
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #6B8E6F;
            }
            
            .modal-body {
                padding: 1.5rem;
            }
            
            .booking-success {
                text-align: center;
                padding: 1rem;
            }
            
            .success-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
            
            .booking-details {
                background: rgba(107, 142, 111, 0.1);
                padding: 1rem;
                border-radius: 0.5rem;
                margin: 1.5rem 0;
                text-align: left;
            }
            
            .detail-item {
                margin-bottom: 0.5rem;
            }
            
            .loading-spinner {
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top-color: white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                display: inline-block;
                margin-right: 0.5rem;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            .no-events {
                text-align: center;
                padding: 3rem;
                color: #6B8E6F;
            }
            
            .no-events-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
        `;

        document.head.appendChild(styles);
    }
}

// Initialize the event booking system
document.addEventListener('DOMContentLoaded', () => {
    window.eventBookingSystem = new EventBookingSystem();
});

// Global functions for modal handling
window.closeModal = () => {
    if (window.eventBookingSystem) {
        window.eventBookingSystem.closeModal();
    }
};

// Auto-initialize if container exists
if (document.getElementById('eventsContainer')) {
    window.eventBookingSystem = new EventBookingSystem();
}
