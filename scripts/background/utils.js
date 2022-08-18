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

  // chrome.contextMenus.create({
  //   id: "foo",
  //   title: "first",
  //   contexts: ["all"],
  // });

  // chrome.contextMenus.create({
  //   id: "bar1",
  //   title: "second1",
  //   contexts: ["all"],
  //   type: "radio",
  // });

  // chrome.contextMenus.create({
  //   id: "bar2",
  //   title: "second2",
  //   contexts: ["all"],
  //   type: "radio",
  // });

  // chrome.contextMenus.create({
  //   id: "bar3",
  //   title: "second3",
  //   contexts: ["all"],
  //   type: "radio",
  // });

  // chrome.contextMenus.create({
  //   id: "baz",
  //   title: "third",
  //   contexts: ["all"],
  //   type: "separator",
  // });

  // chrome.contextMenus.create({
  //   id: "qux",
  //   parentId: "foo",
  //   title: "fourth",
  //   contexts: ["all"],
  //   type: "checkbox",
  // });

  function contextClick(info, tab) {
    console.log(info, tab);

    if (info.menuItemId.startsWith(QUICK_OPEN_PREFIX)) {
      const subId = info.menuItemId.replace(QUICK_OPEN_PREFIX, "");

      chrome.tabs.create({
        url: getPageUrl(subId),
      });
    }
  }

  chrome.contextMenus.onClicked.addListener(contextClick);
}
