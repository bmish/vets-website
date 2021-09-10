import React from 'react';
import moment from 'moment';
import head from 'lodash/head';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import { deductionCodes } from '../const/deduction-codes';
import { setActiveDebt as setDebt } from '../actions';
import { renderAdditionalInfo } from '../const/diary-codes';

const DebtLetterCard = ({ debt, setActiveDebt }) => {
  // TODO: currently we do not have a debtID so we need to make one by combining fileNumber and diaryCode
  const mostRecentHistory = head(debt?.debtHistory);

  const debtCardHeading =
    deductionCodes[debt.deductionCode] || debt.benefitType;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  const additionalInfo = renderAdditionalInfo(
    debt.diaryCode,
    mostRecentHistory?.date,
    debt.benefitType,
  );

  return (
    <article className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--2">
      <h3 className="vads-u-margin--0">{debtCardHeading}</h3>

      {mostRecentHistory && (
        <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
          Updated on
          <span className="vads-u-margin-x--0p5">
            {moment(mostRecentHistory.date, 'MM-DD-YYYY').format(
              'MMMM D, YYYY',
            )}
          </span>
        </p>
      )}

      <p className="vads-u-margin-y--2 vads-u-font-size--md vads-u-font-family--sans">
        <strong>Amount owed: </strong>
        {debt.currentAr && formatter.format(parseFloat(debt.currentAr))}
      </p>

      {additionalInfo.status && (
        <div
          className="vads-u-margin-y--2 vads-u-font-size--md vads-u-font-family--sans"
          data-testid="diary-codes-status"
        >
          {additionalInfo.status}
        </div>
      )}

      {additionalInfo && (
        <div
          className="vads-u-margin-y--2 vads-u-font-size--md vads-u-font-family--sans"
          data-testid="diary-codes-next-step"
        >
          {additionalInfo.nextStep}
        </div>
      )}

      <Link
        className="usa-button"
        onClick={() => setActiveDebt(debt)}
        to={`/debt-detail/${debt.fileNumber + debt.deductionCode}`}
      >
        Go to debt details
        <i
          aria-hidden="true"
          className="fa fa-chevron-right vads-u-font-size--sm vads-u-margin-left--0p5"
        />
      </Link>
    </article>
  );
};

DebtLetterCard.propTypes = {
  debt: PropTypes.shape({
    currentAr: PropTypes.number,
    debtHistory: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string,
      }),
    ),
    deductionCode: PropTypes.string,
    originalAr: PropTypes.number,
  }),
};

DebtLetterCard.defaultProps = {
  debt: {
    currentAr: 0,
    debtHistory: [{ date: '' }],
    deductionCode: '',
    originalAr: 0,
  },
};

const mapStateToProps = state => ({
  selectedDebt: state.debtLetters.selectedDebt,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({ setActiveDebt: setDebt }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DebtLetterCard);
