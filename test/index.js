'use strict';

const { expect } = require('chai');
const { isFuture, isPast, isDate } = require('date-fns');
const Chance = require('chance');
const accessToken = require('./../');

const chance = new Chance();
chance.mixin({ accessToken });

describe('when creating an access token', () => {
  describe('when called without options', () => {
    it('generates the base token properties', () => {
      const token = chance.accessToken();

      expect(token).to.be.an('object');
      expect(token).to.have.property('access_token');
      expect(token).to.have.property('refresh_token');
      expect(token).to.have.property('token_type').and.be.equal('bearer');
    });

    it('generates a token with expired in mode', () => {
      const token = chance.accessToken();

      expect(token).to.have.property('expires_in');
      expect(token).to.not.have.property('expires_at');
    });
  });

  describe('with custom expireMode option', () => {
    describe('when expireMode is expires_at', () => {
      it('generates a token expired at date', () => {
        const token = chance.accessToken({ expireMode: 'expires_at' });

        expect(token).to.not.have.property('expires_in');
        expect(token).to.have.property('expires_at');
      });

      it('generates a expired_at property as date when parseDate is true', () => {
        const token = chance.accessToken({ expireMode: 'expires_at', parseDate: true });

        expect(token).to.have.property('expires_at');
        expect(isDate(token.expires_at)).to.be.equal(true);
      });

      it('generates a expired_at property as ISO string when parseDate is false', () => {
        const token = chance.accessToken({ expireMode: 'expires_at', parseDate: false });

        expect(token).to.have.property('expires_at');
        expect(isDate(token.expires_at)).to.be.equal(false);
      });

      it('generates a expired token when expired option is true', () => {
        const token = chance.accessToken({ expireMode: 'expires_at', expired: true });

        expect(token).to.have.property('expires_at');
        expect(isPast(new Date(token.expires_at))).to.be.equal(true);
      });

      it('generates a valid token when expired option is false', () => {
        const token = chance.accessToken({ expireMode: 'expires_at', expired: false });

        expect(token).to.have.property('expires_at');
        expect(isFuture(new Date(token.expires_at))).to.be.equal(true);
      });
    });

    describe('when expireMode is expires_in', () => {
      it('generates a token expired in time', () => {
        const token = chance.accessToken({ expireMode: 'expires_in' });

        expect(token).to.have.property('expires_in');
        expect(token.expires_in).to.be.a('number');
        expect(token).to.not.have.property('expires_at');
      });
    });

    describe('when expireMode has an invalid value', () => {
      it('generates a token without expiration properties', () => {
        const token = chance.accessToken({ expireMode: chance.string() });

        expect(token).to.not.have.property('expires_in');
        expect(token).to.not.have.property('expires_at');
      });
    });
  });
});
