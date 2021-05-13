import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';
import { expect } from 'chai';
import moment from 'moment';
import React from 'react';
import ConfirmationPageV2 from '../../../covid-19-vaccine/components/ConfirmationPageV2';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import { FETCH_STATUS } from '../../../utils/constants';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingProjectCheetah: true,
  },
};

const start = moment();
const store = createTestStore({
  covid19Vaccine: {
    submitStatus: FETCH_STATUS.succeeded,
    newBooking: {
      data: {
        vaFacility: '983',
        clinicId: '455',
        date1: [start.format()],
      },
      availableSlots: [
        {
          start: start.format(),
          end: start
            .clone()
            .add(30, 'minutes')
            .format(),
        },
      ],
      clinics: {
        '455': [
          {
            serviceName: 'CHY PC CASSIDY',
          },
        ],
      },
      facilities: [
        {
          id: '983',
          name: 'Cheyenne VA Medical Center',
          address: {
            postalCode: '82001-5356',
            city: 'Cheyenne',
            state: 'WY',
            line: ['2360 East Pershing Boulevard'],
          },
          telecom: [
            {
              system: 'phone',
              value: '307-778-7550',
            },
            {
              system: 'covid',
              value: '307-778-7580',
            },
          ],
        },
      ],
    },
  },
});

describe('VAOS vaccine flow <ConfirmationPageV2>', () => {
  it('should show confirmation details', async () => {
    const screen = renderWithStoreAndRouter(<ConfirmationPageV2 />, { store });

    expect(
      await screen.findByText(
        /Your appointment has been scheduled and is confirmed./i,
      ),
    ).to.be.ok;
    expect(
      screen.getByText(
        new RegExp(start.format('MMMM D, YYYY [at] h:mm a'), 'i'),
      ),
    ).to.be.ok;
    expect(screen.getByText(/Cheyenne VA Medical Center/i)).to.be.ok;
    expect(screen.getByText(/2360 East Pershing Boulevard/i)).to.be.ok;
    expect(screen.baseElement).to.contain.text('Cheyenne, WY 82001-5356');
    expect(screen.getByText(/directions/i)).to.have.attribute(
      'href',
      'https://maps.google.com?saddr=Current+Location&daddr=2360 East Pershing Boulevard, Cheyenne, WY 82001-5356',
    );
    expect(screen.baseElement).to.contain.text('Main phone: 307-778-7580');
    expect(screen.getByText(/add to calendar/i)).to.have.tagName('a');
  });

  it('should display links to view appointments and restart appointment flow', async () => {
    const screen = renderWithStoreAndRouter(<ConfirmationPageV2 />, { store });
    expect(
      await screen.findByText(
        /Your appointment has been scheduled and is confirmed./i,
      ),
    ).to.be.ok;
    userEvent.click(screen.getByText(/View your appointments/i));
    expect(screen.history.push.called).to.be.true;
    expect(screen.history.push.getCall(0).args[0]).to.equal('/');
    userEvent.click(screen.getByText(/New appointment/i));
    expect(screen.history.push.getCall(1).args[0]).to.equal('/new-appointment');
  });

  it('should redirect to home page if no form data', async () => {
    const emptyStore = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ConfirmationPageV2 />, {
      store: emptyStore,
    });

    // Expect router to route to home page
    await waitFor(() => {
      expect(screen.history.location.pathname).to.equal('/');
    });
  });
});
