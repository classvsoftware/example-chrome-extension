import { browser } from "/scripts/shared.js";

let color = "#3aa757";

browser.runtime.onInstalled.addListener(() => {
  browser.storage.sync.set({ color });
  console.log("Default background color set to %cgreen", `color: ${color}`);
});

browser.runtime.onInstalled.addListener((object) => {
  let internalUrl = browser.runtime.getURL("components/welcome/welcome.html");

  if (object.reason === browser.runtime.OnInstalledReason.INSTALL) {
    browser.tabs.create({ url: internalUrl });
  }
});

browser.runtime.setUninstallURL("https://buildingbrowserextensions.com");
