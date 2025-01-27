import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import classNames from 'classnames';
import {
  addCompareInstitution,
  removeCompareInstitution,
  showModal,
} from '../actions';

import {
  convertRatingToStars,
  createId,
  formatNumber,
  locationInfo,
  schoolSize,
} from '../utils/helpers';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import recordEvent from 'platform/monitoring/record-event';
import { ariaLabels, MINIMUM_RATING_COUNT } from '../constants';
import RatingsStars from '../components/RatingsStars';
import { CautionFlagAdditionalInfo } from '../components/CautionFlagAdditionalInfo';
import IconWithInfo from '../components/IconWithInfo';
import SchoolClassification from '../components/SchoolClassification';
import LearnMoreLabel from '../components/LearnMoreLabel';
import CompareCheckbox from '../components/CompareCheckbox';

const ProfilePageHeader = ({
  compare,
  dispatchAddCompareInstitution,
  dispatchRemoveCompareInstitution,
  institution,
  dispatchShowModal,
  gibctSchoolRatings,
}) => {
  const [expanded, toggleExpansion] = useState(false);
  const {
    type,
    name,
    physicalCity,
    physicalState,
    physicalCountry,
    facilityCode,
    facilityMap,
    ratingCount,
    ratingAverage,
    cautionFlags,
    highestDegree,
    accreditationType,
    undergradEnrollment,
    localeType,
    website,
    studentCount,
    preferredProvider,
    vetTecProvider,
    programs,
  } = institution;
  const lowerType = type && type.toLowerCase();
  const formattedAddress = locationInfo(
    physicalCity,
    physicalState,
    physicalCountry,
  );

  const compareChecked = !!compare.search.institutions[facilityCode];
  const compareLength = compare.search.loaded.length;

  const handleCompareUpdate = e => {
    recordEvent({
      event: `Checkbox Clicked: Added from profile page`,
    });

    if (compareLength < 3) {
      recordEvent({
        event: compareChecked
          ? `Compare Checkbox click: ${compareLength - 1} in Comparison Drawer`
          : `Compare Checkbox click: ${compareLength + 1} in Comparison Drawer`,
      });
    }

    if (e.target.checked && !compareChecked) {
      if (compare.search.loaded.length === 3) {
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

  const main = facilityMap.main.institution;

  const stars = convertRatingToStars(ratingAverage);
  const displayStars =
    gibctSchoolRatings && stars && ratingCount >= MINIMUM_RATING_COUNT;

  const titleClasses = classNames(
    'small-screen-header',
    'vads-u-margin-right--2',
    {
      'vads-u-margin-bottom--0': displayStars,
    },
  );

  const starClasses = classNames(
    'vads-u-margin-bottom--1',
    cautionFlags.length > 0 ? 'vads-u-margin-top--2' : 'vads-u-margin-top--1',
  );

  const showLeftIconSection =
    (lowerType !== 'ojt' && highestDegree) ||
    lowerType === 'ojt' ||
    (lowerType && lowerType !== 'ojt') ||
    accreditationType;
  const showRightIconSection =
    (lowerType && lowerType !== 'ojt') ||
    (localeType && lowerType && lowerType !== 'ojt') ||
    website;

  const renderIconSection = () =>
    (showLeftIconSection || showRightIconSection) && (
      <div
        className={classNames(
          'usa-grid vads-u-padding-y--1p5 vads-u-padding-x--2',
          {
            'vads-u-border-top--4px': cautionFlags.length === 0,
            'vads-u-border-color--white': cautionFlags.length === 0,
          },
        )}
      >
        {showLeftIconSection && (
          <div className="usa-width-one-half">
            <IconWithInfo
              icon="calendar"
              present={lowerType !== 'ojt' && highestDegree}
            >
              {'  '}
              {_.isFinite(highestDegree)
                ? `${highestDegree} year`
                : highestDegree}{' '}
              program
            </IconWithInfo>
            <IconWithInfo icon="briefcase" present={lowerType === 'ojt'}>
              {'   '}
              On-the-job training
            </IconWithInfo>
            <IconWithInfo
              icon="university"
              present={lowerType && lowerType !== 'ojt'}
            >
              {'   '}
              {_.capitalize(lowerType)} school
            </IconWithInfo>
            <IconWithInfo icon="award" present={accreditationType}>
              {'   '}
              <LearnMoreLabel
                text={<>{_.capitalize(accreditationType)} Accreditation</>}
                onClick={() => {
                  dispatchShowModal('typeAccredited');
                  recordEvent({
                    event: 'gibct-form-help-text-clicked',
                    'help-text-label': 'Learn more about the accreditation',
                  });
                }}
                ariaLabel={ariaLabels.learnMore.numberOfStudents}
                buttonId={'typeAccredited-button'}
              />
            </IconWithInfo>
          </div>
        )}
        {showRightIconSection && (
          <div className="usa-width-one-half">
            <IconWithInfo
              icon="users"
              present={lowerType && lowerType !== 'ojt'}
            >
              {'   '}
              {schoolSize(undergradEnrollment)} size
            </IconWithInfo>
            <IconWithInfo
              icon="map"
              present={localeType && lowerType && lowerType !== 'ojt'}
            >
              {'   '}
              {_.capitalize(localeType)} locale
            </IconWithInfo>
            <IconWithInfo icon="globe" present={website}>
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                id={createId('website')}
              >
                {'  '}
                {website}
              </a>
            </IconWithInfo>
          </div>
        )}
      </div>
    );

  const hasVetTecPhone =
    programs.length > 0 &&
    programs[0]?.phoneAreaCode &&
    programs[0]?.phoneNumber;

  const showVetTecIconSection =
    programs.length > 0 || (localeType && lowerType && lowerType !== 'ojt');

  const renderVetTecIconSection = () =>
    showVetTecIconSection && (
      <div
        className={classNames(
          'usa-grid vads-u-padding-y--1p5 vads-u-padding-x--2',
          {
            'vads-u-border-top--4px': cautionFlags.length === 0,
            'vads-u-border-color--white': cautionFlags.length === 0,
          },
        )}
      >
        <div>
          <IconWithInfo icon="phone" present={hasVetTecPhone}>
            {'   '}{' '}
            <a
              href={`tel:${programs[0].phoneAreaCode}${
                programs[0].phoneNumber
              }`}
            >
              {`${programs[0].phoneAreaCode}-${programs[0].phoneNumber}`}
            </a>
          </IconWithInfo>
          {programs[0].schoolLocale && (
            <IconWithInfo
              icon="map"
              present={
                programs[0].schoolLocale && lowerType && lowerType !== 'ojt'
              }
            >
              {'   '}
              {_.capitalize(programs[0].schoolLocale)} locale
            </IconWithInfo>
          )}
          <IconWithInfo icon="globe" present={programs.length > 0}>
            <a
              href={programs[0].providerWebsite}
              target="_blank"
              rel="noopener noreferrer"
            >
              {'  '}
              {programs[0].providerWebsite}
            </a>
          </IconWithInfo>
        </div>
      </div>
    );

  return (
    <div className="vads-u-background-color--gray-lightest profile-card">
      <SchoolClassification
        institution={main}
        menonly={institution.menonly}
        womenonly={institution.womenonly}
        hbcu={institution.hbcu}
        relaffil={institution.relaffil}
      />
      <div className="vads-u-padding-left--2">
        <h1 tabIndex={-1} className={titleClasses}>
          {name}
        </h1>
        <p>{formattedAddress}</p>
        <div className="vads-u-padding-bottom--1p5">
          {preferredProvider && (
            <span className="preferred-provider-text">
              <LearnMoreLabel
                text={
                  <>
                    <i className="fa fa-star vads-u-color--gold" />
                    <strong> Preferred Provider</strong>
                  </>
                }
                onClick={() => {
                  dispatchShowModal('preferredProviders');
                  recordEvent({
                    event: 'gibct-form-help-text-clicked',
                    'help-text-label': 'Learn more about Preferred Providers',
                  });
                }}
                ariaLabel={ariaLabels.learnMore.numberOfStudents}
                buttonId={'preferredProviders-button'}
              />
            </span>
          )}
        </div>
        {displayStars && (
          <div className={starClasses}>
            <span className="vads-u-font-size--sm">
              <RatingsStars rating={ratingAverage} />
            </span>{' '}
            <span className="vads-u-padding-left--1 vads-u-padding-right--1">
              |
            </span>{' '}
            <span className="vads-u-font-weight--bold vads-u-padding-right--1">
              {stars.display} of 5
            </span>{' '}
            (
            <a
              href="#profile-school-ratings"
              onClick={() => recordEvent({ event: 'nav-jumplink-click' })}
            >
              See {ratingCount} ratings by Veterans
            </a>
            )
          </div>
        )}
        {studentCount > 0 && (
          <p>
            <LearnMoreLabel
              text={
                <>
                  <strong>{formatNumber(studentCount)}</strong> GI Bill students
                </>
              }
              buttonId={createId('GI Bill students profile')}
              onClick={() => {
                dispatchShowModal('gibillstudents');
                recordEvent({
                  event: 'gibct-form-help-text-clicked',
                  'help-text-label':
                    'Learn more about the number of GI bill students',
                });
              }}
              ariaLabel={ariaLabels.learnMore.numberOfStudents}
            />
          </p>
        )}
      </div>
      {cautionFlags.length > 0 && (
        <div className="caution-flag-section">
          <CautionFlagAdditionalInfo
            cautionFlags={cautionFlags}
            expanded={expanded}
            toggleExpansion={toggleExpansion}
            viewDetailsLink
          />
        </div>
      )}

      {!vetTecProvider && renderIconSection()}
      {vetTecProvider && renderVetTecIconSection()}

      <div className="card-bottom-cell vads-u-flex--1 vads-u-margin--0 vads-u-border-top--4px vads-u-border-color--white">
        <CompareCheckbox
          institution={name}
          compareChecked={compareChecked}
          handleCompareUpdate={handleCompareUpdate}
        />
      </div>
    </div>
  );
};

ProfilePageHeader.propTypes = {
  institution: PropTypes.object,
  onViewWarnings: PropTypes.func,
};

const mapStateToProps = state => ({
  compare: state.compare,
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
)(ProfilePageHeader);
