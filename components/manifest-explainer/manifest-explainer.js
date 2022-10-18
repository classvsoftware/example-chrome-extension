import { initializeComponent } from "/scripts/shared.js";

initializeComponent();

const escapeHtml = (unsafe) => {
  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

const manifest = chrome.runtime.getManifest();

const content = document.querySelector("#content");
content.className = "flex flex-col items-stretch gap-8";

for (let [key, value] of Object.entries(manifest)) {
  console.log(key, value);

  let description = "";

  switch (key) {
    case "action":
      description =
        "Defines what happens when the toolbar icon button is clicked.";
      break;
    case "background":
      description = "Defines how the background service worker should execute.";
      break;
    case "commands":
      description =
        "Defines the extensions's keyboard commands. Can be used to create a shortcut for both the popup and custom tasks.";
      break;
    case "content_scripts":
      description =
        "Defines JS and CSS that be injected into pages, as well as where and in what manner they will be injected.";
      break;
    case "current_locale":
      description =
        "Defines the extensions's current locale. Used in conjunction with messages.json";
      break;
    case "declarative_net_request":
      description =
        "Defines the default rules for the extension. These can be programmatically modified.";
      break;
    case "default_locale":
      description =
        "Defines the extensions's default locale. Used in conjunction with messages.json";
      break;
    case "description":
      description =
        "Short blurb about this extension. Displays in the web store listing and the extension management page.";
      break;
    case "devtools_page":
      description =
        "Defines the path to the top-level devtools page that will initialize all the devtools resources.";
      break;
    case "host_permissions":
      description =
        "Defines which hosts this extension has permission to interact with.";
      break;
    case "icons":
      description =
        "Defines the extension's icons. These are used in the toolbar, in the web store listing, and in the extension management page.";
      break;
    case "key":
      description =
        "Used during local development to explicitly specify the extension's ID.";
      break;
    case "manifest_version":
      description = "Defines manifest v2 or v3";
      break;
    case "name":
      description =
        "Defines the formal extension name. Used in the web store listing and in the extension management page.";
      break;
    case "oauth2":
      description = "Configures OAuth for the native browser OAuth APIs.";
      break;
    case "omnibox":
      description =
        "Defines the keyword that will trigger the omnibox interface.";
      break;
    case "options_ui":
      description = "Configures how the options interface should behave.";
      break;
    case "permissions":
      description = "Defines which permissions the extension requires.";
      break;
    case "version":
      description = "Specifies the semantic version number of this release.";
      break;
    case "web_accessible_resources":
      description =
        "Specifies which files may be served via network request to a webpage, and where they are accessible from.";
      break;
    default:
      break;
  }

  content.innerHTML += `
    <div class="card">
        <div class="card-header"><span class="font-bold font-mono">${key}</span><span class="text-gray-500 ml-4">${description}</span></div>
        <div class="card-body">
            <pre class="overflow-x-auto">${escapeHtml(
              JSON.stringify(value, null, 2)
            )}</pre>
        </div>
    </div>
  `;
}
