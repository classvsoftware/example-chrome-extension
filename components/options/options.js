import { initializeComponent } from "/scripts/shared.js";

import "/scripts/exboost.js";

initializeComponent();

document.querySelector("#open-options-api").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

document
  .querySelector("#open-options-window-open")
  .addEventListener("click", () => {
    window.open("/components/options/options.html");
  });
