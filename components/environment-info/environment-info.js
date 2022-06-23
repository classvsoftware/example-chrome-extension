import { browser, initializeBoilerplate } from "/scripts/shared.js";

initializeBoilerplate({ title: "Environment Info" });

document.querySelector("#url").innerText = browser.runtime.getURL("");

document.querySelector("#manifest").innerText = JSON.stringify(
  browser.runtime.getManifest(),
  null,
  2
);

browser.runtime.getPlatformInfo((info) => {
  document.querySelector("#platform-info").innerText = JSON.stringify(
    info,
    null,
    2
  );
});
