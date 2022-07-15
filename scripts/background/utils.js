export function setColor() {
  let color = "#3aa757";

  chrome.storage.sync.set({ color });
}

export function openWelcomePage(details) {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    // Acquire the welcome page URL
    let url = chrome.runtime.getURL("components/welcome/welcome.html");

    // Extension was freshly installed.
    // Open the welcome page in a new tab .
    chrome.tabs.create({ url });
  }
}
