chrome.devtools.panels.create(
    "Devtools Panel",
    "../icons/codesearch_16x16.png",
    "../devtools_panel.html"
);

chrome.devtools.panels.elements.createSidebarPane("Devtools Sidebar",
  (sidebar) => {
    sidebar.setPage("/devtools_sidebar.html");
    sidebar.setHeight("100px");
  }
);