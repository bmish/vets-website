import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';

import {
  toIdSchema,
  getDefaultFormState,
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

import { setArrayRecordTouched } from 'platform/forms-system/src/js/helpers';
import { errorSchemaIsValid } from 'platform/forms-system/src/js/validation';
import { scrollToFirstError } from 'platform/utilities/ui';
import { setData } from 'platform/forms-system/src/js/actions';

import { scrollAndFocus } from '../utils/ui';
import { isEmptyObject, someSelected } from '../utils/helpers';
import { SELECTED, MAX_NEW_CONDITIONS } from '../constants';
import { IssueCard } from './IssueCard';
import {
  missingIssuesErrorMessage,
  noneSelected,
} from '../content/additionalIssues';

const Element = Scroll.Element;

/* Non-review growable table (array) field */
const AddIssuesField = props => {
  const {
    schema,
    uiSchema,
    errorSchema,
    idSchema,
    formData = [{}],
    registry,
    formContext,
    onBlur,
    fullFormData,
    submission,
  } = props;

  const uiOptions = uiSchema['ui:options'] || {};

  if (!fullFormData['view:hasIssuesToAdd']) {
    props.setFormData({
      ...fullFormData,
      'view:hasIssuesToAdd': true,
    });
  }

  const initialEditingState = uiOptions.setInitialEditMode?.(formData);
  // Editing state: 1 = new edit, true = update edit & false = view state
  const [editing, setEditing] = useState(
    initialEditingState?.length ? initialEditingState : [1],
  );

  const toggleSelection = (indexToChange, checked) => {
    const newItems = formData.map((item, index) => ({
      ...item,
      [SELECTED]: index === indexToChange ? checked : item[SELECTED],
    }));
    props.onChange(newItems);
  };

  const onItemChange = (indexToChange, value) => {
    const newItems = formData.map(
      (item, index) =>
        index === indexToChange ? { ...value, [SELECTED]: true } : item,
    );
    props.onChange(newItems);
  };

  const getItemSchema = index => {
    const itemSchema = schema;
    if (itemSchema.items.length > index) {
      return itemSchema.items[index];
    }
    return itemSchema.additionalItems;
  };

  /*
   * Clicking edit on an item that’s not last and so is in view mode
   */
  const handleEdit = (index, status = true) => {
    setEditing(editing.map((mode, indx) => (indx === index ? status : mode)));
    scrollAndFocus({
      selector: `dd[data-index="${index}"] legend`,
      timer: 50,
    });
  };

  /*
   * Clicking Update on an item that’s not last and is in edit mode
   */
  const handleUpdate = index => {
    const { issue, decisionDate } = formData[index];
    if (errorSchemaIsValid(errorSchema[index]) && issue && decisionDate) {
      setEditing(editing.map((mode, indx) => (indx === index ? false : mode)));
      scrollAndFocus({
        selector: `dd[data-index="${index}"] .edit`,
        timer: 100,
      });
    } else {
      // Set all the fields for this item as touched, so we show errors
      const touched = setArrayRecordTouched(idSchema.$id, index);
      formContext.setTouched(touched, () => {
        scrollToFirstError();
      });
    }
  };

  /*
   * Clicking Add another
   */
  const handleAdd = () => {
    const lastIndex = formData.length - 1;
    if (errorSchemaIsValid(errorSchema[lastIndex])) {
      // For new entries we don't use a boolean, so we know it should be labeled
      // as "new" and not "update"
      setEditing(editing.concat([1]));

      const newFormData = formData.concat(
        getDefaultFormState(schema.additionalItems, undefined, {}) || {},
      );
      props.onChange(newFormData);
      scrollAndFocus({
        selector: `dd[data-index="${lastIndex + 1}"] legend`,
        timer: 50,
      });
    } else {
      const touched = setArrayRecordTouched(idSchema.$id, lastIndex);
      formContext.setTouched(touched, () => {
        scrollToFirstError();
      });
    }
  };

  /*
   * Clicking Remove on an item in edit mode
   */
  const handleRemove = indexToRemove => {
    const newItems = formData.filter((_, index) => index !== indexToRemove);
    setEditing(editing.filter((_, index) => index !== indexToRemove));
    props.onChange(newItems);
    scrollAndFocus({
      selector: '.va-growable-add-btn',
      timer: 50,
    });
  };

  const { SchemaField } = registry.fields;

  const onReviewPage = formContext.onReviewPage;
  // review mode = only show selected cards on the review & submit page
  const isReviewMode = formContext.reviewMode;
  const showCheckbox = !onReviewPage || (onReviewPage && !isReviewMode);

  // if we have form data, use that, otherwise use an array with a single default object
  const items = formData.length
    ? formData
    : [getDefaultFormState(schema.additionalItems, undefined, {})];

  const atMax = items.length > MAX_NEW_CONDITIONS;

  const addButton = !atMax &&
    showCheckbox && (
      <button
        type="button"
        className="usa-button-secondary va-growable-add-btn vads-u-width--auto"
        onClick={handleAdd}
      >
        Add another issue
      </button>
    );

  // first issue does not have a header or grey card background
  const singleIssue = items.length === 1;
  const hasSelected =
    someSelected(formData) || someSelected(fullFormData.contestableIssues);
  const hasSubmitted = formContext.submitted || submission?.hasAttemptedSubmit;
  const showError = hasSubmitted && !hasSelected;

  const content = items.map((item, index) => {
    const itemSchema = getItemSchema(index);
    const itemIdPrefix = `${idSchema.$id}_${index}`;
    const itemIdSchema = toIdSchema(itemSchema, itemIdPrefix, {});
    const isEditing = editing[index];
    const itemName = item?.issue || 'issue';

    // Don't show unselected items on the review & submit page in review
    // mode
    if (isReviewMode && (!item[SELECTED] || isEmptyObject(item))) {
      return null;
    }

    const first = singleIssue && index === 0;
    const className = [
      'review-row',
      'additional-issue',
      'editing',
      first ? '' : 'vads-u-background-color--gray-lightest',
      first ? 'vads-u-border-top--0' : '',
      first ? 'vads-u-padding--0' : 'vads-u-padding--3',
      first ? 'vads-u-margin--0' : 'vads-u-margin-bottom--2',
    ].join(' ');

    // show edit card, but not in review mode
    return !isReviewMode && isEditing ? (
      <div key={index} className={className}>
        <dt className="widget-checkbox-wrap" />
        <dd data-index={index}>
          <Element name={`table_${itemIdPrefix}`} />
          <fieldset className="vads-u-text-align--left">
            <legend className="schemaform-block-header vads-u-font-size--base vads-u-font-weight--normal vads-u-margin-top--0 vads-u-padding-y--0">
              {first ? (
                'Please add a new issue for review:'
              ) : (
                <h2 className="vads-u-margin-y--0 vads-u-font-size--h4">
                  {`${isEditing === 1 ? 'Add' : 'Update'} issue`}
                </h2>
              )}
            </legend>
            <div className="input-section vads-u-margin-bottom--0 vads-u-font-weight--normal">
              <SchemaField
                key={index}
                schema={itemSchema}
                uiSchema={uiSchema.items}
                errorSchema={errorSchema ? errorSchema[index] : undefined}
                idSchema={itemIdSchema}
                formData={item}
                onChange={value => onItemChange(index, value)}
                onBlur={onBlur}
                registry={registry}
                required
              />
            </div>
            <div className="vads-u-margin-top--2 vads-u-display--flex vads-u-justify-content--space-between">
              <button
                type="button"
                className="vads-u-margin-right--2 update"
                aria-label={`Save ${itemName}`}
                onClick={() => handleUpdate(index)}
              >
                Save
              </button>
              {formData.length > 1 && (
                <button
                  type="button"
                  className="usa-button-secondary float-right remove"
                  aria-label={`Remove ${itemName}`}
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </button>
              )}
            </div>
          </fieldset>
        </dd>
      </div>
    ) : (
      <IssueCard
        key={index}
        id={idSchema.$id}
        index={index}
        item={item}
        options={uiOptions}
        onChange={toggleSelection}
        showCheckbox={showCheckbox}
        onEdit={() => handleEdit(index)}
      />
    );
  });

  return isReviewMode ? (
    <>
      {!showError && !hasSelected && noneSelected}
      {showError && missingIssuesErrorMessage}
      {content}
    </>
  ) : (
    <div
      className={`schemaform-field-container additional-issues-wrap ${
        showError ? 'usa-input-error vads-u-margin-top--0' : ''
      }`}
    >
      <Element name={`topOfTable_${idSchema.$id}`} />
      {showError && missingIssuesErrorMessage}
      {formData.length > 0 && <dl className="va-growable review">{content}</dl>}
      {editing.some(edit => edit) ? null : addButton}
      {atMax && <p>You’ve entered the maximum number of items allowed.</p>}
    </div>
  );
};

AddIssuesField.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object,
  errorSchema: PropTypes.object,
  requiredSchema: PropTypes.object,
  idSchema: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  formData: PropTypes.array,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  registry: PropTypes.shape({
    widgets: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    ).isRequired,
    fields: PropTypes.objectOf(PropTypes.func).isRequired,
    formContext: PropTypes.object.isRequired,
  }),
};

const mapDispatchToProps = {
  setFormData: setData,
};

const mapStateToProps = state => ({
  submission: state.form.submission || {},
  fullFormData: state.form.data || {},
});

export { AddIssuesField };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddIssuesField);
