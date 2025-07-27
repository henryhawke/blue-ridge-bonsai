/**
 * ==========================================================================
 * INTERACTIVE COMPONENTS LIBRARY
 * Blue Ridge Bonsai Society - Advanced UI Component System
 * ==========================================================================
 */

/**
 * AtmosphericCard Component
 * Enhanced card component with glassmorphism and interactive effects
 */
class AtmosphericCard {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      variant: 'default',
      hoverable: true,
      clickable: false,
      parallax: false,
      glow: false,
      ...options
    };
    
    this.init();
  }
  
  init() {
    this.setupCard();
    this.bindEvents();
    this.setupParallax();
    
    if (this.options.glow) {
      this.setupGlow();
    }
  }
  
  setupCard() {
    this.element.classList.add('glass-card');
    
    if (this.options.variant !== 'default') {
      this.element.classList.add(`glass-card--${this.options.variant}`);
    }
    
    if (this.options.clickable) {
      this.element.style.cursor = 'pointer';
      this.element.setAttribute('tabindex', '0');
      this.element.setAttribute('role', 'button');
    }
  }
  
  bindEvents() {
    if (this.options.hoverable) {
      this.element.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
      this.element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
      this.element.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }
    
    if (this.options.clickable) {
      this.element.addEventListener('click', this.handleClick.bind(this));
      this.element.addEventListener('keydown', this.handleKeydown.bind(this));
    }
  }
  
  setupParallax() {
    if (!this.options.parallax) return;
    
    this.element.addEventListener('mousemove', (e) => {
      const rect = this.element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      this.element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    });
    
    this.element.addEventListener('mouseleave', () => {
      this.element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
  }
  
  setupGlow() {
    this.element.classList.add('animate-glow');
  }
  
  handleMouseEnter(e) {
    this.element.classList.add('card-hover');
  }
  
  handleMouseLeave(e) {
    this.element.classList.remove('card-hover');
  }
  
  handleMouseMove(e) {
    if (!this.options.hoverable) return;
    
    const rect = this.element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create spotlight effect
    this.element.style.setProperty('--mouse-x', `${x}px`);
    this.element.style.setProperty('--mouse-y', `${y}px`);
  }
  
  handleClick(e) {
    this.createRipple(e);
    this.element.dispatchEvent(new CustomEvent('cardClick', { detail: this.options }));
  }
  
  handleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      this.handleClick(e);
    }
  }
  
  createRipple(e) {
    const ripple = document.createElement('span');
    const rect = this.element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
      z-index: 10;
    `;
    
    this.element.style.position = 'relative';
    this.element.style.overflow = 'hidden';
    this.element.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }
}

/**
 * AtmosphericButton Component
 * Enhanced button with atmospheric effects and interactions
 */
class AtmosphericButton {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      variant: 'default',
      size: 'md',
      icon: null,
      loading: false,
      disabled: false,
      ...options
    };
    
    this.init();
  }
  
  init() {
    this.setupButton();
    this.bindEvents();
  }
  
  setupButton() {
    this.element.classList.add('btn-atmospheric');
    
    if (this.options.variant !== 'default') {
      this.element.classList.add(`btn-atmospheric--${this.options.variant}`);
    }
    
    if (this.options.size !== 'md') {
      this.element.classList.add(`btn-atmospheric--${this.options.size}`);
    }
    
    if (this.options.icon) {
      this.addIcon();
    }
    
    this.setLoading(this.options.loading);
    this.setDisabled(this.options.disabled);
  }
  
  bindEvents() {
    this.element.addEventListener('click', this.handleClick.bind(this));
    this.element.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    this.element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
  }
  
  addIcon() {
    const iconElement = document.createElement('span');
    iconElement.className = 'btn-icon';
    iconElement.innerHTML = this.options.icon;
    
    if (this.element.firstChild) {
      this.element.insertBefore(iconElement, this.element.firstChild);
    } else {
      this.element.appendChild(iconElement);
    }
  }
  
  handleClick(e) {
    if (this.options.disabled || this.options.loading) {
      e.preventDefault();
      return false;
    }
    
    this.createRipple(e);
    this.element.dispatchEvent(new CustomEvent('buttonClick', { detail: this.options }));
  }
  
  handleMouseEnter() {
    if (!this.options.disabled) {
      this.element.classList.add('btn-hover');
    }
  }
  
  handleMouseLeave() {
    this.element.classList.remove('btn-hover');
  }
  
  createRipple(e) {
    const ripple = document.createElement('span');
    const rect = this.element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
      z-index: 1;
    `;
    
    this.element.style.position = 'relative';
    this.element.style.overflow = 'hidden';
    this.element.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }
  
  setLoading(loading) {
    this.options.loading = loading;
    
    if (loading) {
      this.element.classList.add('btn-loading');
      this.element.disabled = true;
      
      if (!this.element.querySelector('.loading-spinner')) {
        const spinner = document.createElement('span');
        spinner.className = 'loading-spinner spinner-atmospheric';
        this.element.insertBefore(spinner, this.element.firstChild);
      }
    } else {
      this.element.classList.remove('btn-loading');
      this.element.disabled = this.options.disabled;
      
      const spinner = this.element.querySelector('.loading-spinner');
      if (spinner) {
        spinner.remove();
      }
    }
  }
  
  setDisabled(disabled) {
    this.options.disabled = disabled;
    this.element.disabled = disabled;
    this.element.classList.toggle('btn-disabled', disabled);
  }
}

/**
 * AtmosphericModal Component
 * Enhanced modal with glassmorphism and smooth animations
 */
class AtmosphericModal {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      closeOnBackdrop: true,
      closeOnEscape: true,
      showCloseButton: true,
      size: 'md',
      animation: 'fade',
      ...options
    };
    
    this.isOpen = false;
    this.focusedElementBeforeModal = null;
    
    this.init();
  }
  
  init() {
    this.setupModal();
    this.bindEvents();
  }
  
  setupModal() {
    this.element.classList.add('modal-atmospheric');
    
    if (!this.element.querySelector('.modal-backdrop')) {
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop';
      this.element.insertBefore(backdrop, this.element.firstChild);
    }
    
    const content = this.element.querySelector('.modal-content');
    if (content && this.options.size !== 'md') {
      content.classList.add(`modal-content--${this.options.size}`);
    }
    
    if (this.options.showCloseButton && !this.element.querySelector('.modal-close')) {
      this.addCloseButton();
    }
  }
  
  bindEvents() {
    if (this.options.closeOnBackdrop) {
      this.element.querySelector('.modal-backdrop').addEventListener('click', () => {
        this.close();
      });
    }
    
    if (this.options.closeOnEscape) {
      document.addEventListener('keydown', this.handleKeydown.bind(this));
    }
    
    const closeButton = this.element.querySelector('.modal-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.close());
    }
  }
  
  addCloseButton() {
    const closeButton = document.createElement('button');
    closeButton.className = 'modal-close btn-atmospheric btn-atmospheric--ghost';
    closeButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
    closeButton.setAttribute('aria-label', 'Close modal');
    
    const header = this.element.querySelector('.modal-header');
    if (header) {
      header.appendChild(closeButton);
    } else {
      const content = this.element.querySelector('.modal-content');
      if (content) {
        content.insertBefore(closeButton, content.firstChild);
      }
    }
  }
  
  open() {
    if (this.isOpen) return;
    
    this.focusedElementBeforeModal = document.activeElement;
    
    document.body.style.overflow = 'hidden';
    this.element.style.display = 'flex';
    this.element.classList.add('active');
    
    // Focus management
    setTimeout(() => {
      const focusableElement = this.element.querySelector('input, button, [tabindex]:not([tabindex="-1"])');
      if (focusableElement) {
        focusableElement.focus();
      }
    }, 100);
    
    this.isOpen = true;
    this.element.dispatchEvent(new CustomEvent('modalOpen'));
  }
  
  close() {
    if (!this.isOpen) return;
    
    this.element.classList.remove('active');
    
    setTimeout(() => {
      this.element.style.display = 'none';
      document.body.style.overflow = '';
      
      if (this.focusedElementBeforeModal) {
        this.focusedElementBeforeModal.focus();
      }
    }, 300);
    
    this.isOpen = false;
    this.element.dispatchEvent(new CustomEvent('modalClose'));
  }
  
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
  
  handleKeydown(e) {
    if (e.key === 'Escape' && this.isOpen) {
      this.close();
    }
    
    if (e.key === 'Tab' && this.isOpen) {
      this.trapFocus(e);
    }
  }
  
  trapFocus(e) {
    const focusableElements = this.element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (!e.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
    
    if (e.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    }
  }
}

/**
 * AtmosphericNotification Component
 * Toast notifications with atmospheric styling
 */
class AtmosphericNotification {
  constructor(options = {}) {
    this.options = {
      title: '',
      message: '',
      type: 'info',
      duration: 5000,
      position: 'top-right',
      closable: true,
      ...options
    };
    
    this.element = null;
    this.timeout = null;
    
    this.create();
  }
  
  create() {
    this.element = document.createElement('div');
    this.element.className = `notification-atmospheric notification-${this.options.type}`;
    
    const content = this.createContent();
    this.element.appendChild(content);
    
    if (this.options.closable) {
      const closeButton = this.createCloseButton();
      this.element.appendChild(closeButton);
    }
    
    this.position();
    this.bindEvents();
  }
  
  createContent() {
    const content = document.createElement('div');
    content.className = 'notification-content';
    
    if (this.options.title) {
      const title = document.createElement('div');
      title.className = 'notification-title';
      title.textContent = this.options.title;
      content.appendChild(title);
    }
    
    if (this.options.message) {
      const message = document.createElement('div');
      message.className = 'notification-message';
      message.textContent = this.options.message;
      content.appendChild(message);
    }
    
    return content;
  }
  
  createCloseButton() {
    const button = document.createElement('button');
    button.className = 'notification-close';
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
    button.setAttribute('aria-label', 'Close notification');
    
    return button;
  }
  
  position() {
    const positions = {
      'top-right': { top: '1rem', right: '1rem' },
      'top-left': { top: '1rem', left: '1rem' },
      'bottom-right': { bottom: '1rem', right: '1rem' },
      'bottom-left': { bottom: '1rem', left: '1rem' },
      'top-center': { top: '1rem', left: '50%', transform: 'translateX(-50%)' },
      'bottom-center': { bottom: '1rem', left: '50%', transform: 'translateX(-50%)' }
    };
    
    const position = positions[this.options.position] || positions['top-right'];
    
    Object.assign(this.element.style, {
      position: 'fixed',
      zIndex: '10000',
      ...position
    });
  }
  
  bindEvents() {
    const closeButton = this.element.querySelector('.notification-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.close());
    }
    
    this.element.addEventListener('mouseenter', () => this.clearTimeout());
    this.element.addEventListener('mouseleave', () => this.startTimeout());
  }
  
  show() {
    document.body.appendChild(this.element);
    
    // Force reflow
    this.element.offsetHeight;
    
    this.element.classList.add('show');
    
    if (this.options.duration > 0) {
      this.startTimeout();
    }
    
    return this;
  }
  
  close() {
    this.clearTimeout();
    this.element.classList.remove('show');
    
    setTimeout(() => {
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
    }, 300);
  }
  
  startTimeout() {
    this.clearTimeout();
    if (this.options.duration > 0) {
      this.timeout = setTimeout(() => this.close(), this.options.duration);
    }
  }
  
  clearTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
  
  static show(options) {
    return new AtmosphericNotification(options).show();
  }
}

/**
 * AtmosphericProgress Component
 * Progress bars with atmospheric styling
 */
class AtmosphericProgress {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      value: 0,
      max: 100,
      animated: true,
      striped: false,
      color: 'mountain-sage',
      ...options
    };
    
    this.init();
  }
  
  init() {
    this.setupProgress();
    this.setValue(this.options.value);
  }
  
  setupProgress() {
    this.element.classList.add('progress-atmospheric');
    
    if (!this.element.querySelector('.progress-bar')) {
      const bar = document.createElement('div');
      bar.className = 'progress-bar';
      this.element.appendChild(bar);
    }
    
    const bar = this.element.querySelector('.progress-bar');
    
    if (this.options.color !== 'mountain-sage') {
      bar.style.background = `var(--${this.options.color})`;
    }
    
    if (this.options.striped) {
      bar.classList.add('progress-striped');
    }
    
    if (this.options.animated) {
      bar.classList.add('progress-animated');
    }
  }
  
  setValue(value) {
    this.options.value = Math.max(0, Math.min(value, this.options.max));
    const percentage = (this.options.value / this.options.max) * 100;
    
    const bar = this.element.querySelector('.progress-bar');
    bar.style.width = `${percentage}%`;
    
    this.element.setAttribute('aria-valuenow', this.options.value);
    this.element.setAttribute('aria-valuemax', this.options.max);
  }
  
  increment(amount = 1) {
    this.setValue(this.options.value + amount);
  }
  
  decrement(amount = 1) {
    this.setValue(this.options.value - amount);
  }
  
  reset() {
    this.setValue(0);
  }
  
  complete() {
    this.setValue(this.options.max);
  }
}

/**
 * Component Initialization and Auto-binding
 */
class ComponentManager {
  constructor() {
    this.components = new Map();
    this.observers = new Map();
  }
  
  init() {
    this.initializeComponents();
    this.setupMutationObserver();
    
    console.log('🧩 Interactive Components Library initialized');
  }
  
  initializeComponents() {
    // Auto-initialize cards
    document.querySelectorAll('[data-component="card"]').forEach(element => {
      const options = this.parseOptions(element.dataset);
      this.components.set(element, new AtmosphericCard(element, options));
    });
    
    // Auto-initialize buttons
    document.querySelectorAll('[data-component="button"]').forEach(element => {
      const options = this.parseOptions(element.dataset);
      this.components.set(element, new AtmosphericButton(element, options));
    });
    
    // Auto-initialize modals
    document.querySelectorAll('[data-component="modal"]').forEach(element => {
      const options = this.parseOptions(element.dataset);
      this.components.set(element, new AtmosphericModal(element, options));
    });
    
    // Auto-initialize progress bars
    document.querySelectorAll('[data-component="progress"]').forEach(element => {
      const options = this.parseOptions(element.dataset);
      this.components.set(element, new AtmosphericProgress(element, options));
    });
  }
  
  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.initializeNewComponents(node);
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  initializeNewComponents(element) {
    const components = element.querySelectorAll('[data-component]');
    components.forEach(el => {
      if (!this.components.has(el)) {
        const componentType = el.dataset.component;
        const options = this.parseOptions(el.dataset);
        
        switch (componentType) {
          case 'card':
            this.components.set(el, new AtmosphericCard(el, options));
            break;
          case 'button':
            this.components.set(el, new AtmosphericButton(el, options));
            break;
          case 'modal':
            this.components.set(el, new AtmosphericModal(el, options));
            break;
          case 'progress':
            this.components.set(el, new AtmosphericProgress(el, options));
            break;
        }
      }
    });
  }
  
  parseOptions(dataset) {
    const options = {};
    
    Object.keys(dataset).forEach(key => {
      if (key !== 'component') {
        let value = dataset[key];
        
        // Try to parse as JSON
        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        else if (!isNaN(value) && !isNaN(parseFloat(value))) value = parseFloat(value);
        
        options[key] = value;
      }
    });
    
    return options;
  }
  
  getComponent(element) {
    return this.components.get(element);
  }
  
  destroyComponent(element) {
    const component = this.components.get(element);
    if (component && typeof component.destroy === 'function') {
      component.destroy();
    }
    this.components.delete(element);
  }
}

// Global notification helper
window.notify = function(message, type = 'info', options = {}) {
  return AtmosphericNotification.show({
    message,
    type,
    ...options
  });
};

// Ripple animation keyframes
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .card-hover {
    transform: translateY(-4px);
  }
  
  .btn-hover::after {
    width: 300px;
    height: 300px;
  }
  
  .progress-striped .progress-bar {
    background-image: linear-gradient(45deg, 
      rgba(255, 255, 255, 0.15) 25%, 
      transparent 25%, 
      transparent 50%, 
      rgba(255, 255, 255, 0.15) 50%, 
      rgba(255, 255, 255, 0.15) 75%, 
      transparent 75%, 
      transparent
    );
    background-size: 1rem 1rem;
  }
  
  .progress-animated .progress-bar {
    animation: progress-stripes 1s linear infinite;
  }
  
  @keyframes progress-stripes {
    0% { background-position: 1rem 0; }
    100% { background-position: 0 0; }
  }
`;
document.head.appendChild(rippleStyles);

// Initialize component manager
const componentManager = new ComponentManager();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    componentManager.init();
  });
} else {
  componentManager.init();
}

// Export components for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AtmosphericCard,
    AtmosphericButton,
    AtmosphericModal,
    AtmosphericNotification,
    AtmosphericProgress,
    ComponentManager
  };
}

// Expose globally for Wix integration
window.AtmosphericComponents = {
  Card: AtmosphericCard,
  Button: AtmosphericButton,
  Modal: AtmosphericModal,
  Notification: AtmosphericNotification,
  Progress: AtmosphericProgress,
  Manager: componentManager
};