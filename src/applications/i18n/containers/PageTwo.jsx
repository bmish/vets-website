// CustomPage.jsx
import React from 'react';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';

import { TextField } from '@department-of-veterans-affairs/formulate';

import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import Form from '~/platform/forms/formulate-integration/Form';

const PageTwo = ({
  data,
  goBack,
  goForward,
  onReviewPage,
  updatePage,
  ...props
}) => {
  const { t } = useTranslation();
  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const updateButton = <button type="submit">Review update button</button>;

  return (
    <div>
      <p>{props.name}</p>
      <Formik
        initialValues={data}
        onSubmit={onReviewPage ? updatePage : goForward}
      >
        <Form>
          <TextField
            name="pageTwoData"
            label={t('i18n:pageTwo.label')}
            required={t('required')}
          />
          {onReviewPage ? updateButton : navButtons}
        </Form>
      </Formik>
    </div>
  );
};

export default PageTwo;
