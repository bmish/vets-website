import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import SingleSignOnInfoModal from '../../components/SingleSignOnInfoModal';

describe('Announcements <SingleSignOnInfoModal>', () => {
  it('renders for logged in SSO users', () => {
    const dismiss = sinon.spy();

    const tree = mount(
      <SingleSignOnInfoModal
        isLoggedIn
        dismiss={dismiss}
        isAuthenticatedWithSSOe
      />,
    );

    expect(tree.text()).to.contain(
      'Sign in once to access the VA sites you use most',
    );

    tree.unmount();
  });

  it('closes when the dismiss handler is fired', () => {
    const dismiss = sinon.spy();

    const tree = mount(
      <SingleSignOnInfoModal
        isLoggedIn
        dismiss={dismiss}
        isAuthenticatedWithSSOe
      />,
    );

    tree
      .find('button')
      .at(1)
      .props()
      .onClick();
    expect(dismiss.called).to.be.true;

    tree.unmount();
  });
});
