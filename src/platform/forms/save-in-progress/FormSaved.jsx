import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement, getScrollOptions } from 'platform/utilities/ui';
import { fetchInProgressForm, removeInProgressForm } from './actions';
import FormStartControls from './FormStartControls';
import { APP_TYPE_DEFAULT } from '../../forms-system/src/js/constants';
import { savedMessage } from 'platform/forms-system/src/js/utilities/save-in-progress-messages';

class FormSaved extends React.Component {
  constructor(props) {
    super(props);
    const scrollProps = props.scrollParams || getScrollOptions();
    this.scrollToTop = () => {
      scrollToTop('topScrollElement', scrollProps);
    };
    this.location = props.location || window.location;
  }
  componentDidMount() {
    // if we don’t have this then that means we’re loading the page
    // without any data and should just go back to the intro
    if (!this.props.lastSavedDate) {
      this.props.router.replace(this.props.route.pageList[0].path);
    } else {
      this.scrollToTop();
      focusElement('.usa-alert');
    }
  }

  getResumeOnly = () => {
    return this.props.route?.formConfig?.saveInProgress?.resumeOnly;
  };
  render() {
    const { formId, lastSavedDate, expirationMessage } = this.props;
    const { profile } = this.props.user;
    const { verified } = profile;
    const prefillAvailable = !!(
      profile && profile.prefillsAvailable.includes(formId)
    );
    const { success } = this.props.route.formConfig.savedFormMessages || {};
    const expirationDate = moment
      .unix(this.props.expirationDate)
      .format('MMMM D, YYYY');
    const appType =
      this.props.route.formConfig?.customText?.appType || APP_TYPE_DEFAULT;

    return (
      <div>
        <div className="usa-alert usa-alert-info">
          <div className="usa-alert-body">
            <strong>{savedMessage(this.props.route.formConfig)}</strong>
            <br />
            {!!lastSavedDate &&
              !!expirationDate && (
                <div className="saved-form-metadata-container">
                  <span className="saved-form-metadata">
                    Last saved on{' '}
                    {moment(lastSavedDate).format('MMMM D, YYYY [at] h:mm a')}
                  </span>
                  {expirationMessage || (
                    <p className="expires-container">
                      Your saved {appType}{' '}
                      <span className="expires">
                        will expire on {expirationDate}.
                      </span>
                    </p>
                  )}
                </div>
              )}
            {success}
            If you’re on a public computer, please sign out of your account
            before you leave so your information stays secure.
          </div>
        </div>
        {!verified && (
          <div className="usa-alert usa-alert-warning">
            <div className="usa-alert-body">
              We want to keep your information safe with the highest level of
              security. Please{' '}
              <a
                href={`/verify?next=${this.location.pathname}`}
                className="verify-link"
              >
                verify your identity
              </a>
              .
            </div>
          </div>
        )}
        <br />
        <FormStartControls
          startPage={this.props.route.pageList[1].path}
          router={this.props.router}
          formId={this.props.formId}
          returnUrl={this.props.returnUrl}
          migrations={this.props.migrations}
          fetchInProgressForm={this.props.fetchInProgressForm}
          prefillTransformer={this.props.prefillTransformer}
          removeInProgressForm={this.props.removeInProgressForm}
          prefillAvailable={prefillAvailable}
          formSaved
          resumeOnly={this.getResumeOnly()}
        />
      </div>
    );
  }
}

FormSaved.propTypes = {
  route: PropTypes.shape({
    pageList: PropTypes.arrayOf(
      PropTypes.shape({
        path: PropTypes.string,
      }),
    ),
    formConfig: PropTypes.object.isRequired,
  }),
  location: PropTypes.object,
  scrollParams: PropTypes.object,
  lastSavedDate: PropTypes.number.isRequired,
  expirationMessage: PropTypes.node,
};

function mapStateToProps(state) {
  return {
    formId: state.form.formId,
    returnUrl: state.form.loadedData.metadata.returnUrl,
    lastSavedDate: state.form.lastSavedDate,
    expirationDate: state.form.expirationDate,
    migrations: state.form.migrations,
    prefillTransformer: state.form.prefillTransformer,
    user: state.user,
  };
}

const mapDispatchToProps = {
  fetchInProgressForm,
  removeInProgressForm,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(FormSaved),
);

export { FormSaved };
