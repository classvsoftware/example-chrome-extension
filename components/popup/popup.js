import { initializeBoilerplate, showToast } from "/scripts/shared.js";

initializeBoilerplate({ title: "Popup Page" });

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
