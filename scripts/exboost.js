const EXBOOST_ATTRIBUTE = "data-exboost-slot";
const API_VERSION = `v1`;
const API_ORIGIN = `https://api.extensionboost.com/`;
var EngineContext;
(function (EngineContext) {
  EngineContext["BACKGROUND"] = "BACKGROUND";
  EngineContext["CONTENT_SCRIPT"] = "CONTENT_SCRIPT";
  EngineContext["EXTENSION_PAGE"] = "EXTENSION_PAGE";
  EngineContext["POPUP"] = "POPUP";
  EngineContext["OPTIONS"] = "OPTIONS";
  EngineContext["SIDEBAR"] = "SIDEBAR";
  EngineContext["DEVELOPER_TOOLS"] = "DEVELOPER_TOOLS";
  EngineContext["UNIDENTIFIED_CONTEXT"] = "UNIDENTIFIED_CONTEXT";
})(EngineContext || (EngineContext = {}));
class ExBoostEngine {
  constructor() {
    this.version = "1.4.0";
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
      this.engineContext = EngineContext.BACKGROUND;
    } else if (
      this.windowIsDefined &&
      this.chromeGlobalIsDefined &&
      this.usesExtensionProtocol
    ) {
      this.engineContext = EngineContext.EXTENSION_PAGE;
    } else if (
      this.windowIsDefined &&
      this.chromeGlobalIsDefined &&
      !this.usesExtensionProtocol
    ) {
      this.engineContext = EngineContext.CONTENT_SCRIPT;
    } else {
      this.engineContext = EngineContext.UNIDENTIFIED_CONTEXT;
    }
    this.engineInit();
  }
  engineInit() {
    switch (this.engineContext) {
      case EngineContext.BACKGROUND:
        this.initBackground();
        break;
      case EngineContext.CONTENT_SCRIPT:
      case EngineContext.DEVELOPER_TOOLS:
      case EngineContext.EXTENSION_PAGE:
      case EngineContext.OPTIONS:
      case EngineContext.POPUP:
      default:
        break;
    }
  }
  fillAllExboostIframes() {
    const exboostFrames = document.querySelectorAll(
      `iframe[${EXBOOST_ATTRIBUTE}]`
    );
    for (const exboostFrame of exboostFrames) {
      // Slot ID is to identify the traffic on the server
      const exboostSlotId = exboostFrame.getAttribute(EXBOOST_ATTRIBUTE);
      if (!exboostSlotId) {
        console.error("ExBoost slot is missing a slot ID");
        return;
      }
      const message = {
        exboostSlotId,
        engineContext: this.engineContext,
      };
      chrome.runtime.sendMessage(message, (response) => {
        exboostFrame.contentDocument.body.innerHTML = response.html;
      });
    }
  }
  initBackground() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      fetch(
        `${API_ORIGIN}/${API_VERSION}/serve/${this.extensionId}/${
          message.engineContext
        }/${message.exboostSlotId}?nonce=${Date.now()}`
      )
        .then((response) => {
          if (response.status !== 200) {
            // Don't fill the slot with an error response
            return "";
          }
          return response.text();
        })
        .then((html) =>
          sendResponse({
            html,
          })
        );
      return true;
    });
  }
  init() {
    this.fillAllExboostIframes();
  }
}
const ExBoost = new ExBoostEngine();
export default ExBoost;
