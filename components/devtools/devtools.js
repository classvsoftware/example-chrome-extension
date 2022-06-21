import { browser } from "/scripts/shared.js";

browser.devtools.panels.create(
  "Devtools Panel",
  "/icons/codesearch_16x16.png",
  "/components/devtools-panel/devtools-panel.html"
);

browser.devtools.panels.elements.createSidebarPane(
  "Devtools Sidebar",
  (sidebar) => {
    sidebar.setPage("/components/devtools-sidebar/devtools-sidebar.html");
    sidebar.setHeight("100px");
  }
);
