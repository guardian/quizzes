# Guardian quizzes

Next-gen Guardian quizzes

## Set up

```sh
cd quizzes
npm install -g jspm
npm install jspm
jspm install
python -m SimpleHTTPServer
```

Then navigate to `http://localhost:8000`


## To make a new quiz:
* tag the master branch
* replace lib/quizSpec.js
* edit deploy.sh and boot.js to have a new name
* update quizId in component.jsx so the stats go to the right place

## To make sure you can deploy a quiz
* make sure you have brew install s3cmd
* make sure you have an s3 key for the interactives bucket

## to deploy a quiz
* make a new interactive page in composer and point at the boot.js URL on interactive.guim.co.uk
* run build.sh for peace of mind/testing
* run sh deploy.sh (as many times as you like)

## pictures
* upload the pictures to batch uploader or media service
* create a crop
* add api. on the beginning of the Url
* find exports->assets in the json
* take the biggest url
* paste that into the quizSpec as the imageUrl
