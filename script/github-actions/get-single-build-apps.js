/* eslint-disable no-console */
const find = require('find');
const path = require('path');
const core = require('@actions/core');

/**
 * Takes a relative path and returns the entryName of
 * the app that the given path belongs to
 *
 * @param {*} filePath
 * @returns
 */
const getEntryName = filePath => {
  const root = path.join(__dirname, '../..');
  const appDirectory = filePath.split('/')[2];

  console.log(filePath);

  const manifestFile = find
    .fileSync(
      /manifest\.(json|js)$/,
      path.join(root, `./src/applications/${appDirectory}`),
    )
    .map(file => {
      // eslint-disable-next-line import/no-dynamic-require
      return require(file);
    })[0];

  console.log(manifestFile);
  return manifestFile.entryName;
};

const changedFiles = process.env.CHANGED_FILE_PATHS.split(' ');
const singleAppBuild = true;
let entryNames = '';
let appFolders = '';

changedFiles.forEach(file => {
  if (!file.startsWith('src/applications')) {
    console.log('Running full build');
    // core.ExitCode(0);
  } else {
    const entryName = getEntryName(file);
    const appFolderName = file.split('/')[2];

    entryNames += `${entryName},`;
    appFolders += `${appFolderName}|`;
    console.log(entryNames);
  }
});

appFolders = `(${appFolders})`;
console.log(appFolders);

core.exportVariable('SINGLE_APP_BUILD', singleAppBuild);
core.exportVariable('ENTRY_NAMES', entryNames);
core.exportVariable('APP_FOLDERS', appFolders);
