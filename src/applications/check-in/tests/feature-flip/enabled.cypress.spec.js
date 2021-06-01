import features from './mocks/enabled.json';

describe('Check In Experience -- ', () => {
  beforeEach(() => {
    if (Cypress.env('CI')) this.skip();
    cy.intercept('GET', '/v0/feature_toggles*', features);
  });
  it.skip('feature is enabled', () => {
    cy.visit('/check-in/welcome');
    cy.get('h1').contains('Appointment details');
  });
});
