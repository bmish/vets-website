import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/claims-list.json';

let mockDetails = {};

beforeEach(() => {
  cy.initClaimDetailMocks(false, true, false, 8).then(data => {
    mockDetails = data;
  });
});

describe('Claims status test', () => {
  it('Shows the correct status for the claim', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList, mockDetails);
    trackClaimsPage.verifyInProgressClaim(false);
    trackClaimsPage.verifyClaimedConditions(['Hearing Loss (New)']);
    trackClaimsPage.verifyCompletedSteps(5);
    trackClaimsPage.verifyClosedClaim();
    trackClaimsPage.axeCheckClaimDetails();
    trackClaimsPage.verifyItemsNeedAttention(2);
  });
});
