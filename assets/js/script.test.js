const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');

describe('Portfolio Script functionality', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
    // JSDOM does not implement innerText, which `script.js` heavily relies on.
    // We mock it on the HTMLElement prototype for tests.
    Object.defineProperty(window.HTMLElement.prototype, 'innerText', {
      get() {
        return this.textContent;
      },
      set(value) {
        this.textContent = value;
      },
      configurable: true
    });

    // Clear module cache to re-execute the script
    jest.resetModules();
    require('./script.js');

    // Mock window.scrollTo
    window.scrollTo = jest.fn();
  });

  describe('Sidebar Toggle', () => {
    test('sidebar button toggles active class on sidebar', () => {
      const sidebar = document.querySelector('[data-sidebar]');
      const sidebarBtn = document.querySelector('[data-sidebar-btn]');

      expect(sidebar.classList.contains('active')).toBe(false);
      sidebarBtn.click();
      expect(sidebar.classList.contains('active')).toBe(true);
      sidebarBtn.click();
      expect(sidebar.classList.contains('active')).toBe(false);
    });
  });

  describe('Portfolio Filtering (Mobile)', () => {
    test('select button toggles select list', () => {
      const select = document.querySelector('[data-select]');

      expect(select.classList.contains('active')).toBe(false);
      select.click();
      expect(select.classList.contains('active')).toBe(true);
    });

    test('select item changes value and filters projects', () => {
      const selectItems = document.querySelectorAll('[data-select-item]');
      const selectValue = document.querySelector('[data-selecct-value]');
      const desktopProject = document.querySelector('[data-category="desktop"]');
      const clientProject = document.querySelector('[data-category="client"]');

      // The elements might have extra whitespace in innerText, so use textContent or robust match
      const desktopItem = Array.from(selectItems).find(item => item.textContent.trim() === 'Desktop');

      expect(desktopItem).toBeDefined();
      desktopItem.click();

      expect(selectValue.textContent.trim()).toBe('Desktop');
      expect(desktopProject.classList.contains('active')).toBe(true);
      expect(clientProject.classList.contains('active')).toBe(false);
    });
  });

  describe('Portfolio Filtering (Desktop)', () => {
    test('filter buttons update active class and filter projects', () => {
      const filterBtns = document.querySelectorAll('[data-filter-btn]');
      const selectValue = document.querySelector('[data-selecct-value]');
      const desktopProject = document.querySelector('[data-category="desktop"]');
      const clientProject = document.querySelector('[data-category="client"]');

      const desktopBtn = Array.from(filterBtns).find(btn => btn.textContent.trim() === 'Desktop');

      expect(desktopBtn).toBeDefined();
      desktopBtn.click();
      expect(desktopBtn.classList.contains('active')).toBe(true);
      expect(selectValue.textContent.trim()).toBe('Desktop');
      expect(desktopProject.classList.contains('active')).toBe(true);
      expect(clientProject.classList.contains('active')).toBe(false);

      const clientBtn = Array.from(filterBtns).find(btn => btn.textContent.trim() === 'Client');
      expect(clientBtn).toBeDefined();
      clientBtn.click();
      expect(clientBtn.classList.contains('active')).toBe(true);
      expect(desktopBtn.classList.contains('active')).toBe(false);
      expect(desktopProject.classList.contains('active')).toBe(false);
      expect(clientProject.classList.contains('active')).toBe(true);
    });

    test('All filter shows all projects', () => {
      const filterBtns = document.querySelectorAll('[data-filter-btn]');
      const allBtn = Array.from(filterBtns).find(btn => btn.textContent.trim() === 'All');
      const desktopProject = document.querySelector('[data-category="desktop"]');
      const clientProject = document.querySelector('[data-category="client"]');

      expect(allBtn).toBeDefined();
      allBtn.click();
      expect(desktopProject.classList.contains('active')).toBe(true);
      expect(clientProject.classList.contains('active')).toBe(true);
    });
  });

  describe('Page Navigation', () => {
    test('clicking nav link changes active page and link', () => {
      const navLinks = document.querySelectorAll('[data-nav-link]');
      const resumeLink = Array.from(navLinks).find(link => link.textContent.trim() === 'Resume');
      const aboutPage = document.querySelector('[data-page="about"]');
      const resumePage = document.querySelector('[data-page="resume"]');

      expect(resumeLink).toBeDefined();
      expect(aboutPage.classList.contains('active')).toBe(true);
      expect(resumePage.classList.contains('active')).toBe(false);

      resumeLink.click();

      expect(resumeLink.classList.contains('active')).toBe(true);
      expect(aboutPage.classList.contains('active')).toBe(false);
      expect(resumePage.classList.contains('active')).toBe(true);
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('Project Modal', () => {
    test('clicking project item opens modal with correct data', () => {
      const projectItems = document.querySelectorAll('[data-project-item]');
      const iconChangerItem = Array.from(projectItems).find(item => item.dataset.projectTitle === 'Icon Changer');

      const modalOverlay = document.getElementById('projectModalOverlay');
      const modalTitle = document.getElementById('projectModalTitle');
      const modalCategory = document.getElementById('projectModalCategory');
      const modalDesc = document.getElementById('projectModalDesc');
      const modalImg = document.getElementById('projectModalImg');

      expect(iconChangerItem).toBeDefined();
      expect(modalOverlay.classList.contains('active')).toBe(false);

      iconChangerItem.click();

      expect(modalOverlay.classList.contains('active')).toBe(true);
      expect(modalTitle.innerHTML).toBe('Icon Changer');
      expect(modalCategory.innerHTML).toBe('Desktop');
      expect(modalDesc.innerHTML).toContain('Cross-platform desktop icon changer');
      expect(modalImg.src).toContain('Artur-Nayman/icon_changer');
    });

    test('clicking close button closes modal', () => {
      const modalOverlay = document.getElementById('projectModalOverlay');
      const modalClose = document.getElementById('projectModalClose');

      // Open modal first
      const projectItem = document.querySelector('[data-project-item]');
      projectItem.click();
      expect(modalOverlay.classList.contains('active')).toBe(true);

      // Close modal
      modalClose.click();
      expect(modalOverlay.classList.contains('active')).toBe(false);
    });

    test('clicking overlay outside modal closes modal', () => {
      const modalOverlay = document.getElementById('projectModalOverlay');

      // Open modal first
      const projectItem = document.querySelector('[data-project-item]');
      projectItem.click();
      expect(modalOverlay.classList.contains('active')).toBe(true);

      // Click overlay
      modalOverlay.dispatchEvent(new Event('click'));
      expect(modalOverlay.classList.contains('active')).toBe(false);
    });
  });
});
