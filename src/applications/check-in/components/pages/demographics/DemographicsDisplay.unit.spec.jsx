import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import DemographicsDisplay from './DemographicsDisplay';
import { axeCheck } from 'platform/forms-system/test/config/helpers';

describe('pre-check-in experience', () => {
  describe('shared components', () => {
    describe('DemographicsDisplay', () => {
      it('passes axeCheck', () => {
        axeCheck(<DemographicsDisplay />);
      });
      it('renders with default values', () => {
        const { getByText } = render(<DemographicsDisplay />);
        expect(getByText('Is this your current contact information?')).to.exist;
        expect(
          getByText(
            'We can better follow up with you after your appointment when we have your current information.',
          ),
        ).to.exist;
      });
      it('renders the footer if footer is supplied', () => {
        const { getByText } = render(
          <DemographicsDisplay Footer={() => <div>foo</div>} />,
        );
        expect(getByText('foo')).to.exist;
      });
      it('renders custom header', () => {
        const { getByText } = render(<DemographicsDisplay header="foo" />);

        expect(getByText('foo')).to.exist;
      });
      it('renders custom subtitle', () => {
        const { getByText } = render(<DemographicsDisplay subtitle="foo" />);
        expect(getByText('foo')).to.exist;
      });
      it('renders demographics labels', () => {
        const demographics = {
          mailingAddress: {
            street1: '123 Turtle Trail',
            street2: '',
            street3: '',
            city: 'Treetopper',
            state: 'Tennessee',
            zip: '101010',
          },
          homeAddress: {
            street1: '445 Fine Finch Fairway',
            street2: 'Apt 201',
            city: 'Fairfence',
            state: 'Florida',
            zip: '445545',
          },
          homePhone: '5552223333',
          mobilePhone: '5553334444',
          workPhone: '5554445555',
          emailAddress: 'kermit.frog@sesameenterprises.us',
        };
        const { getByText } = render(
          <DemographicsDisplay demographics={demographics} />,
        );
        expect(getByText('Mailing address')).to.exist;
        expect(getByText('Home address')).to.exist;
        expect(getByText('Home phone')).to.exist;
        expect(getByText('Mobile phone')).to.exist;
        expect(getByText('Work phone')).to.exist;
        expect(getByText('Email address')).to.exist;
      });
      it('renders demographics values', () => {
        const demographics = {
          mailingAddress: {
            street1: '123 Turtle Trail',
            street2: '',
            street3: '',
            city: 'Treetopper',
            state: 'Tennessee',
            zip: '101010',
          },
          homeAddress: {
            street1: '445 Fine Finch Fairway',
            street2: 'Apt 201',
            city: 'Fairfence',
            state: 'Florida',
            zip: '445545',
          },
          homePhone: '5552223333',
          mobilePhone: '5553334444',
          workPhone: '5554445555',
          emailAddress: 'kermit.frog@sesameenterprises.us',
        };
        const { getByText } = render(
          <DemographicsDisplay demographics={demographics} />,
        );
        expect(getByText('123 Turtle Trail')).to.exist;
        expect(getByText('Treetopper, Tennessee 10101')).to.exist;
        expect(getByText('445 Fine Finch Fairway')).to.exist;
        expect(getByText(', Apt 201')).to.exist;
        expect(getByText('Fairfence, Florida 44554')).to.exist;
        expect(getByText('555-222-3333')).to.exist;
        expect(getByText('555-333-4444')).to.exist;
        expect(getByText('555-444-5555')).to.exist;
        expect(getByText('kermit.frog@sesameenterprises.us')).to.exist;
      });
      it('fires the yes function', () => {
        const yesClick = sinon.spy();
        const screen = render(<DemographicsDisplay yesAction={yesClick} />);
        fireEvent.click(screen.getByTestId('yes-button'));
        expect(yesClick.calledOnce).to.be.true;
      });
      it('fires the no function', () => {
        const noClick = sinon.spy();
        const screen = render(<DemographicsDisplay noAction={noClick} />);
        fireEvent.click(screen.getByTestId('no-button'));
        expect(noClick.calledOnce).to.be.true;
      });
    });
  });
});
