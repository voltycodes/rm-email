let replacement = "[REDACTED]";

chrome.storage.sync.get('replacementText', function(data) {
  if (data.replacementText) {
    replacement = data.replacementText;
  }
});

const iterations = 5;
const delay = 500; // 500ms

// Regular expression to match email addresses
const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;

function replaceEmail(node) {
  if (node.nodeValue && emailRegex.test(node.nodeValue)) {
    node.nodeValue = node.nodeValue.replace(emailRegex, replacement);
  } else {
    node.childNodes.forEach(child => replaceEmail(child));
  }
}

function replaceEmailInDocument() {
  replaceEmail(document.body);
}

// Function to run the replacement multiple times
function runReplacements(iterations, delay) {
  for (let i = 0; i < iterations; i++) {
    setTimeout(replaceEmailInDocument, i * delay);
  }
}

// Wait for the document to be fully loaded before running replacements
window.addEventListener('load', () => {
  console.log("rm-email loaded, starting email replacements...");
  runReplacements(iterations, delay);
});

// Create a MutationObserver to monitor for changes in the DOM
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      replaceEmail(node);
    });
  });
});

// Observe changes to the entire document
observer.observe(document.body, {
  childList: true,
  subtree: true
});
