/* eslint-disable no-console */
const find = require('find');
const path = require('path');
const core = require('@actions/core');

const singleAppBuildConfig = require('../../config/single-app-build.json');

const changedFiles = process.env.CHANGED_FILE_PATHS.split(' ').filter(
  filePath => filePath.startsWith('src/applications'),
);

/**
 * Takes a relative path and returns the entryName of
 * the app that the given path belongs to.
 *
 * @param {String} filePath
 * @returns
 */
const getEntryName = filePath => {
  const root = path.join(__dirname, '../..');
  const appDirectory = filePath.split('/')[2];

  const manifestFile = find
    .fileSync(
      /manifest\.(json|js)$/,
      path.join(root, `./src/applications/${appDirectory}`),
    )
    .map(file => {
      // eslint-disable-next-line import/no-dynamic-require
      return require(file);
    })[0];

  return manifestFile.entryName;
};

/**
 * Checks if the given file is part of an app contained
 * in the list. The list should be an array of app entryNames.
 *
 * @param {String} file
 * @param {Array} allowlist
 * @returns
 */
const isInAppList = (file, appList) => {
  if (
    file.startsWith('src/applications') &&
    appList.includes(getEntryName(file))
  ) {
    return true;
  }
  return false;
};

/**
 * Generates a string of relative app directories based on
 * the given files and apps on the single app build config's allowlist.
 *
 * @param {Array} files
 * @param {Object} config
 * @returns
 */
const getAppFolders = (files, config) => {
  const appFolders = [];

  for (const file of files) {
    if (isInAppList(file, config.allow)) {
      const appFolderName = file.split('/')[2];
      appFolders.push(`src/applications/${appFolderName}`);
    } else {
      console.log('Files outside of apps on the allowlist were changed.');
      return '';
    }
  }

  console.log(`Changed app folders: ${appFolders}`);
  return appFolders.join(',');
};

core.exportVariable(
  'APP_FOLDERS',
  getAppFolders(changedFiles, singleAppBuildConfig),
);
