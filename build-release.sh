
if [ -z "$1" ]
then
      echo "Provide a version"
      exit 1
fi

mkdir -p releases

# git archive -o releases/release-$1.zip HEAD

zip -R releases/release-$1.zip '*.json' '*.html' '*.js' '*.css' '*.png' '*.svg' '*.jpg' '*.jpeg' -x "mvx/*" "promo/*"