import { initializeComponent } from "/scripts/shared.js";

initializeComponent();

document.querySelector("#openSidePanel").addEventListener("click", () => {
  chrome.sidePanel.open();
});
