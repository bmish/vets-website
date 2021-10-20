import React from 'react';
import { connect } from 'react-redux';

import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

import recordEvent from 'platform/monitoring/record-event';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import CallToActionWidget from 'applications/static-pages/cta-widget';
import { focusElement } from 'platform/utilities/ui';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { isEmptyAddress } from 'platform/forms/address/helpers';
import { selectVAPContactInfoField } from '@@vap-svc/selectors';
import { FIELD_NAMES } from '@@vap-svc/constants';
import {
  WIZARD_STATUS_NOT_STARTED,
  WIZARD_STATUS_COMPLETE,
} from 'platform/site-wide/wizard';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import {
  BASE_URL,
  SUPPLEMENTAL_CLAIM_URL,
  FACILITY_LOCATOR_URL,
  GET_HELP_REVIEW_REQUEST_URL,
  IS_PRODUCTION,
} from '../constants';
import {
  noContestableIssuesFound,
  showContestableIssueError,
  showHasEmptyAddress,
} from '../content/contestableIssueAlerts';
import WizardContainer from '../wizard/WizardContainer';
import {
  getHlrWizardStatus,
  setHlrWizardStatus,
  shouldShowWizard,
} from '../wizard/utils';

export class IntroductionPage extends React.Component {
  state = {
    status: getHlrWizardStatus() || WIZARD_STATUS_NOT_STARTED,
  };

  componentDidMount() {
    this.setPageFocus();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.status === WIZARD_STATUS_COMPLETE &&
      prevState.status !== WIZARD_STATUS_COMPLETE
    ) {
      // set focus on h1 only after wizard completes (wizard on /introduction)
      setTimeout(() => {
        this.setPageFocus();
      }, 100);
    }
  }

  setPageFocus = () => {
    // focus on h1 if wizard has completed
    // focus on breadcrumb nav when wizard is visible
    const focusTarget =
      this.state.status === WIZARD_STATUS_COMPLETE
        ? 'h1'
        : '.va-nav-breadcrumbs-list';
    focusElement(focusTarget);
    scrollToTop();
  };

  getCallToActionContent = () => {
    const { route, contestableIssues, delay = 250 } = this.props;

    if (contestableIssues?.error) {
      return showContestableIssueError(contestableIssues, delay);
    }

    const { formId, prefillEnabled, savedFormMessages } = route.formConfig;

    if (contestableIssues?.issues?.length > 0) {
      return (
        <SaveInProgressIntro
          formId={formId}
          prefillEnabled={prefillEnabled}
          messages={savedFormMessages}
          pageList={route.pageList}
          startText="Start the Request for a Higher-Level Review"
          gaStartEventName="decision-reviews-va20-0996-start-form"
          ariaDescribedby="main-content"
        />
      );
    }

    recordEvent({
      event: 'visible-alert-box',
      'alert-box-type': 'warning',
      'alert-box-heading':
        'We don’t have any issues on file for you that are eligible for a Higher-Level Review',
      'error-key': contestableIssues?.status || '',
      'alert-box-full-width': false,
      'alert-box-background-only': false,
      'alert-box-closeable': false,
    });
    return noContestableIssuesFound;
  };

  // Used for production only
  setWizardStatus = value => {
    setHlrWizardStatus(value);
    this.setState({ status: value });
  };

  render() {
    const {
      user,
      hasEmptyAddress,
      route,
      isProduction = IS_PRODUCTION, // for unit tests
    } = this.props;
    const callToActionContent = this.getCallToActionContent();
    const showWizard = shouldShowWizard(
      route.formConfig.formId,
      user.profile.savedForms,
    );

    // Change page title once wizard has closed to provide a Veteran using a
    // screenreader some indication that the content has changed
    const pageTitle = `Request a Higher-Level Review${
      showWizard ? '' : ' with VA Form 20-0996'
    }`;
    const subTitle = 'Equal to VA Form 20-0996 (Higher-Level Review)';

    // check if user has address
    if (user?.login?.currentlyLoggedIn && hasEmptyAddress) {
      return (
        <article className="schemaform-intro">
          <FormTitle title={pageTitle} subTitle={subTitle} />
          {showHasEmptyAddress}
        </article>
      );
    }

    if (showWizard && isProduction) {
      return <WizardContainer setWizardStatus={this.setWizardStatus} />;
    }

    return (
      <article className="schemaform-intro">
        <FormTitle title={pageTitle} subTitle={subTitle} />
        <CallToActionWidget
          appId="higher-level-review"
          headerLevel={2}
          ariaDescribedby="main-content"
        >
          {callToActionContent}
        </CallToActionWidget>
        <h2 id="main-content" className="vads-u-font-size--h3">
          What’s a Higher-Level Review?
        </h2>
        <p>
          If you or your representative disagree with VA’s decision on your
          claim, you can request a Higher-Level Review. With a Higher-Level
          Review, a senior reviewer will take a new look at your case and the
          evidence you already provided. The reviewer will decide whether the
          decision can be changed based on a difference of opinion or an error.
        </p>
        <h2 className="vads-u-font-size--h3">
          You can’t submit new evidence with a Higher-Level Review
        </h2>
        <p>
          The senior reviewer will only review the evidence you already
          provided. If you have new and relevant evidence, you can{' '}
          <a href={SUPPLEMENTAL_CLAIM_URL}>file a Supplemental Claim</a>.
        </p>
        <div className="process schemaform-process">
          <h2 className="vads-u-font-size--h3">
            Follow the steps below to request a Higher-Level Review.
          </h2>
          <p className="vads-u-margin-top--2">
            if you don’t think this is the right form for you,{' '}
            <a
              href={`${BASE_URL}${isProduction ? '' : '/start'}`}
              className="va-button-link"
              onClick={event => {
                // prevent reload, but allow opening a new tab
                if (isProduction) {
                  event.preventDefault();
                }
                this.setWizardStatus(WIZARD_STATUS_NOT_STARTED);
                this.setPageFocus();
                recordEvent({ event: 'howToWizard-start-over' });
              }}
            >
              go back and answer questions again
            </a>
            .
          </p>
          <ol>
            <li className="process-step list-one">
              <h3 className="vads-u-font-size--h4">Prepare</h3>
              <p>To fill out this application, you’ll need your:</p>
              <ul>
                <li>Primary address</li>
                <li>
                  List of issues you disagree with and the VA decision date for
                  each
                </li>
                <li>Representative’s contact information (optional)</li>
              </ul>
              <p>
                <strong>What if I need help with my application?</strong>
              </p>
              <p>
                If you need help requesting a Higher-Level Review, you can
                contact a VA regional office and ask to speak to a
                representative. To find the nearest regional office, please call{' '}
                <Telephone contact={CONTACTS.VA_BENEFITS} />
                {' or '}
                <a href={FACILITY_LOCATOR_URL}>
                  visit our facility locator tool
                </a>
                .
              </p>
              <p>
                A Veterans Service Organization or VA-accredited attorney or
                agent can also help you request a decision review.
              </p>
              <a href={GET_HELP_REVIEW_REQUEST_URL}>
                Get help requesting a decision review
              </a>
              .
            </li>
            <li className="process-step list-two">
              <h3 className="vads-u-font-size--h4">Apply</h3>
              <p>
                Complete this Higher-Level Review form. After submitting the
                form, you’ll get a confirmation message. You can print this for
                your records.
              </p>
            </li>
            <li className="process-step list-three">
              <h3 className="vads-u-font-size--h4">VA Review</h3>
              <p>
                Our goal for completing a Higher-Level Review is 125 days. A
                review might take longer if we need to get records or schedule a
                new exam to correct an error.
              </p>
            </li>
            <li className="process-step list-four">
              <h3 className="vads-u-font-size--h4">Decision</h3>
              <p>
                Once we’ve processed your claim, you’ll get a notice in the mail
                with our decision.
              </p>
            </li>
          </ol>
        </div>
        <CallToActionWidget
          appId="higher-level-review"
          headerLevel={2}
          ariaDescribedby="main-content"
        >
          {callToActionContent}
        </CallToActionWidget>
        <div className="omb-info--container vads-u-padding-left--0">
          <OMBInfo resBurden={15} ombNumber="2900-0862" expDate="04/30/2024" />
        </div>
      </article>
    );
  }
}

function mapStateToProps(state) {
  const { form, user, contestableIssues } = state;
  return {
    form,
    user,
    contestableIssues,
    hasEmptyAddress: isEmptyAddress(
      selectVAPContactInfoField(state, FIELD_NAMES.MAILING_ADDRESS),
    ),
    hlrV2: state.featureToggles.hlrV2,
  };
}

const mapDispatchToProps = {
  toggleLoginModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);
