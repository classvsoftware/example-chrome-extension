import { initializeBoilerplate, showToast } from "/scripts/shared.js";

initializeBoilerplate({ title: "tabs-viewer" });

const container = document.querySelector("#windows-container");

const updateWindowsAndTabs = _.debounce(async function () {
  const windows = await chrome.windows.getAll();

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
          <div class="card ${w.focused && t.active ? "border-primary" : ""}">
              <pre class="card-header">Tab ${t.id}</pre>
              
              <div class="card-body">
                <pre class="card-text text-xs">${JSON.stringify(
                  t,
                  null,
                  2
                )}</pre>
              </div>
          </div>`;
    }

    html += `<div class="flex flex-col items-stretch gap-8">${tabHtml}</div>`;
  }

  container.innerHTML = html;
}, 100);

// Initial
updateWindowsAndTabs();

// Window events
chrome.windows.onBoundsChanged.addListener(() => {
  showToast({ body: `Window bounds changed` });

  updateWindowsAndTabs();
});
chrome.windows.onCreated.addListener(() => {
  showToast({ body: `Window created` });

  updateWindowsAndTabs();
});
chrome.windows.onFocusChanged.addListener(() => {
  showToast({ body: `Window focus changed` });

  updateWindowsAndTabs();
});
chrome.windows.onRemoved.addListener(() => {
  showToast({ body: `Window removed` });

  updateWindowsAndTabs();
});

// Tab events
chrome.tabs.onActivated.addListener(() => {
  showToast({ body: `Tab activated` });

  updateWindowsAndTabs();
});
chrome.tabs.onActiveChanged.addListener(() => {
  showToast({ body: `Tab active changed` });

  updateWindowsAndTabs();
});
chrome.tabs.onAttached.addListener(() => {
  showToast({ body: `Tab attached` });

  updateWindowsAndTabs();
});
chrome.tabs.onCreated.addListener(() => {
  showToast({ body: `Tab created` });

  updateWindowsAndTabs();
});
chrome.tabs.onDetached.addListener(() => {
  showToast({ body: `Tab detached` });

  updateWindowsAndTabs();
});
chrome.tabs.onHighlightChanged.addListener(() => {
  showToast({ body: `Tab highlight changed` });

  updateWindowsAndTabs();
});
chrome.tabs.onHighlighted.addListener(() => {
  showToast({ body: `Tab highlighted` });

  updateWindowsAndTabs();
});
chrome.tabs.onMoved.addListener(() => {
  showToast({ body: `Tab moved` });

  updateWindowsAndTabs();
});
chrome.tabs.onRemoved.addListener(() => {
  showToast({ body: `Tab removed` });

  updateWindowsAndTabs();
});
chrome.tabs.onReplaced.addListener(() => {
  showToast({ body: `Tab replaced` });

  updateWindowsAndTabs();
});
chrome.tabs.onSelectionChanged.addListener(() => {
  showToast({ body: `Tab selection changed` });

  updateWindowsAndTabs();
});
chrome.tabs.onUpdated.addListener(() => {
  showToast({ body: `Tab updated` });

  updateWindowsAndTabs();
});
chrome.tabs.onZoomChange.addListener(() => {
  showToast({ body: `Tab zoom changed` });

  updateWindowsAndTabs();
});
