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

function blocked(text) {
    const t = (text || "").replace(/\s+/g, " ").trim();
    return BLOCK.some(re => re.test(t));
}

function process() {
    const cards = document.querySelectorAll('div[role="button"][componentkey^="job-card-component-ref-"]');
    for (const card of cards) {
        if (card.dataset.checked) continue;   // skip cards we already handled
        card.dataset.checked = "1";
        if (blocked(card.textContent)) card.style.display = "none";
    }
}

// debounce: wait for changes to settle before scanning
let timer = null;
function schedule() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(process, 200);
}

process();
new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });