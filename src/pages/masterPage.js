// @ts-nocheck
// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
import wixWindow from 'wix-window-frontend';
import wixLocation from 'wix-location-frontend';
import { initAnalytics, trackPageView } from 'public/js/analytics-tracking.js';

$w.onReady(function () {
  // This function runs on every page of your site.
  console.log("Master page script loaded.");

  // Initialize Analytics
  initAnalytics();
  trackPageView(wixLocation.path.join('/'));

  // Ensure the custom element for styles is present
  ensureCustomElement();

  // Add global elements like a dynamic footer link
  addGlobalFooterElements();
});

/**
 * Ensures the brbs-styles custom element is on the page.
 */
function ensureCustomElement() {
    if (wixWindow.rendering.renderCycle === 1) {
        const customElement = $w("CustomElement").find(el => el.tagName.toLowerCase() === 'brbs-styles');
        if (!customElement) {
            console.log("Programmatically adding <brbs-styles> element.");
            const element = $w.createElement('CustomElement');
            element.tagName = 'brbs-styles';
            const container = $w('#SITE_HEADER');
            if(container) {
                container.children = [...(container.children || []), element];
            } else {
                console.error("Could not find a container to add the brbs-styles element.")
            }
        }
    }
}

/**
 * Adds dynamically created global elements to the site, like footer links.
 */
function addGlobalFooterElements() {
    const footer = $w('#SITE_FOOTER');
    if (footer) {
        // Check if the link already exists to prevent duplicates on navigation
        if (!$w('#googleGroupLink').html) {
            const googleGroupLink = $w.createElement('Text');
            googleGroupLink.id = 'googleGroupLink';
            googleGroupLink.html = `
                <div style="text-align: center; padding: 10px; background-color: #f1f1f1; margin-top: 20px;">
                    <a href="https://groups.google.com/g/brbs-members" target="_blank" rel="noopener noreferrer">
                        Join our Members-Only Google Group for Discussions
                    </a>
                </div>
            `;
            footer.children = [...(footer.children || []), googleGroupLink];
        }
    } else {
        console.warn("Could not find site footer to add global links.");
    }
}
