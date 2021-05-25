import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import moment from 'moment';
import React from 'react';
import ConfirmationPage from '../../../../new-appointment/components/ConfirmationPage';
import { FETCH_STATUS, FLOW_TYPES } from '../../../../utils/constants';
import {
  createTestStore,
  // getTimezoneTestDate,
  renderWithStoreAndRouter,
} from '../../../mocks/setup';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingHomepageRefresh: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
  },
};

const start = moment().tz('America/Denver');
const end = moment(start).tz('America/Denver');
const store = createTestStore({
  ...initialState,
  newAppointment: {
    submitStatus: FETCH_STATUS.succeeded,
    flowType: FLOW_TYPES.DIRECT,
    data: {
      typeOfCareId: '323',
      phoneNumber: '1234567890',
      email: 'joeblow@gmail.com',
      reasonForAppointment: 'routine-follow-up',
      reasonAdditionalInfo: 'Additional info',
      vaParent: '983',
      vaFacility: '983',
      clinicId: '455',
      selectedDates: [start.format('YYYY-MM-DDTHH:mm:ss')],
    },
    availableSlots: [
      {
        start: start.format('YYYY-MM-DDTHH:mm:ss'),
        end: end.add(30, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
      },
    ],
    parentFacilities: [
      {
        id: '983',
        identifier: [
          { system: 'urn:oid:2.16.840.1.113883.6.233', value: '983' },
          {
            system: 'http://med.va.gov/fhir/urn',
            value: 'urn:va:facility:983',
          },
        ],
      },
    ],
    clinics: {
      '983_323': [
        {
          id: '455',
          serviceName: 'CHY PC CASSIDY',
        },
      ],
    },
    facilities: {
      '323': [
        {
          id: '983',
          name: 'Cheyenne VA Medical Center',
          identifier: [
            { system: 'urn:oid:2.16.840.1.113883.6.233', value: '983' },
          ],
          address: {
            postalCode: '82001-5356',
            city: 'Cheyenne',
            state: 'WY',
            line: ['2360 East Pershing Boulevard'],
          },
          telecom: [{ system: 'phone', value: '307-778-7550' }],
        },
      ],
    },
  },
});

describe('VAOS <ConfirmationDirectScheduleInfoV2>', () => {
  it('should render appointment direct schedule view', async () => {
    const screen = renderWithStoreAndRouter(<ConfirmationPage />, { store });
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
    expect(screen.getByText(/Follow-up\/Routine/i)).to.be.ok;
    expect(screen.getByText(/Additional info/i)).to.be.ok;
    expect(screen.getByText(/CHY PC CASSIDY/i)).to.be.ok;

    expect(
      screen.getByRole('link', {
        name: start.format('[Add] MMMM D, YYYY [appointment to your calendar]'),
      }),
    ).to.be.ok;

    expect(
      screen.getByRole('button', {
        name: 'Print',
      }),
    );
  });

  it('should render appointment list page when "View your appointments" link is clicked', () => {
    const screen = renderWithStoreAndRouter(<ConfirmationPage />, { store });
    userEvent.click(screen.getByText(/View your appointments/i));
    expect(screen.history.push.called).to.be.true;
    expect(screen.history.push.getCall(0).args[0]).to.equal('/');
  });

  it('should render new appointment page when "New appointment" link is clicked', () => {
    const screen = renderWithStoreAndRouter(<ConfirmationPage />, { store });
    userEvent.click(screen.getByText(/New appointment/i));
    expect(screen.history.push.called).to.be.true;
    expect(screen.history.push.getCall(0).args[0]).to.equal('/new-appointment');
  });

  it('should verify VA in person calendar ics file format', async () => {
    const screen = renderWithStoreAndRouter(<ConfirmationPage />, {
      store,
    });

    const ics = decodeURIComponent(
      screen
        .getByRole('link', {
          name: `Add ${start.format(
            'MMMM D, YYYY',
          )} appointment to your calendar`,
        })
        .getAttribute('href')
        .replace('data:text/calendar;charset=utf-8,', ''),
    );
    const tokens = ics.split('\r\n');

    // TODO: Debugging
    // console.log(tokens);

    expect(tokens[0]).to.equal('BEGIN:VCALENDAR');
    expect(tokens[1]).to.equal('VERSION:2.0');
    expect(tokens[2]).to.equal('PRODID:VA');
    expect(tokens[3]).to.equal('BEGIN:VEVENT');
    expect(tokens[4]).to.contain('UID:');
    expect(tokens[5]).to.equal('SUMMARY:Appointment at CHY PC CASSIDY');

    // Description text longer than 74 characters should start on newline beginning
    // with a tab character
    expect(tokens[6]).to.equal(
      'DESCRIPTION:You have a health care appointment at CHY PC CASSIDY',
    );
    expect(tokens[7]).to.equal('\t\\n\\n2360 East Pershing Boulevard\\n');
    expect(tokens[8]).to.equal('\tCheyenne\\, WY 82001-5356\\n');
    expect(tokens[9]).to.equal('\t307-778-7550\\n');
    expect(tokens[10]).to.equal(
      '\t\\nSign in to VA.gov to get details about this appointment\\n',
    );

    expect(tokens[11]).to.equal(
      'LOCATION:2360 East Pershing Boulevard\\, Cheyenne\\, WY 82001-5356',
    );
    expect(tokens[12]).to.equal(
      `DTSTAMP:${moment(start)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[13]).to.equal(
      `DTSTART:${moment(start)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[14]).to.equal(
      `DTEND:${moment(start)
        .utc()
        .add(30, 'minutes')
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[15]).to.equal('END:VEVENT');
    expect(tokens[16]).to.equal('END:VCALENDAR');
  });
});
