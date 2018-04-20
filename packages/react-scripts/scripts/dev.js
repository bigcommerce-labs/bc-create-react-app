'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const del = require('del');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const config = require('../config/webpack.config.dev');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printBuildError = require('react-dev-utils/printBuildError');
const appName = require(paths.appPackageJson).name;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// Remove all content but keep the directory so that
// if you're in it, you don't end up in Trash
fs.emptyDirSync(paths.appBuild);

console.log('Creating a development build...');

webpack(config).watch({ ignored: /node_modules/ }, (err, stats) => {
  if (err) {
    return reject(err);
  }
  const messages = formatWebpackMessages(stats.toJson({}, true));
  if (messages.errors.length) {
    // Only keep the first error. Others are often indicative
    // of the same problem, but confuse the reader with noise.
    if (messages.errors.length > 1) {
      messages.errors.length = 1;
    }
    console.log(chalk.red('Failed to compile.\n'));
    return printBuildError(new Error(messages.errors.join('\n\n')));
  }

  // Merge with the public folder
  copyPublicFolder();
  createManifest();

  if (messages.warnings.length) {
    console.log(chalk.yellow('Compiled with warnings.\n'));
    console.log(messages.warnings.join('\n\n'));
    console.log(
      '\nSearch for the ' +
      chalk.underline(chalk.yellow('keywords')) +
      ' to learn more about each warning.'
    );
    console.log(
      'To ignore, add ' +
      chalk.cyan('// eslint-disable-next-line') +
      ' to the line before.\n'
    );
  } else {
    console.log(chalk.green('Compiled successfully.\n'));
  }

  return cleanTranscludeDir().then(transcludeFiles);
});

function cleanTranscludeDir() {
  const transcludeDir = getTranscludeDir();

  return del([`${transcludeDir}/**`], { force: true });
}

function transcludeFiles() {
  const transcludeDir = getTranscludeDir();

  fs.copySync(paths.appBuild, transcludeDir);
}

function getTranscludeDir() {
  const bcAppDirectory = process.env.BC_APP_DIR || '../bigcommerce';
  const microappBuildPath = `vendor/bower_components/${appName}/build`;

  return path.join(bcAppDirectory, microappBuildPath);
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}
function createManifest() {
  const manifest = { version: 'dev' };

  fs.writeFileSync(
    path.join(paths.appBuild, 'manifest.json'),
    JSON.stringify(manifest)
  );
}
