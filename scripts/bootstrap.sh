#!/bin/bash -eux

export PREPARE_NO_BUILD=true

yarn install

# Some packages require running `yarn install` on their directory to
# build successfully.
for package in packages/loader-angular packages/react-web-runtime; do
  pushd $package
  yarn install
  popd
done

nx run-many --target=build
