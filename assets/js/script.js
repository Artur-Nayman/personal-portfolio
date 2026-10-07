'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebarBtn) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}

// custom select variables for portfolio filtering (mobile)
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

// add event in all select items
selectItems.forEach(item => {
  item.addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase().trim();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

    // Sync with large screen filter buttons
    for (let j = 0; j < filterBtn.length; j++) {
      if (filterBtn[j].innerText.toLowerCase().trim() === selectedValue) {
        if (lastClickedBtn) lastClickedBtn.classList.remove("active");
        filterBtn[j].classList.add("active");
        lastClickedBtn = filterBtn[j];
        break;
      }
    }
  });
});

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

// Pre-compute normalized category strings to optimize filtering
for (let i = 0; i < filterItems.length; i++) {
  if (filterItems[i].dataset.category) {
    filterItems[i].dataset.normalizedCategory = filterItems[i].dataset.category.toLowerCase().trim();
  }
}

const filterFunc = function (selectedValue) {
  filterItems.forEach(item => {
    if (selectedValue === "all") {
      item.classList.add("active");
    } else if (selectedValue === item.dataset.category.toLowerCase().trim()) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

filterBtn.forEach((btn) => {
  btn.addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase().trim();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    if (lastClickedBtn) {
      lastClickedBtn.classList.remove("active");
    }
    this.classList.add("active");
    lastClickedBtn = this;
  });
});

// --- FULLY REWRITTEN PAGE NAVIGATION LOGIC ---
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// Pre-compute map for O(1) lookups
const pagesMap = new Map();
pages.forEach(page => {
  pagesMap.set(page.dataset.page.toLowerCase().trim(), page);
});

navigationLinks.forEach((link) => {
  link.addEventListener("click", function () {
    // Get the name of the page clicked (e.g., "about", "project history")
    const targetPage = this.innerText.toLowerCase().trim();

    // 1. Remove "active" class from ALL links and ALL pages
    navigationLinks.forEach(nav => nav.classList.remove("active"));
    pages.forEach(page => page.classList.remove("active"));

    // 2. Add "active" class to the clicked link
    this.classList.add("active");

    // 3. Find the correct page and add "active" to it
    const targetPageElem = pagesMap.get(targetPage);
    if (targetPageElem) {
      targetPageElem.classList.add("active");
      window.scrollTo(0, 0); // Scroll to top when switching tabs
    }
  });
});

// --- Project Modal Functionality ---
const projectItems = document.querySelectorAll("[data-project-item]");
const projectModalOverlay = document.getElementById("projectModalOverlay");
const projectModalClose = document.getElementById("projectModalClose");
const projectModalImg = document.getElementById("projectModalImg");
const projectModalTitle = document.getElementById("projectModalTitle");
const projectModalCategory = document.getElementById("projectModalCategory");
const projectModalDesc = document.getElementById("projectModalDesc");
const projectModalLink = document.getElementById("projectModalLink");

const toggleProjectModal = function () {
  if (projectModalOverlay) {
    projectModalOverlay.classList.toggle("active");
  }
}

projectItems.forEach(item => {
  item.addEventListener("click", function () {
    const title = this.dataset.projectTitle;
    const category = this.dataset.projectCategory;
    const desc = this.dataset.projectDesc;
    const img = this.dataset.projectImg;
    const link = this.dataset.projectLink;

    if (projectModalTitle) projectModalTitle.textContent = title;
    if (projectModalCategory) projectModalCategory.textContent = category;
    if (projectModalDesc) projectModalDesc.textContent = desc;
    if (projectModalImg) {
      projectModalImg.src = img;
      projectModalImg.alt = title;
    }

    if (projectModalLink) {
      if (link && link !== "#" && link !== "") {
        projectModalLink.href = link;
        projectModalLink.style.display = "flex"; 
      } else {
        projectModalLink.style.display = "none";
      }
    }

    toggleProjectModal();
  });
});

if (projectModalClose) {
  projectModalClose.addEventListener("click", toggleProjectModal);
}

// Close modal when clicking on the dark overlay background outside the box
if (projectModalOverlay) {
  projectModalOverlay.addEventListener("click", function (e) {
    if (e.target === projectModalOverlay) {
      toggleProjectModal();
    }
  });
}
