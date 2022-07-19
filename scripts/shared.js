const githubPrefix =
  "https://github.com/msfrisbie/demo-browser-extension/tree/master/components";

export async function initializeBoilerplate({ title = "" } = {}) {
  const headerWrapper = document.createElement("header");
  document.body.prepend(headerWrapper);
  headerWrapper.innerHTML = await fetch("/components/header/header.html").then(
    (r) => r.text()
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

  document.querySelector("#page-title").innerText = title;

  document.querySelector("#reload").addEventListener("click", () => {
    window.location.reload();
  });
}

let toastContainer = null;

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
<div class="toast text-white ${variant} border-0" role="alert" aria-live="assertive" aria-atomic="true" data-autohide="false">
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
