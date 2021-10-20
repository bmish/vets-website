/* eslint-disable no-console */
const find = require('find');
const path = require('path');
const core = require('@actions/core');

const allowList = require('../../config/single-app-build.json');

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

const isInAllowlistApp = file => {
  if (
    file.startsWith('src/applications') &&
    allowList.allow.includes(getEntryName(file))
  ) {
    return true;
  }
  return false;
};

const getAppFolders = () => {
  const changedFiles = process.env.CHANGED_FILE_PATHS.split(' ').filter(
    filePath => path(filePath.startsWith('src/applications')),
  );
  // const shouldTestAppFolders = false;
  const appFolders = [];

  for (const file of changedFiles) {
    if (isInAllowlistApp(file)) {
      const appFolderName = file.split('/')[2];
      appFolders.push(`src/applications/${appFolderName}`);
    } else {
      console.log('Files outside of apps on the allowlist were changed.');
      return '';
    }
  }

  console.log(appFolders);
  return appFolders.join(',');
};

// core.exportVariable('SHOULD_TEST_APP_FOLDERS');
core.exportVariable('APP_FOLDERS', getAppFolders());
