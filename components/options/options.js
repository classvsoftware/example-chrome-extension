import ExBoost from "/scripts/exboost.mjs";
import { initializeComponent } from "/scripts/shared.js";


ExBoost.renderSlotDataOrError({
  exboostSlotId: 'demo-options-id',
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
