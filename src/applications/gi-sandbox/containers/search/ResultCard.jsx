import React, { useState } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import appendQuery from 'append-query';
import { Link } from 'react-router-dom';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import {
  addCompareInstitution,
  removeCompareInstitution,
  showModal,
} from '../../actions';
import { MINIMUM_RATING_COUNT } from '../../constants';
import CompareCheckbox from '../../components/CompareCheckbox';
import { estimatedBenefits } from '../../selectors/estimator';
import {
  formatCurrency,
  createId,
  convertRatingToStars,
} from '../../utils/helpers';
import { CautionFlagAdditionalInfo } from '../../components/CautionFlagAdditionalInfo';
import RatingsStars from '../../components/RatingsStars';
import SchoolClassification from '../../components/SchoolClassification';
import recordEvent from 'platform/monitoring/record-event';

export function ResultCard({
  compare,
  estimated,
  dispatchAddCompareInstitution,
  dispatchRemoveCompareInstitution,
  dispatchShowModal,
  institution,
  location = false,
  header = null,
  gibctSchoolRatings,
  active = false,
  version,
}) {
  const {
    name,
    city,
    state,
    studentCount,
    ratingAverage,
    ratingCount,
    accreditationType,
    cautionFlags,
    facilityCode,
    vetTecProvider,
    schoolProvider,
    employerProvider,
    preferredProvider,
    programCount,
    programLengthInHours,
  } = institution;
  const compareChecked = !!compare.search.institutions[facilityCode];
  const compareLength = compare.search.loaded.length;

  const handleCompareUpdate = e => {
    recordEvent({
      event: location
        ? `Checkbox Clicked: Added from location tab`
        : `Checkbox Clicked: Added from name tab`,
    });

    if (compareLength < 3) {
      recordEvent({
        event: compareChecked
          ? `Compare Checkbox click: ${compareLength - 1} in Comparison Drawer`
          : `Compare Checkbox click: ${compareLength + 1} in Comparison Drawer`,
      });
    }

    if (e.target.checked && !compareChecked) {
      if (compareLength === 3) {
        dispatchShowModal('comparisonLimit');
        recordEvent({
          event: `Compare Checkbox click: Comparison Limit Reached. More than 3 schools selected.`,
        });
      } else {
        dispatchAddCompareInstitution(institution);
        recordEvent({
          event: `Compare Checkbox click: Added ${
            institution.name
          } to comparison tray`,
        });
      }
    } else {
      dispatchRemoveCompareInstitution(facilityCode);
      recordEvent({
        event: `Compare Checkbox click: Removed ${
          institution.name
        } from comparison try`,
      });
    }
  };

  const [expanded, toggleExpansion] = useState(false);

  const profileLink = version
    ? appendQuery(`/institution/${facilityCode}`, { version })
    : `/institution/${facilityCode}`;

  const resultCardClasses = classNames('result-card', {
    'vads-u-margin-bottom--2': location,
    'vads-u-padding-right--1': location && !active,
    'vads-u-padding--0p5': active,
    active,
  });

  const containerClasses = classNames({
    'vads-u-margin-bottom--2': !location,
    'small-screen:vads-u-margin-left--2p5': !location,
    'vads-u-margin--0': location,
    'vads-u-padding--0': location,
  });

  const nameClasses = classNames({
    'vads-u-margin-top--2': !location,
    'vads-u-margin-top--1': location,
  });

  const nameCityStateHeader = (
    <>
      <div>
        <Link
          to={profileLink}
          aria-labelledby={`${facilityCode}-label ${facilityCode}-classification`}
          onClick={() =>
            cautionFlags.length > 0 &&
            recordEvent({
              event: `Cautionary Warnings: ${name} profile link clicked`,
            })
          }
        >
          <h3
            className={nameClasses}
            aria-label={`${institution.name}, `}
            id={`${institution.facilityCode}-label`}
          >
            {name}
          </h3>
        </Link>
      </div>
      <p className="vads-u-padding--0">
        {city}
        {state && `, ${state}`}
      </p>
    </>
  );

  const stars = convertRatingToStars(ratingAverage);
  const displayStars =
    gibctSchoolRatings && stars && ratingCount >= MINIMUM_RATING_COUNT;

  const ratingsInformation = displayStars ? (
    <div>
      <div className="vads-u-margin-bottom--2">
        <RatingsStars rating={ratingAverage} />
        {location && <br />}
        <strong>
          ({Math.round(10 * ratingAverage) / 10} of 5) by {ratingCount} Veteran
          {ratingCount > 1 && 's'}
        </strong>
      </div>
    </div>
  ) : (
    <div>
      <p>
        <strong>Not yet rated by Veterans</strong>
      </p>
    </div>
  );

  const estimate = ({ qualifier, value }) => {
    if (qualifier === '% of instate tuition') {
      return <span>{value}% in-state</span>;
    } else if (qualifier === null) {
      return value;
    }
    return <span>{formatCurrency(value)}</span>;
  };

  const tuition = estimate(estimated.tuition);
  const housing = estimate(estimated.housing);

  const tuitionAndEligibility = (
    <>
      <p>
        <strong>You may be eligible for up to:</strong>
      </p>
      <div className="vads-u-display--flex vads-u-margin-top--0 vads-u-margin-bottom--2">
        <div className="vads-u-flex--1">
          <p className="secondary-info-label-large">Tuition benefit:</p>
          <p className="vads-u-margin-y--0">{tuition}</p>
        </div>
        <div className="vads-u-flex--1">
          <p className="secondary-info-label-large">Housing benefit:</p>
          <p className="vads-u-margin-y--0">
            {housing} /mo
            {employerProvider && '*'}
          </p>
        </div>
      </div>
      {employerProvider && (
        <p className="asterisk-text">
          * Housing rate and the amount of entitlement used decrease every 6
          months as training progresses
        </p>
      )}
    </>
  );

  const schoolEmployerInstitutionDetails = (
    <>
      <div className="vads-u-flex--1">
        <p className="secondary-info-label-large">
          <strong>Accreditation:</strong>
        </p>
        <p className="vads-u-margin-top--1 vads-u-margin-bottom--2p5">
          {(accreditationType && (
            <span className="capitalize-value">{accreditationType}</span>
          )) ||
            'N/A'}
        </p>
      </div>
      <div className="vads-u-flex--1">
        <p className="secondary-info-label-large">
          <strong>GI Bill students:</strong>
        </p>
        <p className="vads-u-margin-top--1 vads-u-margin-bottom--2p5">
          {studentCount || '0'}
        </p>
      </div>
    </>
  );

  const programHours = () => {
    if (programLengthInHours && programLengthInHours.length > 0) {
      const maxHours = Math.max(...programLengthInHours);
      const minHours = Math.min(...programLengthInHours);
      return `${
        minHours === maxHours ? minHours : `${minHours} - ${maxHours}`
      } hours`;
    }
    return 'TBD';
  };

  const vettecInstitutionDetails = (
    <>
      <div className="vads-u-flex--1">
        <p className="secondary-info-label-large">
          <strong>Approved programs:</strong>
        </p>
        <p className="vads-u-margin-top--1 vads-u-margin-bottom--2p5">
          {programCount || 0}
        </p>
      </div>
      <div className="vads-u-flex--1">
        <p className="secondary-info-label-large">
          <strong>Program length:</strong>
        </p>
        <p className="vads-u-margin-top--1 vads-u-margin-bottom--2p5">
          {programHours()}
        </p>
      </div>
    </>
  );

  return (
    <div
      key={institution.facilityCode}
      className={resultCardClasses}
      id={`${createId(name)}-result-card`}
    >
      <div className={containerClasses}>
        {location && <span id={`${createId(name)}-result-card-placeholder`} />}
        {header}
        <div className="result-card-container vads-u-background-color--gray-lightest">
          <SchoolClassification institution={institution} />
          <div className="vads-u-padding-x--2 vads-u-margin-bottom--1">
            {nameCityStateHeader}
            {schoolProvider && ratingsInformation}
            {preferredProvider && (
              <span className="preferred-provider-text">
                <i className="fa fa-star vads-u-color--gold" />
                <strong> Preferred Provider</strong>
              </span>
            )}
          </div>
          {cautionFlags.length > 0 && (
            <div className="caution-flag-section">
              <CautionFlagAdditionalInfo
                cautionFlags={cautionFlags}
                expanded={expanded}
                toggleExpansion={toggleExpansion}
              />
            </div>
          )}
          {
            <>
              <div
                className={classNames(
                  'vads-u-padding-x--2 vads-u-margin-bottom--4',
                  {
                    'vads-u-border-top--3px': cautionFlags.length === 0,
                    'vads-u-border-color--white': cautionFlags.length === 0,
                  },
                )}
              >
                {tuitionAndEligibility}
              </div>
              <div className="vads-u-border-top--3px vads-u-border-color--white vads-u-padding-x--2">
                <div className="vads-u-display--flex vads-u-margin-top--1 ">
                  {!vetTecProvider
                    ? schoolEmployerInstitutionDetails
                    : vettecInstitutionDetails}
                </div>
              </div>
            </>
          }

          <div
            className={classNames(
              'vads-u-display--flex, vads-u-text-align--center',
              {
                'vads-u-border-top--3px': !expanded,
                'vads-u-border-color--white': !expanded,
              },
            )}
          >
            <div className="card-bottom-cell vads-u-flex--1 vads-u-margin--0">
              <CompareCheckbox
                institution={name}
                compareChecked={compareChecked}
                handleCompareUpdate={handleCompareUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state, props) => ({
  compare: state.compare,
  estimated: estimatedBenefits(state, props),
  gibctSchoolRatings: toggleValues(state)[
    FEATURE_FLAG_NAMES.gibctSchoolRatings
  ],
});

const mapDispatchToProps = {
  dispatchAddCompareInstitution: addCompareInstitution,
  dispatchRemoveCompareInstitution: removeCompareInstitution,
  dispatchShowModal: showModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResultCard);
