import { activeTab } from "/scripts/shared.js";

export async function pagesJson() {
  return fetch("/pages.json")
    .then((r) => r.json())
    .then((pages) =>
      pages.map((page) => ({
        ...page,
        url: getPageUrl(page.id),
      }))
    );
}

export function getPageUrl(id) {
  return chrome.runtime.getURL(`/components/${id}/${id}.html`);
}

export function setColor() {
  let color = "#3aa757";

  chrome.storage.sync.set({ color });
}

export function openWelcomePage(details) {
  // Acquire the welcome page URL
  let url = chrome.runtime.getURL("components/welcome/welcome.html");

  // Open the welcome page in a new tab .
  chrome.tabs.create({ url });
}

export async function initializeContextMenus() {
  await chrome.contextMenus.removeAll();

  const QUICK_OPEN_PREFIX = "quickopen__";

  const pages = await pagesJson();

  chrome.contextMenus.create({
    id: "demo-menu",
    title: "Open Demo...",
    contexts: ["all"],
  });

  for (const page of pages) {
    chrome.contextMenus.create({
      id: `${QUICK_OPEN_PREFIX}${page.id}`,
      parentId: "demo-menu",
      title: page.title,
      contexts: ["all"],
    });
  }

  chrome.contextMenus.create({
    id: "separator-1",
    contexts: ["all"],
    type: "separator",
  });

  chrome.contextMenus.create({
    id: "demo-checkbox",
    title: "Check and uncheck me!",
    contexts: ["all"],
    type: "checkbox",
  });

  chrome.contextMenus.create({
    id: "demo-radio",
    title: "Select a radio button...",
    contexts: ["all"],
  });

  for (let i of [1, 2, 3, 4, 5]) {
    chrome.contextMenus.create({
      id: `demo-radio-${i}`,
      parentId: "demo-radio",
      title: `Radio ${i}`,
      contexts: ["all"],
      type: "radio",
    });
  }

  chrome.contextMenus.create({
    id: "separator-2",
    contexts: ["all"],
    type: "separator",
  });

  chrome.contextMenus.create({
    id: "demo-page",
    title: "You right clicked the page",
    contexts: ["page", "frame"],
  });

  chrome.contextMenus.create({
    id: "demo-selection",
    title: "You right clicked selected text",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "demo-media",
    title: "You right clicked a media element",
    contexts: ["image", "video", "audio"],
  });

  chrome.contextMenus.create({
    id: "demo-action",
    title: "You right clicked the toolbar icon",
    contexts: ["action"],
  });

  chrome.contextMenus.create({
    id: "demo-editable",
    title: "You right clicked a form input",
    contexts: ["editable"],
  });

  chrome.contextMenus.create({
    id: "demo-link",
    title: "You right clicked a link",
    contexts: ["link"],
  });

  chrome.contextMenus.create({
    id: "demo-disabled",
    title: "I'm disabled",
    enabled: false,
    contexts: ["all"],
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.runtime.sendMessage({
      id: "CONTEXT_MENU_CLICK",
      info,
      tab,
    });

    if (info.menuItemId.startsWith(QUICK_OPEN_PREFIX)) {
      chrome.tabs.create({
        url: getPageUrl(info.menuItemId.replace(QUICK_OPEN_PREFIX, "")),
      });
    }
  });
}

export function initializeMessageRelay() {
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    switch (msg.id) {
      case "BACKGROUND_MESSAGE_RELAY":
        sendResponse({
          text: `Background heard message ${msg.count}`,
          sender,
        });
        break;
      default:
        break;
    }
  });

  chrome.runtime.onConnect.addListener((port) => {
    switch (port.name) {
      case "BACKGROUND_PORT_RELAY":
        port.onMessage.addListener((msg) => {
          port.postMessage({
            text: `Background heard message ${msg.count}`,
            port,
          });
        });
        break;
      default:
        break;
    }
  });
}

export async function initializeOmnibox() {
  const pages = await pagesJson();

  chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
    const normalizedText = text.trim().toLowerCase();

    // Add suggestions to an array
    const suggestions = pages
      .filter((page) => {
        return (
          page.title.toLowerCase().includes(normalizedText) ||
          page.subtitle.toLowerCase().includes(normalizedText)
        );
      })
      .map((page) => {
        let title = page.title;
        let subtitle = page.subtitle;

        const titleStartIdx = title.toLowerCase().indexOf(normalizedText);
        if (titleStartIdx >= 0) {
          const titleEndIdx = titleStartIdx + normalizedText.length;
          title =
            title.slice(0, titleStartIdx) +
            "<match>" +
            title.slice(titleStartIdx, titleEndIdx) +
            "</match>" +
            title.slice(titleEndIdx);
        }

        const subtitleStartIdx = subtitle.toLowerCase().indexOf(normalizedText);
        if (subtitleStartIdx >= 0) {
          const subtitleEndIdx = subtitleStartIdx + normalizedText.length;
          subtitle =
            subtitle.slice(0, subtitleStartIdx) +
            "<match>" +
            subtitle.slice(subtitleStartIdx, subtitleEndIdx) +
            "</match>" +
            subtitle.slice(subtitleEndIdx);
        }

        return {
          content: page.url,
          deletable: true,
          description: `
          ${title}
          <dim>${subtitle}</dim>
          <url>${page.url}</url>`,
        };
      });

    // Set first suggestion as the default suggestion
    // chrome.omnibox.setDefaultSuggestion({
    //   description: suggestions[0].content,
    // });

    // Remove the first suggestion from the array since we just suggested it
    // suggestions.shift();

    // Suggest the remaining suggestions
    suggest(suggestions);
  });
}

chrome.omnibox.onInputEntered.addListener(async (text, disposition) => {
  let [tab] = await activeTab();

  chrome.tabs.update(tab.id, { url: text });
});
