#! deploy.sh
export BASE=$(cd $(dirname $0) && pwd -P)

# abort on errors
set -e
TAG=$(git describe --tags $(git rev-list --tags --max-count=1))

VERSION=(${TAG//./ })
MINOR_VERSION=${VERSION[2]}
MINOR_VERSION=$((MINOR_VERSION+1))

sed -i '' -e "s/{VERSION}/${VERSION[0]}.${VERSION[1]}.$MINOR_VERSION/g" $BASE/src/components/Home.vue

# build
npm run build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:hsuan9522/JH-Movie.git master:gh-pages

cd -
git checkout .