const version = "1.1.0";
console.log(`Version: ${version}`);
class ExBoostEngine {
  constructor() {
    this.windowIsDefined = typeof window !== "undefined";
    this.chromeGlobalIsDefined = typeof chrome !== "undefined";
    this.usesExtensionProtocol = this.windowIsDefined
      ? window.location.protocol === "chrome-extension:"
      : false;
    this.extensionId = null;
    if (this.chromeGlobalIsDefined) {
      this.extensionId = chrome.runtime.id;
    }
    if (!this.windowIsDefined && this.chromeGlobalIsDefined) {
      this.initBackground();
    } else if (
      this.windowIsDefined &&
      this.chromeGlobalIsDefined &&
      this.usesExtensionProtocol
    ) {
      this.initExtensionPage();
    } else if (
      this.windowIsDefined &&
      this.chromeGlobalIsDefined &&
      !this.usesExtensionProtocol
    ) {
      this.initContentScript();
    } else {
      // Undefined context
    }
  }
  fillAllExboostIframes() {
    const exboostFrames = document.querySelectorAll("iframe[exboost]");
    for (const exboostFrame of exboostFrames) {
      chrome.runtime.sendMessage({ greeting: "hello" }, (response) => {
        exboostFrame.contentDocument.body.innerHTML = response.html;
      });
    }
  }
  initBackground() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log(this.extensionId);
      fetch(`https://api.extensionboost.com/serve/${this.extensionId}`)
        .then((x) => x.text())
        .then((html) =>
          sendResponse({
            html,
          })
        );
      return true;
    });
  }
  initExtensionPage() {
    this.fillAllExboostIframes();
  }
  initContentScript() {
    this.fillAllExboostIframes();
  }
}
const ExBoost = new ExBoostEngine();
export default ExBoost;
