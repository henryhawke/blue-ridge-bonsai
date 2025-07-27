import { loadScript, clearScriptCache, getScriptCache } from '../loadScript';

beforeEach(() => {
  // Clear the script cache before each test
  clearScriptCache();
  
  // Mock DOM methods to avoid real network requests
  document.head.appendChild = jest.fn();
  document.querySelector = jest.fn();
});

describe('loadScript', () => {
  it('appends only one script tag per URL', async () => {
    // Mock to simulate script already exists
    document.querySelector.mockReturnValue(true);
    
    const src = 'https://example.com/script.js';
    await loadScript(src);
    
    expect(document.head.appendChild).not.toHaveBeenCalled();
  });

  it('resolves after the script loads', async () => {
    const src = 'https://example.com/script.js';

    // Mock to simulate that no script exists
    document.querySelector.mockReturnValue(null);

    // Simulate the onload event
    const scriptMock = { onload: null, onerror: null };
    document.createElement = jest.fn(() => scriptMock);

    const promise = loadScript(src);

    // Simulate load
    scriptMock.onload();

    await expect(promise).resolves.toEqual({ script: scriptMock, loaded: true });
  });

  it('rejects on error', async () => {
    const src = 'https://example.com/errorScript.js';

    // Mock to simulate that no script exists
    document.querySelector.mockReturnValue(null);

    // Simulate the onerror event
    const scriptMock = { onload: null, onerror: null };
    document.createElement = jest.fn(() => scriptMock);

    const promise = loadScript(src);

    // Simulate error
    scriptMock.onerror();

    await expect(promise).rejects.toThrow('Failed to load script: https://example.com/errorScript.js');
  });
});
