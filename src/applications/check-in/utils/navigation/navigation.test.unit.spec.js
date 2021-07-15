import { expect } from 'chai';
import sinon from 'sinon';
import { goToNextPage, getTokenFromLocation } from './index';

describe('check in', () => {
  describe('navigation utils', () => {
    describe('getTokenFromLocation', () => {
      it('returns the id of the query object of the location provided', () => {
        const location = {
          query: {
            id: 'magic',
          },
        };
        const result = getTokenFromLocation(location);
        expect(result).to.equal('magic');
      });
      it('returns undefined if location is undefined', () => {
        const location = undefined;
        const result = getTokenFromLocation(location);
        expect(result).to.be.undefined;
      });
      it('returns undefined if location.query is undefined', () => {
        const location = {
          query: undefined,
        };
        const result = getTokenFromLocation(location);
        expect(result).to.be.undefined;
      });
    });
    describe('goToNextPage', () => {
      it('calls .push() of the object passed in with the string that was provided', () => {
        const push = sinon.spy();
        const mockRouter = {
          push,
          params: {
            token: 'some-token',
          },
        };
        const target = 'magic';
        goToNextPage(mockRouter, target);
        expect(push.called).to.be.true;
        expect(push.calledWith(`magic`));
      });
    });
  });
});
