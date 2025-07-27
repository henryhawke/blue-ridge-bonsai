// Script cache to store loaded promises and prevent duplicate loads
const scriptCache = new Map();

/**
 * Utility function to load scripts dynamically without Webpack chunking
 * Returns a cached Promise, injects <script> tag, resolves on onload, rejects on onerror
 * Remediation for Wix CLI Webpack 5 bundling issues
 * 
 * @param {string} src - The URL of the script to load
 * @param {Object} options - Configuration options
 * @param {string} options.type - Script type (default: 'text/javascript')
 * @param {HTMLElement} options.target - Target element to append script (default: document.head)
 * @param {number} options.timeout - Optional timeout in milliseconds
 * @returns {Promise} Promise that resolves when script loads successfully
 */
export function loadScript(src, options = {}) {
    // Return cached promise if script is already being loaded or loaded
    if (scriptCache.has(src)) {
        return scriptCache.get(src);
    }
    
    // Create new promise for loading this script
    const loadPromise = new Promise((resolve, reject) => {
        // Check if script element already exists in DOM
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
            console.log(`✅ Script already loaded: ${src}`);
            resolve({ alreadyLoaded: true, script: existingScript });
            return;
        }
        
        // Create new script element
        const script = document.createElement('script');
        script.src = src;
        script.type = options.type || 'text/javascript';
        
        // Handle script load success
        script.onload = () => {
            console.log(`✅ Script loaded successfully: ${src}`);
            resolve({ script, loaded: true });
        };
        
        // Handle script load error
        script.onerror = () => {
            console.error(`❌ Failed to load script: ${src}`);
            // Remove failed promise from cache so it can be retried
            scriptCache.delete(src);
            reject(new Error(`Failed to load script: ${src}`));
        };
        
        // Add script to document
        (options.target || document.head).appendChild(script);
        
        // Optional timeout handling
        if (options.timeout) {
            setTimeout(() => {
                console.error(`❌ Script load timeout: ${src}`);
                // Remove timed out promise from cache so it can be retried
                scriptCache.delete(src);
                reject(new Error(`Script load timeout: ${src}`));
            }, options.timeout);
        }
    });
    
    // Cache the promise before returning
    scriptCache.set(src, loadPromise);
    
    return loadPromise;
}

/**
 * Clear the script cache (useful for testing)
 * @param {string} [src] - Optional specific URL to clear, if not provided clears entire cache
 */
export function clearScriptCache(src) {
    if (src) {
        scriptCache.delete(src);
    } else {
        scriptCache.clear();
    }
}

/**
 * Get the current script cache (useful for testing)
 * @returns {Map} The script cache map
 */
export function getScriptCache() {
    return scriptCache;
}
