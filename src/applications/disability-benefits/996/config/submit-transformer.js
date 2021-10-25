import { DEFAULT_BENEFIT_TYPE } from '../constants';

import {
  getRep,
  getConferenceTimes,
  getConferenceTime, // v2
  addIncludedIssues,
  addAreaOfDisagreement,
  getContact,
  getAddress,
  getPhone,
  getTimeZone,
} from '../utils/submit';
import { apiVersion1 } from '../utils/helpers';

export function transform(formConfig, form) {
  // https://dev-developer.va.gov/explore/appeals/docs/decision_reviews?version=current
  const mainTransform = formData => {
    let included;
    const version1 = apiVersion1(formData);
    const informalConference = formData.informalConference !== 'no';
    const attributes = {
      // This value may empty if the user restarts the form; see
      // va.gov-team/issues/13814
      benefitType: formData.benefitType || DEFAULT_BENEFIT_TYPE,
      informalConference,
      // informalConferenceRep & informalConferenceTimes are added below

      veteran: {
        timezone: getTimeZone(),
        address: getAddress(formData),
      },
    };

    if (version1) {
      attributes.sameOffice = formData.sameOffice || false;
      included = addIncludedIssues(formData);
    }
    if (!version1) {
      attributes.veteran.homeless = formData.homeless;
      attributes.veteran.phone = getPhone(formData);
      attributes.veteran.email = formData.veteran?.email || '';
      attributes.socOptIn = formData.socOptIn;
      included = addAreaOfDisagreement(addIncludedIssues(formData), formData);
    }

    // Add informal conference data
    if (informalConference) {
      if (version1) {
        attributes.informalConferenceTimes = getConferenceTimes(formData);
      } else {
        attributes.informalConferenceTime = getConferenceTime(formData);
      }
      if (formData.informalConference === 'rep') {
        attributes.informalConferenceRep = getRep(formData);
      }
      if (!version1) {
        attributes.informalConferenceContact = getContact(formData);
      }
    }

    return {
      data: {
        type: 'higherLevelReview',
        attributes,
      },
      included,
    };
  };

  // Not using _.cloneDeep on form data - it appears to replace `null` values
  // with an empty object; and causes submission errors due to type mismatch
  const transformedData = mainTransform(form.data);
  return JSON.stringify(transformedData);
}
