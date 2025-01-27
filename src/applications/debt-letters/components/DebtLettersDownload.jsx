import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import { setPageFocus } from '../utils/page';
import { MobileTableView } from './MobileTableView';
import { DebtLettersTable } from './DebtLettersTable';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const ErrorAlert = () => (
  <div
    className="usa-alert usa-alert-error vads-u-margin-top--0 vads-u-padding--3"
    role="alert"
  >
    <div className="usa-alert-body">
      <h3 className="usa-alert-heading">
        Your debt letters are currently unavailable.
      </h3>
      <p className="vads-u-font-family--sans">
        You can’t download your debt letters because something went wrong on our
        end.
      </p>
      <h4>What you can do</h4>
      <p className="vads-u-font-family--sans vads-u-margin-y--0">
        You can check back later or call the Debt Management Center at
        <Telephone className="vads-u-margin-x--0p5" contact="8008270648" /> to
        find out more information about how to resolve your debt.
      </p>
    </div>
  </div>
);

const DependentDebt = () => (
  <div
    className="usa-alert usa-alert-error vads-u-margin-top--0 vads-u-padding--3"
    role="alert"
  >
    <div className="usa-alert-body">
      <h3 className="usa-alert-heading">
        Your debt letters are currently unavailable.
      </h3>
      <p className="vads-u-font-family--sans">
        You can’t download your debt letters because something went wrong on our
        end.
      </p>
      <h4>What you can do</h4>
      <p className="vads-u-font-family--sans vads-u-margin-y--0">
        If you need to access debt letters that were mailed to you, call the
        Debt Management Center at <Telephone contact="8008270648" />.
      </p>
    </div>
  </div>
);

const NoDebtLinks = () => (
  <div className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--2">
    <div className="usa-alert-body">
      <h3 className="usa-alert-heading">You don’t have any VA debt letters</h3>
      <p className="vads-u-font-family--sans">
        Our records show you don’t have any debt letters related to VA benefits.
        If you think this is an error, please contact the Debt Management Center
        at <Telephone contact="8008270648" />.
      </p>
      <p className="vads-u-font-family--sans vads-u-margin-y--0">
        If you have VA health care copay debt, go to our
        <a className="vads-u-margin-x--0p5" href="/health-care/pay-copay-bill/">
          Pay your VA copay bill
        </a>
        page to learn about your payment options.
      </p>
    </div>
  </div>
);

const DownloadLettersAlert = () => (
  <va-alert
    class="vads-u-margin-top--4 vads-u-margin-bottom--4"
    status="warning"
  >
    <h3 slot="headline">
      Downloadable letters have incorrect repayment plan terms
    </h3>
    <p className="vads-u-font-size--base vads-u-font-family--sans">
      We’re sorry. The length of time listed for repayment plans in these
      letters is too short. Use the letters you get in the mail to find the
      correct repayment plan terms. If you have any questions, call us at
      <Telephone contact={'800-827-0648'} className="vads-u-margin-x--0p5" />
      (or
      <Telephone
        contact={'1-612-713-6415'}
        pattern={PATTERNS.OUTSIDE_US}
        className="vads-u-margin-x--0p5"
      />
      from overseas). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m.
      ET. If you have hearing loss, call TTY:
      <Telephone
        contact={CONTACTS[711]}
        pattern={PATTERNS['3_DIGIT']}
        className="vads-u-margin-left--0p5"
      />
      .
    </p>
    <p className="vads-u-font-size--base vads-u-font-family--sans">
      We’re working to fix this problem as fast as we can. Check back soon for
      updates.
    </p>
  </va-alert>
);

const DebtLettersView = ({
  debtLinks,
  isError,
  isVBMSError,
  hasDependentDebts,
}) => {
  const hasDebtLinks = !!debtLinks.length;

  if (isError || isVBMSError) return <ErrorAlert />;
  if (hasDependentDebts) return <DependentDebt />;
  if (!hasDebtLinks) return <NoDebtLinks />;

  return (
    <>
      <DebtLettersTable debtLinks={debtLinks} />
      <MobileTableView debtLinks={debtLinks} />
    </>
  );
};

const DebtLettersDownload = ({
  debtLinks,
  isError,
  isVBMSError,
  hasDependentDebts,
}) => {
  useEffect(() => {
    scrollToTop();
    setPageFocus('h1');
  });

  return (
    <div className="vads-l-row large-screen:vads-u-margin-x--neg2p5">
      <Breadcrumbs className="vads-u-font-family--sans">
        <a href="/">Home</a>
        <a href="/manage-va-debt">Manage your VA debt</a>
        <a href="/manage-va-debt/your-debt">Your debt</a>
        <a href="/manage-va-debt/your-debt/debt-letters">
          Download debt letters
        </a>
      </Breadcrumbs>

      <div className="large-screen:vads-l-col--8">
        <h1
          id="downloadDebtLetters"
          className="vads-u-margin-bottom--2"
          tabIndex="-1"
        >
          Download debt letters
        </h1>
        <p className="vads-u-font-weight--normal vads-u-color--gray-dark vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-font-size--lg">
          Download your debt letters, learn your payment options, or find out
          how to get help with your VA debts.
        </p>

        <DownloadLettersAlert />

        <h2>Your debt letters</h2>
        <DebtLettersView
          debtLinks={debtLinks}
          isError={isError}
          isVBMSError={isVBMSError}
          hasDependentDebts={hasDependentDebts}
        />
        <div className="vads-u-margin-bottom--6 vads-u-margin-top--5">
          <h2 className="vads-u-margin-y--0">
            What if the letter I’m looking for isn’t listed here?
          </h2>
          <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
            If you’ve received a letter about a VA debt that isn’t listed here,
            call us at
            <Telephone
              contact={'800-827-0648'}
              className="vads-u-margin-x--0p5"
            />
            (or
            <Telephone
              contact={'1-612-713-6415'}
              pattern={PATTERNS.OUTSIDE_US}
              className="vads-u-margin-x--0p5"
            />
            from overseas). You can also call us to get information about your
            resolved debts.
          </p>
          <p className="vads-u-font-family--sans">
            For medical copay debt, please go to
            <a
              className="vads-u-margin-x--0p5"
              href="/health-care/pay-copay-bill/"
            >
              pay your VA copay bill
            </a>
            to learn about your payment options.
          </p>
          <p>
            <Link
              className="vads-u-font-family--sans vads-u-font-size--sm"
              to="/"
            >
              <i aria-hidden="true" className="fa fa-chevron-left" /> Return to
              your list of debts.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ debtLetters }) => ({
  hasDependentDebts: debtLetters.hasDependentDebts,
  isError: debtLetters.isError,
  isVBMSError: debtLetters.isVBMSError,
  debtLinks: debtLetters.debtLinks,
});

DebtLettersDownload.propTypes = {
  hasDependentDebts: PropTypes.bool.isRequired,
  isVBMSError: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  debtLinks: PropTypes.arrayOf(
    PropTypes.shape({
      documentId: PropTypes.string,
      receivedAt: PropTypes.string,
      typeDescription: PropTypes.string,
    }),
  ),
};

DebtLettersDownload.defaultProps = {
  hasDependentDebts: false,
  isError: false,
  isVBMSError: false,
  debtLinks: [],
};

export default connect(mapStateToProps)(DebtLettersDownload);
