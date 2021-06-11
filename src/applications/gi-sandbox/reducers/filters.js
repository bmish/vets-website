import { INSTITUTION_FILTERS_CHANGED } from '../actions';

const INITIAL_STATE = Object.freeze({
  expanded: false,
  accredited: false,
  excludeCautionFlags: false,
  country: 'ALL',
  employers: true,
  hbcu: false,
  relaffil: false,
  preferredProvider: false,
  schools: true,
  singleGenderSchool: false,
  state: 'ALL',
  studentVeteran: false,
  type: 'ALL',
  yellowRibbonScholarship: false,
  vettec: true,
});

export default function(state = INITIAL_STATE, action) {
  let newState = { ...state };

  if (action.type === INSTITUTION_FILTERS_CHANGED) {
    newState = {
      ...newState,
      ...action.payload,
    };
  }

  return newState;
}
