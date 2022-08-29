
if [ -z "$1" ]
then
      echo "Provide a version"
      exit 1
fi

mkdir -p releases

git archive -o releases/release-$1.zip HEAD