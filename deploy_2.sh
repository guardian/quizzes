[ ! -f data/$1.json ] && echo "don't know any $1" && exit;

read -p "# edit this path into boot.js: http://interactive.guim.co.uk/`date +%Y/%m/`$1/app.js"
echo "# building lib/quizSpec.js..."

echo "export const quizSpec = " > lib/quizSpec.js
cat data/$1.json >> lib/quizSpec.js
echo ";" >> lib/quizSpec.js

echo "# building target/$1/app.js..."

jspm bundle-sfx -m lib/bootstrap target/$1/app.js

echo "# uploading to s3"

# s3cmd put -P boot.js s3://gdn-cdn/`date +%Y/%m/`$1/ --add-header='Cache-Control: max-age=300'
# s3cmd put -P target/$1/app.js s3://gdn-cdn/`date +%Y/%m/`$1/ --add-header='Cache-Control: max-age=300'

s3cmd put -P boot.js s3://gdn-cdn/`date +%Y/%m/`$1/ --add-header='Cache-Control: no-cache'
s3cmd put -P target/$1/app.js s3://gdn-cdn/`date +%Y/%m/`$1/ --add-header='Cache-Control: no-cache'

echo "# embed url: http://interactive.guim.co.uk/`date +%Y/%m/`$1/boot.js"