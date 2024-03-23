import ExBoost from "/scripts/exboost.mjs";
import { initializeComponent, showToast } from "/scripts/shared.js";

// ExBoost manual render
ExBoost.loadSlotDataOrError({
  exboostSlotId: "a10785e4-570d-4bdd-9185-4a10e67053cf",
}).then((slotData) => {
  document.querySelector(".slot").innerHTML = `<div class="exboost-container">${slotData.anchorData
    .map((data) => `<a class="exboost-link" href="${data.href}" target="_blank">${data.text}</a>`)
    .join("")}</div>`;
});

initializeComponent();

document.querySelector("#popup-default").addEventListener("click", () => {
  chrome.action.setPopup({
    popup: chrome.runtime.getURL("/components/popup/popup.html"),
  });

  showToast({
    body: "Set default popup to popup.html",
  });
});

document.querySelector("#welcome-default").addEventListener("click", () => {
  chrome.action.setPopup({
    popup: chrome.runtime.getURL("/components/welcome/welcome.html"),
  });

  showToast({
    body: "Set default popup to welcome.html",
  });
});
