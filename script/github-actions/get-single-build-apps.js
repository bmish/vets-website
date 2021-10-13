/* eslint-disable no-console */
const find = require('find');
const path = require('path');
const core = require('@actions/core');

// Returns the entryName of the app that the given file belongs to
const getEntryName = filePath => {
  const root = path.join(__dirname, '../..');
  const appDirectory = filePath.split('/')[2];

  console.log(filePath);
  console.log(root);

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

// console.log(
//   getEntryName(
//     'src/applications/vaos/appointment-list/components/AppointmentsPageV2/AppointmentListItem.jsx',
//   ),
// );

const changedFiles = process.env.CHANGED_FILE_PATHS.split(' ');
const singleAppBuild = true;
let entryNames = '';

changedFiles.forEach(file => {
  if (!file.startsWith('src/applications')) {
    console.log('Running full build');
    // core.ExitCode(0);
  } else {
    const entryName = getEntryName(file);
    entryNames += `${entryName},`;

    console.log(entryNames);
  }
});

core.exportVariable('SINGLE_APP_BUILD', singleAppBuild);
core.exportVariable('ENTRY_NAMES', entryNames);

// console.log(changedFiles);
// console.log(entryNames);
