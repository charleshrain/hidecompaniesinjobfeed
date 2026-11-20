// ==UserScript==
// @name         Hide LinkedIn job companies
// @match        https://www.linkedin.com/jobs/*
// @match        https://linkedin.com/jobs/*
// @grant        none
// ==/UserScript==

const BLOCK = [
    // add company name regex in this array
    /acmeinc/i,
];

// ==UserScript==
// @name         Hide LinkedIn job companies
// @match        https://www.linkedin.com/jobs/*
// @match        https://linkedin.com/jobs/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

const BLOCK = [
  // ... keep your existing list unchanged ...
];

const DISMISS_SELECTOR = 'button[aria-label^="Dismiss "][aria-label$=" job"]';

function blocked(text) {
  const t = (text || "").replace(/\s+/g, " ").trim();
  return BLOCK.some(re => re.test(t));
}

// Walk up from the dismiss button to the largest ancestor
// that still contains only this one card.
function getCard(button) {
  let card = button;
  let parent = button.parentElement;
  while (parent && parent !== document.body) {
    if (parent.querySelectorAll(DISMISS_SELECTOR).length > 1) {
      break;
    }
    card = parent;
    parent = parent.parentElement;
  }
  return card;
}

// Card layout: <p>title</p>, <p>company</p>, <p>location</p>, ...
function getCompany(card) {
  const paragraphs = card.querySelectorAll("p");
  if (paragraphs.length >= 2) {
    return paragraphs[1].textContent.trim();
  }
  return card.textContent.trim();
}

function processCards() {
  const buttons = document.querySelectorAll(DISMISS_SELECTOR);
  for (const button of buttons) {
    const card = getCard(button);
    const company = getCompany(card);

    if (!company) {
      continue;
    }

    if (card.dataset.checkedCompany === company) {
      continue;
    }
    card.dataset.checkedCompany = company;

    if (blocked(company)) {
      card.style.display = "none";
    }
  }
}

let timer = null;
function schedule() {
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(processCards, 200);
}

processCards();
new MutationObserver(schedule).observe(document.documentElement, {
  childList: true,
  subtree: true,
  characterData: true,
});