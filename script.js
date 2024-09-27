window.addEventListener("load", () => {
  const inputElem = document.getElementById("rplce");
  const setBtn = document.getElementById("setBtn");

  chrome.storage.sync.get('replacementText', function(data) {
    if (data.replacementText) {
      inputElem.value = data.replacementText;
    } else {
      chrome.storage.sync.set({ replacementText: "[REDACTED]" })
    }
  });

  setBtn.addEventListener("click", setReplacement);
});

function setReplacement() {
  const inputVal = document.getElementById("rplce").value.trim();

  // Store the replacement text in Chrome sync storage
  chrome.storage.sync.set({ replacementText: inputVal });
}
