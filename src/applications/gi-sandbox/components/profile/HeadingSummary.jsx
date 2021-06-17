import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import AdditionalResources from '../content/AdditionalResources';
import {
  convertRatingToStars,
  formatNumber,
  locationInfo,
  schoolSize,
} from '../../utils/helpers';
import { ariaLabels, MINIMUM_RATING_COUNT } from '../../constants';
import CautionFlagHeading from './CautionFlagHeading';
import SchoolClosingHeading from './SchoolClosingHeading';
import ScorecardTags from '../ScorecardTags';
import recordEvent from 'platform/monitoring/record-event';
import RatingsStars from '../RatingsStars';

const IconWithInfo = ({ icon, children, present }) => {
  if (!present) return null;
  return (
    <p className="icon-with-info">
      <i className={`fa fa-${icon}`} />
      &nbsp;
      {children}
    </p>
  );
};

const HeadingSummary = ({
  institution,
  gibctSchoolRatings,
  onLearnMore,
  onViewWarnings,
}) => {
  const it = institution;
  it.type = it.type && it.type.toLowerCase();
  const formattedAddress = locationInfo(
    it.physicalCity,
    it.physicalState,
    it.physicalCountry,
  );
  const addressPresent = formattedAddress !== ''; // if locationInfo returns a blank string, icon should not show

  const stars = convertRatingToStars(it.ratingAverage);
  const displayStars =
    gibctSchoolRatings && stars && it.ratingCount >= MINIMUM_RATING_COUNT;

  const titleClasses = classNames({
    'vads-u-margin-bottom--0': displayStars,
  });

  const starClasses = classNames(
    'vads-u-margin-bottom--1',
    it.cautionFlags.length > 0
      ? 'vads-u-margin-top--2'
      : 'vads-u-margin-top--1',
  );

  return (
    <div className="heading row">
      <div className="usa-width-two-thirds medium-8 small-12 column">
        <h1 tabIndex={-1} className={titleClasses}>
          {it.name}
        </h1>
        <SchoolClosingHeading
          schoolClosing={it.schoolClosing}
          schoolClosingOn={it.schoolClosingOn}
        />
        <div className="caution-flag">
          <CautionFlagHeading
            cautionFlags={it.cautionFlags}
            onViewWarnings={onViewWarnings}
          />
        </div>
        {displayStars && (
          <div className={starClasses}>
            <span className="vads-u-font-size--sm">
              <RatingsStars rating={it.ratingAverage} />
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
              See {it.ratingCount} ratings by Veterans
            </a>
            )
          </div>
        )}
        <div className="column">
          <p>
            <strong>{formatNumber(it.studentCount)}</strong> GI Bill students (
            <button
              type="button"
              className="va-button-link learn-more-button"
              onClick={onLearnMore}
              aria-label={ariaLabels.learnMore.numberOfStudents}
            >
              Learn more
            </button>
            )
          </p>
        </div>
        <div>
          <div className="medium-6 small-12 column vads-u-margin-top--neg2">
            <IconWithInfo icon="map-marker" present={addressPresent}>
              {'  '}
              {formattedAddress}
            </IconWithInfo>
            <IconWithInfo icon="globe" present={it.website}>
              <a href={it.website} target="_blank" rel="noopener noreferrer">
                {'  '}
                {it.website}
              </a>
            </IconWithInfo>
            <IconWithInfo
              icon="calendar"
              present={it.type !== 'ojt' && it.highestDegree}
            >
              {'  '}
              {_.isFinite(it.highestDegree)
                ? `${it.highestDegree} year`
                : it.highestDegree}{' '}
              program
            </IconWithInfo>
          </div>
          <div className="medium-6 small-12 column vads-u-margin-top--neg2">
            <IconWithInfo icon="briefcase" present={it.type === 'ojt'}>
              {'   '}
              On-the-job training
            </IconWithInfo>
            <IconWithInfo
              icon="university"
              present={it.type && it.type !== 'ojt'}
            >
              {'   '}
              {_.capitalize(it.type)} school
            </IconWithInfo>
            <IconWithInfo
              icon="map"
              present={it.localeType && it.type && it.type !== 'ojt'}
            >
              {'   '}
              {_.capitalize(it.localeType)} locale
            </IconWithInfo>
            <IconWithInfo icon="users" present={it.type && it.type !== 'ojt'}>
              {'   '}
              {schoolSize(it.undergradEnrollment)} size
            </IconWithInfo>
          </div>
        </div>
        <div className="row vads-u-padding-top--1p5">
          <div className="view-details columns vads-u-display--inline-block">
            <ScorecardTags
              styling="info-flag"
              it={institution}
              menOnly={institution.menonly}
              womenOnly={institution.womenonly}
              hbcu={institution.hbcu}
              relAffil={institution.relaffil}
            />
          </div>
        </div>
      </div>
      <AdditionalResources />
    </div>
  );
};

HeadingSummary.propTypes = {
  institution: PropTypes.object,
  onLearnMore: PropTypes.func,
  onViewWarnings: PropTypes.func,
};

export default HeadingSummary;
