console.log("Content script initialized");

(async () => {
  // For this to work, add exboost.mjs to web_accessible_resources in manifest.json
  const { default: ExBoost } = await import("/scripts/exboost.mjs");

  const { CONTENT_SCRIPT_WIDGET_STORAGE_KEY, toggleContentScriptWidget } =
    await import("/scripts/content-scripts/shared.js");

  chrome.storage.onChanged.addListener((changes, areaName) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      if (key !== CONTENT_SCRIPT_WIDGET_STORAGE_KEY) {
        continue;
      }

      if (newValue === "true") {
        renderContentScriptWidget();
      } else {
        removeContentScriptWidget();
      }
    }
  });

  // First-time setup
  chrome.storage.sync.get([CONTENT_SCRIPT_WIDGET_STORAGE_KEY], (result) => {
    if (result[CONTENT_SCRIPT_WIDGET_STORAGE_KEY] === "true") {
      renderContentScriptWidget();
    }
  });

  const CONTENT_SCRIPT_CONTAINER_ID =
    "EXAMPLE_CHROME_EXTENSION_CONTENT_SCRIPT_WIDGET";

  async function renderContentScriptWidget() {
    // Create a new, encapsulated 'div' element for the widget
    const widgetContainer = document.createElement("div");
    widgetContainer.setAttribute("id", CONTENT_SCRIPT_CONTAINER_ID);
    // Ensure the container is not affected by the page's CSS
    widgetContainer.style.all = "initial";
    // Set styles to make sure the widget is on top of the page
    widgetContainer.style.position = "fixed";
    widgetContainer.style.zIndex = "2147483647"; // Use a high value to ensure it's on top
    widgetContainer.style.top = "10px";
    widgetContainer.style.right = "10px";
    widgetContainer.style.backgroundColor = "transparent";

    // Attach the container to the document body
    document.body.appendChild(widgetContainer);

    // Create a shadow root to encapsulate styles and structure
    const shadowRoot = widgetContainer.attachShadow({ mode: "open" });

    // Add HTML content to the shadow DOM
    shadowRoot.innerHTML = `
    <style>
        :host {
            display: block;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
            color: #212529;
        }
        .widget-content {
            font-size: 16px;
            color: #212529;
            text-align: center;
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            padding: 1rem;
            border-radius: 0.25rem;
            box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,.075);
            display: flex;
            flex-direction: column;
            gap: 1rem;
            max-width: 400px;
        }
        button#toggle-content-script-widget {
            font-size: 1.5rem;
            color: #fff;
            background-color: #007bff;
            border-color: #007bff;
            padding: 0.375rem 0.75rem;
            border-radius: 0.25rem;
            cursor: pointer;
            line-height: 1.5;
            border: 1px solid transparent;
            transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }
        button#toggle-content-script-widget:hover {
            background-color: #0056b3;
            border-color: #0056b3;
        }

        .slot,
        .exboost-container {
            display: flex;
            flex-direction: column;
        }

        .slot {
            margin-top: 8rem;
            place-items: center;
        }

        .exboost-container {
            gap: 1rem;
            place-items: stretch;
        }

        .exboost-link {
            text-decoration: none;
            color: white;
            background-color: gray;
            border-radius: 1rem;
            padding: 0.5rem 1rem;
            text-align: center;
            opacity: 0.8;
        }

        .exboost-link:hover {
            text-decoration: none;
            color: white;
            opacity: 1;
        }

    </style>
    <div class="widget-content">
        <h1>This is a simple HTML widget.</h1>
        <h2>It is rendered inside a shadow DOM so its styling can be isolated from the host page.</h2>
        <button id="toggle-content-script-widget">TOGGLE CONTENT SCRIPT WIDGET</button>
        <div class="slot"></div>
        <a style="text-decoration:underline; color:blue; text-align:center" href="https://extensionboost.com" target="_blank">Get ExBoost</a>
    </div>

    `;

    shadowRoot
      .querySelector("#toggle-content-script-widget")
      .addEventListener("click", toggleContentScriptWidget);

    // ExBoost auto render
    ExBoost.renderSlotDataOrError({
      exboostSlotId: "demo-options-id",
      target: shadowRoot.querySelector(".slot"),
    });
  }

  async function removeContentScriptWidget() {
    const widgetContainer = document.body.querySelector(
      `#${CONTENT_SCRIPT_CONTAINER_ID}`
    );

    if (widgetContainer?.parentElement) {
      widgetContainer.parentElement.removeChild(widgetContainer);
    }
  }
})();
