import {
  initializeContextMenus,
  initializeMessageRelay,
  initializeOmnibox,
  initializeSidePanel,
  openWelcomePage,
  setColor,
} from "/scripts/background/utils.js";

import "/scripts/exboost.mjs";

// ExBoost.apiOrigin = "http://127.0.0.1:5000";

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

  initializeSidePanel();
} catch (e) {
  console.error(e);
}
