describe('filterFunc', () => {
  let filterFunc;

  beforeEach(() => {
    // Set up the DOM with mock elements
    document.body.innerHTML = `
      <div data-filter-item data-category="web design" class="active"></div>
      <div data-filter-item data-category="web development" class=""></div>
      <div data-filter-item data-category=" Web Design " class=""></div>
      <div data-filter-item data-category="applications" class="active"></div>
    `;

    // Clear module cache to re-evaluate the script and grab new DOM elements
    jest.resetModules();

    // Import the function after DOM is set up
    const script = require('./script.js');
    filterFunc = script.filterFunc;
  });

  test('should show all items when selectedValue is "all"', () => {
    filterFunc('all');

    const items = document.querySelectorAll('[data-filter-item]');
    items.forEach(item => {
      expect(item.classList.contains('active')).toBe(true);
    });
  });

  test('should show only items matching the exact category', () => {
    filterFunc('web design');

    const items = document.querySelectorAll('[data-filter-item]');
    expect(items[0].classList.contains('active')).toBe(true); // web design
    expect(items[1].classList.contains('active')).toBe(false); // web development
    expect(items[2].classList.contains('active')).toBe(true); // Web Design (testing trim and lowercase match)
    expect(items[3].classList.contains('active')).toBe(false); // applications
  });

  test('should handle spaces and casing in dataset category correctly', () => {
    // The elements have spaces in the DOM dataset definition, we should match them correctly
    // The filterFunc transforms the dataset.category by lowercasing and trimming
    filterFunc('applications');

    const items = document.querySelectorAll('[data-filter-item]');
    expect(items[0].classList.contains('active')).toBe(false); // web design
    expect(items[3].classList.contains('active')).toBe(true); // applications
  });
});
