/**
 * ==========================================================================
 * MICRO-INTERACTIONS SYSTEM
 * Blue Ridge Bonsai Society - Enhanced User Experience
 * ==========================================================================
 */

/**
 * Micro-Interactions Manager
 * Handles all small, delightful interactions throughout the site
 */
class MicroInteractions {
  constructor() {
    this.observers = new Map();
    this.animationQueue = [];
    this.isAnimating = false;
    this.rafId = null;
    
    this.init();
  }
  
  /**
   * Initialize micro-interactions system
   */
  init() {
    this.setupHoverEffects();
    this.setupClickEffects();
    this.setupScrollEffects();
    this.setupFocusEffects();
    this.setupIntersectionObserver();
    this.setupParallax();
    this.setupMagneticButtons();
    this.setupTextAnimations();
    this.setupImageHovers();
    this.setupFormInteractions();
    
    console.log('✨ Micro-interactions system initialized');
  }
  
  /**
   * Setup hover effects for various elements
   */
  setupHoverEffects() {
    // Card hover effects
    document.querySelectorAll('.glass-card, [data-hover="card"]').forEach(card => {
      this.addCardHover(card);
    });
    
    // Button hover effects
    document.querySelectorAll('.btn-atmospheric, [data-hover="button"]').forEach(button => {
      this.addButtonHover(button);
    });
    
    // Link hover effects
    document.querySelectorAll('a:not(.btn-atmospheric), [data-hover="link"]').forEach(link => {
      this.addLinkHover(link);
    });
    
    // Image hover effects
    document.querySelectorAll('img, [data-hover="image"]').forEach(image => {
      this.addImageHover(image);
    });
  }
  
  /**
   * Add sophisticated card hover effects
   */
  addCardHover(card) {
    let isHovering = false;
    let mouseX = 0;
    let mouseY = 0;
    
    card.addEventListener('mouseenter', (e) => {
      isHovering = true;
      card.classList.add('card-hovering');
      
      // Add glow effect
      card.style.setProperty('--glow-opacity', '1');
      
      // Create floating particles
      this.createFloatingParticles(card);
    });
    
    card.addEventListener('mouseleave', (e) => {
      isHovering = false;
      card.classList.remove('card-hovering');
      
      // Reset transforms
      card.style.transform = '';
      card.style.setProperty('--glow-opacity', '0');
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
      
      // Remove particles
      this.removeFloatingParticles(card);
    });
    
    card.addEventListener('mousemove', (e) => {
      if (!isHovering) return;
      
      const rect = card.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (mouseY - centerY) / 20;
      const rotateY = (centerX - mouseX) / 20;
      
      // Apply 3D transform
      card.style.transform = `
        perspective(1000px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg) 
        translateZ(10px)
      `;
      
      // Update CSS custom properties for spotlight effect
      card.style.setProperty('--mouse-x', `${(mouseX / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(mouseY / rect.height) * 100}%`);
    });
  }
  
  /**
   * Add advanced button hover effects
   */
  addButtonHover(button) {
    button.addEventListener('mouseenter', (e) => {
      button.classList.add('btn-hovering');
      
      // Create ripple effect on hover
      this.createHoverRipple(button, e);
      
      // Add magnetic effect
      this.addMagneticEffect(button);
    });
    
    button.addEventListener('mouseleave', (e) => {
      button.classList.remove('btn-hovering');
      
      // Reset magnetic effect
      button.style.transform = '';
    });
    
    button.addEventListener('mousemove', (e) => {
      this.updateMagneticEffect(button, e);
    });
  }
  
  /**
   * Create magnetic effect for buttons
   */
  addMagneticEffect(button) {
    button.dataset.magnetic = 'true';
  }
  
  updateMagneticEffect(button, e) {
    if (button.dataset.magnetic !== 'true') return;
    
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * 0.1;
    const deltaY = (e.clientY - centerY) * 0.1;
    
    button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  }
  
  /**
   * Add sophisticated link hover effects
   */
  addLinkHover(link) {
    // Create underline animation
    if (!link.querySelector('.link-underline')) {
      const underline = document.createElement('span');
      underline.className = 'link-underline';
      underline.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background: var(--mountain-sage);
        transition: width var(--duration-300) var(--ease-out);
      `;
      
      link.style.position = 'relative';
      link.appendChild(underline);
    }
    
    link.addEventListener('mouseenter', () => {
      const underline = link.querySelector('.link-underline');
      if (underline) {
        underline.style.width = '100%';
      }
      
      // Add text shimmer effect
      this.addTextShimmer(link);
    });
    
    link.addEventListener('mouseleave', () => {
      const underline = link.querySelector('.link-underline');
      if (underline) {
        underline.style.width = '0';
      }
      
      // Remove text shimmer
      link.classList.remove('text-shimmer');
    });
  }
  
  /**
   * Add image hover effects
   */
  addImageHover(image) {
    image.addEventListener('mouseenter', () => {
      image.style.transform = 'scale(1.05)';
      image.style.filter = 'brightness(1.1) saturate(1.2)';
      image.style.transition = 'all var(--duration-300) var(--ease-out)';
    });
    
    image.addEventListener('mouseleave', () => {
      image.style.transform = 'scale(1)';
      image.style.filter = 'brightness(1) saturate(1)';
    });
  }
  
  /**
   * Setup click effects
   */
  setupClickEffects() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('button, .btn-atmospheric, [data-click="ripple"]');
      if (target) {
        this.createClickRipple(target, e);
      }
      
      // Add screen flash effect for important actions
      if (target && target.dataset.important === 'true') {
        this.createScreenFlash();
      }
    });
  }
  
  /**
   * Create click ripple effect
   */
  createClickRipple(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 50%;
      transform: scale(0);
      animation: clickRipple 0.6s ease-out;
      pointer-events: none;
      z-index: 1000;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }
  
  /**
   * Create hover ripple effect
   */
  createHoverRipple(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      border-radius: 50%;
      transform: scale(0);
      animation: hoverRipple 1s ease-out;
      pointer-events: none;
      z-index: 1;
    `;
    
    element.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 1000);
  }
  
  /**
   * Setup scroll effects
   */
  setupScrollEffects() {
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleScrollEffects(lastScrollY);
          lastScrollY = window.scrollY;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
  
  /**
   * Handle scroll-based effects
   */
  handleScrollEffects(lastScrollY) {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;
    
    // Update parallax elements
    document.querySelectorAll('[data-parallax]').forEach(element => {
      const speed = parseFloat(element.dataset.parallax) || 0.5;
      const yPos = -(currentScrollY * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
    
    // Update scroll progress indicators
    this.updateScrollProgress();
    
    // Trigger scroll-based animations
    this.triggerScrollAnimations();
  }
  
  /**
   * Update scroll progress indicators
   */
  updateScrollProgress() {
    const progressBars = document.querySelectorAll('[data-scroll-progress]');
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (window.scrollY / scrollHeight) * 100;
    
    progressBars.forEach(bar => {
      bar.style.width = `${scrollPercentage}%`;
    });
  }
  
  /**
   * Setup focus effects
   */
  setupFocusEffects() {
    document.addEventListener('focusin', (e) => {
      this.addFocusGlow(e.target);
    });
    
    document.addEventListener('focusout', (e) => {
      this.removeFocusGlow(e.target);
    });
  }
  
  /**
   * Add focus glow effect
   */
  addFocusGlow(element) {
    element.classList.add('focus-glow');
    
    // Create focus ring
    if (!element.querySelector('.focus-ring')) {
      const ring = document.createElement('span');
      ring.className = 'focus-ring';
      ring.style.cssText = `
        position: absolute;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: -4px;
        border: 2px solid var(--mountain-sage);
        border-radius: inherit;
        opacity: 0;
        animation: focusRing 0.3s ease-out forwards;
        pointer-events: none;
        z-index: 1;
      `;
      
      element.style.position = 'relative';
      element.appendChild(ring);
    }
  }
  
  /**
   * Remove focus glow effect
   */
  removeFocusGlow(element) {
    element.classList.remove('focus-glow');
    
    const ring = element.querySelector('.focus-ring');
    if (ring) {
      ring.style.animation = 'focusRingOut 0.2s ease-out forwards';
      setTimeout(() => {
        if (ring.parentNode) {
          ring.parentNode.removeChild(ring);
        }
      }, 200);
    }
  }
  
  /**
   * Setup intersection observer for scroll animations
   */
  setupIntersectionObserver() {
    this.scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.triggerEntranceAnimation(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '-50px 0px'
      }
    );
    
    // Observe elements with scroll animations
    document.querySelectorAll('[data-animate-on-scroll]').forEach(element => {
      this.scrollObserver.observe(element);
    });
  }
  
  /**
   * Trigger entrance animations
   */
  triggerEntranceAnimation(element) {
    const animationType = element.dataset.animateOnScroll || 'fadeInUp';
    element.classList.add(`animate-${animationType}`);
    
    // Add stagger delay for multiple elements
    const siblings = element.parentNode.querySelectorAll('[data-animate-on-scroll]');
    const index = Array.from(siblings).indexOf(element);
    element.style.animationDelay = `${index * 100}ms`;
  }
  
  /**
   * Setup parallax effects
   */
  setupParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    const handleParallax = () => {
      const scrollY = window.scrollY;
      
      parallaxElements.forEach(element => {
        const speed = parseFloat(element.dataset.parallax) || 0.5;
        const yPos = -(scrollY * speed);
        
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    };
    
    window.addEventListener('scroll', () => {
      requestAnimationFrame(handleParallax);
    }, { passive: true });
  }
  
  /**
   * Setup magnetic buttons
   */
  setupMagneticButtons() {
    document.querySelectorAll('[data-magnetic]').forEach(button => {
      this.addMagneticEffect(button);
    });
  }
  
  /**
   * Setup text animations
   */
  setupTextAnimations() {
    // Typewriter effect
    document.querySelectorAll('[data-typewriter]').forEach(element => {
      this.addTypewriterEffect(element);
    });
    
    // Text reveal animation
    document.querySelectorAll('[data-text-reveal]').forEach(element => {
      this.addTextRevealEffect(element);
    });
  }
  
  /**
   * Add typewriter effect
   */
  addTypewriterEffect(element) {
    const text = element.textContent;
    const speed = parseInt(element.dataset.typewriterSpeed) || 100;
    
    element.textContent = '';
    
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, speed);
  }
  
  /**
   * Add text reveal effect
   */
  addTextRevealEffect(element) {
    const text = element.textContent;
    const words = text.split(' ');
    
    element.innerHTML = words.map(word => 
      `<span class="word-reveal" style="opacity: 0; transform: translateY(20px);">${word}</span>`
    ).join(' ');
    
    const wordElements = element.querySelectorAll('.word-reveal');
    
    this.scrollObserver.observe(element);
    
    element.addEventListener('intersect', () => {
      wordElements.forEach((word, index) => {
        setTimeout(() => {
          word.style.opacity = '1';
          word.style.transform = 'translateY(0)';
          word.style.transition = 'all 0.5s ease-out';
        }, index * 100);
      });
    });
  }
  
  /**
   * Setup image hover effects
   */
  setupImageHovers() {
    document.querySelectorAll('[data-image-effect]').forEach(image => {
      const effect = image.dataset.imageEffect;
      
      switch (effect) {
        case 'zoom':
          this.addImageZoom(image);
          break;
        case 'tilt':
          this.addImageTilt(image);
          break;
        case 'reveal':
          this.addImageReveal(image);
          break;
      }
    });
  }
  
  /**
   * Add image zoom effect
   */
  addImageZoom(image) {
    image.addEventListener('mouseenter', () => {
      image.style.transform = 'scale(1.1)';
      image.style.transition = 'transform 0.5s ease-out';
    });
    
    image.addEventListener('mouseleave', () => {
      image.style.transform = 'scale(1)';
    });
  }
  
  /**
   * Add image tilt effect
   */
  addImageTilt(image) {
    image.addEventListener('mousemove', (e) => {
      const rect = image.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const rotateX = (e.clientY - centerY) / 10;
      const rotateY = (e.clientX - centerX) / 10;
      
      image.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    image.addEventListener('mouseleave', () => {
      image.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  }
  
  /**
   * Setup form interactions
   */
  setupFormInteractions() {
    // Floating labels
    document.querySelectorAll('.input-atmospheric').forEach(input => {
      this.addFloatingLabel(input);
    });
    
    // Form validation feedback
    document.querySelectorAll('form').forEach(form => {
      this.addFormValidation(form);
    });
  }
  
  /**
   * Add floating label effect
   */
  addFloatingLabel(input) {
    const label = input.parentNode.querySelector('label');
    if (!label) return;
    
    input.addEventListener('focus', () => {
      label.classList.add('label-floating');
    });
    
    input.addEventListener('blur', () => {
      if (!input.value) {
        label.classList.remove('label-floating');
      }
    });
    
    // Check initial state
    if (input.value) {
      label.classList.add('label-floating');
    }
  }
  
  /**
   * Helper methods
   */
  
  createFloatingParticles(element) {
    if (element.querySelector('.floating-particles')) return;
    
    const container = document.createElement('div');
    container.className = 'floating-particles';
    container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      overflow: hidden;
    `;
    
    for (let i = 0; i < 3; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: var(--mountain-sage);
        border-radius: 50%;
        opacity: 0.6;
        animation: floatParticle 3s infinite linear;
        animation-delay: ${i * 0.5}s;
      `;
      
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      container.appendChild(particle);
    }
    
    element.appendChild(container);
  }
  
  removeFloatingParticles(element) {
    const particles = element.querySelector('.floating-particles');
    if (particles) {
      particles.remove();
    }
  }
  
  addTextShimmer(element) {
    element.classList.add('text-shimmer');
  }
  
  createScreenFlash() {
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.8);
      pointer-events: none;
      z-index: 10000;
      animation: screenFlash 0.3s ease-out;
    `;
    
    document.body.appendChild(flash);
    
    setTimeout(() => {
      if (flash.parentNode) {
        flash.parentNode.removeChild(flash);
      }
    }, 300);
  }
  
  triggerScrollAnimations() {
    // Custom scroll-based animations can be added here
  }
  
  addFormValidation(form) {
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateInput(input);
      });
      
      input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) {
          this.validateInput(input);
        }
      });
    });
  }
  
  validateInput(input) {
    const isValid = input.checkValidity();
    
    input.classList.toggle('valid', isValid);
    input.classList.toggle('invalid', !isValid);
    
    // Add validation animation
    if (!isValid) {
      input.style.animation = 'shake 0.5s ease-in-out';
      setTimeout(() => {
        input.style.animation = '';
      }, 500);
    }
  }
}

// CSS animations for micro-interactions
const microInteractionStyles = document.createElement('style');
microInteractionStyles.textContent = `
  @keyframes clickRipple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  @keyframes hoverRipple {
    to {
      transform: scale(1);
      opacity: 0;
    }
  }
  
  @keyframes focusRing {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes focusRingOut {
    to {
      opacity: 0;
      transform: scale(1.05);
    }
  }
  
  @keyframes floatParticle {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 0.6;
    }
    90% {
      opacity: 0.6;
    }
    100% {
      transform: translateY(-50px) rotate(360deg);
      opacity: 0;
    }
  }
  
  @keyframes screenFlash {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  .text-shimmer {
    background: linear-gradient(90deg, 
      var(--stone-gray), 
      var(--mountain-sage), 
      var(--stone-gray)
    );
    background-size: 200% 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 1.5s ease-in-out;
  }
  
  .card-hovering {
    position: relative;
    z-index: 10;
  }
  
  .card-hovering::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: radial-gradient(
      circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(107, 142, 111, 0.3) 0%,
      transparent 50%
    );
    border-radius: inherit;
    opacity: var(--glow-opacity, 0);
    transition: opacity 0.3s ease;
    z-index: -1;
  }
  
  .btn-hovering {
    transform: translateY(-2px);
  }
  
  .focus-glow {
    box-shadow: 0 0 20px rgba(107, 142, 111, 0.3);
  }
  
  .label-floating {
    transform: translateY(-20px) scale(0.8);
    color: var(--mountain-sage);
  }
  
  .input-atmospheric + label {
    transition: all 0.3s ease;
    transform-origin: left center;
  }
  
  .valid {
    border-color: var(--success-green) !important;
  }
  
  .invalid {
    border-color: var(--error-red) !important;
  }
`;

document.head.appendChild(microInteractionStyles);

// Initialize micro-interactions when DOM is ready
const microInteractions = new MicroInteractions();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MicroInteractions };
}

// Expose globally for Wix integration
window.MicroInteractions = MicroInteractions;