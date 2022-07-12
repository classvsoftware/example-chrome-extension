chrome.devtools.panels.create(
  "Devtools Panel",
  "/icons/codesearch_16x16.png",
  "/components/devtools-panel/devtools-panel.html"
);

chrome.devtools.panels.elements.createSidebarPane(
  "Devtools Sidebar",
  (sidebar) => {
    sidebar.setPage("/components/devtools-sidebar/devtools-sidebar.html");
    sidebar.setHeight("100px");
  }
);
