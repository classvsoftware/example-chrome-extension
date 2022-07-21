import {
  sendDynamicBlockRequest,
  sendDynamicRedirectRequest,
} from "/scripts/content-scripts/shared.js";
import {
  activeTab,
  initializeComponent,
  showToast,
  showWarningIfNotPermittedScheme,
  showWarningIfNotPopup,
} from "/scripts/shared.js";

// Dynamic rule IDs
const DYNAMIC_REDIRECT_RULE_ID = 3;
const DYNAMIC_BLOCK_RULE_ID = 4;

const DYNAMIC_REDIRECT_RULE = {
  id: DYNAMIC_REDIRECT_RULE_ID,
  priority: 1,
  action: {
    type: "redirect",
    redirect: {
      url: "https://example.com",
    },
  },
  condition: {
    urlFilter: "httpbin.org/anything/dynamic/redirectme",
  },
};
const DYNAMIC_BLOCK_RULE = {
  id: DYNAMIC_BLOCK_RULE_ID,
  priority: 1,
  action: {
    type: "block",
  },
  condition: {
    urlFilter: "httpbin.org/anything/dynamic/blockme",
  },
};

initializeComponent().then(() => {
  showWarningIfNotPopup();
  showWarningIfNotPermittedScheme();
});

initializeOrToggleRules();

document.body
  .querySelector("#dynamic-redirect")
  .addEventListener("click", async () => {
    let [tab] = await activeTab();

    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: sendDynamicRedirectRequest,
      });

      showToast({
        body: `Request sent. Check the active tab's network activity.`,
      });
    } catch (e) {
      handleError(e);
    }
  });

document.body
  .querySelector("#dynamic-block")
  .addEventListener("click", async () => {
    let [tab] = await activeTab();

    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: sendDynamicBlockRequest,
      });

      showToast({
        body: `Request sent. Check the active tab's network activity.`,
      });
    } catch (e) {
      handleError(e);
    }
  });

document.body
  .querySelector("#toggle-rule")
  .addEventListener("click", async () => {
    initializeOrToggleRules();
  });

async function refreshDisplayedRules() {
  const dynamicRules = await chrome.declarativeNetRequest.getDynamicRules();

  document.querySelector("#dynamic-rules-container").innerHTML = JSON.stringify(
    dynamicRules,
    null,
    2
  );
}

async function initializeOrToggleRules() {
  const dynamicRules = await chrome.declarativeNetRequest.getDynamicRules();

  const addRules = [];
  const removeRuleIds = [];

  if (!dynamicRules.find((rule) => rule.id === DYNAMIC_REDIRECT_RULE_ID)) {
    addRules.push(DYNAMIC_REDIRECT_RULE);
  }

  if (!dynamicRules.find((rule) => rule.id === DYNAMIC_BLOCK_RULE_ID)) {
    addRules.push(DYNAMIC_BLOCK_RULE);
  } else {
    removeRuleIds.push(DYNAMIC_BLOCK_RULE_ID);
  }

  chrome.declarativeNetRequest.updateDynamicRules({
    addRules,
    removeRuleIds,
  });

  refreshDisplayedRules();
}

function handleError(e) {
  showToast({
    variant: "bg-danger",
    body: `Failed to send request: ${e}`,
  });
}
