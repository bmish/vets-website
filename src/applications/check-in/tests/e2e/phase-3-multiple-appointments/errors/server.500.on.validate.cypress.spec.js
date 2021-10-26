import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';
import mockSession from '../../../../api/local-mock-api/mocks/v2/sessions.responses';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.intercept('GET', '/check_in/v2/sessions/*', req => {
      req.reply(500, mockSession.createMockFailedResponse({}));
    });

    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        checkInExperienceMultipleAppointmentSupport: true,
        checkInExperienceUpdateInformationPageEnabled: false,
      }),
    );
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('C5736 - Validate - 500 api error', () => {
    const featureRoute =
      '/health-care/appointment-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287';
    cy.visit(featureRoute);
    cy.url().should('match', /error/);
    cy.get('h1').contains('We couldn’t check you in');
  });
});
