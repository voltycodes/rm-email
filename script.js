window.addEventListener("load", () => {
  const inputElem = document.getElementById("rplce");
  const setBtn = document.getElementById("setBtn");
  const toggleBtn = document.getElementById("toggleBtn");

  chrome.storage.sync.get('isEnabled', function (data) {
    if (data.isEnabled) {
      toggleBtn.textContent = "Disable Extension";
    } else {
      toggleBtn.textContent = "Enable Extension";
      chrome.storage.sync.set({ isEnabled: false });
    }
  });

  chrome.storage.sync.get('replacementText', function(data) {
    if (data.replacementText) {
      inputElem.value = data.replacementText;
    } else {
      chrome.storage.sync.set({ replacementText: "[REDACTED]" });
    }
  });

  setBtn.addEventListener("click", setReplacement);
  toggleBtn.addEventListener("click", toggleExt);
});

function setReplacement() {
  const inputVal = document.getElementById("rplce").value.trim();

  // Store the replacement text in Chrome sync storage
  chrome.storage.sync.set({ replacementText: inputVal });
}

function toggleExt() {
  chrome.storage.sync.get('isEnabled', function (data) {
    const newStatus = !data.isEnabled;
    chrome.storage.sync.set({ isEnabled: newStatus }, function() {
      const toggleBtn = document.getElementById("toggleBtn");
      toggleBtn.textContent = newStatus ? "Disable Extension" : "Enable Extension";
    });
  });
}