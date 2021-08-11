class loginPage {
  emailInput() {
    return cy.get('#user_email');
  }
  passInput() {
    return cy.get('#user_password');
  }
}

export default loginPage;
