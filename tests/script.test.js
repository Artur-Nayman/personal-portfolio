const fs = require('fs');
const path = require('path');

describe('toggleProjectModal', () => {
  let originalScriptContent;

  beforeAll(() => {
    const scriptPath = path.resolve(__dirname, '../assets/js/script.js');
    originalScriptContent = fs.readFileSync(scriptPath, 'utf8');
  });

  beforeEach(() => {
    document.body.innerHTML = '<div id="projectModalOverlay"></div>';

    // Replace const with window. to make it testable
    const testableScript = originalScriptContent.replace(
      'const toggleProjectModal = function () {',
      'window.toggleProjectModal = function () {'
    );

    // Execute in the current global context
    eval(testableScript);
  });

  it('should toggle active class when projectModalOverlay exists', () => {
    const overlay = document.getElementById("projectModalOverlay");

    expect(overlay.classList.contains("active")).toBe(false);

    window.toggleProjectModal();

    expect(overlay.classList.contains("active")).toBe(true);

    window.toggleProjectModal();

    expect(overlay.classList.contains("active")).toBe(false);
  });

  it('should not throw an error when projectModalOverlay does not exist', () => {
    document.body.innerHTML = ''; // Remove the overlay

    // Re-evaluate script because the script defines constants at script load
    const testableScript = originalScriptContent.replace(
      'const toggleProjectModal = function () {',
      'window.toggleProjectModal = function () {'
    );
    eval(testableScript);

    expect(() => {
      window.toggleProjectModal();
    }).not.toThrow();
  });
});
