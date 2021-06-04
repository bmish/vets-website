import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import { spy } from 'sinon';

import { FormSignature } from '../../../src/js/components/FormSignature';

describe('Forms library - Forms signature component', () => {
  const signatureProps = {
    formData: { name: 'Foo' },
    onSectionComplete: () => {},
    setFormData: () => {},
    showError: true,
    required: false,
  };

  describe('signature input', () => {
    it('should render input with default label', () => {
      const { getByLabelText } = render(<FormSignature {...signatureProps} />);
      expect(getByLabelText('Veteran’s full name')).to.exist;
    });

    it('should render input with custom string label', () => {
      const { getByLabelText } = render(
        <FormSignature
          {...signatureProps}
          signatureLabel={'Custom text here'}
        />,
      );
      expect(getByLabelText('Custom text here')).to.exist;
    });

    it('should render input input with custom React element label', () => {
      const customLabel = <span>Custom text here</span>;
      const { getByLabelText } = render(
        <FormSignature {...signatureProps} signatureLabel={customLabel} />,
      );
      expect(getByLabelText('Custom text here')).to.exist;
    });
  });

  describe('certification checkbox', () => {
    it('should render with default label', () => {
      const { getByLabelText } = render(<FormSignature {...signatureProps} />);
      expect(
        getByLabelText(
          'I certify the information above is correct and true to the best of my knowledge and belief.',
        ),
      ).to.exist;
    });

    it('should render with custom string label', () => {
      const { getByLabelText } = render(
        <FormSignature {...signatureProps} checkboxLabel="LGTM" />,
      );
      expect(getByLabelText('LGTM')).to.exist;
    });

    it('should render with custom React element label', () => {
      const customLabel = <span>Custom text here</span>;
      const { getByLabelText } = render(
        <FormSignature {...signatureProps} checkboxLabel={customLabel} />,
      );
      expect(getByLabelText('Custom text here')).to.exist;
    });
  });

  describe('validation', () => {
    it('should require signature and certification', () => {
      const { getByText } = render(
        <FormSignature {...signatureProps} required />,
      );
      expect(getByText(/Your signature must match/)).to.exist;
      expect(getByText(/Must certify by checking box/)).to.exist;
    });

    it('should not show validation errors when showErrors is false', () => {
      const { queryByText } = render(
        <FormSignature {...signatureProps} showError={false} required />,
      );
      expect(queryByText(/Your signature must match/)).to.not.exist;
      expect(queryByText(/Must certify by checking box/)).to.not.exist;
    });

    it('should dismiss validation errors after resolution', () => {
      const { queryByText } = render(
        <FormSignature {...signatureProps} required />,
      );
      userEvent.type(queryByText(/Veteran’s full name/), 'Curious George');
      userEvent.click(
        queryByText(/I certify the information above is correct/),
      );
      expect(queryByText(/Your signature must match/)).to.not.exist;
      expect(queryByText(/Must certify by checking box/)).to.not.exist;
    });

    it('should perform data validations if present', () => {
      const validationSpies = [spy(() => 'Example error'), spy()];
      render(
        <FormSignature {...signatureProps} validations={validationSpies} />,
      );
      expect(validationSpies[0].calledWithExactly('', signatureProps.formData))
        .to.be.true;

      // Subsequent validation functions don't get run if previous validators
      // return an error message
      expect(validationSpies[1].called).to.be.false;
    });

    it('should show error messages from validation functions', () => {
      const validationSpies = [spy(() => 'Example error'), spy()];
      const { getByText } = render(
        <FormSignature {...signatureProps} validations={validationSpies} />,
      );
      expect(getByText('Example error')).to.exist;
    });
  });

  describe('behavior', () => {
    it('should call onSectionComplete when the signature is valid', () => {
      // "Valid" here means:
      //   - There are no validation errors
      //   - The checkbox has been checked
    });

    it('should NOT call onSectionComplete when the signature is INVALID', () => {});

    it('should call setFormData when the name is entered', () => {});
  });
});
