import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';
import '../../support/commands';
import Timeouts from 'platform/testing/e2e/timeouts';

describe('Check In Experience -- ', () => {
  describe('phase 4 -- ', () => {
    beforeEach(function() {
      cy.authenticate();
      cy.getSingleAppointment();
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          checkInExperienceUpdateInformationPageEnabled: true,
          checkInExperienceDemographicsPageEnabled: true,
        }),
      );
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('everything Happy path', () => {
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

      cy.get('legend > h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('have.text', 'Do you need to update any information?');
      cy.injectAxe();
      cy.axeCheck();
      cy.get('[data-testid="no-button"]').click();

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
      cy.get('.appointment-list').should('have.length', 0);
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
