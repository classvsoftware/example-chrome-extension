import {
  initializeContextMenus,
  initializeMessageRelay,
  initializeOmnibox,
  openWelcomePage,
  setColor,
} from "/scripts/background/utils.js";

import "/scripts/exboost.mjs";

console.log("Initialized background!");

try {
  // Fired when:
  // - the extension is first installed
  // - the extension is updated to a new version
  // - the browser is updated to a new version.
  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
      openWelcomePage(details);
    }

    chrome.runtime.setUninstallURL("https://buildingbrowserextensions.com");

    setColor();
  });

  initializeContextMenus();

  initializeMessageRelay();

  initializeOmnibox();
} catch (e) {
  console.error(e);
}
