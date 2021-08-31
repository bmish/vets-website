import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import { withTranslation } from 'react-i18next';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const i18n = this.props.i18n;
    return (
      <div className="schemaform-intro">
        <FormTitle title={i18n.t('introductionPage.mainTitle')} />
        <p>{i18n.t('introductionPage.equalToForm')}</p>
        <SaveInProgressIntro
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the Application"
        >
          Please complete the 00-0000 form to apply for i18n form poc app.
        </SaveInProgressIntro>
        <h4>{i18n.t('introductionPage.stepsHeading')}</h4>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <h5>{i18n.t('introductionPage.step1.prepare')}</h5>
              <h6>
                {i18n.t('introductionPage.step1.toFillOutThisApplication')}
              </h6>
              <ul>
                <li>{i18n.t('introductionPage.step1.socialSecurityNumber')}</li>
              </ul>
              <p>
                <strong>
                  {i18n.t('introductionPage.step1.whatIfINeedHelp')}
                </strong>{' '}
                {i18n.t('introductionPage.step1.anAccreditedRepresentative')}{' '}
                <a href="/disability-benefits/apply/help/index.html">
                  {i18n.t('introductionPage.step1.getHelpFiling')}
                </a>
              </p>
            </li>
            <li className="process-step list-two">
              <h5>Apply</h5>
              <p>Complete this i18n form poc app form.</p>
              <p>
                After submitting the form, you’ll get a confirmation message.
                You can print this for your records.
              </p>
            </li>
            <li className="process-step list-three">
              <h5>VA Review</h5>
              <p>
                We process claims within a week. If more than a week has passed
                since you submitted your application and you haven’t heard back,
                please don’t apply again. Call us at.
              </p>
            </li>
            <li className="process-step list-four">
              <h5>Decision</h5>
              <p>
                Once we’ve processed your claim, you’ll get a notice in the mail
                with our decision.
              </p>
            </li>
          </ol>
        </div>
        <SaveInProgressIntro
          buttonOnly
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the Application"
        />
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo resBurden={30} ombNumber="0000-0000" expDate="12/31/2022" />
        </div>
      </div>
    );
  }
}

export default withTranslation()(IntroductionPage);
