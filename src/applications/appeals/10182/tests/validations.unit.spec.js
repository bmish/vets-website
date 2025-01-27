import { expect } from 'chai';
import sinon from 'sinon';

import { getDate } from '../utils/dates';
import {
  requireIssue,
  validateDate,
  isValidDate,
  contactInfoValidation,
  validAdditionalIssue,
  uniqueIssue,
  maxIssues,
  areaOfDisagreementRequired,
  optInValidation,
} from '../validations';
import { optInErrorMessage } from '../content/OptIn';
import { SELECTED, MAX_SELECTIONS } from '../constants';

const _ = undefined; // placeholder

describe('requireIssue validation', () => {
  let errorMessage = '';
  const errors = {
    addError: message => {
      errorMessage = message || '';
    },
    additionalIssues: {
      addError: message => {
        errorMessage = message || '';
      },
    },
  };

  beforeEach(() => {
    errorMessage = '';
  });

  it('should show an error if no issues are selected', () => {
    requireIssue(errors, _, _, _, _, _, {});
    // errorMessage will contain JSX
    expect(errorMessage).to.not.equal('');
  });

  it('should show an error if no issues are selected', () => {
    const data = {
      contestableIssues: [{ [SELECTED]: false }, {}],
      additionalIssues: [{ [SELECTED]: false }, {}],
    };
    requireIssue(errors, _, _, _, _, _, data);
    // errorMessage will contain JSX
    expect(errorMessage).to.not.equal('');
  });

  it('should not show an error if a single contestable issue is selected', () => {
    const data = {
      contestableIssues: [{ [SELECTED]: true }, {}],
      additionalIssues: [{ [SELECTED]: false }, {}],
    };
    requireIssue(errors, _, _, _, _, _, data);
    expect(errorMessage).to.equal('');
  });
  it('should not show an error if a single added issue is selected', () => {
    const data = {
      contestableIssues: [{ [SELECTED]: false }, {}],
      additionalIssues: [{ [SELECTED]: true }, {}],
    };
    requireIssue(errors, _, _, _, _, _, data);
    expect(errorMessage).to.equal('');
  });

  it('should not show an error if a two issues are selected', () => {
    const data = {
      contestableIssues: [{ [SELECTED]: true }, {}],
      additionalIssues: [{ [SELECTED]: true }, {}],
    };
    requireIssue(errors, _, _, _, _, _, data);
    expect(errorMessage).to.equal('');
  });
});

describe('validAdditionalIssue', () => {
  it('should not show an error for valid additional issues', () => {
    const errors = { addError: sinon.spy() };
    validAdditionalIssue(errors, {
      additionalIssues: [
        { issue: 'foo', decisionDate: getDate({ offset: { months: -1 } }) },
      ],
    });
    expect(errors.addError.called).to.be.false;
  });
  it('should show an error for additional issues with no name', () => {
    const errors = { addError: sinon.spy() };
    validAdditionalIssue(errors, {
      additionalIssues: [
        { issue: '', decisionDate: getDate({ offset: { months: -1 } }) },
      ],
    });
    expect(errors.addError.called).to.be.true;
  });
  it('should show an error for additional issues with an empty decision date', () => {
    const errors = { addError: sinon.spy() };
    validAdditionalIssue(errors, {
      additionalIssues: [{ issue: 'test', decisionDate: '' }],
    });
    expect(errors.addError.called).to.be.true;
  });
  it('should show an error for additional issues with an old decision date', () => {
    const errors = { addError: sinon.spy() };
    expect(
      validAdditionalIssue(errors, {
        additionalIssues: [
          { issue: 'test', decisionDate: getDate({ offset: { months: -15 } }) },
        ],
      }),
    );
    expect(errors.addError.called).to.be.true;
  });
});

describe('uniqueIssue', () => {
  const contestableIssues = [
    {
      attributes: {
        ratingIssueSubjectText: 'test',
        approxDecisionDate: '2021-01-01',
      },
    },
  ];

  it('should not show an error when there are no issues', () => {
    const errors = { addError: sinon.spy() };
    uniqueIssue(errors, _, _, _, _, _, {});
    expect(errors.addError.notCalled).to.be.true;
  });
  it('should not show an error when there are duplicate contestable issues', () => {
    const errors = { addError: sinon.spy() };
    uniqueIssue(errors, _, _, _, _, _, {
      contestableIssues: [contestableIssues[0], contestableIssues[0]],
    });
    expect(errors.addError.notCalled).to.be.true;
  });
  it('should not show an error when there are no duplicate issues (only date differs)', () => {
    const errors = { addError: sinon.spy() };
    uniqueIssue(errors, _, _, _, _, _, {
      contestableIssues,
      additionalIssues: [{ issue: 'test', decisionDate: '2021-01-02' }],
    });
    expect(errors.addError.notCalled).to.be.true;
  });
  it('should show an error when there is a duplicate additional issue', () => {
    const errors = { addError: sinon.spy() };
    uniqueIssue(errors, _, _, _, _, _, {
      contestableIssues,
      additionalIssues: [{ issue: 'test', decisionDate: '2021-01-01' }],
    });
    expect(errors.addError.called).to.be.true;
  });
  it('should show an error when there are multiple duplicate additional issue', () => {
    const errors = { addError: sinon.spy() };
    uniqueIssue(errors, _, _, _, _, _, {
      contestableIssues,
      additionalIssues: [
        { issue: 'test2', decisionDate: '2021-02-01' },
        { issue: 'test2', decisionDate: '2021-02-01' },
      ],
    });
    expect(errors.addError.called).to.be.true;
  });
});

describe('maxIssues', () => {
  it('should not show an error when the array length is less than max', () => {
    const errors = { addError: sinon.spy() };
    maxIssues(errors, []);
    expect(errors.addError.called).to.be.false;
  });
  it('should show not show an error when the array length is greater than max', () => {
    const errors = { addError: sinon.spy() };
    const validDate = getDate({ offset: { months: -2 } });
    const template = {
      issue: 'x',
      decisionDate: validDate,
      [SELECTED]: true,
    };
    maxIssues(errors, {
      contestableIssues: new Array(MAX_SELECTIONS + 1).fill(template),
    });
    expect(errors.addError.called).to.be.true;
  });
});

describe('validateDate & isValidDate', () => {
  let errorMessage = '';
  const errors = {
    addError: message => {
      errorMessage = message || '';
    },
  };

  beforeEach(() => {
    errorMessage = '';
  });

  it('should allow valid dates', () => {
    const date = getDate({ offset: { weeks: -1 } });
    validateDate(errors, date);
    expect(errorMessage).to.equal('');
    expect(isValidDate(date)).to.be.true;
  });
  it('should throw a invalid date error', () => {
    validateDate(errors, '200');
    expect(errorMessage).to.contain('provide a valid date');
    expect(isValidDate('200')).to.be.false;
  });
  it('should throw a range error for dates too old', () => {
    validateDate(errors, '1899');
    expect(errorMessage).to.contain('enter a year between');
    expect(isValidDate('1899')).to.be.false;
  });
  it('should throw an error for dates in the future', () => {
    const date = getDate({ offset: { weeks: 1 } });
    validateDate(errors, date);
    expect(errorMessage).to.contain('past decision date');
    expect(isValidDate(date)).to.be.false;
  });
  it('should throw an error for dates more than a year in the past', () => {
    const date = getDate({ offset: { weeks: -60 } });
    validateDate(errors, date);
    expect(errorMessage).to.contain('date less than a year');
    expect(isValidDate(date)).to.be.false;
  });
});

describe('contactInfoValidation', () => {
  const getData = ({
    email = true,
    phone = true,
    address = true,
    homeless = false,
  } = {}) => ({
    veteran: {
      email: email ? 'placeholder' : '',
      phone: phone ? { phoneNumber: 'placeholder' } : {},
      address: address ? { addressLine1: 'placeholder' } : {},
    },
    homeless,
  });
  it('should not show an error when data is available', () => {
    const addError = sinon.spy();
    contactInfoValidation({ addError }, null, getData());
    expect(addError.notCalled).to.be.true;
  });
  it('should have an error when email is missing', () => {
    const addError = sinon.spy();
    contactInfoValidation({ addError }, null, getData({ email: false }));
    expect(addError.called).to.be.true;
    expect(addError.args[0][0]).to.contain('add an email');
  });
  it('should have multiple errors when email & phone are missing', () => {
    const addError = sinon.spy();
    contactInfoValidation(
      { addError },
      null,
      getData({ email: false, phone: false }),
    );
    expect(addError.called).to.be.true;
    expect(addError.firstCall.args[0]).to.contain('add an email');
    expect(addError.secondCall.args[0]).to.contain('add a phone');
  });
  it('should have multiple errors when everything is missing', () => {
    const addError = sinon.spy();
    contactInfoValidation(
      { addError },
      null,
      getData({ email: false, phone: false, address: false }),
    );
    expect(addError.called).to.be.true;
    expect(addError.firstCall.args[0]).to.contain('add an email');
    expect(addError.secondCall.args[0]).to.contain('add a phone');
    expect(addError.thirdCall.args[0]).to.contain('add an address');
  });
  it('should not include address when homeless is true', () => {
    const addError = sinon.spy();
    contactInfoValidation(
      { addError },
      null,
      getData({ address: false, homeless: true }),
    );
    expect(addError.called).to.be.false;
  });
});

describe('areaOfDisagreementRequired', () => {
  it('should show an error with no selections', () => {
    const errors = { addError: sinon.spy() };
    areaOfDisagreementRequired(errors);
    expect(errors.addError.called).to.be.true;
  });
  it('should show an error with other selected, but no entry text', () => {
    const errors = { addError: sinon.spy() };
    areaOfDisagreementRequired(errors, {
      disagreementOptions: { other: true },
    });
    expect(errors.addError.called).to.be.true;
  });
  it('should not show an error with a single selection', () => {
    const errors = { addError: sinon.spy() };
    areaOfDisagreementRequired(errors, { disagreementOptions: { foo: true } });
    expect(errors.addError.called).to.be.false;
  });
  it('should not show an error with other selected with entry text', () => {
    const errors = { addError: sinon.spy() };
    areaOfDisagreementRequired(errors, {
      disagreementOptions: { other: true },
      otherEntry: 'foo',
    });
    expect(errors.addError.called).to.be.false;
  });
});

describe('optInValidation', () => {
  let errorMessage = '';
  const errors = {
    addError: message => {
      errorMessage = message || '';
    },
  };

  beforeEach(() => {
    errorMessage = '';
  });

  it('should show an error when the value is false', () => {
    optInValidation(errors, false);
    expect(errorMessage).to.equal(optInErrorMessage);
  });
  it('should not show an error when the value is true', () => {
    optInValidation(errors, true);
    expect(errorMessage).to.equal('');
  });
});
