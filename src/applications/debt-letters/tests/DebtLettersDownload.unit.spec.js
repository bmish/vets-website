import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom';
import DebtLettersDownload from '../components/DebtLettersDownload';

describe('DebtLettersDownload', () => {
  const fakeStore = {
    getState: () => ({
      user: {
        login: {
          currentlyLoggedIn: true,
        },
      },
      debtLetters: {
        isFetching: false,
        debts: [],
        debtLinks: [
          {
            documentId: '{64B0BDC4-D40C-4C54-86E0-104C987B8D8F}',
            docType: '1213',
            typeDescription: 'Second Demand Letter',
            receivedAt: '2020-05-29',
          },
          {
            documentId: '{70412535-E39E-4202-B24E-2751D9FBC874}',
            docType: '194',
            typeDescription: 'First Demand Letter',
            receivedAt: '2020-05-29',
          },
          {
            documentId: '{3626D232-98D9-41AB-AA3A-CD2DDF7DA59C}',
            docType: '194',
            typeDescription: 'First Demand Letter',
            receivedAt: '2020-05-29',
          },
          {
            documentId: '{641D0414-10A9-4246-9AFD-3C0BE2D62B2F}',
            docType: '1213',
            typeDescription: 'Second Demand Letter',
            receivedAt: '2020-05-29',
          },
        ],
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
  it('renders correct number of debt rows', () => {
    const wrapper = mount(
      <MemoryRouter>
        <DebtLettersDownload store={fakeStore} />
      </MemoryRouter>,
    );

    expect(wrapper.find(`DebtLettersTable`).length).to.equal(1);
    expect(
      wrapper
        .find('DebtLettersTable')
        .find('td')
        .at(0)
        .text(),
    ).to.equal('May 29, 2020');
    expect(
      wrapper
        .find('DebtLettersTable')
        .find('td')
        .at(1)
        .text(),
    ).to.equal('Second Demand Letter');
    wrapper.unmount();
  });
});
