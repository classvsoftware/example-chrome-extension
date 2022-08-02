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
  "options_ui": {
    "open_in_tab": false,
    "page": "options.html"
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
  <head>
    <link href="popup.css" rel="stylesheet" />
  </head>
  <body>
    <h1>Popup</h1>

    <script src="popup.js"></script>
  </body>
</html>
EOF

cat <<EOF >mvx/options.html
<!DOCTYPE html>
<html>
  <head>
    <link href="options.css" rel="stylesheet" />
  </head>
  <body>
    <h1>Options</h1>

    <script src="options.js"></script>
  </body>
</html>
EOF


cat <<EOF >mvx/background.js
chrome.runtime.onInstalled.addListener((object) => {
    console.log("Installed background!");
});
EOF


touch mvx/popup.css
touch mvx/options.css
touch mvx/popup.js
touch mvx/options.js
touch mvx/content-script.js