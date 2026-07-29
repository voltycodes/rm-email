(() => {
  "use strict";

  const DEFAULT_REPLACEMENT = "[REDACTED]";

  const replacementInput = document.getElementById("replacementInput");
  const chipInput = document.getElementById("chipInput");
  const chipField = document.getElementById("chipField");
  const replacementGroup = document.getElementById("replacementGroup");
  const emailsGroup = document.getElementById("emailsGroup");
  const modeTabs = document.querySelectorAll(".mode-tab");

  let currentMode = "off";
  let chips = [];

  function renderChips() {
    chipInput.querySelectorAll(".chip").forEach((el) => el.remove());
    chips.forEach((email, i) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.innerHTML = `${email}<span class="chip-x" data-i="${i}">\u00d7</span>`;
      chipInput.insertBefore(chip, chipField);
    });
  }

  function saveChips() {
    chrome.storage.sync.set({ emails: chips.join(", ") });
  }

  function isValidEmail(str) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  }

  function addChip(text) {
    const email = text.trim().toLowerCase();
    if (!email) return;
    if (chips.includes(email) || !isValidEmail(email)) {
      chipInput.classList.add("error");
      setTimeout(() => chipInput.classList.remove("error"), 600);
      return;
    }
    chips.push(email);
    chipField.value = "";
    renderChips();
    saveChips();
  }

  function removeChip(i) {
    chips.splice(i, 1);
    renderChips();
    saveChips();
  }

  chipField.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      addChip(chipField.value);
    } else if (e.key === "Backspace" && chipField.value === "" && chips.length) {
      removeChip(chips.length - 1);
    }
  });

  chipInput.addEventListener("click", (e) => {
    if (e.target.classList.contains("chip-x")) {
      removeChip(Number(e.target.dataset.i));
    } else {
      chipField.focus();
    }
  });

  function loadSettings() {
    chrome.storage.sync.get(
      { mode: "off", replacementText: DEFAULT_REPLACEMENT, emails: "" },
      (data) => {
        currentMode = data.mode;
        replacementInput.value = data.replacementText || DEFAULT_REPLACEMENT;
        chips = data.emails
          ? data.emails.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)
          : [];
        renderChips();
        applyMode(currentMode, false);
      }
    );
  }

  function applyMode(mode, save = true) {
    currentMode = mode;

    modeTabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.mode === mode);
    });

    if (mode === "off") {
      replacementGroup.classList.add("hidden");
      emailsGroup.classList.add("hidden");
    } else if (mode === "only") {
      replacementGroup.classList.remove("hidden");
      emailsGroup.classList.remove("hidden");
    } else {
      replacementGroup.classList.remove("hidden");
      emailsGroup.classList.add("hidden");
    }

    if (save) {
      chrome.storage.sync.set({ mode });
    }
  }

  modeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      applyMode(tab.dataset.mode);
    });
  });

  replacementInput.addEventListener("input", () => {
    const val = replacementInput.value.trim();
    chrome.storage.sync.set({ replacementText: val || DEFAULT_REPLACEMENT });
  });

  loadSettings();
})();
