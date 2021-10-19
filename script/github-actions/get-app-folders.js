/* eslint-disable no-console */
const core = require('@actions/core');

const changedFiles = process.env.CHANGED_FILE_PATHS.split(' ');
const shouldTestAppFolders = true;
const appFolders = [];

changedFiles.forEach(file => {
  if (!file.startsWith('src/applications')) {
    console.log('Running full build');
    // core.ExitCode(0);
  } else {
    const appFolderName = file.split('/')[2];
    appFolders.push(appFolderName);
  }
});

// appFolders = `(${appFolders})`;
console.log(appFolders);

core.exportVariable('SHOULD_TEST_APP_FOLDERS', shouldTestAppFolders);
core.exportVariable('APP_FOLDERS', appFolders.join('|'));
