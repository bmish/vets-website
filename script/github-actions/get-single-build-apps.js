/* eslint-disable no-console */
const find = require('find');
const path = require('path');
const core = require('@actions/core');

// Returns the entryName of the app that the given file belongs to
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

// console.log(
//   getEntryName(
//     'src/applications/vaos/appointment-list/components/AppointmentsPageV2/AppointmentListItem.jsx',
//   ),
// );

const changedFiles = process.env.CHANGED_FILE_PATHS.split(' ');
const singleAppBuild = true;
const entryNames = '';

changedFiles.forEach(file => {
  if (!file.startsWith('src/applications')) {
    console.log('Running full build');
    // core.ExitCode(0);
  } else {
    const entryName = getEntryName(file);
    entryNames.concat(`,${entryName}`);
  }
});

core.exportVariable('SINGLE_APP_BUILD', singleAppBuild);
core.exportVariable('ENTRY_NAMES', entryNames);

// console.log(changedFiles);
// console.log(entryNames);