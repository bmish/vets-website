import React, { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import { selectProviderSelectionInfo } from '../../redux/selectors';
import { FACILITY_SORT_METHODS, GA_PREFIX } from '../../../utils/constants';
import RemoveProviderModal from './RemoveProviderModal';

export default function SelectedProvider({
  formData,
  initialProviderDisplayCount,
  onChange,
  providerSelected,
  setCheckedProvider,
  setProvidersListLength,
  setShowProvidersList,
}) {
  const { address, sortMethod } = useSelector(
    selectProviderSelectionInfo,
    shallowEqual,
  );
  const [showRemoveProviderModal, setShowRemoveProviderModal] = useState(false);

  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--2 medium-screen:vads-u-padding--3">
      {!providerSelected && (
        <button
          className="va-button-link"
          type="button"
          aria-describedby="providerSelectionDescription"
          onClick={() => {
            setShowProvidersList(true);
            recordEvent({ event: `${GA_PREFIX}-choose-provider-click` });
          }}
        >
          <i
            className="fas fa-plus vads-u-padding-right--0p5"
            aria-hidden="true"
          />
          Choose a provider
        </button>
      )}
      {providerSelected && (
        <section id="selectedProvider" aria-label="Selected provider">
          <h2
            id="providerPostSelectionHeader"
            className="vads-u-font-size--h3 vads-u-margin-top--0"
          >
            Selected Provider
          </h2>
          <span className="vads-u-display--block">{formData.name}</span>
          <span className="vads-u-display--block">
            {formData.address?.line}
          </span>
          <span className="vads-u-display--block">
            {formData.address?.city}, {formData.address?.state}{' '}
            {formData.address?.postalCode}
          </span>
          <span className="vads-u-display--block vads-u-font-size--sm">
            {formData[sortMethod]} miles{' '}
            <span className="sr-only">
              {sortMethod === FACILITY_SORT_METHODS.distanceFromCurrentLocation
                ? 'from your current location'
                : 'from your home address'}
            </span>
          </span>
          <div className="vads-u-display--flex vads-u-margin-top--1">
            <button
              type="button"
              className="vaos-appts__cancel-btn va-button-link vads-u-margin--0 vads-u-flex--0 vads-u-margin-right--2"
              onClick={() => {
                setProvidersListLength(initialProviderDisplayCount);
                setShowProvidersList(true);
              }}
            >
              Change provider
            </button>
            <button
              aria-label={`Remove ${formData.name}`}
              type="button"
              className="vaos-appts__cancel-btn va-button-link vads-u-margin--0 vads-u-flex--0 vads-u-margin-right--2"
              onClick={() => {
                setShowRemoveProviderModal(true);
              }}
            >
              Remove
            </button>
          </div>
        </section>
      )}
      {showRemoveProviderModal && (
        <RemoveProviderModal
          provider={formData}
          address={address}
          onClose={response => {
            setShowRemoveProviderModal(false);
            if (response === true) {
              setCheckedProvider(false);
              onChange({});
            }
          }}
        />
      )}
    </div>
  );
}
