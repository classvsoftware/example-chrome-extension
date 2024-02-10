import { initializeComponent } from "/scripts/shared.js";

import ExBoost from "/scripts/exboost.js";

ExBoost.init();

initializeComponent();

document.querySelector("#open-options-api").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

document
  .querySelector("#open-options-window-open")
  .addEventListener("click", () => {
    window.open("/components/options/options.html");
  });
