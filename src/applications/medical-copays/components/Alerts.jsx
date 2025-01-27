import React from 'react';
import { currency, calcDueDate, formatDate } from '../utils/helpers';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const Alert = ({ children }) => children;

Alert.Error = () => (
  <va-alert
    class="row vads-u-margin-bottom--5"
    status="error"
    data-testid="error-alert"
  >
    <h2 slot="headline" className="vads-u-font-size--h3">
      We can’t access your current copay balances right now
    </h2>
    <p>
      We’re sorry. Something went wrong on our end. You won’t be able to access
      information about your copay balances at this time.
    </p>
    <h4>What you can do</h4>
    <p>
      <strong className="vads-u-margin-right--0p5">
        For questions about your payment or relief options,
      </strong>
      contact us at
      <Telephone contact={'866-400-1238'} className="vads-u-margin-x--0p5" />
      (TTY:
      <Telephone
        contact={CONTACTS[711]}
        pattern={PATTERNS['3_DIGIT']}
        className="vads-u-margin-left--0p5"
      />
      ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
    </p>
    <p>
      <strong className="vads-u-margin-right--0p5">
        For questions about your treatment or your charges,
      </strong>
      contact the VA health care facility where you received care.
    </p>
    <a href="https://www.va.gov/find-locations">
      Find the contact information for your facility
    </a>
  </va-alert>
);

Alert.ZeroBalance = ({ copay }) => (
  <va-alert
    class="row vads-u-margin-bottom--5"
    status="info"
    data-testid="zero-balance"
  >
    <h2 slot="headline" className="vads-u-font-size--h3">
      You don’t need to make a payment at this time
    </h2>
    <p className="vads-u-font-size--base vads-u-font-family--sans">
      Your balance is $0 and was updated on
      <span className="vads-u-margin-x--0p5" data-testid="updated-date">
        {formatDate(copay?.pSStatementDate)}
      </span>
      . You can
      <a href="#download-statements" className="vads-u-margin--0p5">
        download your previous statements
      </a>
      below.
    </p>
    <p>
      If you receive new charges, we’ll send you a statement in the mail and
      update your balance. Learn more about
      <a href="#balance-questions" className="vads-u-margin--0p5">
        what to do if you have questions about your balance
      </a>
      .
    </p>
  </va-alert>
);

Alert.NoHealthcare = () => (
  <va-alert
    class="row vads-u-margin-bottom--5"
    status="warning"
    data-testid="no-healthcare-alert"
  >
    <h2 slot="headline" className="vads-u-font-size--h3">
      You’re not enrolled in VA health care
    </h2>
    <p className="vads-u-font-size--base vads-u-font-family--sans">
      You can’t check copay balances at this time because our records show that
      you’re not enrolled in VA health care.
      <a
        href="https://va.gov/health-care/how-to-apply/"
        className="vads-u-margin-left--0p5"
      >
        Find out how to apply for VA health care benefits
      </a>
      .
    </p>
    <p>
      If you think this is incorrect, call our toll-free hotline at
      <Telephone contact={'877-222-8387'} className="vads-u-margin-x--0p5" />,
      Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
    </p>
  </va-alert>
);

Alert.NoHistory = () => (
  <va-alert
    class="row vads-u-margin-bottom--5"
    status="info"
    data-testid="no-history-alert"
  >
    <h2 slot="headline" className="vads-u-font-size--h3">
      You haven’t received a copay bill in the past 6 months
    </h2>
    <p className="vads-u-font-size--base vads-u-font-family--sans">
      You can’t check copay balances at this time because our records show that
      you haven’t received a copay bill in the past 6 months.
    </p>
    <p>
      If you think this is incorrect, contact the VA Health Resource Center at
      <Telephone contact={'866-400-1238'} className="vads-u-margin-left--0p5" />
      . (TTY:
      <Telephone
        contact={CONTACTS[711]}
        pattern={PATTERNS['3_DIGIT']}
        className="vads-u-margin-left--0p5"
      />
      ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
    </p>
  </va-alert>
);

Alert.Deceased = () => (
  <va-alert
    class="row vads-u-margin-bottom--5"
    status="warning"
    data-testid="deceased-alert"
  >
    <h2 slot="headline" className="vads-u-font-size--h3">
      Our records show that this Veteran is deceased
    </h2>
    <p className="vads-u-font-size--base vads-u-font-family--sans">
      We can’t show copay statements for this Veteran.
    </p>
    <p>
      If this information is incorrect, please call Veterans Benefits Assistance
      at <Telephone contact={'800-827-1000'} />, Monday through Friday, 8:00
      a.m. to 9:00 p.m. ET.
    </p>
  </va-alert>
);

Alert.Status = ({ copay }) => (
  <va-alert background-only status="info" data-testid="status-alert">
    <h2 className="vads-u-font-size--h3 vads-u-margin-y--0">
      {/* using vads-u-margin-left here causes the word "before" 
      to wrap to the next line so we need a {' '} space here */}
      Pay your {currency(copay?.pHAmtDue)} balance or request help before{' '}
      <span className="vads-u-line-height--4 no-wrap">
        {calcDueDate(copay?.pSStatementDate, 30)}
      </span>
    </h2>
    <p>
      To avoid late fees or collection action on your bill, you must pay your
      full balance or request financial help before
      <span className="vads-u-margin-left--0p5">
        {calcDueDate(copay?.pSStatementDate, 30)}
      </span>
      .
    </p>
    <p>
      <a className="vads-c-action-link--blue" href="#how-to-pay">
        Learn how to pay your copay bill
      </a>
    </p>
    <p>
      <a className="vads-c-action-link--blue" href="#how-to-get-financial-help">
        Request help with your bill
      </a>
    </p>
    <h3 className="vads-u-font-size--h4">
      What if I’ve already requested financial help with my bill?
    </h3>
    <p>
      You may need to continue making payments while we review your request.
      Call us at
      <Telephone contact={'866-400-1238'} className="vads-u-margin-x--0p5" />,
      Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
    </p>
  </va-alert>
);

const RenderAlert = ({ type, copay }) => {
  switch (type) {
    case 'no-health-care':
      return <Alert.NoHealthcare />;
    case 'no-history':
      return <Alert.NoHistory />;
    case 'deceased':
      return <Alert.Deceased />;
    case 'status':
      return <Alert.Status copay={copay} />;
    case 'zero-balance':
      return <Alert.ZeroBalance copay={copay} />;
    default:
      return <Alert.Error />;
  }
};

export default RenderAlert;
