set -e

if [ -z "$1" ]
then
      echo "Provide a name"
      exit 1
fi

# TARGET="<!-- DBX_TARGET -->"

# HEADERTPL="<li><a class=\"dropdown-item\" href=\"\/components\/$1\/$1.html\"><div>$1<\/div><small class=\"text-gray-500\">$1<\/small><\/a><\/li>$TARGET"

# sed -i "s/$TARGET/$HEADERTPL/" components/header/header.html

sed -i "" "s/]/,{\"id\":\"$1\",\"title\":\"$1\",\"subtitle\":\"$1\",\"description\":\"$1\"}]/" pages.json
 
mkdir components/$1

cat <<EOF >components/$1/$1.html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <script src="/scripts/vendor/tailwind.js"></script>
    <script src="/scripts/vendor/bootstrap.js"></script>
    <script src="/scripts/vendor/lodash.js"></script>
    <link href="/styles/vendor/bootstrap.css" rel="stylesheet" />
    <link href="/styles/vendor/fontawesome/css/all.min.css" rel="stylesheet" />
    <link href="/styles/shared.css" rel="stylesheet" />

    <link href="$1.css" rel="stylesheet" />
  </head>
  <body>
    <script src="$1.js" type="module"></script>
  </body>
</html>
EOF

cat <<EOF >components/$1/$1.css

EOF

cat <<EOF >components/$1/$1.js
import { initializeComponent } from "/scripts/shared.js";

initializeComponent();
EOF
