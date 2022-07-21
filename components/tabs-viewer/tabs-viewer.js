import { initializeBoilerplate, showToast } from "/scripts/shared.js";

initializeBoilerplate();

const container = document.querySelector("#windows-container");

const updateWindowsAndTabs = _.debounce(async function () {
  const windows = await chrome.windows.getAll();

  let html = "";

  for (const w of windows) {
    const windowFocused = w.focused;

    const windowButtonClass = `btn btn-outline-${
      windowFocused ? "primary" : "secondary"
    } flex flex-row justify-center items-center gap-1`;

    html += `
      <div class="card ${windowFocused ? "border-primary" : ""}">
          <pre data-focus-window-id="${
            w.id
          }" class="card-header cursor-pointer ${
      windowFocused ? "bg-primary text-white" : ""
    }">Window ${w.id}</pre>
          <div class="card-body flex flex-col gap-8">
            <div class="btn-group flex-wrap gap-y-1" role="group">
              <button data-close-window-id="${
                w.id
              }" class="${windowButtonClass}"><i class="fa-solid fa-xmark"></i>CLOSE</button>
              <button data-focus-window-id="${
                w.id
              }" class="${windowButtonClass}"><i class="fa-solid fa-eye"></i>FOCUS</button>
              <button data-minimize-window-id="${
                w.id
              }" class="${windowButtonClass}"><i class="fa-solid fa-minimize"></i>MINIMIZE</button>
              <button data-maximize-window-id="${
                w.id
              }" class="${windowButtonClass}"><i class="fa-solid fa-maximize"></i>MAXIMIZE</button>
            </div>
            <pre class="card-text text-xs">${JSON.stringify(w, null, 2)}</pre>
          </div>
      </div>`;

    const tabs = await chrome.tabs.query({ windowId: w.id });

    let tabHtml = "";

    for (const t of tabs) {
      const tabSelected = w.focused && t.active;

      const tabButtonClass = `btn btn-outline-${
        tabSelected ? "primary" : "secondary"
      } flex flex-row justify-center items-center gap-1`;

      tabHtml += `
          <div class="card  ${tabSelected ? "border-primary" : ""}">
              <pre data-focus-tab-id="${
                t.id
              }" class="card-header cursor-pointer ${
        tabSelected ? "bg-primary text-white" : ""
      }">Tab ${t.id}</pre>
              
              <div class="card-body flex flex-col gap-8">
                <div class="btn-group flex-wrap gap-y-1" role="group">
                <button data-close-tab-id="${
                  t.id
                }" class="${tabButtonClass}"><i class="fa-solid fa-xmark"></i>CLOSE</button>
                <button data-focus-tab-id="${
                  t.id
                }" class="${tabButtonClass}"><i class="fa-solid fa-eye"></i>FOCUS</button>
                <button data-duplicate-tab-id="${
                  t.id
                }" class="${tabButtonClass}"><i class="fa-solid fa-copy"></i>DUPLICATE</button>
                <button data-reload-tab-id="${
                  t.id
                }" class="${tabButtonClass}"><i class="fa-solid fa-refresh"></i>RELOAD</button>
                <button data-goback-tab-id="${
                  t.id
                }" class="${tabButtonClass}"><i class="fa-solid fa-backward"></i>GO BACK</button>
                <button data-goforward-tab-id="${
                  t.id
                }" class="${tabButtonClass}"><i class="fa-solid fa-forward"></i>GO FORWARD</button>
                <button data-moveleft-tab-id="${
                  t.id
                }" class="${tabButtonClass}"><i class="fa-solid fa-backward-step"></i>MOVE LEFT</button>
                <button data-moveright-tab-id="${
                  t.id
                }" class="${tabButtonClass}"><i class="fa-solid fa-forward-step"></i>MOVE RIGHT</button>
                <button data-zoomin-tab-id="${
                  t.id
                }" class="${tabButtonClass}"><i class="fa-solid fa-magnifying-glass-plus"></i>ZOOM IN</button>
                <button data-zoomout-tab-id="${
                  t.id
                }" class="${tabButtonClass}"><i class="fa-solid fa-magnifying-glass-minus"></i>ZOOM OUT</button>
                <button data-pin-tab-id="${
                  t.id
                }" class="${tabButtonClass}"><i class="fa-solid fa-thumbtack"></i>PIN</button>
                <button data-unpin-tab-id="${
                  t.id
                }" class="${tabButtonClass}"><i class="fa-solid fa-xmark"></i>UNPIN</button>
                </div>

                <pre class="card-body text-xs">${JSON.stringify(
                  t,
                  null,
                  2
                )}</pre>
              </div>
          </div>`;
    }

    html += `
    <div class="flex flex-col items-stretch gap-8">
        ${tabHtml}
        
        <button data-create-tab-window-id="${w.id}" class="btn btn-outline-primary flex flex-row justify-center items-center gap-1">
            <i class="fa-solid fa-plus"></i>CREATE NEW TAB
        </button>
    </div>
    <hr class="col-span-2" />`;
  }

  html += `
    <button data-create-window="" class="btn btn-outline-primary flex flex-row justify-center items-center gap-1">
        <i class="fa-solid fa-plus"></i>CREATE NEW WINDOW
    </button>`;

  container.innerHTML = html;

  // Focus window when window card header or card button is clicked
  addHandlers("data-focus-window-id", focusWindow);

  // Focus window and tab when tab card header or card button is clicked
  addHandlers("data-focus-tab-id", focusTab);

  // Create new tab in window when create button clicked
  addHandlers("data-create-tab-window-id", createTab);

  // Create new window when create button clicked
  addHandlers("data-create-window", createWindow);

  // Close window when card button is clicked
  addHandlers("data-close-window-id", closeWindow);

  // Maximize window when card button is clicked
  addHandlers("data-maximize-window-id", maximizeWindow);

  // Minimize window when card button is clicked
  addHandlers("data-minimize-window-id", minimizeWindow);

  // Close tab when card button is clicked
  addHandlers("data-close-tab-id", closeTab);

  // Duplicate tab when card button is clicked
  addHandlers("data-duplicate-tab-id", duplicateTab);

  // Reload tab when card button is clicked
  addHandlers("data-reload-tab-id", reloadTab);

  // Go back tab when card button is clicked
  addHandlers("data-goback-tab-id", goBackTab);

  // Go forward tab when card button is clicked
  addHandlers("data-goforward-tab-id", goForwardTab);

  // Zoom in tab when card button is clicked
  addHandlers("data-zoomin-tab-id", zoomTab, 1);

  // Move tab left when card button is clicked
  addHandlers("data-moveleft-tab-id", moveTab, -1);

  // Move tab right when card button is clicked
  addHandlers("data-moveright-tab-id", moveTab, 1);

  // Pin tab when card button is clicked
  addHandlers("data-pin-tab-id", pinTab);

  // Unpin tab when card button is clicked
  addHandlers("data-unpin-tab-id", unpinTab);
}, 100);

/**
 * Handler helper methods
 */

function addHandlers(attribute, handler, ...args) {
  for (const el of [...document.querySelectorAll(`[${attribute}]`)]) {
    el.addEventListener("click", (e) => {
      handler(el.getAttribute(attribute), ...args);
    });
  }
}

/**
 * Window helper methods
 */

async function createWindow() {
  return chrome.windows.create({
    focused: true,
    url: "https://en.wikipedia.org/wiki/Special:Random",
  });
}

async function focusWindow(windowId) {
  return chrome.windows.update(parseInt(windowId, 10), {
    focused: true,
  });
}

async function closeWindow(windowId) {
  return chrome.windows.remove(parseInt(windowId, 10));
}

async function maximizeWindow(windowId) {
  return chrome.windows.update(parseInt(windowId, 10), { state: "maximized" });
}

async function minimizeWindow(windowId) {
  return chrome.windows.update(parseInt(windowId, 10), { state: "minimized" });
}

/**
 * Tab helper methods
 */

async function createTab(windowId) {
  return chrome.tabs.create({
    active: true,
    windowId: parseInt(windowId, 10),
    url: "https://en.wikipedia.org/wiki/Special:Random",
  });
}

async function focusTab(tabId) {
  const { windowId } = await chrome.tabs.get(parseInt(tabId, 10));

  await focusWindow(windowId);

  return chrome.tabs.update(parseInt(tabId, 10), {
    highlighted: true,
  });
}

async function closeTab(tabId) {
  return chrome.tabs.remove(parseInt(tabId, 10));
}

async function duplicateTab(tabId) {
  return chrome.tabs.duplicate(parseInt(tabId, 10));
}

async function reloadTab(tabId) {
  return chrome.tabs.reload(parseInt(tabId, 10));
}

async function goBackTab(tabId) {
  return chrome.tabs.goBack(parseInt(tabId, 10));
}

async function goForwardTab(tabId) {
  return chrome.tabs.goForward(parseInt(tabId, 10));
}

async function moveTab(tabId, moveOffset) {
  const { index } = await chrome.tabs.get(parseInt(tabId, 10));

  console.log(index, moveOffset);

  console.log(index + moveOffset);

  return chrome.tabs.move(parseInt(tabId, 10), { index: index + moveOffset });
}

async function zoomTab(tabId, zoomAdjust) {
  const currentZoomFactor = await chrome.tabs.getZoom(parseInt(tabId, 10));

  return chrome.tabs.setZoom(
    parseInt(tabId, 10),
    currentZoomFactor + zoomAdjust
  );
}

async function pinTab(tabId) {
  return chrome.tabs.update(parseInt(tabId, 10), { pinned: true });
}

async function unpinTab(tabId) {
  return chrome.tabs.update(parseInt(tabId, 10), { pinned: false });
}

/**
 * Window event handlers
 */

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

/**
 * Tab event handlers
 */

chrome.tabs.onActivated.addListener(() => {
  showToast({ body: `Tab activated` });

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

chrome.tabs.onUpdated.addListener(() => {
  showToast({ body: `Tab updated` });

  updateWindowsAndTabs();
});

chrome.tabs.onZoomChange.addListener(() => {
  showToast({ body: `Tab zoom changed` });

  updateWindowsAndTabs();
});

// Render the view for the first time
updateWindowsAndTabs();
