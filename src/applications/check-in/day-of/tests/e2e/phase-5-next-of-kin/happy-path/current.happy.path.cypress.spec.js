import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';
import '../../support/commands';
import Timeouts from 'platform/testing/e2e/timeouts';

describe('Check In Experience -- ', () => {
  describe('phase 5 -- ', () => {
    beforeEach(function() {
      cy.authenticate();
      cy.getSingleAppointment();
      cy.successfulCheckin();
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          checkInExperienceUpdateInformationPageEnabled: false,
          checkInExperienceDemographicsPageEnabled: true,
          checkInExperienceNextOfKinEnabled: true,
        }),
      );
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('current happy path', () => {
      cy.visitWithUUID();
      cy.get('h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('have.text', 'Check in at VA');
      cy.injectAxe();
      cy.axeCheck();
      cy.signIn();

      cy.get('h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('have.text', 'Is this your current contact information?');
      cy.injectAxe();
      cy.axeCheck();
      cy.get('[data-testid=yes-button]').click();

      cy.get('h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('have.text', 'Is this your current next of kin information?');
      cy.injectAxe();
      cy.axeCheck();
      cy.get('[data-testid=yes-button]').click();

      cy.get('h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('have.text', 'Your appointments');
      cy.get('.appointment-list').should('have.length', 1);
      cy.injectAxe();
      cy.axeCheck();
      cy.get('.usa-button').click();
      cy.get('va-alert > h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('include.text', 'checked in');
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
