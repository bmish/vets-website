// ***********************************************

import LoginPage from '../support/pageObjects/loginPg.js';
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// import 'cypress-file-upload';
// to upload file use below code:
// const fileName = 'SampleFile.pdf';
// cypress.fixture(fileName).then(fileContent =>{
// cy.get('[type="file"]).upload({fileContent, fileName, mimeType: 'application/pdf});
// })
// cy.get('[type="submit"]).click()
// cy.contains("you uploaded a file. your notes on the file were:")
Cypress.Commands.add('login', () => {
  const loginPg = new LoginPage();
  loginPg.emailInput().type('vets.gov.user+295@gmail.com');
  loginPg.passInput().type('237SsNrLgPv5{enter}');
});
