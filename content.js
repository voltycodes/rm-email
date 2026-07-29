(() => {
  "use strict";

  const DEFAULT_REPLACEMENT = "[REDACTED]";

  let mode = "off";
  let replacement = DEFAULT_REPLACEMENT;
  let emailsList = [];
  const originalNodes = new Map();
  let observer = null;

  function init() {
    console.log("[rm-email] init running");
    chrome.storage.sync.get(
      { mode: "off", replacementText: DEFAULT_REPLACEMENT, emails: "" },
      (data) => {
        mode = data.mode;
        replacement = data.replacementText || DEFAULT_REPLACEMENT;
        emailsList = data.emails
          ? data.emails.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)
          : [];
        console.log("[rm-email] loaded:", { mode, replacement, emailsList });
        applyCurrentMode();
      }
    );
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync") return;
    if (changes.mode) mode = changes.mode.newValue;
    if (changes.replacementText) replacement = changes.replacementText.newValue || DEFAULT_REPLACEMENT;
    if (changes.emails) {
      emailsList = changes.emails.newValue
        ? changes.emails.newValue.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)
        : [];
    }
    console.log("[rm-email] storage changed:", { mode, replacement, emailsList });
    applyCurrentMode();
  });

  function applyCurrentMode() {
    restoreAll();
    stopObserver();

    if (mode === "all") {
      saveOriginals(document.body);
      applyRedactAll(document.body);
      startObserver();
      rerunMultiple(6, 300);
    } else if (mode === "only" && emailsList.length > 0) {
      saveOriginals(document.body);
      applyRedactOnly(document.body);
      startObserver();
      rerunMultiple(6, 300);
    }
  }

  function restoreAll() {
    originalNodes.forEach((original, node) => {
      if (node.nodeValue !== undefined) node.nodeValue = original;
    });
    originalNodes.clear();
  }

  function traverse(root, callback) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentNode;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "TEXTAREA" || tag === "INPUT") {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) textNodes.push(node);
    textNodes.forEach(callback);
  }

  function emailRegex() {
    return /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  }

  function saveOriginals(root) {
    traverse(root, (node) => {
      if (originalNodes.has(node)) return;
      const re = emailRegex();
      if (re.test(node.nodeValue)) {
        originalNodes.set(node, node.nodeValue);
      }
    });
  }

  function applyRedactAll(root) {
    traverse(root, (node) => {
      const original = originalNodes.get(node) || node.nodeValue;
      const re = emailRegex();
      if (!re.test(original)) return;
      node.nodeValue = original.replace(emailRegex(), replacement);
    });
  }

  function applyRedactOnly(root) {
    traverse(root, (node) => {
      const original = originalNodes.get(node) || node.nodeValue;
      const re = emailRegex();
      if (!re.test(original)) return;
      let changed = false;
      const result = original.replace(emailRegex(), (match) => {
        if (emailsList.includes(match.toLowerCase())) {
          changed = true;
          return replacement;
        }
        return match;
      });
      if (changed) node.nodeValue = result;
    });
  }

  function rerunMultiple(iterations, delay) {
    for (let i = 1; i <= iterations; i++) {
      setTimeout(() => {
        if (mode === "all") applyRedactAll(document.body);
        else if (mode === "only") applyRedactOnly(document.body);
      }, i * delay);
    }
  }

  function startObserver() {
    if (observer) return;
    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const added of mutation.addedNodes) {
          if (added.nodeType === Node.TEXT_NODE) {
            saveOriginals(added.parentNode || added);
            if (mode === "all") applyRedactAll(added.parentNode || added);
            else if (mode === "only") applyRedactOnly(added.parentNode || added);
          } else if (added.nodeType === Node.ELEMENT_NODE) {
            saveOriginals(added);
            if (mode === "all") applyRedactAll(added);
            else if (mode === "only") applyRedactOnly(added);
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    console.log("[rm-email] observer started");
  }

  function stopObserver() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  if (document.body) {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
