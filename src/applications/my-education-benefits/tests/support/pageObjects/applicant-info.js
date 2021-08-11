class applicantPage {
  header() {
    return cy.get('h1');
  }

  subtitle() {
    return cy.get('.schemaform-subtitle');
  }

  progressBar() {
    return cy.get('.progress-bar-segmented');
  }
  formHeader() {
    return cy.get('#nav-form-header');
  }

  yourFullName() {
    return cy.contains('Your full name');
  }

  yourDateOfBirth() {
    return cy.contains('Your date of birth');
  }

  editYourFullName() {
    return cy.get(':nth-child(2) > .review-box > .review-box_button');
  }

  cancelButtonYourName() {
    return cy.get('.cancel-button');
  }

  editDateOfBirth() {
    return cy.get(':nth-child(3) > .review-box > .review-box_button');
  }

  cancelButtonYourDOB() {
    return cy.get(
      ':nth-child(2) > .review-box > .review-box_body > .vads-u-display--flex > .cancel-button',
    );
  }

  cancelButtonSingle() {
    return cy.get('.cancel-button');
  }

  yourFirstName() {
    return cy.get('label[id="root_fullName_first-label"');
  }

  yourMiddleName() {
    return cy.get('label[id="root_fullName_middle-label"');
  }
  yourLastName() {
    return cy.get('label[id="root_fullName_last-label"');
  }

  suffix() {
    return cy.get('#root_fullName_suffix-label');
  }

  firstNameInput() {
    return cy.get('input[id="root_fullName_first"');
  }
  middleNameInput() {
    return cy.get('input[id="root_fullName_middle"');
  }
  lastNameInput() {
    return cy.get('input[id="root_fullName_last"');
  }
  suffixDropDown() {
    return cy.get('select[id="root_fullName_suffix"');
  }

  dateOfBirthLabel() {
    return cy.get(
      ':nth-child(3) > .review-box > .review-box_body > .review-box_title',
    );
  }
  monthLabel() {
    return cy.contains('Month');
  }
  dayLabel() {
    return cy.contains('Day');
  }
  yearLabel() {
    return cy.contains('Year');
  }

  monthInput() {
    return cy.get('select[id="root_view:dateOfBirth_dateOfBirthMonth"');
  }

  dayInput() {
    return cy.get('select[id="root_view:dateOfBirth_dateOfBirthDay"');
  }

  yearInput() {
    return cy.get('input[id="root_view:dateOfBirth_dateOfBirthYear"');
  }
  updateButton() {
    return cy.get('.update-button');
  }

  reviewName() {
    return cy.get(
      ':nth-child(1) > .review-box > .review-box_group > .review-box_value',
    );
  }

  dateOfBirthConfirmation() {
    return cy.get(
      ':nth-child(3) > .review-box > .review-box_group > .review-box_value',
    );
  }

  selectedSuffix() {
    return cy.get('#root_fullName_suffix');
  }
  fullNameConfirmation() {
    return cy.get(
      ':nth-child(2) > .review-box > .review-box_group > .review-box_value',
    );
  }

  backButtonAppInfoPage() {
    return cy.get('button[type="button"][class="usa-button-secondary null"');
  }
  continueButtonAppInfoPage() {
    return cy.get('button[type="submit"][class="usa-button-primary null"');
  }
  firstNameErrorMsg() {
    return cy.get('#root_fullName_first-error-message');
  }

  lastNameErrorMsg() {
    return cy.get('#root_fullName_last-error-message');
  }
  dateOfBirthErrorMsg() {
    return cy.get('span[id="root_view:dateOfBirth_dateOfBirth-error-message"]');
  }
}
export default applicantPage;
