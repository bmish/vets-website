// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import environment from 'platform/utilities/environment';
import { App } from '.';

describe('Ask VA <App>', () => {
  it('renders ask va link when not authenticated', () => {
    const expectedHref = environment.isProduction()
      ? 'https://ava.va.gov/'
      : 'https://ask-staging.va.gov';
    const wrapper = shallow(<App loa={undefined} />);
    expect(wrapper.find(`a[href="${expectedHref}"]`)).be.have.lengthOf(1);
    expect(wrapper.find(`a[href="${expectedHref}"]`).text()).to.equal(
      'Contact us online through Ask VA',
    );
    wrapper.unmount();
  });

  it('renders what we expect when user is LOA1', () => {
    const expectedHref = environment.isProduction()
      ? 'https://ava.va.gov/Unauthenticated'
      : 'https://ask-staging.va.gov/Unauthenticated';
    const wrapper = shallow(<App loa={1} />);
    expect(wrapper.find(`a[href="${expectedHref}"]`)).be.have.lengthOf(1);
    expect(wrapper.find(`a[href="${expectedHref}"]`).text()).to.equal(
      'Contact us online through Ask VA',
    );
    wrapper.unmount();
  });

  it('renders what we expect when user is LOA2', () => {
    const expectedHref = environment.isProduction()
      ? 'https://eauth.va.gov/isam/sps/saml20idp/saml20/logininitial?PartnerId=https://prod-va-gov-sso.portals.va.gov/ava/SSO/Metadata/'
      : 'https://preprod.eauth.va.gov/isam/sps/saml20idp/saml20/logininitial?PartnerId=https://preprod-va-gov-sso.portals.va.gov/ava/SSO/Metadata/';
    const wrapper = shallow(<App loa={2} />);
    expect(wrapper.find(`a[href="${expectedHref}"]`)).be.have.lengthOf(1);
    expect(wrapper.find(`a[href="${expectedHref}"]`).text()).to.equal(
      'Contact us online through Ask VA',
    );
    wrapper.unmount();
  });

  it('renders what we expect when user is LOA2+', () => {
    const expectedHref = environment.isProduction()
      ? 'https://eauth.va.gov/isam/sps/saml20idp/saml20/logininitial?PartnerId=https://prod-va-gov-sso.portals.va.gov/ava/SSO/Metadata/'
      : 'https://preprod.eauth.va.gov/isam/sps/saml20idp/saml20/logininitial?PartnerId=https://preprod-va-gov-sso.portals.va.gov/ava/SSO/Metadata/';
    const wrapper = shallow(<App loa={3} />);
    expect(wrapper.find(`a[href="${expectedHref}"]`)).be.have.lengthOf(1);
    expect(wrapper.find(`a[href="${expectedHref}"]`).text()).to.equal(
      'Contact us online through Ask VA',
    );
    wrapper.unmount();
  });
});
