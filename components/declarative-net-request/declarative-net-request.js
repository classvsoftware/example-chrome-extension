
import { initializeBoilerplate, showToast, activeTab } from "/scripts/shared.js";

initializeBoilerplate({ title: "declarative-net-request" });

updateStaticRules();
updateDynamicRules();

document.body
  .querySelector("#static-redirect-btn")
  .addEventListener("click", async () => {
    let [tab] = await activeTab();

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: sendStaticRedirectRequest,
      },
      handleError
    );
  });

document.body
  .querySelector("#static-block-btn")
  .addEventListener("click", async () => {
    let [tab] = await activeTab();

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: sendStaticBlockRequest,
      },
      handleError
    );
  });

document.body
  .querySelector("#dynamic-list-btn")
  .addEventListener("click", async () => {
    chrome.declarativeNetRequest.getDynamicRules((dynamicRules) => {
      showToast({
        body: `${JSON.stringify(dynamicRules)}`,
      });
    });
  });

document.body
  .querySelector("#dynamic-add-btn")
  .addEventListener("click", async () => {
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [
        {
          id: 3,
          priority: 1,
          action: {
            type: "block",
          },
          condition: {
            urlFilter: "httpbin.org/anything/dynamic/blockme",
          },
        },
      ],
      removeRuleIds: [],
    });
  });

document.body
  .querySelector("#dynamic-remove-btn")
  .addEventListener("click", async () => {
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [],
      removeRuleIds: [],
    });
  });

document.body
  .querySelector("#dynamic-block-btn")
  .addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: sendDynamicBlockRequest,
      },
      handleError
    );
  });

document.body
  .querySelector("#rule-count-btn")
  .addEventListener("click", async () => {
    chrome.declarativeNetRequest.getAvailableStaticRuleCount((count) => {
      showToast({
        variant: "bg-info",
        body: `Number of rules that can be defined before reaching global maximum: ${count}`,
      });
    });
  });

async function updateStaticRules() {

    document.body.querySelector('#static-rule-container').innerHTML = fetch('/rules/ruleset_1.json')
}

async function updateDynamicRules() {

}

function handleError() {
  if (chrome.runtime.lastError) {
    showToast({
      variant: "bg-danger",
      body: `Failed to send request: ${chrome.runtime.lastError.message}`,
    });
  }
}

function sendStaticBlockRequest() {
  fetch("https://httpbin.org/anything/static/blockme").then(
    () => {},
    () => {}
  );
}

function sendStaticRedirectRequest() {
  fetch("https://httpbin.org/anything/static/redirectme").then(
    () => {},
    () => {}
  );
}

function sendDynamicBlockRequest() {
  fetch("https://httpbin.org/anything/dynamic/blockme").then(
    () => {},
    () => {}
  );
}
