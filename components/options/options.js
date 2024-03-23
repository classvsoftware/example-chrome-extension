import ExBoost from "/scripts/exboost.mjs";
import { initializeComponent } from "/scripts/shared.js";

// ExBoost auto render
ExBoost.renderSlotDataOrError({
  exboostSlotId: 'a10785e4-570d-4bdd-9185-4a10e67053cf',
  target: document.querySelector('.slot')
});

initializeComponent();

document.querySelector("#open-options-api").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

document
  .querySelector("#open-options-window-open")
  .addEventListener("click", () => {
    window.open("/components/options/options.html");
  });
