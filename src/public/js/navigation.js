/**
 * ==========================================================================
 * LIQUID GLASS NAVIGATION SYSTEM
 * Blue Ridge Bonsai Society - Advanced Navigation Component
 * ==========================================================================
 */

class LiquidGlassNavigation {
  constructor() {
    // Core navigation elements
    this.nav = document.querySelector('.liquid-glass-nav');
    this.navToggle = document.querySelector('.nav-toggle');
    this.mobileMenu = document.querySelector('.nav-mobile-menu');
    this.overlay = document.querySelector('.nav-overlay');
    this.searchToggle = document.querySelector('.nav-search-toggle');
    
    // Navigation state
    this.lastScrollY = 0;
    this.ticking = false;
    this.isMenuOpen = false;
    this.currentSection = '';
    this.scrollThreshold = 100;
    this.contrastThreshold = 0.5;
    
    // Performance optimizations
    this.rafId = null;
    this.resizeTimeout = null;
    this.intersectionObserver = null;
    this.mutationObserver = null;
    
    // Touch handling
    this.touchStartY = 0;
    this.touchEndY = 0;
    
    // Initialize if navigation exists
    if (this.nav) {
      this.init();
    }
  }

  /**
   * Initialize the navigation system
   */
  init() {
    this.setupEventListeners();
    this.setupAccessibility();
    this.setupIntersectionObserver();
    this.setupMutationObserver();
    this.calculateContentContrast();
    this.updateActiveSection();
    this.optimizePerformance();
    
    // Initial state
    this.handleResize();
    
    console.log('🌟 Liquid Glass Navigation initialized');
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Scroll handling with throttling
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
    
    // Resize handling with debouncing
    window.addEventListener('resize', this.onResize.bind(this), { passive: true });
    
    // Mobile menu toggle
    if (this.navToggle) {
      this.navToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
    }
    
    // Overlay click to close menu
    if (this.overlay) {
      this.overlay.addEventListener('click', this.closeMobileMenu.bind(this));
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', this.handleKeyNavigation.bind(this));
    
    // Touch events for mobile optimization
    if ('ontouchstart' in window) {
      this.setupTouchEvents();
    }
    
    // Search toggle
    if (this.searchToggle) {
      this.searchToggle.addEventListener('click', this.toggleSearch.bind(this));
    }
    
    // Click outside to close menu
    document.addEventListener('click', this.handleOutsideClick.bind(this));
    
    // Focus management
    this.setupFocusManagement();
  }

  /**
   * Handle scroll events with performance optimization
   */
  onScroll() {
    if (!this.ticking) {
      this.rafId = requestAnimationFrame(this.updateNavigation.bind(this));
      this.ticking = true;
    }
  }

  /**
   * Update navigation based on scroll position
   */
  updateNavigation() {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - this.lastScrollY;
    
    // Auto-hide navigation on scroll down, show on scroll up
    this.handleAutoHide(currentScrollY, scrollDelta);
    
    // Enhance blur and styling based on scroll position
    this.enhanceScrollEffects(currentScrollY);
    
    // Update active section highlighting
    this.updateActiveSection();
    
    this.lastScrollY = currentScrollY;
    this.ticking = false;
  }

  /**
   * Handle navigation auto-hide behavior
   */
  handleAutoHide(currentScrollY, scrollDelta) {
    const isScrollingDown = scrollDelta > 0;
    const isScrollingUp = scrollDelta < 0;
    const isBeyondThreshold = currentScrollY > this.scrollThreshold;
    const isMenuClosed = !this.isMenuOpen;
    
    if (isScrollingDown && isBeyondThreshold && isMenuClosed) {
      this.nav.classList.add('nav-hidden');
    } else if (isScrollingUp || !isBeyondThreshold) {
      this.nav.classList.remove('nav-hidden');
    }
  }

  /**
   * Enhance visual effects based on scroll position
   */
  enhanceScrollEffects(currentScrollY) {
    const scrollProgress = Math.min(currentScrollY / 300, 1);
    const blurAmount = 20 + (scrollProgress * 15);
    const opacity = 0.8 + (scrollProgress * 0.15);
    
    // Add scrolled class for enhanced styling
    if (currentScrollY > 50) {
      this.nav.classList.add('nav-scrolled');
    } else {
      this.nav.classList.remove('nav-scrolled');
    }
    
    // Dynamic backdrop filter adjustment
    const backdropFilter = `blur(${blurAmount}px) saturate(1.2)`;
    this.nav.style.backdropFilter = backdropFilter;
    this.nav.style.webkitBackdropFilter = backdropFilter;
    
    // Dynamic background opacity
    const currentBg = this.nav.style.background;
    if (currentBg.includes('rgba')) {
      this.nav.style.background = currentBg.replace(
        /rgba\(([^)]+)\)/,
        (match, p1) => {
          const [r, g, b] = p1.split(',').slice(0, 3);
          return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
      );
    }
  }

  /**
   * Setup intersection observer for content-aware theming
   */
  setupIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.analyzeContentContrast(entry.target);
          }
        });
      },
      {
        rootMargin: '-80px 0px 0px 0px',
        threshold: 0.1
      }
    );

    // Observe all major content sections
    this.observeContentSections();
  }

  /**
   * Observe content sections for contrast analysis
   */
  observeContentSections() {
    const sections = document.querySelectorAll(
      'section, .hero, .content-block, main, article, .page-section'
    );
    
    sections.forEach(section => {
      this.intersectionObserver.observe(section);
    });
  }

  /**
   * Analyze content contrast and adapt navigation theme
   */
  analyzeContentContrast(element) {
    const styles = getComputedStyle(element);
    const bgColor = styles.backgroundColor;
    const bgImage = styles.backgroundImage;
    
    let isLight = true;
    
    // Analyze background color
    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
      isLight = this.isColorLight(bgColor);
    }
    
    // Analyze background image if present
    if (bgImage && bgImage !== 'none') {
      // For images, assume darker content and use light navigation
      isLight = false;
    }
    
    // Apply appropriate theme
    this.applyNavigationTheme(isLight);
  }

  /**
   * Determine if a color is light or dark
   */
  isColorLight(color) {
    const rgb = color.match(/\d+/g);
    if (!rgb || rgb.length < 3) return true;
    
    const [r, g, b] = rgb.map(Number);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > this.contrastThreshold;
  }

  /**
   * Apply navigation theme based on content
   */
  applyNavigationTheme(isLight) {
    this.nav.classList.toggle('content-light', isLight);
    this.nav.classList.toggle('content-dark', !isLight);
    
    // Update reflection effect
    const reflection = this.nav.querySelector('::before');
    if (reflection) {
      const bgColor = isLight 
        ? 'rgba(254, 255, 254, 0.4)' 
        : 'rgba(26, 29, 27, 0.4)';
      
      reflection.style.background = `linear-gradient(180deg, ${bgColor} 0%, transparent 100%)`;
    }
  }

  /**
   * Setup mutation observer for dynamic content changes
   */
  setupMutationObserver() {
    this.mutationObserver = new MutationObserver(() => {
      // Re-observe sections when DOM changes
      this.observeContentSections();
    });

    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }

  /**
   * Update active navigation section
   */
  updateActiveSection() {
    const sections = document.querySelectorAll('section[id], main[id], article[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"], .nav-mobile-link[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const navHeight = this.nav.offsetHeight;
      
      if (rect.top <= navHeight + 50 && rect.bottom >= navHeight + 50) {
        currentSection = section.id;
      }
    });
    
    // Update active states
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const isActive = href === `#${currentSection}`;
      
      link.classList.toggle('active', isActive);
    });
    
    this.currentSection = currentSection;
  }

  /**
   * Mobile menu functionality
   */
  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    this.navToggle.classList.toggle('active', this.isMenuOpen);
    this.mobileMenu.classList.toggle('active', this.isMenuOpen);
    this.overlay.classList.toggle('active', this.isMenuOpen);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    
    // Focus management
    if (this.isMenuOpen) {
      this.trapFocus(this.mobileMenu);
      this.mobileMenu.querySelector('.nav-mobile-link')?.focus();
    } else {
      this.navToggle.focus();
    }
    
    // Update ARIA attributes
    this.navToggle.setAttribute('aria-expanded', this.isMenuOpen);
    this.mobileMenu.setAttribute('aria-hidden', !this.isMenuOpen);
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    if (this.isMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyNavigation(event) {
    switch (event.key) {
      case 'Escape':
        if (this.isMenuOpen) {
          this.closeMobileMenu();
          event.preventDefault();
        }
        break;
        
      case 'Tab':
        if (this.isMenuOpen) {
          this.handleTabNavigation(event);
        }
        break;
        
      case 'ArrowDown':
      case 'ArrowUp':
        if (this.isMenuOpen) {
          this.handleArrowNavigation(event);
        }
        break;
    }
  }

  /**
   * Handle tab navigation in mobile menu
   */
  handleTabNavigation(event) {
    const focusableElements = this.mobileMenu.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (!event.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      event.preventDefault();
    } else if (event.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      event.preventDefault();
    }
  }

  /**
   * Handle arrow key navigation
   */
  handleArrowNavigation(event) {
    const menuLinks = Array.from(this.mobileMenu.querySelectorAll('.nav-mobile-link'));
    const currentIndex = menuLinks.indexOf(document.activeElement);
    
    let nextIndex;
    if (event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % menuLinks.length;
    } else {
      nextIndex = (currentIndex - 1 + menuLinks.length) % menuLinks.length;
    }
    
    menuLinks[nextIndex].focus();
    event.preventDefault();
  }

  /**
   * Setup touch events for mobile optimization
   */
  setupTouchEvents() {
    // Touch-based navigation hiding
    document.addEventListener('touchstart', (event) => {
      this.touchStartY = event.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', (event) => {
      this.touchEndY = event.touches[0].clientY;
      const deltaY = this.touchStartY - this.touchEndY;
      
      // Hide nav on significant upward swipe
      if (deltaY > 50 && window.scrollY > this.scrollThreshold) {
        this.nav.classList.add('nav-hidden');
      } else if (deltaY < -50) {
        this.nav.classList.remove('nav-hidden');
      }
    }, { passive: true });
    
    // Enhanced touch targets
    const navLinks = document.querySelectorAll('.nav-link, .nav-mobile-link');
    navLinks.forEach(link => {
      link.style.minHeight = '44px';
      link.style.minWidth = '44px';
    });
  }

  /**
   * Search functionality
   */
  toggleSearch() {
    // This will be expanded when search component is implemented
    console.log('Search toggle clicked');
    
    // For now, focus on the first search input if it exists
    const searchInput = document.querySelector('input[type="search"], input[name="search"]');
    if (searchInput) {
      searchInput.focus();
    }
  }

  /**
   * Handle clicks outside mobile menu
   */
  handleOutsideClick(event) {
    if (this.isMenuOpen && !this.mobileMenu.contains(event.target) && !this.navToggle.contains(event.target)) {
      this.closeMobileMenu();
    }
  }

  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    // Add ARIA labels
    this.nav.setAttribute('role', 'navigation');
    this.nav.setAttribute('aria-label', 'Main navigation');
    
    if (this.navToggle) {
      this.navToggle.setAttribute('aria-label', 'Toggle navigation menu');
      this.navToggle.setAttribute('aria-expanded', 'false');
      this.navToggle.setAttribute('aria-controls', 'mobile-menu');
    }
    
    if (this.mobileMenu) {
      this.mobileMenu.setAttribute('id', 'mobile-menu');
      this.mobileMenu.setAttribute('aria-hidden', 'true');
    }
    
    // Skip link for screen readers
    this.createSkipLink();
  }

  /**
   * Create skip link for accessibility
   */
  createSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--mountain-sage);
      color: white;
      padding: 8px;
      text-decoration: none;
      z-index: 10000;
      border-radius: 4px;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  /**
   * Setup focus management
   */
  setupFocusManagement() {
    // Enhanced focus indicators
    const focusableElements = document.querySelectorAll(
      '.nav-link, .nav-toggle, .nav-search-toggle, .nav-mobile-link'
    );
    
    focusableElements.forEach(element => {
      element.addEventListener('focus', this.handleFocus.bind(this));
      element.addEventListener('blur', this.handleBlur.bind(this));
    });
  }

  /**
   * Handle focus events
   */
  handleFocus(event) {
    event.target.classList.add('is-focused');
  }

  /**
   * Handle blur events
   */
  handleBlur(event) {
    event.target.classList.remove('is-focused');
  }

  /**
   * Trap focus within mobile menu
   */
  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Focus first element
    firstElement.focus();
  }

  /**
   * Handle window resize with debouncing
   */
  onResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.handleResize();
    }, 150);
  }

  /**
   * Handle resize actions
   */
  handleResize() {
    // Close mobile menu on desktop resize
    if (window.innerWidth >= 769 && this.isMenuOpen) {
      this.closeMobileMenu();
    }
    
    // Recalculate navigation positioning
    this.calculateContentContrast();
  }

  /**
   * Performance optimizations
   */
  optimizePerformance() {
    // Use passive event listeners where appropriate
    const passiveEvents = ['touchstart', 'touchmove', 'wheel'];
    passiveEvents.forEach(eventType => {
      if (this.nav.addEventListener.length > 2) {
        this.nav.addEventListener(eventType, () => {}, { passive: true });
      }
    });
    
    // Optimize intersection observer
    this.intersectionObserver.thresholds = [0.1];
    
    // Use CSS containment for performance
    this.nav.style.contain = 'layout style';
  }

  /**
   * Calculate initial content contrast
   */
  calculateContentContrast() {
    const heroSection = document.querySelector('.hero, main, section');
    if (heroSection) {
      this.analyzeContentContrast(heroSection);
    }
  }

  /**
   * Smooth scroll to anchor links
   */
  smoothScrollToAnchor(targetId) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;
    
    const navHeight = this.nav.offsetHeight;
    const targetPosition = targetElement.offsetTop - navHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  /**
   * Destroy navigation instance
   */
  destroy() {
    // Remove event listeners
    window.removeEventListener('scroll', this.onScroll.bind(this));
    window.removeEventListener('resize', this.onResize.bind(this));
    document.removeEventListener('keydown', this.handleKeyNavigation.bind(this));
    
    // Disconnect observers
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    
    // Cancel animation frames
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    
    // Clear timeouts
    clearTimeout(this.resizeTimeout);
    
    // Reset body styles
    document.body.style.overflow = '';
    
    console.log('🌟 Liquid Glass Navigation destroyed');
  }
}

/**
 * Navigation utility functions
 */
const NavigationUtils = {
  /**
   * Initialize navigation when DOM is ready
   */
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        window.liquidGlassNav = new LiquidGlassNavigation();
      });
    } else {
      window.liquidGlassNav = new LiquidGlassNavigation();
    }
  },

  /**
   * Get current navigation instance
   */
  getInstance() {
    return window.liquidGlassNav;
  },

  /**
   * Update navigation theme manually
   */
  setTheme(theme) {
    const nav = this.getInstance();
    if (nav) {
      nav.applyNavigationTheme(theme === 'light');
    }
  },

  /**
   * Scroll to section
   */
  scrollToSection(sectionId) {
    const nav = this.getInstance();
    if (nav) {
      nav.smoothScrollToAnchor(sectionId);
    }
  }
};

// Auto-initialize navigation
NavigationUtils.init();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LiquidGlassNavigation, NavigationUtils };
}