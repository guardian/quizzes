# Guardian quizzes

> A quiz is a form of game or mind sport in which the players (as individuals or in teams) attempt to answer questions correctly. In some countries, a quiz is also a brief assessment used in education and similar fields to measure growth in knowledge, abilities, and/or skills.
>
> --Wikipedia

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

### Configure GitHub authentication
If you get an error saying: `GitHub rate limit reached. To increase the limit use GitHub authentication`, you will need to set up GitHub authentication by following these steps:

- Create a new [personal access token](https://github.com/settings/applications#personal-access-tokens) for your GitHub account
- Run `jspm registry config github` and provide your username and access token when prompted
- Re-run `jspm install`

## To make a new quiz:
* tag the master branch
* replace lib/quizSpec.js
* edit deploy.sh and boot.js to have a new name

## To make sure you can deploy a quiz
* make sure you have `s3cmd` installed (`brew install s3cmd`)
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
