const replacement = "[REDACTED]";
const iterations = 6;
const delay = 500; // 500ms

// Regular expression to match email addresses
const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;

function replaceEmail(node) {
  if (node.nodeValue && emailRegex.test(node.nodeValue)) {
    console.log(`Original text: ${node.nodeValue}`);
    node.nodeValue = node.nodeValue.replace(emailRegex, replacement);
    console.log(`Replaced text: ${node.nodeValue}`);
  } else {
    node.childNodes.forEach(child => replaceEmail(child));
  }
}

function replaceEmailInDocument() {
  console.log("Running replaceEmailInDocument");
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
  console.log("Document loaded, starting replacements");
  runReplacements(iterations, delay);
});

// Create a MutationObserver to monitor for changes in the DOM
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      console.log("Mutation detected");
      replaceEmail(node);
    });
  });
});

// Observe changes to the entire document
observer.observe(document.body, {
  childList: true,
  subtree: true
});

console.log("Email Replacer content script loaded");

