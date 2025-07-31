// @ts-nocheck
// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
import wixWindow from 'wix-window-frontend';

$w.onReady(function () {
  // This function runs on every page of your site.
  // We use a custom element to load styles and handle dynamic functionality.
  console.log("Master page script loaded.");

  // To activate the custom element, it must be added to the page.
  // The recommended way is to add a "Custom Element" from the "Embed & Social"
  // panel in the Wix Editor onto the header or footer of the site, and set its
  // tag name to "brbs-styles".

  // The following code is a programmatic fallback to ensure the element is added
  // if it's not present in the editor.
  if (wixWindow.rendering.renderCycle === 1) {
    const customElement = $w("CustomElement").find(el => el.tagName.toLowerCase() === 'brbs-styles');
    if (!customElement) {
      console.log("Programmatically adding <brbs-styles> element.");
      const element = $w.createElement('CustomElement');
      element.tagName = 'brbs-styles';
      const container = $w('#SITE_HEADER'); // Or another suitable container
      if(container) {
          container.children = [...(container.children || []), element];
      } else {
          console.error("Could not find a container to add the brbs-styles element.")
      }
    }
  }
});
