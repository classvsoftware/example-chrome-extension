import ExBoost from "/scripts/exboost.mjs";
import { initializeComponent, showToast } from "/scripts/shared.js";

ExBoost.loadSlotDataOrError({
  exboostSlotId: 'demo-popup-id'
}).then(slotData => {
  document.querySelector('.slot').innerHTML = slotData.anchorData
    .map(
      (data) =>
        `<a style="display:block" href="${data.href
        }" target="_blank">${data.text}</a>`
    )
    .join("");
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
