import "/scripts/background/keepalive.js";

console.log("Initialized background!");

chrome.runtime.onInstalled.addListener((object) => {
  // Fired when:
  // - the extension is first installed
  // - the extension is updated to a new version
  // - the browser is updated to a new version.
  let t0 = performance.now();

  setInterval(() => console.log(`Age: ${performance.now() - t0}`), 1000);

  let color = "#3aa757";

  chrome.storage.sync.set({ color });

  if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    // Acquire the welcome page URL
    let url = chrome.runtime.getURL("components/welcome/welcome.html");

    // Extension was freshly installed.
    // Open the welcome page in a new tab .
    chrome.tabs.create({ url });
  }
});

chrome.runtime.setUninstallURL("https://buildingbrowserextensions.com");
