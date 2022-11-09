import { pagesJson } from "./background/utils.js";

const githubPrefix =
  "https://github.com/msfrisbie/demo-browser-extension/tree/master/components";

let toastContainer = null;

export async function initializeComponent() {
  // Set a random hash on this page
  // window.location.hash = Math.random().toString(36).substring(2);

  const script = document.createElement("script");
  script.async = true;
  script.src = "/scripts/vendor/ga.js";

  document.body.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }

  const GA_ID = "G-RD0QVQ2X7R";

  gtag("js", new Date());
  gtag("config", GA_ID, {
    send_page_view: false,
  });
  gtag("event", "page_view", {
    page_path: window.location.path,
  });

  const currentPageId = window.location.href.match(/([a-zA-Z0-9-]+).html/)[1];

  gtag("send", "pageview", currentPageId);

  const headerWrapper = document.createElement("header");
  headerWrapper.className = "w-full";
  document.body.prepend(headerWrapper);
  headerWrapper.innerHTML = await fetch("/components/header/header.html").then(
    (r) => r.text()
  );

  const pages = await pagesJson();

  let menuHtml = "";
  let currentPageData = null;

  for (let page of pages) {
    if (page.id === currentPageId) {
      currentPageData = page;
    }

    console.log(await getExtensionMethods(page.id));

    // Build the dropdown menu objects. Not all pages should appear in here.
    if (page.showInDropdown) {
      menuHtml += `
        <li>
          <a class="dropdown-item" href="/components/${page.id}/${page.id}.html">
            <div>${page.title}</div>
            <div>
              <small class="text-gray-500"
                >${page.subtitle}</small
              >
            </div>
          </div>
          </a>
        </li>`;
    }
  }

  if (!currentPageData) {
    throw new Error("Cannot find page data");
  }

  document.title = currentPageData.title + " - Browser Extension Explorer";

  document.querySelector("#dbx-menu").innerHTML = menuHtml;

  for (const el of document.querySelectorAll("[data-component-title]")) {
    el.innerText = currentPageData.title;
  }

  document
    .querySelector("[data-set-active-tab-url]")
    .addEventListener("click", async (e) => {
      let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      chrome.tabs.update(tab.id, {
        url: e.target.getAttribute("data-set-active-tab-url"),
      });
    });

  document
    .querySelector("[data-open-in-tab]")
    .addEventListener("click", async (e) => {
      window.open(window.location.href);
      window.close();
    });

  const content = document.querySelector("#content");
  content.classList.add(
    "grid",
    "auto-rows-min",
    "place-items-stretch",
    "gap-8",
    "max-w-5xl",
    "w-full"
  );

  const footerWrapper = document.createElement("footer");
  footerWrapper.className = "flex flex-row items-end justify-start";
  document.body.appendChild(footerWrapper);

  const demoName = window.location.pathname
    .split("/")
    .reverse()[0]
    .split(".html")[0];

  const sourceCodeLinks = [
    {
      filename: `${demoName}.html`,
      url: `${githubPrefix}/${demoName}/${demoName}.html`,
    },
    {
      filename: `${demoName}.js`,
      url: `${githubPrefix}/${demoName}/${demoName}.js`,
    },
    {
      filename: `${demoName}.css`,
      url: `${githubPrefix}/${demoName}/${demoName}.css`,
    },
  ];

  const sourceCodeLinkHtml = sourceCodeLinks
    .map(
      ({ filename, url }) =>
        `<a class="btn btn-sm btn-link" role="button" target="blank" href="${url}">${filename}</a>`
    )
    .join("");

  footerWrapper.innerHTML = `
<div class="flex flex-row flex-wrap items-center gap-1">
  <div class="text-sm">Source code:</div>
  ${sourceCodeLinkHtml}
</div>`;

  document.querySelector("#page-title").innerText = currentPageData.title;
  document.querySelector("#page-description").innerHTML =
    currentPageData.description;

  document.querySelector("#reload").addEventListener("click", () => {
    window.location.reload();
  });
}

export function showToast({ variant = "bg-primary", body }) {
  if (!body) {
    throw new Error("Must provide body");
  }

  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.classList.add(
      "fixed",
      "bottom-0",
      "right-0",
      "p-4",
      "flex",
      "flex-col",
      "gap-4",
      "items-stretch",
      "z-50"
    );
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");

  toastContainer.appendChild(toast);

  toast.innerHTML = `
<div class="toast text-white ${variant} border-0" role="alert" aria-live="assertive" aria-atomic="true" data-autohide="false" style="min-width:540px;">
  <div class="flex flex-row justify-between items-center">
    <div class="toast-body">${body}</div>
    <button
      type="button"
      class="text-white text-4xl flex flex-col items-center justify-center"
      data-bs-dismiss="toast"
      aria-label="Close"
    >
      <span 
      style="height:3rem; width:3rem"  >&times;</span>
    </button>
  </div>
</div>
  `;

  new bootstrap.Toast(toast.querySelector(".toast")).show();

  setTimeout(() => {
    toastContainer.removeChild(toast);
  }, 5000);
}

export async function activeTab() {
  return chrome.tabs.query({ active: true, currentWindow: true });
}

export async function getExtensionMethods(id) {
  const scriptText = await fetch(`/components/${id}/${id}.js`).then((r) =>
    r.text()
  );

  const r = /chrome\.[a-zA-Z\.]+\(?/g;

  return [...scriptText.matchAll(r)].map((x) => {
    let method = x[0];

    if (method.endsWith("(")) {
      method += ")";
    }

    return method;
  });
}

export async function showWarningIfNotPopup() {
  const popups = chrome.extension.getViews({ type: "popup" });

  const el = document.querySelector("#popup-warning");

  if (!popups.includes(window)) {
    // if (!popup || popup.location.href !== window.location.href) {
    el.classList.remove("hidden");
  } else {
    el.classList.add("hidden");
  }
}

export async function showWarningIfPopup() {
  const popups = chrome.extension.getViews({ type: "popup" });

  const el = document.querySelector("#no-popup-warning");

  if (popups.includes(window)) {
    el.classList.remove("hidden");
  } else {
    el.classList.add("hidden");
  }
}

export async function showWarningIfNotPermittedScheme() {
  const listener = _.debounce(async () => {
    const [tab] = await activeTab();

    const el = document.querySelector("#permitted-scheme-warning");

    if (tab.url.match(/^https?:\/\/|^ftp:\/\/|^file:\/\/\//)) {
      el.classList.add("hidden");
    } else {
      el.classList.remove("hidden");
    }
  }, 100);

  chrome.tabs.onUpdated.addListener(listener);
  listener();
}

export async function showWarningIfNotDevtools() {
  const el = document.querySelector("#devtools-warning");

  if (!chrome.devtools) {
    el.classList.remove("hidden");
  } else {
    el.classList.add("hidden");
  }
}
