# Generate Minimum Viable Extension (mvx)

background="false"
contentscript="false"
options="false"
popup="false"

while getopts 'bcop' OPTION; do
  case "$OPTION" in
    b)
      background="true"
      ;;
    c)
      contentscript="true"
      ;;
    o)
      options="true"
      ;;
    p)
      popup="true"
      ;;
    ?)
      echo "script usage: generate-mvx.sh -b -c -o -p" >&2
      exit 1
      ;;
  esac
done
shift "$(($OPTIND -1))"

rm -rf mvx

mkdir mvx

BACKGROUND=""
CONTENTSCRIPT=""
OPTIONS=""
POPUP=""

if [ $background == "true" ]; 
then
read -r -d '' BACKGROUND << EOM 
,
  "background": {
    "service_worker": "background.js",
    "type": "module"
  }
EOM

cat <<EOF >mvx/background.js
chrome.runtime.onInstalled.addListener((object) => {
    console.log("Installed background!");
});
EOF
fi


if [ $contentscript == "true" ]; then
read -r -d '' CONTENTSCRIPT << EOM 
,
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "css": [],
      "js": ["content-script.js"]
    }
  ]
EOM

  touch mvx/content-script.js
fi


if [ $popup == "true" ]; then
read -r -d '' POPUP << EOM 
,
  "action": {
    "default_popup": "popup.html"
  }
EOM

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

  touch mvx/popup.js
  touch mvx/popup.css
fi


if [ $options == "true" ]; then
read -r -d '' OPTIONS << EOM 
,
  "options_ui": {
    "open_in_tab": false,
    "page": "options.html"
  }
EOM

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

touch mvx/options.css
touch mvx/options.js
fi

cat <<EOF >mvx/manifest.json
{
  "name": "MVX",
  "version": "0.0.1",
  "manifest_version": 3$BACKGROUND$POPUP$OPTIONS$CONTENTSCRIPT,
  "permissions": []
}
EOF


