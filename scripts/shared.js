export const browser = chrome || browser;

const githubPrefix =
  "https://github.com/msfrisbie/demo-browser-extension/tree/master/components";

export async function initializeBoilerplate() {
  const headerWrapper = document.createElement("header");
  document.body.prepend(headerWrapper);
  headerWrapper.innerHTML = await fetch("/components/header/header.html").then(
    (r) => r.text()
  );

  const footerWrapper = document.createElement("footer");
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

  document.querySelector("#reload").addEventListener("click", () => {
    window.location.reload();
  });
}

let toastContainer = null;

export function showToast({ title, body, subtitle = "" }) {
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.classList.add(
      "absolute",
      "top-0",
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
<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="toast-header">
    <img src="/icons/codesearch_16x16.png" class="rounded mr-2" />
    <strong class="mr-auto">${title}</strong>
    <small>${subtitle}</small>
    <button
      type="button"
      class="ml-2 mb-1 close"
      data-dismiss="toast"
      aria-label="Close"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="toast-body">${body}</div>
</div>
  `;

  new bootstrap.Toast(toast.querySelector(".toast")).show();

  setTimeout(() => {
    toastContainer.removeChild(toast);
  }, 5000);
}
