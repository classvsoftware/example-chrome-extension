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
