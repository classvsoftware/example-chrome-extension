# Generate simple disposable test extension

rm -rf mvx

mkdir mvx

cat <<EOF >mvx/manifest.json
{
  "name": "MVX",
  "version": "0.0.1",
  "manifest_version": 3,
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  "action": {
    "default_popup": "popup.html"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "css": [],
      "js": ["content-script.js"]
    }
  ]
}
EOF

cat <<EOF >mvx/popup.html
<!DOCTYPE html>
<html>
  <body>
    <h1>Popup</h1>

    <script src="popup.js"></script>
  </body>
</html>
EOF

cat <<EOF >mvx/background.js

console.log("Initialized background!");

chrome.runtime.onInstalled.addListener((object) => {
    console.log("Installed background!");
});
EOF

cat <<EOF >mvx/popup.js

console.log("Initialized popup.js!");
EOF

cat <<EOF >mvx/content-script.js

console.log("Initialized content script!");
EOF