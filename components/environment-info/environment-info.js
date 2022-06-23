import { browser, initializeBoilerplate } from "/scripts/shared.js";

initializeBoilerplate({ title: "Environment Info" });

document.querySelector("#manifest").innerText = JSON.stringify(
  browser.runtime.getManifest(),
  null,
  2
);

browser.runtime.getPackageDirectoryEntry((directoryEntry) => {
  document.querySelector("#package-directory").innerText = JSON.stringify(
    directoryEntry,
    null,
    2
  );
});

browser.runtime.getPlatformInfo((info) => {
  document.querySelector("#platform-info").innerText = JSON.stringify(
    info,
    null,
    2
  );
});

//   https://developer.chrome.com/docs/extensions/reference/runtime/#method-getPlatformInfo
