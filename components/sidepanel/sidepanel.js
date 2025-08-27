import { initializeComponent, showToast } from "/scripts/shared.js";

initializeComponent();

const els = {
  select: document.querySelector("#windowSelect"),
  openBtn: document.querySelector("#openSidePanel"),
};

async function populateWindows() {
  try {
    const [current, windows] = await Promise.all([
      chrome.windows.getCurrent(),
      chrome.windows.getAll({ windowTypes: ["normal"], populate: false }),
    ]);

    els.select.innerHTML = "";
    for (const w of windows) {
      const opt = document.createElement("option");
      opt.value = String(w.id);
      opt.textContent = `Window ${w.id}${w.id === current.id ? " (current)" : ""}`;
      els.select.appendChild(opt);
    }
    // Default to current window
    els.select.value = String(current.id);
  } catch (err) {
    // If listing windows fails (e.g., missing "windows" permission), fall back to current window only.
    try {
      const current = await chrome.windows.getCurrent();
      els.select.innerHTML = "";
      const opt = document.createElement("option");
      opt.value = String(current.id);
      opt.textContent = `Window ${current.id} (current)`;
      els.select.appendChild(opt);
    } catch (innerErr) {
      showToast({ body: `Failed to detect windows: ${innerErr}` });
    }
  }
}

els.openBtn.addEventListener("click", async () => {
  try {
    const windowId = Number(els.select.value);
    await chrome.sidePanel.open({ windowId }); // open panel for the chosen window
  } catch (err) {
    showToast({
      body: `Failed to open side panel: ${err}`,
    });
  }
});

populateWindows();
