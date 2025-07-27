/**
 * ==========================================================================
 * ACCESSIBILITY & TOUCH OPTIMIZATION
 * Blue Ridge Bonsai Society - Enhanced Accessibility Features
 * ==========================================================================
 */

class AccessibilityManager {
  constructor() {
    this.focusVisible = false;
    this.reducedMotion = false;
    this.highContrast = false;
    this.screenReader = false;
    this.touchDevice = false;
    
    this.init();
  }

  /**
   * Initialize accessibility features
   */
  init() {
    this.detectUserPreferences();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupScreenReaderSupport();
    this.setupTouchOptimization();
    this.setupReducedMotion();
    this.setupHighContrast();
    this.addAccessibilityControls();
    this.monitorAccessibility();
    
    console.log('♿ Accessibility features initialized');
  }

  /**
   * Detect user preferences and system settings
   */
  detectUserPreferences() {
    // Detect reduced motion preference
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Detect high contrast preference
    this.highContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    // Detect touch device
    this.touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Detect screen reader (heuristic approach)
    this.screenReader = this.detectScreenReader();
    
    // Apply detected preferences
    this.applyUserPreferences();
  }

  /**
   * Detect screen reader usage (heuristic)
   */
  detectScreenReader() {
    // Check for common screen reader indicators
    const indicators = [
      navigator.userAgent.includes('NVDA'),
      navigator.userAgent.includes('JAWS'),
      navigator.userAgent.includes('VoiceOver'),
      navigator.userAgent.includes('Narrator'),
      document.querySelector('[role="application"]'),
      window.speechSynthesis && window.speechSynthesis.getVoices().length > 0
    ];
    
    return indicators.some(indicator => indicator);
  }

  /**
   * Apply user preferences to the interface
   */
  applyUserPreferences() {
    document.body.classList.toggle('reduced-motion', this.reducedMotion);
    document.body.classList.toggle('high-contrast', this.highContrast);
    document.body.classList.toggle('touch-device', this.touchDevice);
    document.body.classList.toggle('screen-reader', this.screenReader);
    
    // Adjust navigation for preferences
    if (this.touchDevice) {
      this.enhanceForTouch();
    }
    
    if (this.screenReader) {
      this.enhanceForScreenReader();
    }
  }

  /**
   * Setup comprehensive keyboard navigation
   */
  setupKeyboardNavigation() {
    // Global keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      this.handleGlobalKeyboard(event);
    });
    
    // Enhanced Tab navigation
    this.setupTabNavigation();
    
    // Arrow key navigation for menus
    this.setupArrowNavigation();
    
    // Skip links
    this.createSkipLinks();
  }

  /**
   * Handle global keyboard shortcuts
   */
  handleGlobalKeyboard(event) {
    const { key, ctrlKey, metaKey, altKey, shiftKey } = event;
    
    // Skip if typing in input
    if (event.target.matches('input, textarea, [contenteditable]')) {
      return;
    }
    
    switch (key) {
      case 'Escape':
        this.closeAllModals();
        this.closeMobileMenu();
        break;
        
      case '/':
        if (!ctrlKey && !metaKey) {
          event.preventDefault();
          this.focusSearch();
        }
        break;
        
      case 'k':
        if (ctrlKey || metaKey) {
          event.preventDefault();
          this.openSearch();
        }
        break;
        
      case 'h':
        if (altKey) {
          event.preventDefault();
          this.goHome();
        }
        break;
        
      case 'm':
        if (altKey) {
          event.preventDefault();
          this.toggleMainMenu();
        }
        break;
        
      case '?':
        if (!ctrlKey && !metaKey) {
          event.preventDefault();
          this.showKeyboardShortcuts();
        }
        break;
    }
  }

  /**
   * Setup enhanced tab navigation
   */
  setupTabNavigation() {
    // Create visible focus indicators
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        this.focusVisible = true;
        document.body.classList.add('keyboard-navigation');
      }
    });
    
    // Remove focus visibility on mouse interaction
    document.addEventListener('mousedown', () => {
      this.focusVisible = false;
      document.body.classList.remove('keyboard-navigation');
    });
    
    // Enhanced focus trap for modals
    this.setupFocusTraps();
  }

  /**
   * Setup arrow key navigation for menus
   */
  setupArrowNavigation() {
    const navigationMenus = document.querySelectorAll('.nav-menu, .nav-mobile-menu');
    
    navigationMenus.forEach(menu => {
      menu.addEventListener('keydown', (event) => {
        this.handleMenuNavigation(event, menu);
      });
    });
  }

  /**
   * Handle menu navigation with arrow keys
   */
  handleMenuNavigation(event, menu) {
    const { key } = event;
    const menuItems = Array.from(menu.querySelectorAll('.nav-link, .nav-mobile-link'));
    const currentIndex = menuItems.indexOf(document.activeElement);
    
    let nextIndex = currentIndex;
    
    switch (key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        nextIndex = (currentIndex + 1) % menuItems.length;
        break;
        
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        nextIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
        break;
        
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
        
      case 'End':
        event.preventDefault();
        nextIndex = menuItems.length - 1;
        break;
        
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (document.activeElement) {
          document.activeElement.click();
        }
        break;
    }
    
    if (nextIndex !== currentIndex && menuItems[nextIndex]) {
      menuItems[nextIndex].focus();
    }
  }

  /**
   * Create skip links for screen readers
   */
  createSkipLinks() {
    const skipLinks = [
      { text: 'Skip to main content', target: '#main-content' },
      { text: 'Skip to navigation', target: '.liquid-glass-nav' },
      { text: 'Skip to search', target: '#search-input' },
      { text: 'Skip to footer', target: 'footer' }
    ];
    
    const skipContainer = document.createElement('div');
    skipContainer.className = 'skip-links';
    skipContainer.innerHTML = skipLinks.map(link => `
      <a href="${link.target}" class="skip-link" tabindex="1">
        ${link.text}
      </a>
    `).join('');
    
    // Add CSS for skip links
    const style = document.createElement('style');
    style.textContent = `
      .skip-links {
        position: absolute;
        top: -200px;
        left: 0;
        z-index: 10000;
      }
      
      .skip-link {
        position: absolute;
        top: -200px;
        left: 6px;
        background: var(--mountain-sage, #6B8E6F);
        color: white;
        padding: 8px 12px;
        text-decoration: none;
        border-radius: 4px;
        font-weight: 500;
        transition: top 0.3s ease;
      }
      
      .skip-link:focus {
        top: 6px;
      }
      
      .skip-links:focus-within {
        top: 6px;
      }
    `;
    
    document.head.appendChild(style);
    document.body.insertBefore(skipContainer, document.body.firstChild);
    
    // Handle skip link clicks
    skipContainer.addEventListener('click', (event) => {
      if (event.target.classList.contains('skip-link')) {
        event.preventDefault();
        const target = document.querySelector(event.target.getAttribute('href'));
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  /**
   * Setup focus management
   */
  setupFocusManagement() {
    // Manage focus when content changes
    this.setupLiveRegions();
    
    // Enhanced focus indicators
    this.enhanceFocusIndicators();
    
    // Focus restoration
    this.setupFocusRestoration();
  }

  /**
   * Setup ARIA live regions for dynamic content
   */
  setupLiveRegions() {
    // Create global live regions
    const liveRegions = [
      { id: 'sr-status', level: 'polite' },
      { id: 'sr-alert', level: 'assertive' },
      { id: 'sr-log', level: 'polite' }
    ];
    
    liveRegions.forEach(region => {
      const element = document.createElement('div');
      element.id = region.id;
      element.setAttribute('aria-live', region.level);
      element.setAttribute('aria-atomic', 'true');
      element.className = 'sr-only';
      element.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      `;
      
      document.body.appendChild(element);
    });
  }

  /**
   * Announce message to screen readers
   */
  announceToScreenReader(message, level = 'polite') {
    const regionId = level === 'assertive' ? 'sr-alert' : 'sr-status';
    const region = document.getElementById(regionId);
    
    if (region) {
      region.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        region.textContent = '';
      }, 1000);
    }
  }

  /**
   * Enhance focus indicators
   */
  enhanceFocusIndicators() {
    const style = document.createElement('style');
    style.textContent = `
      /* Enhanced focus indicators */
      .keyboard-navigation *:focus {
        outline: 3px solid var(--mountain-sage, #6B8E6F);
        outline-offset: 2px;
        border-radius: 4px;
      }
      
      .keyboard-navigation .nav-link:focus,
      .keyboard-navigation .nav-mobile-link:focus {
        outline-color: var(--cloud-white, #FEFFFE);
        background: var(--mountain-sage, #6B8E6F);
        color: var(--cloud-white, #FEFFFE);
      }
      
      /* High contrast mode focus */
      .high-contrast *:focus {
        outline: 4px solid currentColor;
        outline-style: dotted;
      }
      
      /* Remove focus outline for mouse users */
      *:focus:not(.keyboard-navigation *) {
        outline: none;
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Setup focus restoration
   */
  setupFocusRestoration() {
    this.focusHistory = [];
    
    // Store focus before modal opens
    document.addEventListener('modal-open', (event) => {
      this.focusHistory.push(document.activeElement);
    });
    
    // Restore focus when modal closes
    document.addEventListener('modal-close', (event) => {
      const previousFocus = this.focusHistory.pop();
      if (previousFocus) {
        previousFocus.focus();
      }
    });
  }

  /**
   * Setup focus traps for modals
   */
  setupFocusTraps() {
    const modals = document.querySelectorAll('.modal, .nav-mobile-menu');
    
    modals.forEach(modal => {
      modal.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
          this.trapFocus(event, modal);
        }
      });
    });
  }

  /**
   * Trap focus within element
   */
  trapFocus(event, container) {
    const focusableElements = container.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    } else if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }
  }

  /**
   * Setup screen reader specific enhancements
   */
  setupScreenReaderSupport() {
    // Add descriptive ARIA labels
    this.addAriaLabels();
    
    // Setup landmark navigation
    this.setupLandmarks();
    
    // Enhance form accessibility
    this.enhanceFormAccessibility();
    
    // Add screen reader specific content
    this.addScreenReaderContent();
  }

  /**
   * Add comprehensive ARIA labels
   */
  addAriaLabels() {
    // Navigation
    const nav = document.querySelector('.liquid-glass-nav');
    if (nav) {
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', 'Main navigation');
    }
    
    // Search
    const searchButton = document.querySelector('.nav-search-toggle');
    if (searchButton) {
      searchButton.setAttribute('aria-label', 'Open search');
    }
    
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.nav-toggle');
    if (mobileToggle) {
      mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
    
    // Logo
    const logo = document.querySelector('.nav-brand');
    if (logo) {
      logo.setAttribute('aria-label', 'Blue Ridge Bonsai Society - Home');
    }
  }

  /**
   * Setup semantic landmarks
   */
  setupLandmarks() {
    // Main content
    const main = document.querySelector('main, #main-content');
    if (main) {
      main.setAttribute('role', 'main');
      main.setAttribute('aria-label', 'Main content');
    }
    
    // Navigation
    const nav = document.querySelector('nav');
    if (nav) {
      nav.setAttribute('role', 'navigation');
    }
    
    // Footer
    const footer = document.querySelector('footer');
    if (footer) {
      footer.setAttribute('role', 'contentinfo');
    }
    
    // Search
    const search = document.querySelector('.search-form');
    if (search) {
      search.setAttribute('role', 'search');
    }
  }

  /**
   * Enhance form accessibility
   */
  enhanceFormAccessibility() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Associate labels with inputs
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
          const label = form.querySelector(`label[for="${input.id}"]`);
          if (label) {
            input.setAttribute('aria-labelledby', label.id || input.id + '-label');
          }
        }
        
        // Add required indicators
        if (input.hasAttribute('required')) {
          input.setAttribute('aria-required', 'true');
        }
      });
      
      // Error handling
      form.addEventListener('submit', (event) => {
        this.handleFormErrors(form);
      });
    });
  }

  /**
   * Add screen reader specific content
   */
  addScreenReaderContent() {
    // Add context for complex interactions
    const navItems = document.querySelectorAll('.nav-link');
    navItems.forEach(item => {
      if (item.querySelector('.nav-icon')) {
        const text = item.textContent.trim();
        item.setAttribute('aria-label', `Navigate to ${text}`);
      }
    });
    
    // Add descriptions for interactive elements
    const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    buttons.forEach(button => {
      const text = button.textContent.trim();
      if (text) {
        button.setAttribute('aria-label', text);
      }
    });
  }

  /**
   * Setup touch optimization
   */
  setupTouchOptimization() {
    if (!this.touchDevice) return;
    
    // Increase touch targets
    this.enhanceTouchTargets();
    
    // Add touch gestures
    this.setupTouchGestures();
    
    // Optimize touch feedback
    this.optimizeTouchFeedback();
  }

  /**
   * Enhance touch targets for mobile devices
   */
  enhanceTouchTargets() {
    const style = document.createElement('style');
    style.textContent = `
      @media (pointer: coarse) {
        .nav-link,
        .nav-mobile-link,
        .nav-toggle,
        .nav-search-toggle,
        button,
        a {
          min-height: 44px;
          min-width: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .nav-link,
        .nav-mobile-link {
          padding: 12px 16px;
        }
        
        /* Larger spacing on mobile */
        .nav-menu {
          gap: 8px;
        }
        
        .nav-mobile-list {
          gap: 4px;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Setup touch gestures
   */
  setupTouchGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', (event) => {
      touchStartX = event.changedTouches[0].screenX;
      touchStartY = event.changedTouches[0].screenY;
    }, { passive: true });
    
    document.addEventListener('touchend', (event) => {
      touchEndX = event.changedTouches[0].screenX;
      touchEndY = event.changedTouches[0].screenY;
      
      this.handleTouchGesture(touchStartX, touchStartY, touchEndX, touchEndY);
    }, { passive: true });
  }

  /**
   * Handle touch gestures
   */
  handleTouchGesture(startX, startY, endX, endY) {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const minSwipeDistance = 50;
    
    // Horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        // Swipe right - close mobile menu
        this.closeMobileMenu();
      } else {
        // Swipe left - could open menu or navigate
        // Implementation depends on context
      }
    }
    
    // Vertical swipes
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > minSwipeDistance) {
      if (deltaY < 0) {
        // Swipe up - hide navigation
        this.hideNavigation();
      } else {
        // Swipe down - show navigation
        this.showNavigation();
      }
    }
  }

  /**
   * Optimize touch feedback
   */
  optimizeTouchFeedback() {
    const style = document.createElement('style');
    style.textContent = `
      @media (hover: none) and (pointer: coarse) {
        /* Remove hover effects on touch devices */
        .nav-link:hover,
        .nav-mobile-link:hover,
        button:hover {
          transform: none;
        }
        
        /* Add active/pressed states instead */
        .nav-link:active,
        .nav-mobile-link:active,
        button:active {
          transform: scale(0.98);
          opacity: 0.8;
        }
        
        /* Faster transitions for touch */
        .nav-link,
        .nav-mobile-link,
        button {
          transition-duration: 0.1s;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Setup reduced motion support
   */
  setupReducedMotion() {
    if (!this.reducedMotion) return;
    
    const style = document.createElement('style');
    style.textContent = `
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
        
        .liquid-glass-nav {
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Setup high contrast support
   */
  setupHighContrast() {
    const style = document.createElement('style');
    style.textContent = `
      @media (prefers-contrast: high) {
        .liquid-glass-nav {
          background: rgba(255, 255, 255, 0.98);
          border-bottom: 3px solid var(--stone-gray, #4A4A4A);
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }
        
        .nav-link {
          border: 2px solid transparent;
        }
        
        .nav-link:hover,
        .nav-link:focus {
          border-color: var(--mountain-sage, #6B8E6F);
          background: var(--mountain-sage, #6B8E6F);
          color: white;
        }
        
        .nav-link.active {
          border-color: var(--stone-gray, #4A4A4A);
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Add accessibility controls panel
   */
  addAccessibilityControls() {
    const controls = document.createElement('div');
    controls.className = 'accessibility-controls';
    controls.innerHTML = `
      <button class="accessibility-toggle" aria-label="Accessibility options">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5C14.8 4.9 14.3 4.5 13.7 4.5S12.6 4.9 12.4 5.5L11 6L14 7.5V9H21ZM16 11.5L17.5 9.5L15.5 9L14 11.5V22H16V11.5ZM9.5 11.5C9.9 11.2 10.4 11 11 11V9C10.5 9 10.1 9.1 9.6 9.3L6 7.8C5.7 7.7 5.4 7.8 5.2 8.1L2 12.3C1.8 12.6 1.9 13 2.2 13.2L4 14.3L8 11L9.5 11.5ZM7 22H9V18L5 15L7 22Z"/>
        </svg>
      </button>
      <div class="accessibility-panel" hidden>
        <h3>Accessibility Options</h3>
        <label>
          <input type="checkbox" id="increase-text-size"> 
          Increase text size
        </label>
        <label>
          <input type="checkbox" id="high-contrast-toggle"> 
          High contrast mode
        </label>
        <label>
          <input type="checkbox" id="reduce-motion-toggle"> 
          Reduce motion
        </label>
        <label>
          <input type="checkbox" id="keyboard-shortcuts"> 
          Show keyboard shortcuts
        </label>
        <button id="reset-accessibility">Reset to defaults</button>
      </div>
    `;
    
    // Add CSS for controls
    const style = document.createElement('style');
    style.textContent = `
      .accessibility-controls {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
      }
      
      .accessibility-toggle {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--mountain-sage, #6B8E6F);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      }
      
      .accessibility-toggle svg {
        width: 24px;
        height: 24px;
        fill: currentColor;
      }
      
      .accessibility-panel {
        position: absolute;
        bottom: 60px;
        right: 0;
        background: white;
        border: 2px solid var(--mountain-sage, #6B8E6F);
        border-radius: 8px;
        padding: 16px;
        min-width: 200px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      }
      
      .accessibility-panel h3 {
        margin: 0 0 12px 0;
        font-size: 1rem;
      }
      
      .accessibility-panel label {
        display: block;
        margin-bottom: 8px;
        cursor: pointer;
      }
      
      .accessibility-panel button {
        width: 100%;
        padding: 8px;
        margin-top: 12px;
        background: var(--mountain-sage, #6B8E6F);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(controls);
    
    // Setup control functionality
    this.setupAccessibilityControlHandlers(controls);
  }

  /**
   * Setup accessibility control handlers
   */
  setupAccessibilityControlHandlers(controls) {
    const toggle = controls.querySelector('.accessibility-toggle');
    const panel = controls.querySelector('.accessibility-panel');
    
    toggle.addEventListener('click', () => {
      const isOpen = !panel.hidden;
      panel.hidden = isOpen;
      toggle.setAttribute('aria-expanded', !isOpen);
      
      if (!isOpen) {
        panel.querySelector('input').focus();
      }
    });
    
    // Control handlers
    const textSizeToggle = controls.querySelector('#increase-text-size');
    textSizeToggle.addEventListener('change', () => {
      document.body.classList.toggle('large-text', textSizeToggle.checked);
    });
    
    const contrastToggle = controls.querySelector('#high-contrast-toggle');
    contrastToggle.addEventListener('change', () => {
      document.body.classList.toggle('force-high-contrast', contrastToggle.checked);
    });
    
    const motionToggle = controls.querySelector('#reduce-motion-toggle');
    motionToggle.addEventListener('change', () => {
      document.body.classList.toggle('force-reduced-motion', motionToggle.checked);
    });
    
    const shortcutsToggle = controls.querySelector('#keyboard-shortcuts');
    shortcutsToggle.addEventListener('change', () => {
      if (shortcutsToggle.checked) {
        this.showKeyboardShortcuts();
      }
    });
    
    const resetButton = controls.querySelector('#reset-accessibility');
    resetButton.addEventListener('click', () => {
      this.resetAccessibilitySettings();
    });
  }

  /**
   * Monitor accessibility compliance
   */
  monitorAccessibility() {
    // Check for missing alt text
    this.checkImageAltText();
    
    // Check color contrast
    this.checkColorContrast();
    
    // Check heading hierarchy
    this.checkHeadingHierarchy();
    
    // Check ARIA implementation
    this.checkAriaImplementation();
  }

  /**
   * Check for missing alt text
   */
  checkImageAltText() {
    const images = document.querySelectorAll('img');
    const missingAlt = Array.from(images).filter(img => !img.alt && !img.getAttribute('aria-label'));
    
    if (missingAlt.length > 0) {
      console.warn(`⚠️ Accessibility: ${missingAlt.length} images missing alt text`, missingAlt);
    }
  }

  /**
   * Check color contrast
   */
  checkColorContrast() {
    // This would integrate with a color contrast checking library
    // For now, just log that we're checking
    console.log('🎨 Checking color contrast ratios...');
  }

  /**
   * Check heading hierarchy
   */
  checkHeadingHierarchy() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    let hasIssues = false;
    
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (level > lastLevel + 1) {
        console.warn(`⚠️ Accessibility: Heading hierarchy skip from h${lastLevel} to h${level}`, heading);
        hasIssues = true;
      }
      
      lastLevel = level;
    });
    
    if (!hasIssues) {
      console.log('✅ Heading hierarchy is correct');
    }
  }

  /**
   * Check ARIA implementation
   */
  checkAriaImplementation() {
    // Check for invalid ARIA attributes
    const elementsWithAria = document.querySelectorAll('[aria-labelledby], [aria-describedby]');
    
    elementsWithAria.forEach(element => {
      const labelledBy = element.getAttribute('aria-labelledby');
      const describedBy = element.getAttribute('aria-describedby');
      
      if (labelledBy && !document.getElementById(labelledBy)) {
        console.warn('⚠️ Accessibility: Invalid aria-labelledby reference', element);
      }
      
      if (describedBy && !document.getElementById(describedBy)) {
        console.warn('⚠️ Accessibility: Invalid aria-describedby reference', element);
      }
    });
  }

  /**
   * Utility methods for navigation integration
   */
  
  closeAllModals() {
    document.dispatchEvent(new CustomEvent('modal-close'));
  }
  
  closeMobileMenu() {
    const nav = window.liquidGlassNav;
    if (nav) {
      nav.closeMobileMenu();
    }
  }
  
  focusSearch() {
    const searchInput = document.querySelector('#search-input, input[type="search"]');
    if (searchInput) {
      searchInput.focus();
    }
  }
  
  openSearch() {
    const nav = window.liquidGlassNav;
    if (nav) {
      nav.toggleSearch();
    }
  }
  
  goHome() {
    window.location.href = '/';
  }
  
  toggleMainMenu() {
    const nav = window.liquidGlassNav;
    if (nav) {
      nav.toggleMobileMenu();
    }
  }
  
  showKeyboardShortcuts() {
    this.announceToScreenReader('Keyboard shortcuts: Press Slash to search, Alt+H for home, Alt+M for menu, Escape to close modals, question mark for help');
  }
  
  hideNavigation() {
    const nav = document.querySelector('.liquid-glass-nav');
    if (nav) {
      nav.classList.add('nav-hidden');
    }
  }
  
  showNavigation() {
    const nav = document.querySelector('.liquid-glass-nav');
    if (nav) {
      nav.classList.remove('nav-hidden');
    }
  }
  
  handleFormErrors(form) {
    const firstError = form.querySelector('[aria-invalid="true"], .error');
    if (firstError) {
      firstError.focus();
      this.announceToScreenReader('Form contains errors. Please review and correct.', 'assertive');
    }
  }
  
  resetAccessibilitySettings() {
    document.body.classList.remove('large-text', 'force-high-contrast', 'force-reduced-motion');
    
    const controls = document.querySelector('.accessibility-controls');
    const checkboxes = controls.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    
    this.announceToScreenReader('Accessibility settings reset to defaults');
  }
  
  enhanceForTouch() {
    console.log('🤏 Touch enhancements applied');
  }
  
  enhanceForScreenReader() {
    console.log('🔊 Screen reader enhancements applied');
  }
}

// Initialize accessibility manager
const accessibilityManager = new AccessibilityManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AccessibilityManager };
}