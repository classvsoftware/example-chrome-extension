import { initializeBoilerplate } from "/scripts/shared.js";

initializeBoilerplate({ title: "tabs-viewer" });

const container = document.querySelector("#windows-container");

// Initial
updateWindowsAndTabs();

// onBoundsChanged
// onCreated
// onFocusChanged
// onRemoved

async function updateWindowsAndTabs() {
  const windows = await chrome.windows.getAll();
  const currentWindow = await chrome.windows.getCurrent();

  console.log(windows);
  console.log(currentWindow);

  let html = "";

  for (const w of windows) {
    html += `
    <div class="card ${w.focused ? "border-primary" : ""}">
        <pre class="card-header">Window ${w.id}</pre>
        
        <div class="card-body">
          <pre class="card-text text-xs">${JSON.stringify(w, null, 2)}</pre>
        </div>
    </div>`;

    const tabs = await chrome.tabs.query({ windowId: w.id });

    let tabHtml = "";

    for (const t of tabs) {
      tabHtml += `
        <div class="card ${t.active ? "border-primary" : ""}">
            <pre class="card-header">Tab ${t.id}</pre>
            
            <div class="card-body">
              <pre class="card-text text-xs">${JSON.stringify(t, null, 2)}</pre>
            </div>
        </div>`;
    }

    html += `<div class="flex flex-col items-stretch gap-8">${tabHtml}</div>`;
  }

  container.innerHTML = html;
}
