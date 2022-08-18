import { initializeComponent, showWarningIfPopup } from "/scripts/shared.js";

initializeComponent().then(() => {
  showWarningIfPopup();
});

document.querySelector("#create-tab").addEventListener("click", () => {
  return chrome.tabs.create({
    active: false,
    url: "https://en.wikipedia.org/wiki/Special:Random",
  });
});

const logContainer = document.querySelector("#navigation-log");

document.querySelector("#reset").addEventListener("click", () => {
  logContainer.innerHTML = "";
});

chrome.webNavigation.onCompleted.addListener((details) => {
  logContainer.innerHTML += `<div class="card">
    <pre class="card-header">${details.url}</pre>
    <pre class="card-body">${JSON.stringify(details, null, 2)}</pre>
  </div>`;
});
