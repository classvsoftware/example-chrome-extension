import { toggleContentScriptWidget } from "/scripts/content-scripts/shared.js";
import { initializeComponent } from "/scripts/shared.js";

initializeComponent().then(() => {
  document
    .querySelector("#toggle-content-script-widget")
    .addEventListener("click", toggleContentScriptWidget);
});
