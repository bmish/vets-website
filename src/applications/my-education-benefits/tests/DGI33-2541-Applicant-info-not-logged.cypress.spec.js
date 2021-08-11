import ApplicantPage from './support/pageObjects/applicant-info';
import Introduction from './support/pageObjects/introduction.js';
import applicant from './fixtures/data/applicant.json';

describe('Applicant Info pg test 1', () => {
  const applicantPg = new ApplicantPage();
  const introductionPage = new Introduction();
  // let applicant

  beforeEach(() => {
    // cy.fixture('./fixtures/data/applicant.json').then((user) => {
    //     applicant = user
    // })

    cy.visit('/my-education-benefits/introduction');
    introductionPage
      .applyWithoutSigning()
      .should('have.text', 'Start your application without signing in')
      .click();
  });

  it('Tests the Applicant land on "Applicant Information" page ', () => {
    // Then  the Applicant will land on "Applicant Information" page
    cy.url().should('contain', '/applicant/information');

    // Then  there will be a title "Apply for VA education benefits" Form 22-1990
    applicantPg.header().should('have.text', 'Apply for VA education benefits');
    applicantPg.subtitle().should('have.text', 'Form 22-1990');

    // And   there will be a progression bar
    applicantPg.progressBar().should('be.visible');

    // And   text "Step 1 of 4 Application Information"
    applicantPg
      .formHeader()
      .should('have.text', 'Step 1 of 3: Applicant information');

    // for now it has only 4 progress bars
    cy.get('.progress-bar-segmented')
      .find('div')
      .should('have.length', 3)
      .each($el => {
        expect($el).to.have.class('progress-segment');
      });
  });

  it('Tests text Field labeled "Your full name" ', () => {
    // text Field labeled "Your full name" with claimant's Full Name, required field
    applicantPg.yourFullName().should('have.text', 'Your full name');
    // cy.screenshot('applicant-info-page')

    // clicking the edit button next to "Your full name" and extensible
    applicantPg
      .editYourFullName()
      .should('be.extensible')
      .click();

    // validating that the three labels for first, middle, last name and suffix exist and visible
    applicantPg
      .yourFirstName()
      .should('exist')
      .and('be.visible');
    applicantPg
      .yourMiddleName()
      .should('exist')
      .and('be.visible');
    applicantPg
      .yourLastName()
      .should('exist')
      .and('be.visible');
    applicantPg
      .suffix()
      .should('exist')
      .and('be.visible');

    // validating that the three inputs for first, middle, last name exist and visible
    applicantPg
      .firstNameInput()
      .should('exist')
      .and('be.visible');
    applicantPg
      .middleNameInput()
      .should('exist')
      .and('be.visible');
    applicantPg
      .lastNameInput()
      .should('exist')
      .and('be.visible');
    applicantPg
      .suffixDropDown()
      .should('exist')
      .and('be.visible');
    applicantPg.cancelButtonYourName().click;
  });
  it('Tests text Field labeled "Your date of birth" ', () => {
    applicantPg.yourDateOfBirth().should('have.text', 'Your date of birth');

    // clicking the edit button next to "Your date of birth" and cancelling
    applicantPg.editDateOfBirth().click();

    // validating Your date of birth labels such as Month, day and year
    applicantPg
      .dateOfBirthLabel()
      .should('exist')
      .and('be.visible');
    applicantPg
      .monthLabel()
      .should('exist')
      .and('be.visible');
    applicantPg
      .dayLabel()
      .should('exist')
      .and('be.visible');
    applicantPg
      .yearLabel()
      .should('exist')
      .and('be.visible');

    // validating that three month, day and year input fields exist and visible
    applicantPg
      .monthInput()
      .should('exist')
      .and('be.visible');
    applicantPg
      .dayInput()
      .should('exist')
      .and('be.visible');
    applicantPg
      .yearInput()
      .should('exist')
      .and('be.visible');

    applicantPg.cancelButtonSingle().click();
  });

  it('Tests "Your full name" input fields with Valid data ', () => {
    // clicking on edite button
    applicantPg.editYourFullName().click();

    const insertedText = () => {
      let str;
      str = `${applicant[0].firstName} `;
      str += `${applicant[0].middleName}  `;
      str += `${applicant[0].lastName} `;
      str += applicant[0].prefix;
      return str;
    };
    cy.log(insertedText());

    // entering first, middle, last name and loop Suffix selection and priting the full name
    applicantPg
      .firstNameInput()
      .type('{selectall}{backspace}')
      .type(applicant[0].firstName);
    applicantPg
      .middleNameInput()
      .type('{selectall}{backspace}')
      .type(applicant[0].middleName);
    applicantPg
      .lastNameInput()
      .type('{selectall}{backspace}')
      .type(applicant[0].lastName);
    applicantPg.suffixDropDown().select(applicant[0].prefix);
    applicantPg.updateButton().click();
    applicantPg.fullNameConfirmation().should('have.text', insertedText());

    applicantPg.editYourFullName().click();
    applicantPg
      .firstNameInput()
      .type('{selectall}{backspace}')
      .type(applicant[0].firstName);
    applicantPg
      .middleNameInput()
      .type('{selectall}{backspace}')
      .type(applicant[0].middleName);
    applicantPg
      .lastNameInput()
      .type('{selectall}{backspace}')
      .type(applicant[0].lastName);
    applicantPg.suffixDropDown().select('III');
    applicantPg.cancelButtonSingle().click();
  });

  it('Tests "Your date of birth" input fields ', () => {
    // clicking on edite button
    applicantPg.editDateOfBirth().click();

    // //concatinating the DOB as a single string
    const insertedDate = () => {
      let str;
      str = `${applicant[0].dateOfBirth.month} `;
      str += `${applicant[0].dateOfBirth.day.toString()}, `;
      str += applicant[0].dateOfBirth.year;
      return str;
    };

    // printing the inserted DOB
    cy.log(insertedDate());

    applicantPg.monthInput().select(applicant[0].dateOfBirth.month);
    applicantPg.dayInput().select(applicant[0].dateOfBirth.day.toString());
    applicantPg
      .yearInput()
      .type('{selectAll}{backspace}')
      .type(applicant[0].dateOfBirth.year);
    applicantPg.updateButton().click();
    // asserting that the inserted DOB is shown on the page
    applicantPg.dateOfBirthConfirmation().should('have.text', insertedDate());

    // applicantPg.cancelButtonSingle().click()
    applicantPg.editDateOfBirth().click();
    applicantPg.monthInput().select(applicant[1].dateOfBirth.month);
    applicantPg.dayInput().select(applicant[1].dateOfBirth.day.toString());
    applicantPg
      .yearInput()
      .type('{selectAll}{backspace}')
      .type(applicant[1].dateOfBirth.year);
    applicantPg.cancelButtonSingle().click();

    // validating that the next date of birth has not been updated
    applicantPg.dateOfBirthConfirmation().should('have.text', insertedDate());
  });

  it('Tests the page navigation', () => {
    // clicking on back button
    applicantPg.backButtonAppInfoPage().click();

    // validating the introduction url
    cy.url().should('include', '/introduction');

    // clicking back on "start your application without sigining in"
    introductionPage.applyWithoutSigning().click();

    // Then  the Applicant will land on "Applicant Information" page
    cy.url().should('contain', '/applicant/information');

    // clicking on continue button
    applicantPg.continueButtonAppInfoPage().click();

    // validating the url on service history page
    cy.url().should('contain', '/contact/information');
  });

  it('invalid test data for "Your full name', () => {
    // clicking on edite button
    applicantPg.editYourFullName().click();

    // entering blank first, last name and clicking on update button
    applicantPg.firstNameInput().type('{selectall}{backspace}');
    applicantPg.lastNameInput().type('{selectall}{backspace}');

    cy.get('.update-button').click();

    // asserting that the error message is displayed
    applicantPg
      .firstNameErrorMsg()
      .should('contain.text', 'Please enter a first name');
    applicantPg
      .lastNameErrorMsg()
      .should('contain.text', 'Please enter a last name');
  });

  it('test data for "Your date of birth" with empty fields', () => {
    // clicking on edite button
    applicantPg.editDateOfBirth().click();

    // deselecting month and asserting the error message
    applicantPg
      .monthInput()
      .invoke('val', '')
      .trigger('change');
    applicantPg
      .dateOfBirthErrorMsg()
      .should('contain.text', 'Please enter a date');
    applicantPg.monthInput().select(applicant[0].dateOfBirth.month);

    // adding back the month and deselecting day and asserting the error message
    applicantPg
      .dayInput()
      .invoke('val', '')
      .trigger('change');
    applicantPg
      .dateOfBirthErrorMsg()
      .should('contain.text', 'Please enter a date');
    applicantPg.dayInput().select(applicant[0].dateOfBirth.day.toString());

    applicantPg.yearInput().clear();
    applicantPg
      .dateOfBirthErrorMsg()
      .should('contain.text', 'Please enter a date');
  });
});
