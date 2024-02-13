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
        this.version = "1.6.0";
        this.sessionId = null;
        this.windowIsDefined = typeof window !== "undefined";
        this.chromeGlobalIsDefined = typeof chrome !== "undefined";
        this.isManifestV2 = chrome.runtime.getManifest().version === "2";
        this.usesExtensionProtocol = this.windowIsDefined
            ? window.location.protocol === "chrome-extension:"
            : false;
        this.extensionId = null;
        if (this.chromeGlobalIsDefined) {
            this.extensionId = chrome.runtime.id;
        }
        if ((!this.isManifestV2 &&
            !this.windowIsDefined &&
            this.chromeGlobalIsDefined) ||
            (this.isManifestV2 &&
                this.windowIsDefined &&
                window === chrome.extension.getBackgroundPage())) {
            this.engineContext = EngineContext.BACKGROUND;
        }
        else if (this.windowIsDefined &&
            this.chromeGlobalIsDefined &&
            this.usesExtensionProtocol) {
            this.engineContext = EngineContext.EXTENSION_PAGE;
        }
        else if (this.windowIsDefined &&
            this.chromeGlobalIsDefined &&
            !this.usesExtensionProtocol) {
            this.engineContext = EngineContext.CONTENT_SCRIPT;
        }
        else {
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
    fillAllExboostIframes(options = {}) {
        const exboostFrames = document.querySelectorAll(`iframe[${EXBOOST_ATTRIBUTE}]`);
        if (options.debug) {
            console.log(`Detected ${exboostFrames.length} ExBoost frames`);
        }
        for (const exboostFrame of exboostFrames) {
            // Slot ID is to identify the traffic on the server
            const exboostSlotId = exboostFrame.getAttribute(EXBOOST_ATTRIBUTE);
            if (!exboostSlotId) {
                if (options.debug) {
                    console.error("ExBoost slot is missing a slot ID");
                }
                continue;
            }
            if (options.debug) {
                const frameWidth = exboostFrame.offsetWidth;
                const frameHeight = exboostFrame.offsetHeight;
                if (frameWidth < 50 || frameHeight < 50) {
                    `Frame ${exboostSlotId} is too small and will not render: ${frameWidth}x${frameHeight}`;
                }
            }
            // Frame has already been filled
            if (exboostFrame.contentDocument.body.innerHTML.length > 0) {
                if (options.debug) {
                    console.log(`Frame ${exboostSlotId} is already filled, skipping`);
                }
                continue;
            }
            const message = {
                exboostSlotId,
                engineContext: this.engineContext,
                options: {},
            };
            chrome.runtime.sendMessage(message, (response) => {
                exboostFrame.contentDocument.body.innerHTML = response.html;
                if (options.debug) {
                    if (response.html.length > 0) {
                        console.log(`Successfully filled ${exboostSlotId}`);
                    }
                    else {
                        console.log(`Declined to fill ${exboostSlotId}`);
                    }
                }
            });
        }
    }
    initBackground() {
        this.sessionId = crypto.randomUUID();
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            const path = [
                API_VERSION,
                "serve",
                this.extensionId,
                this.sessionId,
                message.engineContext,
                message.exboostSlotId,
            ].join("/");
            fetch(`${API_ORIGIN}/${path}?nonce=${Date.now()}`)
                .then((response) => {
                if (response.status !== 200) {
                    // Don't fill the slot with an error response
                    return "";
                }
                return response.text();
            })
                .then((html) => sendResponse({
                html,
            }));
            // Indicate that a response is coming
            return true;
        });
    }
    init(options = {}) {
        if (options.debug) {
            console.log(`Engine context: ${this.engineContext}`);
        }
        this.fillAllExboostIframes(options);
    }
}
const ExBoost = new ExBoostEngine();
export default ExBoost;
