if [ -z "$1" ]
then
      echo "Provide a name"
      exit 1
fi

mkdir components/$1

cat <<EOF >components/$1/$1.html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <script src="/scripts/tailwind.js"></script>
    <script src="/scripts/bootstrap.js"></script>
    <link href="/styles/bootstrap.css" rel="stylesheet" />
    <link href="/styles/fontawesome/css/all.min.css" rel="stylesheet" />
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
import { browser, initializeBoilerplate } from "/scripts/shared.js";

initializeBoilerplate({ title: "$1" });
EOF