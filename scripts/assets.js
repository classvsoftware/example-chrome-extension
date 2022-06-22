const scriptUrls = ["/scripts/tailwind.js", "/scripts/bootstrap.js"];
const styleUrls = [
  "/styles/bootstrap.css",
  "/styles/fontawesome/css/all.min.css",
  "/styles/shared.css",
];

for (let scriptUrl of scriptUrls) {
  let scriptTag = document.createElement("script");
  scriptTag.src = scriptUrl;
  document.head.appendChild(scriptTag);
}

for (let styleUrl of styleUrls) {
  let styleTag = document.createElement("link");
  styleTag.rel = "stylesheet";
  styleTag.href = styleUrl;
  document.head.appendChild(styleTag);
}
