import mockSession from '../../../api/local-mock-api/mocks/v2/sessions.responses';
import mockPreCheckIn from '../../../api/local-mock-api/mocks/v2/patient.pre.check.in.responses';
import mockPreCheckInPost from '../../../api/local-mock-api/mocks/v2/pre.check.in.responses';

class ApiInitializer {
  initializeSessionGet = {
    withSuccessfulNewSession: () => {
      cy.intercept('GET', '/check_in/v2/sessions/*', req => {
        req.reply(
          mockSession.createMockSuccessResponse('some-token', 'read.basic'),
        );
      });
    },
    withSuccessfulReturningSession: () => {
      cy.intercept('GET', '/check_in/v2/sessions/*', req => {
        req.reply(
          mockSession.createMockSuccessResponse('some-token', 'read.full'),
        );
      });
    },
    withFailure: (errorCode = 400) => {
      cy.intercept('GET', '/check_in/v2/sessions/*', req => {
        req.reply(errorCode, mockSession.createMockFailedResponse());
      });
    },
  };

  initializeSessionPost = {
    withSuccess: extraValidation => {
      cy.intercept('POST', '/check_in/v2/sessions', req => {
        if (extraValidation) {
          extraValidation(req);
        }
        req.reply(
          mockSession.createMockSuccessResponse('some-token', 'read.full'),
        );
      });
    },

    withFailure: (errorCode = 400) => {
      cy.intercept('POST', '/check_in/v2/sessions', req => {
        req.reply(errorCode, mockSession.createMockFailedResponse());
      });
    },
  };

  initializePreCheckInDataGet = {
    withSuccess: extraValidation => {
      cy.intercept('GET', '/check_in/v2/pre_check_ins/*', req => {
        if (extraValidation) {
          extraValidation(req);
        }
        req.reply(mockPreCheckIn.createMockSuccessResponse('some-token'));
      });
      return mockPreCheckIn.createMockSuccessResponse('some-token');
    },
    withFailure: (errorCode = 400) => {
      cy.intercept('GET', '/check_in/v2/pre_check_ins/*', req => {
        req.reply(errorCode, mockPreCheckIn.createMockFailedResponse());
      });
    },
  };

  initializePreCheckInDataPost = {
    withSuccess: extraValidation => {
      cy.intercept('POST', '/check_in/v2/pre_check_ins/', req => {
        if (extraValidation) {
          extraValidation(req);
        }
        req.reply(mockPreCheckInPost.createMockSuccessResponse('some-token'));
      });
    },
    withFailure: (errorCode = 400) => {
      cy.intercept('POST', '/check_in/v2/pre_check_ins/', req => {
        req.reply(errorCode, mockPreCheckInPost.createMockFailedResponse());
      });
    },
  };
}

export default new ApiInitializer();
