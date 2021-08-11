class introduction {
  applyWithoutSigning() {
    return cy.get(':nth-child(5) > .va-button-link');
  }

  signButton() {
    return cy.contains('Sign in');
  }

  idDotMeButton() {
    return cy.get('button[class="usa-button-primary va-button-primary"');
  }
}

export default introduction;
