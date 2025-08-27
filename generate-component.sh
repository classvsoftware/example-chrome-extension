set -e

if [ -z "$1" ]
then
      echo "Provide a name"
      exit 1
fi

sed -i "" "s/]/{\"id\":\"$1\",\"title\":\"$1\",\"subtitle\":\"$1\",\"description\":\"$1\",\"showInDropdown\":true},]/" pages.js
 
mkdir components/$1

cat <<EOF >components/$1/$1.html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

<script type="module" src="/scripts/vendor/shared.js"></script>
    <link href="/styles/shared.css" rel="stylesheet" />

    <link href="$1.css" rel="stylesheet" />
    <script src="$1.js" type="module" defer></script>
  </head>
  <body>
    <div id="content"></div>
  </body>
</html>
EOF

cat <<EOF >components/$1/$1.css

EOF

cat <<EOF >components/$1/$1.js
import { initializeComponent } from "/scripts/shared.js";

initializeComponent();
EOF
