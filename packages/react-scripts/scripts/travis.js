const del = require('del');
const fs = require('fs-extra');
const path = require('path');
const paths = require('../config/paths');

const appBuild = paths.appBuild;

let version = getVersion();
createManifest(version);
createVersionedDirectory(version);
cleanDistDirectory(version);

function createManifest(version) {
  manifest = { version };

  fs.writeFileSync(
    path.join(paths.appBuild, 'manifest.json'),
    JSON.stringify(manifest)
  );
}

function getVersion() {
  return revision = require('child_process')
    .execSync('git rev-parse --verify HEAD')
    .toString().trim();
}

function createVersionedDirectory(version) {
  fs.copySync(appBuild, path.join(appBuild, version),
    {
      filter: (src) => !src.startsWith(path.join(appBuild, version))
    });
}

function cleanDistDirectory(version) {
  return del([
    `${appBuild}/**`,
    `!${appBuild}`,
    `!${appBuild}/${version}/**`,
    `!${appBuild}/manifest.json`,
  ]);
}
