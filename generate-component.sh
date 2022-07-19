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

    <script src="/scripts/vendor/tailwind.js"></script>
    <script src="/scripts/vendor/bootstrap.js"></script>
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
import { initializeBoilerplate } from "/scripts/shared.js";

initializeBoilerplate({ title: "$1" });
EOF