import { initializeComponent } from "/scripts/shared.js";

initializeComponent();

const logContainer = document.querySelector("#click-log");

document.querySelector("#reset").addEventListener("click", () => {
  logContainer.innerHTML = "";
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.id === "CONTEXT_MENU_CLICK") {
    delete msg.id;

    logContainer.innerHTML += `<div class="card">
        <pre class="card-header">${msg.info.menuItemId}</pre>
        <pre class="card-body">${JSON.stringify(msg, null, 2)}</pre>
      </div>`;
  }
});
