#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
# git checkout main
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io/
git push -f https://github.com/rebelArtists/rebelArtists.github.io.git master:gh-pages
