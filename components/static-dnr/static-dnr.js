import {
  sendStaticBlockRequest,
  sendStaticRedirectRequest,
} from "/scripts/content-scripts/shared.js";
import {
  activeTab,
  initializeBoilerplate,
  showToast,
} from "/scripts/shared.js";

// Static ruleset ID that can be toggled
const STATIC_RULESET_ID = "ruleset_2";

initializeBoilerplate({ title: "Static Declarative Net Request" });

refreshDisplayedRulesets();

document.body
  .querySelector("#static-redirect")
  .addEventListener("click", async () => {
    let [tab] = await activeTab();

    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: sendStaticRedirectRequest,
      });

      showToast({
        body: `Request sent. Check the active tab's network activity.`,
      });
    } catch (e) {
      handleError(e);
    }
  });

document.body
  .querySelector("#static-block")
  .addEventListener("click", async () => {
    let [tab] = await activeTab();

    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: sendStaticBlockRequest,
      });

      showToast({
        body: `Request sent. Check the active tab's network activity.`,
      });
    } catch (e) {
      handleError(e);
    }
  });

document.body
  .querySelector("#toggle-ruleset")
  .addEventListener("click", async () => {
    const enabledRulesets =
      await chrome.declarativeNetRequest.getEnabledRulesets();

    if (enabledRulesets.includes(STATIC_RULESET_ID)) {
      chrome.declarativeNetRequest.updateEnabledRulesets({
        disableRulesetIds: [STATIC_RULESET_ID],
      });

      showToast({
        body: `${STATIC_RULESET_ID} disabled`,
      });
    } else {
      chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: [STATIC_RULESET_ID],
      });

      showToast({
        body: `${STATIC_RULESET_ID} enabled`,
      });
    }

    refreshDisplayedRulesets();
  });

async function refreshDisplayedRulesets() {
  const enabledRulesets =
    await chrome.declarativeNetRequest.getEnabledRulesets();

  document.querySelector("#static-ruleset-container").innerHTML =
    JSON.stringify(enabledRulesets, null, 2);
}

function handleError(e) {
  showToast({
    variant: "bg-danger",
    body: `Failed to send request: ${e}`,
  });
}
