import format from 'date-fns/format';
import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';
import mockPatientCheckIns from '../../../../api/local-mock-api/mocks/v2/patient.check.in.responses';
import '../../support/commands';
import Timeouts from 'platform/testing/e2e/timeouts';

describe('Check In Experience -- ', () => {
  describe('phase 3 -- ', () => {
    beforeEach(() => {
      cy.authenticate();
      const rv1 = mockPatientCheckIns.createMultipleAppointments();
      const earliest = mockPatientCheckIns.createAppointment();
      earliest.startTime = '2021-08-19T03:00:00';
      const midday = mockPatientCheckIns.createAppointment();
      midday.startTime = '2021-08-19T13:00:00';
      const latest = mockPatientCheckIns.createAppointment();
      latest.startTime = '2027-08-19T18:00:00';
      rv1.payload.appointments = [latest, earliest, midday];

      const rv2 = mockPatientCheckIns.createMultipleAppointments();
      const newLatest = mockPatientCheckIns.createAppointment();
      newLatest.startTime = '2027-08-19T17:00:00';
      rv2.payload.appointments = [newLatest, earliest, midday];
      const responses = [rv1, rv2];

      cy.intercept(
        {
          method: 'GET',
          url: '/check_in/v2/patient_check_ins/*',
        },
        req => {
          req.reply(responses.shift());
        },
      ).as('testid');
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          checkInExperienceLowAuthenticationEnabled: true,
          checkInExperienceUpdateInformationPageEnabled: false,
        }),
      );
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Veterans may refresh their appointments', () => {
      cy.viewport(550, 750);
      cy.visitWithUUID();
      cy.get('h1').contains('Check in at VA');
      cy.injectAxe();
      cy.axeCheck();
      cy.signIn();

      cy.get('h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('contain', 'Your appointments');
      cy.get('.appointment-list > li').should('have.length', 3);
      cy.injectAxe();
      cy.axeCheck();
      cy.get(
        ':nth-child(3) > .appointment-summary > [data-testid=appointment-time]',
        { timeout: Timeouts.slow },
      )
        .should('be.visible')
        .and('contain', '6:00 p.m.');
      cy.get('[data-testid=update-text]')
        .should('be.visible')
        .and(
          'contain',
          `Latest update: ${format(new Date(), "MMMM d, yyyy 'at' h:mm aaaa")}`,
        );
      cy.scrollTo('bottom')
        .window()
        .its('scrollY')
        .should('not.equal', 0);
      cy.get('[data-testid=refresh-appointments-button]')
        .should('be.visible')
        .click();
      cy.window()
        .its('scrollY')
        .should('equal', 0);
      cy.injectAxe();
      cy.axeCheck();
      cy.get(
        ':nth-child(3) > .appointment-summary > [data-testid=appointment-time]',
        { timeout: Timeouts.slow },
      )
        .should('be.visible')
        .and('contain', '5:00 p.m.');
    });
  });
});
