import { initializeBoilerplate } from "/scripts/shared.js";

initializeBoilerplate({ title: "Environment Info" });

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
