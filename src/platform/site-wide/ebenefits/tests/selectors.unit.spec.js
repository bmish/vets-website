import { expect } from 'chai';
import * as selectors from '../selectors';

describe('ebenefits selectors', () => {
  describe('shouldUseProxyUrl', () => {
    let state = {};
    beforeEach(() => {
      state = {
        user: {
          profile: {
            session: {},
          },
        },
      };
    });

    it('renders false when user is logged out', () => {
      expect(selectors.shouldUseProxyUrl(state)).to.equal(false);
    });
    it('renders true when user is logged in with ssoe', () => {
      state.user.profile.session.ssoe = true;
      expect(selectors.shouldUseProxyUrl(state)).to.equal(true);
    });
  });
});
