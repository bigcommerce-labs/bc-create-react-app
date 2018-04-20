#!/bin/bash
set -e

if [ "$CREATE_CONTAINER" == "true" ]
then
  bundle install
  yarn run build
  yarn run travis
  bundle exec ctfy travis_build

elif [ "$RUN_TESTS" == "true" ]
then
  yarn run test
fi
