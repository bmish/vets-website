import basicUser from './fixtures/users/user-basic.json';

it('health care questionnaire list -- loads manager page -- feature enabled', () => {
  cy.fixture(
    'applications/health-care-questionnaire/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.enabled.json',
  ).then(features => {
    cy.intercept('GET', '/v0/feature_toggles*', features);
    cy.login(basicUser);
    cy.visit('/health-care/health-questionnaires/questionnaires/');
    cy.get('h1').contains('Your health questionnaires');
    cy.injectAxe();
    cy.axeCheck();
    cy.percySnapshot();
  });
});

it('health care questionnaire list -- does not load manager page -- feature disabled', () => {
  cy.fixture(
    'applications/health-care-questionnaire/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.disabled.json',
  ).then(features => {
    cy.intercept('GET', '/v0/feature_toggles*', features);
    const featureRoute = '/health-care/health-questionnaires/questionnaires/';
    cy.visit(featureRoute);
    cy.url().should('not.match', /health-care/);
    cy.percySnapshot();
  });
});
