export async function sendStaticRedirectRequest() {
  fetch("https://httpbin.org/anything/static/redirectme").then(
    () => {},
    () => {}
  );
}

export async function sendStaticBlockRequest() {
  fetch("https://httpbin.org/anything/static/blockme").then(
    () => {},
    () => {}
  );
}

export async function sendDynamicRedirectRequest() {
  fetch("https://httpbin.org/anything/dynamic/redirectme").then(
    () => {},
    () => {}
  );
}

export async function sendDynamicBlockRequest() {
  fetch("https://httpbin.org/anything/dynamic/blockme").then(
    () => {},
    () => {}
  );
}

export const CONTENT_SCRIPT_WIDGET_STORAGE_KEY = "CONTENT_SCRIPT_WIDGET_STORAGE_KEY";

export async function toggleContentScriptWidget() {
  // Use await directly with chrome.storage.sync.get
  const result = await chrome.storage.sync.get([CONTENT_SCRIPT_WIDGET_STORAGE_KEY]);
  const currentValue = result[CONTENT_SCRIPT_WIDGET_STORAGE_KEY] === "true"; // Convert to boolean
  const newValue = !currentValue;

  // Use await directly with chrome.storage.sync.set
  await chrome.storage.sync.set({ [CONTENT_SCRIPT_WIDGET_STORAGE_KEY]: newValue.toString() });
}
