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
    return BLOCK.some((re) => re.test(t));
}

function hide(root) {
    for (const p of root.querySelectorAll("p")) {
        if (!blocked(p.textContent || "")) continue;
        const card = p.closest('div[role="button"][componentkey^="job-card-component-ref-"]');
        if (card) card.style.display = "none";
    }
}

function walk(node) {
    hide(node);
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT);
    let n;
    while ((n = walker.nextNode())) {
        if (n.shadowRoot) walk(n.shadowRoot);
    }
}

const run = () => walk(document);
run();
new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true });