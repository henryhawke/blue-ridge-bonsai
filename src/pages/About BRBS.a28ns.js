// Blue Ridge Bonsai Society - About Us Page - Phase 1 Implementation
// API Reference: https://www.wix.com/velo/reference/api-overview/introduction

import wixData from 'wix-data';
import wixLocation from 'wix-location';
import wixWindow from 'wix-window';

// Enhanced initialization for Wix environment
function runAboutInitialization() {
  console.log('🚀 Starting About Us page initialization...');
  initializeAboutPage()
    .then(() => {
      setupEventHandlers();
      return loadDynamicContent();
    })
    .catch((error) => {
      console.error('Error in About Us initialization:', error);
    });
}

$w.onReady(async function () {
    console.log('About Us page $w.onReady triggered');
    runAboutInitialization();
});

// Also try immediate initialization for better Wix compatibility
if (typeof setTimeout !== 'undefined') {
  setTimeout(runAboutInitialization, 100);
  setTimeout(runAboutInitialization, 1000);
}

async function initializeAboutPage() {
    try {
        // Display mission and vision
        displayMissionVision();
        
        // Load board member profiles
        await loadBoardMembers();
        
        // Display NC Arboretum partnership info
        displayPartnershipInfo();
        
        // Load and display FAQ
        await loadFAQ();
        
        // Display meeting information
        displayMeetingInfo();
        
        // Initialize animations
        initializeAnimations();
        
    } catch (error) {
        console.error('Error initializing About page:', error);
    }
}

function displayMissionVision() {
    const missionContent = `
        <div class="mission-vision-section">
            <div class="glass-card mission-card">
                <div class="icon-container">
                    <div class="mission-icon">🌿</div>
                </div>
                <h3 class="section-title">Our Mission</h3>
                <p class="mission-text">
                    Blue Ridge Bonsai Society is dedicated to fostering the ancient art of bonsai in the beautiful 
                    Blue Ridge Mountains of North Carolina. We provide education, support, and community for bonsai 
                    enthusiasts of all skill levels, from curious beginners to master artists.
                </p>
                <p class="mission-text">
                    Through workshops, demonstrations, exhibitions, and fellowship, we preserve and share the 
                    timeless wisdom of bonsai cultivation while adapting traditional techniques to our unique 
                    mountain environment.
                </p>
            </div>
            
            <div class="glass-card vision-card">
                <div class="icon-container">
                    <div class="vision-icon">🏔️</div>
                </div>
                <h3 class="section-title">Our Vision</h3>
                <p class="vision-text">
                    To be the premier bonsai community in the Southeast, cultivating not just trees, but lasting 
                    friendships, artistic excellence, and deep appreciation for the natural beauty that surrounds 
                    us in the Blue Ridge Mountains.
                </p>
                <p class="vision-text">
                    We envision a thriving community where the art of bonsai bridges generations, cultures, and 
                    backgrounds, creating a peaceful sanctuary of learning and growth for all who seek to understand 
                    this living art form.
                </p>
            </div>
        </div>
        
        <div class="glass-card values-card">
            <h3 class="section-title text-center">Our Core Values</h3>
            <div class="values-grid">
                <div class="value-item">
                    <div class="value-icon">🎓</div>
                    <h4>Education</h4>
                    <p>Continuous learning and sharing of bonsai knowledge and techniques</p>
                </div>
                <div class="value-item">
                    <div class="value-icon">🤝</div>
                    <h4>Community</h4>
                    <p>Building lasting relationships through our shared passion for bonsai</p>
                </div>
                <div class="value-item">
                    <div class="value-icon">🌱</div>
                    <h4>Respect for Nature</h4>
                    <p>Honoring the natural world and practicing sustainable cultivation</p>
                </div>
                <div class="value-item">
                    <div class="value-icon">✨</div>
                    <h4>Artistic Excellence</h4>
                    <p>Pursuing mastery while celebrating creativity and individual expression</p>
                </div>
            </div>
        </div>
    `;
    
    $w('#missionVisionContainer').html = missionContent;
    $w('#missionVisionSection').show();
}

async function loadBoardMembers() {
    try {
        // Load board members from database
        const boardMembers = await wixData.query('BoardMembers')
            .eq('active', true)
            .ascending('displayOrder')
            .find();
        
        if (boardMembers.items.length > 0) {
            displayBoardMembers(boardMembers.items);
        } else {
            // Display default board structure if no data
            displayDefaultBoard();
        }
        
        $w('#boardMembersSection').show();
    } catch (error) {
        console.error('Error loading board members:', error);
        displayDefaultBoard();
        $w('#boardMembersSection').show();
    }
}

function displayBoardMembers(members) {
    const boardHTML = members.map(member => {
        return `
            <div class="glass-card board-member-card" data-member-id="${member._id}">
                <div class="member-photo-container">
                    <img src="${member.photo || '/images/default-board-member.jpg'}" 
                         alt="${member.name}" 
                         class="member-photo" />
                    <div class="member-role-badge">${member.role}</div>
                </div>
                <div class="member-info">
                    <h4 class="member-name">${member.name}</h4>
                    <p class="member-title">${member.title || member.role}</p>
                    <p class="member-bio">${member.bio}</p>
                    <div class="member-experience">
                        <span class="experience-label">Bonsai Experience:</span>
                        <span class="experience-years">${member.yearsExperience} years</span>
                    </div>
                    ${member.specialties ? `
                        <div class="member-specialties">
                            <span class="specialties-label">Specialties:</span>
                            <span class="specialties-list">${member.specialties}</span>
                        </div>
                    ` : ''}
                    ${member.contactEmail ? `
                        <div class="member-contact">
                            <button class="btn btn-primary btn-sm" onclick="contactMember('${member.contactEmail}', '${member.name}')">
                                Contact ${member.name.split(' ')[0]}
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    $w('#boardMembersContainer').html = `
        <div class="board-header">
            <h3 class="section-title text-center">Meet Our Board</h3>
            <p class="section-subtitle text-center">
                Dedicated volunteers who guide our society with passion and expertise
            </p>
        </div>
        <div class="board-members-grid">
            ${boardHTML}
        </div>
    `;
}

function displayDefaultBoard() {
    const defaultBoard = [
        {
            name: "Society Leadership",
            role: "Board of Directors",
            bio: "Our volunteer board members bring decades of combined bonsai experience and are passionate about sharing their knowledge with our community.",
            yearsExperience: "20+",
            specialties: "Traditional and Contemporary Styles"
        }
    ];
    
    const boardHTML = defaultBoard.map(member => {
        return `
            <div class="glass-card board-member-card">
                <div class="member-photo-container">
                    <div class="default-member-icon">👥</div>
                    <div class="member-role-badge">${member.role}</div>
                </div>
                <div class="member-info">
                    <h4 class="member-name">${member.name}</h4>
                    <p class="member-bio">${member.bio}</p>
                    <div class="member-experience">
                        <span class="experience-label">Combined Experience:</span>
                        <span class="experience-years">${member.yearsExperience}</span>
                    </div>
                    <div class="member-specialties">
                        <span class="specialties-label">Expertise:</span>
                        <span class="specialties-list">${member.specialties}</span>
                    </div>
                    <div class="member-contact">
                        <button class="btn btn-primary" onclick="joinToMeetBoard()">
                            Join Us to Learn More
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    $w('#boardMembersContainer').html = `
        <div class="board-header">
            <h3 class="section-title text-center">Meet Our Board</h3>
            <p class="section-subtitle text-center">
                Dedicated volunteers who guide our society with passion and expertise
            </p>
        </div>
        <div class="board-members-grid">
            ${boardHTML}
        </div>
    `;
}

function displayPartnershipInfo() {
    const partnershipContent = `
        <div class="glass-card partnership-card">
            <div class="partnership-header">
                <div class="partnership-logos">
                    <div class="brbs-logo">🌿</div>
                    <div class="partnership-symbol">🤝</div>
                    <div class="arboretum-logo">🌳</div>
                </div>
                <h3 class="section-title">Partnership with NC Arboretum</h3>
            </div>
            
            <div class="partnership-content">
                <p class="partnership-description">
                    Blue Ridge Bonsai Society is proud to partner with the North Carolina Arboretum, 
                    one of the Southeast's premier botanical destinations. This collaboration allows us to:
                </p>
                
                <div class="partnership-benefits">
                    <div class="benefit-item">
                        <div class="benefit-icon">🏛️</div>
                        <div class="benefit-content">
                            <h4>Venue Access</h4>
                            <p>Host workshops and meetings in the beautiful, inspiring environment of the Arboretum</p>
                        </div>
                    </div>
                    <div class="benefit-item">
                        <div class="benefit-icon">👨‍🏫</div>
                        <div class="benefit-content">
                            <h4>Expert Resources</h4>
                            <p>Access to horticultural expertise and botanical knowledge from Arboretum staff</p>
                        </div>
                    </div>
                    <div class="benefit-item">
                        <div class="benefit-icon">🌺</div>
                        <div class="benefit-content">
                            <h4>Educational Programs</h4>
                            <p>Collaborative educational offerings that combine bonsai artistry with botanical science</p>
                        </div>
                    </div>
                    <div class="benefit-item">
                        <div class="benefit-icon">🎨</div>
                        <div class="benefit-content">
                            <h4>Exhibition Opportunities</h4>
                            <p>Showcase member work in one of the region's most visited botanical gardens</p>
                        </div>
                    </div>
                </div>
                
                <div class="partnership-cta">
                    <button class="btn btn-primary" onclick="visitArboretum()">
                        Learn More About NC Arboretum
                    </button>
                    <button class="btn btn-outline" onclick="viewUpcomingWorkshops()">
                        View Arboretum Workshops
                    </button>
                </div>
            </div>
        </div>
    `;
    
    $w('#partnershipContainer').html = partnershipContent;
    $w('#partnershipSection').show();
}

async function loadFAQ() {
    try {
        // Load FAQ items from database
        const faqItems = await wixData.query('FAQItems')
            .eq('active', true)
            .ascending('displayOrder')
            .find();
        
        if (faqItems.items.length > 0) {
            displayFAQ(faqItems.items);
        } else {
            // Display default FAQ if no data
            displayDefaultFAQ();
        }
        
        $w('#faqSection').show();
    } catch (error) {
        console.error('Error loading FAQ:', error);
        displayDefaultFAQ();
        $w('#faqSection').show();
    }
}

function displayFAQ(faqItems) {
    const faqHTML = faqItems.map((item, index) => {
        return `
            <div class="glass-card faq-item" data-faq-id="${item._id}">
                <div class="faq-question" onclick="toggleFAQ('faq-${index}')">
                    <h4 class="question-text">${item.question}</h4>
                    <div class="faq-toggle" id="toggle-faq-${index}">+</div>
                </div>
                <div class="faq-answer" id="faq-${index}" style="display: none;">
                    <p class="answer-text">${item.answer}</p>
                    ${item.category ? `<span class="faq-category">${item.category}</span>` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    $w('#faqContainer').html = `
        <div class="faq-header">
            <h3 class="section-title text-center">Frequently Asked Questions</h3>
            <p class="section-subtitle text-center">
                Everything you need to know about Blue Ridge Bonsai Society
            </p>
        </div>
        <div class="faq-list">
            ${faqHTML}
        </div>
    `;
}

function displayDefaultFAQ() {
    const defaultFAQ = [
        {
            question: "Do I need experience to join Blue Ridge Bonsai Society?",
            answer: "Not at all! We welcome bonsai enthusiasts of all skill levels, from complete beginners to experienced practitioners. Our society is built on the principle of learning together and sharing knowledge.",
            category: "Membership"
        },
        {
            question: "What should I bring to my first meeting?",
            answer: "Just bring yourself and your curiosity! If you have a bonsai tree, feel free to bring it along, but it's not required. We'll provide all materials for demonstrations and hands-on activities.",
            category: "Getting Started"
        },
        {
            question: "When and where do you meet?",
            answer: "We typically meet monthly at the North Carolina Arboretum. Check our Events page for the most current meeting schedule and locations, as times may vary by season.",
            category: "Meetings"
        },
        {
            question: "What types of workshops do you offer?",
            answer: "We offer a variety of workshops including beginner styling sessions, repotting demonstrations, advanced techniques, seasonal care, and guest artist workshops. Our calendar features both hands-on and educational sessions.",
            category: "Education"
        },
        {
            question: "How much does membership cost?",
            answer: "We offer several membership levels to accommodate different needs and budgets. Visit our membership page for current pricing and benefits of each level.",
            category: "Membership"
        },
        {
            question: "Can I purchase bonsai trees through the society?",
            answer: "While we don't sell trees directly, our members often share resources, and we occasionally organize group purchases or host vendor sales. We also maintain a list of trusted local and regional suppliers.",
            category: "Resources"
        }
    ];
    
    const faqHTML = defaultFAQ.map((item, index) => {
        return `
            <div class="glass-card faq-item">
                <div class="faq-question" onclick="toggleFAQ('faq-${index}')">
                    <h4 class="question-text">${item.question}</h4>
                    <div class="faq-toggle" id="toggle-faq-${index}">+</div>
                </div>
                <div class="faq-answer" id="faq-${index}" style="display: none;">
                    <p class="answer-text">${item.answer}</p>
                    <span class="faq-category">${item.category}</span>
                </div>
            </div>
        `;
    }).join('');
    
    $w('#faqContainer').html = `
        <div class="faq-header">
            <h3 class="section-title text-center">Frequently Asked Questions</h3>
            <p class="section-subtitle text-center">
                Everything you need to know about Blue Ridge Bonsai Society
            </p>
        </div>
        <div class="faq-list">
            ${faqHTML}
        </div>
    `;
}

function displayMeetingInfo() {
    const meetingContent = `
        <div class="glass-card meeting-info-card">
            <div class="meeting-header">
                <div class="meeting-icon">📅</div>
                <h3 class="section-title">Meeting Information</h3>
            </div>
            
            <div class="meeting-details">
                <div class="meeting-schedule">
                    <h4>Regular Meetings</h4>
                    <div class="schedule-item">
                        <div class="schedule-icon">🗓️</div>
                        <div class="schedule-info">
                            <strong>When:</strong> Second Saturday of each month, 10:00 AM - 12:00 PM
                        </div>
                    </div>
                    <div class="schedule-item">
                        <div class="schedule-icon">📍</div>
                        <div class="schedule-info">
                            <strong>Where:</strong> North Carolina Arboretum Education Center<br>
                            100 Frederick Law Olmsted Way, Asheville, NC 28806
                        </div>
                    </div>
                    <div class="schedule-item">
                        <div class="schedule-icon">🚗</div>
                        <div class="schedule-info">
                            <strong>Parking:</strong> Free parking available in the Arboretum visitor lots
                        </div>
                    </div>
                </div>
                
                <div class="meeting-activities">
                    <h4>What to Expect</h4>
                    <ul class="activities-list">
                        <li>🎓 Educational presentations and demonstrations</li>
                        <li>🤝 Social time and networking with fellow enthusiasts</li>
                        <li>🌿 Show and tell - bring your trees to share</li>
                        <li>❓ Q&A sessions with experienced members</li>
                        <li>📢 Society updates and upcoming event announcements</li>
                        <li>🛍️ Occasional vendor presentations and sales</li>
                    </ul>
                </div>
                
                <div class="visitor-info">
                    <h4>Visiting for the First Time?</h4>
                    <p class="visitor-text">
                        We love having visitors! No need to register in advance - just show up and introduce yourself. 
                        We'll make sure you feel welcome and help you get oriented with our community.
                    </p>
                    <div class="visitor-tips">
                        <div class="tip-item">
                            <strong>Arrive a few minutes early</strong> to find parking and the meeting room
                        </div>
                        <div class="tip-item">
                            <strong>Bring a notebook</strong> if you like to take notes during presentations
                        </div>
                        <div class="tip-item">
                            <strong>Don't be shy</strong> - ask questions and introduce yourself to other members
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="meeting-cta">
                <button class="btn btn-primary" onclick="viewUpcomingMeetings()">
                    View Upcoming Meetings
                </button>
                <button class="btn btn-outline" onclick="getDirections()">
                    Get Directions
                </button>
            </div>
        </div>
    `;
    
    $w('#meetingInfoContainer').html = meetingContent;
    $w('#meetingInfoSection').show();
}

function initializeAnimations() {
    // Add scroll-triggered animations for sections
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
    
    // Observe all glass cards with a delay
    setTimeout(() => {
        const cards = document.querySelectorAll('.glass-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            observer.observe(card);
        });
    }, 500);
}

async function loadDynamicContent() {
    try {
        // Load society statistics
        await loadSocietyStats();
        
        // Load recent achievements or news
        await loadRecentAchievements();
        
    } catch (error) {
        console.error('Error loading dynamic content:', error);
    }
}

async function loadSocietyStats() {
    try {
        // Get member count
        const memberCount = await wixData.query('Members')
            .eq('isActive', true)
            .count();
        
        // Get years in operation (assuming founded in 1999)
        const foundedYear = 1999;
        const currentYear = new Date().getFullYear();
        const yearsInOperation = currentYear - foundedYear;
        
        // Display stats if container exists
        if ($w('#societyStatsContainer')) {
            $w('#societyStatsContainer').html = `
                <div class="glass-card stats-overview">
                    <h3 class="section-title text-center">Society at a Glance</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-number">${memberCount.totalCount || '50+'}</div>
                            <div class="stat-label">Active Members</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${yearsInOperation}+</div>
                            <div class="stat-label">Years Serving the Community</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">100+</div>
                            <div class="stat-label">Workshops Held</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">∞</div>
                            <div class="stat-label">Friendships Formed</div>
                        </div>
                    </div>
                </div>
            `;
            $w('#societyStatsSection').show();
        }
    } catch (error) {
        console.error('Error loading society stats:', error);
    }
}

async function loadRecentAchievements() {
    try {
        // This would load from an Achievements collection if available
        const achievements = [
            {
                title: "25th Anniversary Celebration",
                description: "Celebrating over two decades of fostering bonsai artistry in Western North Carolina",
                date: "2024"
            },
            {
                title: "Arboretum Partnership Expansion",
                description: "Strengthened our collaboration with NC Arboretum for enhanced educational opportunities",
                date: "2023"
            }
        ];
        
        if ($w('#achievementsContainer')) {
            const achievementsHTML = achievements.map(achievement => {
                return `
                    <div class="achievement-item glass-card">
                        <div class="achievement-year">${achievement.date}</div>
                        <div class="achievement-content">
                            <h4 class="achievement-title">${achievement.title}</h4>
                            <p class="achievement-description">${achievement.description}</p>
                        </div>
                    </div>
                `;
            }).join('');
            
            $w('#achievementsContainer').html = `
                <div class="achievements-header">
                    <h3 class="section-title text-center">Recent Achievements</h3>
                </div>
                <div class="achievements-list">
                    ${achievementsHTML}
                </div>
            `;
            $w('#achievementsSection').show();
        }
    } catch (error) {
        console.error('Error loading achievements:', error);
    }
}

function setupEventHandlers() {
    // Handle dynamic interactions
    $w('#page').onClick((event) => {
        const target = event.target;
        
        // Handle board member card interactions
        if (target.closest('.board-member-card')) {
            const memberId = target.closest('.board-member-card').dataset.memberId;
            if (memberId && target.tagName !== 'BUTTON') {
                // Could expand member info or show more details
                console.log('Board member clicked:', memberId);
            }
        }
    });
}

// Global functions for dynamic interactions
window.contactMember = function(email, name) {
    const subject = encodeURIComponent(`Inquiry from BRBS Website - ${name}`);
    const body = encodeURIComponent(`Hello ${name},\n\nI found your information on the Blue Ridge Bonsai Society website and would like to get in touch.\n\nBest regards,`);
    wixLocation.to(`mailto:${email}?subject=${subject}&body=${body}`);
};

window.joinToMeetBoard = function() {
    wixLocation.to('/join-brbs');
};

window.visitArboretum = function() {
    wixWindow.openLightbox('arboretum-info');
};

window.viewUpcomingWorkshops = function() {
    wixLocation.to('/events?category=workshop&location=arboretum');
};

window.toggleFAQ = function(faqId) {
    const faqAnswer = document.getElementById(faqId);
    const toggleButton = document.getElementById(`toggle-${faqId}`);
    
    if (faqAnswer && toggleButton) {
        if (faqAnswer.style.display === 'none' || !faqAnswer.style.display) {
            faqAnswer.style.display = 'block';
            toggleButton.textContent = '−';
            toggleButton.style.transform = 'rotate(180deg)';
        } else {
            faqAnswer.style.display = 'none';
            toggleButton.textContent = '+';
            toggleButton.style.transform = 'rotate(0deg)';
        }
    }
};

window.viewUpcomingMeetings = function() {
    wixLocation.to('/events?category=meeting');
};

window.getDirections = function() {
    const arboretumAddress = "100 Frederick Law Olmsted Way, Asheville, NC 28806";
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(arboretumAddress)}`;
    wixWindow.openLightbox('directions-modal');
};

// Add CSS for About page styling
if (typeof window !== 'undefined') {
    const aboutPageStyles = `
        <style id="about-page-styles">
            .mission-vision-section {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 2rem;
                margin: 2rem 0;
            }
            
            .mission-card, .vision-card {
                text-align: center;
            }
            
            .icon-container {
                margin-bottom: 1rem;
            }
            
            .mission-icon, .vision-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
            
            .values-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1.5rem;
                margin: 2rem 0;
            }
            
            .value-item {
                text-align: center;
                padding: 1rem;
            }
            
            .value-icon {
                font-size: 2rem;
                margin-bottom: 0.5rem;
            }
            
            .board-members-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 2rem;
                margin: 2rem 0;
            }
            
            .board-member-card {
                position: relative;
                overflow: hidden;
            }
            
            .member-photo-container {
                position: relative;
                text-align: center;
                margin-bottom: 1rem;
            }
            
            .member-photo {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                object-fit: cover;
                border: 4px solid var(--mountain-sage);
            }
            
            .default-member-icon {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                background: var(--mountain-haze);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 3rem;
                margin: 0 auto;
                border: 4px solid var(--mountain-sage);
            }
            
            .member-role-badge {
                position: absolute;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--mountain-sage);
                color: var(--cloud-white);
                padding: 0.25rem 0.75rem;
                border-radius: 15px;
                font-size: 0.8rem;
                font-weight: 600;
            }
            
            .member-name {
                color: var(--stone-gray);
                margin: 1rem 0 0.5rem 0;
            }
            
            .member-title {
                color: var(--earth-brown);
                font-style: italic;
                margin-bottom: 1rem;
            }
            
            .member-bio {
                line-height: 1.6;
                margin-bottom: 1rem;
            }
            
            .member-experience, .member-specialties {
                margin: 0.5rem 0;
                font-size: 0.9rem;
            }
            
            .experience-label, .specialties-label {
                font-weight: 600;
                color: var(--mountain-sage);
            }
            
            .partnership-header {
                text-align: center;
                margin-bottom: 2rem;
            }
            
            .partnership-logos {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 1rem;
                margin-bottom: 1rem;
                font-size: 2rem;
            }
            
            .partnership-benefits {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1.5rem;
                margin: 2rem 0;
            }
            
            .benefit-item {
                display: flex;
                gap: 1rem;
                align-items: flex-start;
            }
            
            .benefit-icon {
                font-size: 1.5rem;
                flex-shrink: 0;
            }
            
            .benefit-content h4 {
                color: var(--mountain-sage);
                margin-bottom: 0.5rem;
            }
            
            .partnership-cta {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
                margin-top: 2rem;
            }
            
            .faq-list {
                max-width: 800px;
                margin: 0 auto;
            }
            
            .faq-item {
                margin-bottom: 1rem;
            }
            
            .faq-question {
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                padding: 1rem;
                transition: background-color 0.3s ease;
            }
            
            .faq-question:hover {
                background-color: rgba(107, 142, 111, 0.1);
            }
            
            .question-text {
                margin: 0;
                flex-grow: 1;
                color: var(--stone-gray);
            }
            
            .faq-toggle {
                font-size: 1.5rem;
                font-weight: bold;
                color: var(--mountain-sage);
                transition: transform 0.3s ease;
                margin-left: 1rem;
            }
            
            .faq-answer {
                padding: 0 1rem 1rem 1rem;
                border-top: 1px solid var(--mountain-haze);
            }
            
            .answer-text {
                margin: 1rem 0;
                line-height: 1.6;
            }
            
            .faq-category {
                background: var(--mountain-sage);
                color: var(--cloud-white);
                padding: 0.25rem 0.5rem;
                border-radius: 12px;
                font-size: 0.8rem;
                font-weight: 500;
            }
            
            .meeting-header {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 2rem;
            }
            
            .meeting-icon {
                font-size: 2rem;
            }
            
            .meeting-details {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
                margin: 2rem 0;
            }
            
            .schedule-item {
                display: flex;
                gap: 1rem;
                align-items: flex-start;
                margin: 1rem 0;
            }
            
            .schedule-icon {
                font-size: 1.2rem;
                color: var(--mountain-sage);
                flex-shrink: 0;
            }
            
            .activities-list {
                list-style: none;
                padding: 0;
            }
            
            .activities-list li {
                margin: 0.75rem 0;
                padding-left: 0.5rem;
            }
            
            .visitor-tips {
                margin-top: 1rem;
            }
            
            .tip-item {
                margin: 0.5rem 0;
                padding: 0.5rem;
                background: var(--mountain-haze);
                border-radius: var(--radius-md);
                border-left: 4px solid var(--mountain-sage);
            }
            
            .meeting-cta {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
                margin-top: 2rem;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                margin: 2rem 0;
            }
            
            .stat-item {
                text-align: center;
                padding: 1.5rem 1rem;
            }
            
            .stat-number {
                font-size: 2.5rem;
                font-weight: 700;
                color: var(--mountain-sage);
                margin-bottom: 0.5rem;
            }
            
            .stat-label {
                font-size: 0.9rem;
                color: var(--stone-gray);
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            
            .achievements-list {
                max-width: 600px;
                margin: 0 auto;
            }
            
            .achievement-item {
                display: flex;
                gap: 2rem;
                align-items: center;
                margin: 1rem 0;
            }
            
            .achievement-year {
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--mountain-sage);
                flex-shrink: 0;
            }
            
            .achievement-title {
                color: var(--stone-gray);
                margin-bottom: 0.5rem;
            }
            
            .section-subtitle {
                color: var(--earth-brown);
                font-style: italic;
                margin-bottom: 2rem;
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
                .mission-vision-section {
                    grid-template-columns: 1fr;
                }
                
                .board-members-grid {
                    grid-template-columns: 1fr;
                }
                
                .partnership-benefits {
                    grid-template-columns: 1fr;
                }
                
                .meeting-details {
                    grid-template-columns: 1fr;
                }
                
                .partnership-cta, .meeting-cta {
                    flex-direction: column;
                    align-items: center;
                }
                
                .achievement-item {
                    flex-direction: column;
                    text-align: center;
                }
                
                .values-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        </style>
    `;
    
    if (!document.getElementById('about-page-styles')) {
        document.head.insertAdjacentHTML('beforeend', aboutPageStyles);
    }
}