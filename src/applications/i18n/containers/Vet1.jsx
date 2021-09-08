// CustomPage.jsx
import React from 'react';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';

import { TextField } from '@department-of-veterans-affairs/formulate';

// import { VaSelect } from 'web-components/react-bindings';

import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import Form from '~/platform/forms/formulate-integration/Form';

const Vet1 = ({ data, goBack, goForward, onReviewPage, updatePage }) => {
  const { t } = useTranslation();
  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const updateButton = <button type="submit">Review update button</button>;

  const tns = key => t(`i18n:chapter1.page1.${key}`);

  return (
    <div>
      <p className="vads-u-margin-top--2">{t('pleaseCompleteAll')}</p>
      <Formik
        initialValues={data}
        onSubmit={onReviewPage ? updatePage : goForward}
      >
        <Form>
          <TextField
            name="vetFirstName"
            label={tns('vetFirstName')}
            required={t('requiredInvalid')}
          />

          <TextField name="vetMiddleName" label={tns('vetMiddleName')} />

          <TextField
            name="vetLastName"
            label={tns('vetLastName')}
            required={t('requiredInvalid')}
          />

          <p className="vads-u-margin-top--2">{tns('vetSSN')}</p>

          <div className="vads-u-margin-y--1p5">
            <AdditionalInfo triggerText={tns('vetSSNWhy')}>
              {tns('vetSSNWhyExp')}
            </AdditionalInfo>
          </div>

          <TextField name="vetSSN" required={tns('vetSSNRequired')} />

          {/* <VaSelect
            name="vetDOBMonth"
            label={tns('vetDOBMonth')}
            required
            onVaSelect={e => console.log(e)}
          >
            <option value="june">June</option>
            <option value="june">July</option>
            <option value="august">August</option>
          </VaSelect> */}

          {onReviewPage ? updateButton : navButtons}
        </Form>
      </Formik>
    </div>
  );
};

export default Vet1;
