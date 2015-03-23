jspm bundle-sfx -m lib/bootstrap target/app.js
s3cmd put -P boot.js       s3://gdn-cdn/2015/mar/disney-villans-quiz/ --add-header="Cache-Control: max-age=300"
s3cmd put -P target/app.js s3://gdn-cdn/2015/mar/disney-villans-quiz/ --add-header="Cache-Control: max-age=300"
