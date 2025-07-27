// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// Blue Ridge Bonsai Society - Master Page Implementation
// Phase 1: Liquid Glass Navigation & Information Architecture

import { currentMember } from 'wix-members';

$w.onReady(function () {
    console.log('🌸 Blue Ridge Bonsai Society - Master Page Loaded');
    
    // Initialize navigation system
    initializeNavigation();
    
    // Setup member-specific features
    setupMemberFeatures();
    
    // Initialize search functionality
    initializeSearch();
    
    // Setup performance monitoring
    setupPerformanceMonitoring();
    
    // Initialize accessibility features
    initializeAccessibility();
});

/**
 * Initialize the liquid glass navigation system
 */
async function initializeNavigation() {
    try {
        // Check if we're on a page that should have navigation
        const currentPage = $w('#currentPage');
        if (!currentPage) {
            console.log('No navigation container found on this page');
            return;
        }
        
        // Get current member status for navigation personalization
        const member = await getCurrentMember();
        const userRole = getUserRole(member);
        
        // Setup navigation based on user role
        await setupNavigationForUser(userRole);
        
        // Initialize responsive navigation behavior
        setupResponsiveNavigation();
        
        // Setup navigation analytics
        trackNavigationUsage();
        
        console.log('✅ Navigation system initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing navigation:', error);
        // Fallback to basic navigation
        setupFallbackNavigation();
    }
}

/**
 * Get current member information
 */
async function getCurrentMember() {
    try {
        const member = await currentMember.getMember();
        return member;
    } catch (error) {
        console.log('No member logged in');
        return null;
    }
}

/**
 * Determine user role based on member data
 */
function getUserRole(member) {
    if (!member) return 'guest';
    
    // Check for admin or board member roles
    // This would be based on your member data structure
    const memberRoles = member.memberRoles || [];
    
    if (memberRoles.includes('admin')) return 'admin';
    if (memberRoles.includes('board')) return 'board';
    return 'member';
}

/**
 * Setup navigation based on user role
 */
async function setupNavigationForUser(userRole) {
    // Show/hide navigation items based on user role
    const membersOnlyItems = $w('#membersArea, #memberDirectory, #adminPanel');
    
    if (userRole === 'guest') {
        // Hide members-only navigation
        membersOnlyItems.hide();
        
        // Show login/join prompts
        $w('#joinUsButton').show();
        $w('#loginLink').show();
        
    } else {
        // Show member navigation
        membersOnlyItems.show();
        
        // Hide join prompts
        $w('#joinUsButton').hide();
        $w('#loginLink').hide();
        
        // Setup member-specific navigation
        await setupMemberNavigation(userRole);
    }
    
    // Update navigation active states
    updateActiveNavigation();
}

/**
 * Setup member-specific navigation features
 */
async function setupMemberNavigation(userRole) {
    try {
        // Setup member dashboard link
        const memberDashboard = $w('#memberDashboard');
        if (memberDashboard) {
            memberDashboard.onClick(() => {
                wixLocationFrontend.to('/members/dashboard');
            });
        }
        
        // Setup member directory (board members only)
        if (userRole === 'board' || userRole === 'admin') {
            const memberDirectory = $w('#memberDirectory');
            if (memberDirectory) {
                memberDirectory.show();
                memberDirectory.onClick(() => {
                    wixLocationFrontend.to('/members/directory');
                });
            }
        }
        
        // Setup admin panel (admins only)
        if (userRole === 'admin') {
            const adminPanel = $w('#adminPanel');
            if (adminPanel) {
                adminPanel.show();
                adminPanel.onClick(() => {
                    wixLocationFrontend.to('/admin');
                });
            }
        }
        
    } catch (error) {
        console.error('Error setting up member navigation:', error);
    }
}

/**
 * Update active navigation states based on current page
 */
function updateActiveNavigation() {
    const currentPath = wixLocationFrontend.path;
    const navLinks = $w('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.link;
        if (href && currentPath.startsWith(href)) {
            link.addClass('active');
        } else {
            link.removeClass('active');
        }
    });
}

/**
 * Setup responsive navigation behavior
 */
function setupResponsiveNavigation() {
    // Mobile menu toggle
    const mobileToggle = $w('#mobileMenuToggle');
    const mobileMenu = $w('#mobileMenu');
    const overlay = $w('#mobileOverlay');
    
    if (mobileToggle && mobileMenu) {
        mobileToggle.onClick(() => {
            const isOpen = mobileMenu.isVisible;
            
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }
    
    // Close menu when overlay is clicked
    if (overlay) {
        overlay.onClick(() => {
            closeMobileMenu();
        });
    }
    
    // Close menu when window is resized to desktop
    $w.onViewportEnter('Desktop', () => {
        closeMobileMenu();
    });
}

/**
 * Open mobile menu
 */
function openMobileMenu() {
    const mobileMenu = $w('#mobileMenu');
    const overlay = $w('#mobileOverlay');
    const toggle = $w('#mobileMenuToggle');
    
    if (mobileMenu) mobileMenu.show();
    if (overlay) overlay.show();
    if (toggle) toggle.addClass('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    const mobileMenu = $w('#mobileMenu');
    const overlay = $w('#mobileOverlay');
    const toggle = $w('#mobileMenuToggle');
    
    if (mobileMenu) mobileMenu.hide();
    if (overlay) overlay.hide();
    if (toggle) toggle.removeClass('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
}

/**
 * Setup member-specific features
 */
function setupMemberFeatures() {
    // Member login/logout handling
    $w('#loginButton').onClick(async () => {
        try {
            await wixUsers.promptLogin();
            // Refresh navigation after login
            await initializeNavigation();
        } catch (error) {
            console.error('Login error:', error);
        }
    });
    
    $w('#logoutButton').onClick(async () => {
        try {
            await wixUsers.logout();
            // Refresh navigation after logout
            await initializeNavigation();
        } catch (error) {
            console.error('Logout error:', error);
        }
    });
}

/**
 * Initialize search functionality
 */
function initializeSearch() {
    const searchToggle = $w('#searchToggle');
    const searchInput = $w('#searchInput');
    const searchResults = $w('#searchResults');
    
    if (searchToggle) {
        searchToggle.onClick(() => {
            openSearchModal();
        });
    }
    
    if (searchInput) {
        // Debounced search
        let searchTimeout;
        
        searchInput.onInput(() => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(searchInput.value);
            }, 300);
        });
        
        // Handle search keyboard shortcuts
        searchInput.onKeyPress((event) => {
            if (event.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }
}

/**
 * Open search modal
 */
function openSearchModal() {
    const searchModal = $w('#searchModal');
    const searchInput = $w('#searchInput');
    
    if (searchModal) {
        searchModal.show();
        // Focus on search input
        if (searchInput) {
            searchInput.focus();
        }
    }
}

/**
 * Perform search operation
 */
async function performSearch(query) {
    if (!query || query.length < 2) {
        clearSearchResults();
        return;
    }
    
    try {
        // Show loading state
        showSearchLoading();
        
        // Perform site search using Wix Search API
        // This is a placeholder - implement actual search logic
        const results = await searchSiteContent(query);
        
        // Display results
        displaySearchResults(results);
        
    } catch (error) {
        console.error('Search error:', error);
        showSearchError();
    }
}

/**
 * Search site content (placeholder implementation)
 */
async function searchSiteContent(query) {
    // This would integrate with Wix Search API or custom search
    // For now, return mock results
    return [
        {
            title: `Bonsai Care Tips for "${query}"`,
            url: '/learn/articles/care-tips',
            description: 'Learn essential care techniques...',
            type: 'article'
        },
        {
            title: `Events related to "${query}"`,
            url: '/events/upcoming',
            description: 'Upcoming workshops and meetings...',
            type: 'event'
        }
    ];
}

/**
 * Display search results
 */
function displaySearchResults(results) {
    const searchResults = $w('#searchResults');
    
    if (!searchResults) return;
    
    if (results.length === 0) {
        searchResults.html = '<p>No results found. Try different keywords.</p>';
        return;
    }
    
    const resultsHtml = results.map(result => `
        <div class="search-result">
            <h3><a href="${result.url}">${result.title}</a></h3>
            <p>${result.description}</p>
            <span class="result-type">${result.type}</span>
        </div>
    `).join('');
    
    searchResults.html = resultsHtml;
    searchResults.show();
}

/**
 * Clear search results
 */
function clearSearchResults() {
    const searchResults = $w('#searchResults');
    if (searchResults) {
        searchResults.html = '';
        searchResults.hide();
    }
}

/**
 * Show search loading state
 */
function showSearchLoading() {
    const searchResults = $w('#searchResults');
    if (searchResults) {
        searchResults.html = '<p>Searching...</p>';
        searchResults.show();
    }
}

/**
 * Show search error
 */
function showSearchError() {
    const searchResults = $w('#searchResults');
    if (searchResults) {
        searchResults.html = '<p>Search temporarily unavailable. Please try again later.</p>';
        searchResults.show();
    }
}

/**
 * Setup performance monitoring
 */
function setupPerformanceMonitoring() {
    // Track Core Web Vitals
    if (typeof PerformanceObserver !== 'undefined') {
        // Largest Contentful Paint
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                console.log('FID:', entry.processingStart - entry.startTime);
            });
        }).observe({ entryTypes: ['first-input'] });
        
        // Cumulative Layout Shift
        new PerformanceObserver((entryList) => {
            let clsValue = 0;
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            console.log('CLS:', clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
    }
}

/**
 * Initialize accessibility features
 */
function initializeAccessibility() {
    // Skip link functionality
    const skipLink = $w('#skipToContent');
    if (skipLink) {
        skipLink.onClick(() => {
            const mainContent = $w('#mainContent');
            if (mainContent) {
                mainContent.focus();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (event) => {
        // Escape key closes modals
        if (event.key === 'Escape') {
            closeMobileMenu();
            closeSearchModal();
        }
        
        // Ctrl/Cmd + K opens search
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            openSearchModal();
        }
    });
    
    // Focus management for mobile menu
    setupFocusTrap();
}

/**
 * Setup focus trap for mobile menu
 */
function setupFocusTrap() {
    const mobileMenu = $w('#mobileMenu');
    
    if (mobileMenu) {
        mobileMenu.onViewportEnter(() => {
            // Trap focus within mobile menu when open
            const focusableElements = mobileMenu.querySelectorAll(
                'a, button, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        });
    }
}

/**
 * Close search modal
 */
function closeSearchModal() {
    const searchModal = $w('#searchModal');
    if (searchModal) {
        searchModal.hide();
    }
}

/**
 * Track navigation usage for analytics
 */
function trackNavigationUsage() {
    // Track navigation clicks
    $w('.nav-link').forEach(link => {
        link.onClick(() => {
            const linkText = link.text;
            const linkUrl = link.link;
            
            // Send analytics event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'navigation_click', {
                    'link_text': linkText,
                    'link_url': linkUrl,
                    'user_type': getUserRole(getCurrentMember())
                });
            }
        });
    });
}

/**
 * Setup fallback navigation for error cases
 */
function setupFallbackNavigation() {
    console.log('Setting up fallback navigation');
    
    // Basic navigation without advanced features
    const navLinks = $w('.nav-link');
    navLinks.forEach(link => {
        if (link.link) {
            link.onClick(() => {
                wixLocationFrontend.to(link.link);
            });
        }
    });
}
