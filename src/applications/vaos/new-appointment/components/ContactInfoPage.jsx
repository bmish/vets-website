import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';
import {
  selectVAPEmailAddress,
  selectVAPHomePhoneString,
  selectVAPMobilePhoneString,
} from 'platform/user/selectors';
import FormButtons from '../../components/FormButtons';

import {
  getFlowType,
  getFormData,
  selectPageChangeInProgress,
} from '../redux/selectors';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { useHistory } from 'react-router-dom';
import {
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../redux/actions';
import NewTabAnchor from '../../components/NewTabAnchor';
import useFormState from '../../hooks/useFormState';
import { FLOW_TYPES } from '../../utils/constants';

const initialSchema = {
  type: 'object',
  required: ['phoneNumber', 'email', 'bestTimeToCall'],
  properties: {
    phoneNumber: {
      type: 'string',
      pattern: '^[2-9][0-9]{9}$',
    },
    bestTimeToCall: {
      type: 'object',
      properties: {
        morning: {
          type: 'boolean',
        },
        afternoon: {
          type: 'boolean',
        },
        evening: {
          type: 'boolean',
        },
      },
    },
    email: {
      type: 'string',
      format: 'email',
    },
  },
};

const phoneConfig = phoneUI('Your phone number');
const pageKey = 'contactInfo';
const pageTitle = 'Confirm your contact information';

export default function ContactInfoPage() {
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);
  const history = useHistory();
  const dispatch = useDispatch();
  const pageChangeInProgress = useSelector(selectPageChangeInProgress);
  const userData = useSelector(getFormData);
  const email = useSelector(selectVAPEmailAddress);
  const homePhone = useSelector(selectVAPHomePhoneString);
  const mobilePhone = useSelector(selectVAPMobilePhoneString);
  const flowType = useSelector(getFlowType);

  const uiSchema = {
    'ui:description': (
      <>
        <p>
          This is the information we’ll use to contact you about your
          appointment. You can update your contact information here, but the
          updates will only apply to this tool.
        </p>
        <p className="vads-u-margin-y--2">
          To update your contact information for all your VA accounts, please{' '}
          <NewTabAnchor href="/profile">go to your profile page</NewTabAnchor>.
        </p>
      </>
    ),
    phoneNumber: {
      ...phoneConfig,
      'ui:errorMessages': {
        ...phoneConfig['ui:errorMessages'],
        pattern:
          'Please enter a valid 10-digit phone number (with or without dashes)',
      },
    },
    bestTimeToCall: {
      'ui:title': 'What are the best times for us to call you?',
      'ui:validations':
        flowType === FLOW_TYPES.REQUEST ? [validateBooleanGroup] : [],
      'ui:options': {
        showFieldLabel: true,
        classNames: 'vaos-form__checkboxgroup',
        hideIf: () => flowType === FLOW_TYPES.DIRECT,
      },
      morning: {
        'ui:title': 'Morning (8:00 a.m. – noon)',
        'ui:options': { widgetClassNames: 'vaos-form__checkbox' },
      },
      afternoon: {
        'ui:title': 'Afternoon (noon – 4:00 p.m.)',
        'ui:options': { widgetClassNames: 'vaos-form__checkbox' },
      },
      evening: {
        'ui:title': 'Evening (4:00 p.m. – 8:00 p.m.)',
        'ui:options': { widgetClassNames: 'vaos-form__checkbox' },
      },
    },
    email: { 'ui:title': 'Your email address' },
  };

  const { data, schema, setData } = useFormState({
    initialSchema,
    uiSchema,
    initialData: {
      ...userData,
      email: userData.email || email,
      phoneNumber: userData.phoneNumber || mobilePhone || homePhone,
    },
  });

  return (
    <div>
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      {!!schema && (
        <SchemaForm
          name="Contact info"
          title="Contact info"
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={() =>
            dispatch(routeToNextAppointmentPage(history, pageKey, data))
          }
          onChange={newData => setData(newData)}
          data={data}
        >
          <FormButtons
            onBack={() =>
              dispatch(routeToPreviousAppointmentPage(history, pageKey, data))
            }
            pageChangeInProgress={pageChangeInProgress}
            loadingText="Page change in progress"
          />
        </SchemaForm>
      )}
    </div>
  );
}
