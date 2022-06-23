import { browser, initializeBoilerplate } from "/scripts/shared.js";

initializeBoilerplate({ title: "Environment Info" });

document.querySelector("#manifest").innerText = JSON.stringify(
  browser.runtime.getManifest(),
  null,
  2
);

browser.runtime.getPackageDirectoryEntry((directoryEntry) => {
  debugger;
  document.querySelector("#package-directory").innerText = JSON.stringify(
    directoryEntry.name,
    null,
    2
  );
});
