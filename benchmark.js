const { performance } = require('perf_hooks');

function createMockElement(pageName) {
  return {
    dataset: { page: pageName },
    classList: {
      remove: () => {},
      add: () => {}
    }
  };
}

const numPages = 100; // Even for 100 pages
const pages = Array.from({ length: numPages }, (_, i) => createMockElement(`page${i}   `));

function oldWay(targetPage) {
  pages.forEach(page => {
    if (page.dataset.page.toLowerCase().trim() === targetPage) {
      page.classList.add("active");
      // window.scrollTo(0, 0);
    }
  });
}

const pagesMap = new Map();
pages.forEach(page => {
  pagesMap.set(page.dataset.page.toLowerCase().trim(), page);
});

function newWay(targetPage) {
  const targetPageElem = pagesMap.get(targetPage);
  if (targetPageElem) {
    targetPageElem.classList.add("active");
  }
}

const iterations = 100000;
const target = `page${numPages - 1}`;

let start = performance.now();
for (let i = 0; i < iterations; i++) {
  oldWay(target);
}
let end = performance.now();
const oldTime = end - start;
console.log(`Old way: ${oldTime.toFixed(2)} ms`);

start = performance.now();
for (let i = 0; i < iterations; i++) {
  newWay(target);
}
end = performance.now();
const newTime = end - start;
console.log(`New way: ${newTime.toFixed(2)} ms`);
console.log(`Improvement: ${((oldTime - newTime) / oldTime * 100).toFixed(2)}% faster`);
