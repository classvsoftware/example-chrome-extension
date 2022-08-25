chrome.devtools.panels.create(
  "Devtools Network Panel",
  "/icons/codesearch_16x16.png",
  "/components/devtools-network-panel/devtools-network-panel.html"
);

chrome.devtools.panels.create(
  "Devtools Inspected Window Panel",
  "/icons/codesearch_16x16.png",
  "/components/devtools-inspected-window-panel/devtools-inspected-window-panel.html"
);

chrome.devtools.panels.elements.createSidebarPane(
  "Devtools Elements Sidebar",
  (sidebar) => {
    sidebar.setPage(
      "/components/devtools-elements-sidebar/devtools-elements-sidebar.html"
    );
    sidebar.setHeight("100px");
  }
);

chrome.devtools.panels.sources.createSidebarPane(
  "Devtools Sources Sidebar",
  (sidebar) => {
    sidebar.setPage(
      "/components/devtools-sources-sidebar/devtools-sources-sidebar.html"
    );
    sidebar.setHeight("100px");
  }
);
