/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

const scriptCode = fs.readFileSync(path.resolve(__dirname, './script.js'), 'utf-8');

const getScriptEnvironment = () => {
  // Setup minimal DOM needed for the script to not throw errors on initialization
  document.body.innerHTML = `
    <div data-sidebar></div>
    <button data-sidebar-btn></button>
    <div data-select></div>
    <div data-selecct-value></div>
    <div data-filter-btn></div>
    <div data-project-item></div>
  `;

  // Wrap the script execution to extract the elementToggleFunc
  const wrapper = `
    (function() {
      ${scriptCode.replace(/'use strict';/g, '')}
      return elementToggleFunc;
    })();
  `;

  return eval(wrapper);
};

describe('elementToggleFunc', () => {
  let elementToggleFunc;

  beforeAll(() => {
    elementToggleFunc = getScriptEnvironment();
  });

  it('should add "active" class if it does not exist', () => {
    const el = document.createElement('div');
    expect(el.classList.contains('active')).toBe(false);

    elementToggleFunc(el);
    expect(el.classList.contains('active')).toBe(true);
  });

  it('should remove "active" class if it exists', () => {
    const el = document.createElement('div');
    el.classList.add('active');
    expect(el.classList.contains('active')).toBe(true);

    elementToggleFunc(el);
    expect(el.classList.contains('active')).toBe(false);
  });

  it('should maintain other classes when toggling "active"', () => {
    const el = document.createElement('div');
    el.className = 'btn btn-primary';

    elementToggleFunc(el);
    expect(el.classList.contains('active')).toBe(true);
    expect(el.classList.contains('btn')).toBe(true);
    expect(el.classList.contains('btn-primary')).toBe(true);
  });
});
