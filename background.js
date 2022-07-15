import { openWelcomePage, setColor } from "/scripts/background/utils.js";

console.log("Initialized background!");

chrome.runtime.onInstalled.addListener((details) => {
  // Fired when:
  // - the extension is first installed
  // - the extension is updated to a new version
  // - the browser is updated to a new version.
  setColor();

  openWelcomePage(details);
});

chrome.runtime.setUninstallURL("https://buildingbrowserextensions.com");
