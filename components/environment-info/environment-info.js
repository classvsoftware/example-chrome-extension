import { initializeComponent } from "/scripts/shared.js";

initializeComponent();

document.querySelector("#url").innerText = chrome.runtime.getURL("");

document.querySelector("#manifest").innerText = JSON.stringify(
  chrome.runtime.getManifest(),
  null,
  2
);

chrome.runtime.getPlatformInfo((info) => {
  document.querySelector("#platform-info").innerText = JSON.stringify(
    info,
    null,
    2
  );
});

document.querySelector("#views").innerText = JSON.stringify(
  chrome.extension.getViews().map((window) => window.location.href),
  null,
  2
);
