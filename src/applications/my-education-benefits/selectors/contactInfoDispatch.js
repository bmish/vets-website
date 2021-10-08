import { apiRequest } from 'platform/utilities/api';

const claimantInfoEndpoint = `http://localhost:3000/meb_api/v0/claimant_info`;

export const fetchContactInfo = async state => {
  if (state && state.contactInformation) {
    window.console.log('fetchContactInfo has state');
    return state.contactInformation;
  }

  window.console.log('fetchContactInfo doesn not have state');
  const claimantInfo = await apiRequest(claimantInfoEndpoint);
  window.console.log(claimantInfo);
  return claimantInfo;
};
