'use strict';

const test = require('ava');
const { isFuture, isPast, isDate } = require('date-fns');
const Chance = require('chance');
const accessToken = require('..');

const hasOwnProperty = (ctx, ...args) => Object.prototype.hasOwnProperty.call(ctx, ...args);

const chance = new Chance();
chance.mixin({ accessToken });

test('generates an access token (no options)', (t) => {
  const token = chance.accessToken();

  t.is(typeof token, 'object');
  t.true(hasOwnProperty(token, 'access_token'));
  t.true(hasOwnProperty(token, 'refresh_token'));

  t.true(hasOwnProperty(token, 'expires_in'));
  t.false(hasOwnProperty(token, 'expires_at'));

  t.true(hasOwnProperty(token, 'token_type'));
  t.is(token.token_type, 'bearer');
});

test('generates an access token (expireMode=expires_at)', (t) => {
  const token = chance.accessToken({ expireMode: 'expires_at' });

  t.true(hasOwnProperty(token, 'expires_at'));
  t.false(hasOwnProperty(token, 'expires_in'));
});

test('generates an access token with expired_at property as date (expireMode=expires_at) and (dateFormat=date)', (t) => {
  const token = chance.accessToken({ expireMode: 'expires_at', dateFormat: 'date' });

  t.true(hasOwnProperty(token, 'expires_at'));
  t.true(isDate(token.expires_at));
});

test('generates an access token with expired_at property as ISO string (expireMode=expires_at) and (dateFormat=iso)', (t) => {
  const token = chance.accessToken({ expireMode: 'expires_at', dateFormat: 'iso' });

  t.true(hasOwnProperty(token, 'expires_at'));
  t.false(isDate(token.expires_at));
  t.is(typeof token.expires_at, 'string');
});

test('generates an access token with expired_at property as UNIX timestamp (expireMode=expires_at) and (dateFormat=unix)', (t) => {
  const token = chance.accessToken({ expireMode: 'expires_at', dateFormat: 'unix' });

  t.true(hasOwnProperty(token, 'expires_at'));
  t.false(isDate(token.expires_at));
  t.is(typeof token.expires_at, 'number');
});

test('generates an expired access token (expired=true)', (t) => {
  const token = chance.accessToken({ expireMode: 'expires_at', expired: true });

  t.true(hasOwnProperty(token, 'expires_at'));
  t.true(isPast(new Date(token.expires_at)));
});

test('generates a valid access token (expired=false)', (t) => {
  const token = chance.accessToken({ expireMode: 'expires_at', expired: false });

  t.true(hasOwnProperty(token, 'expires_at'));
  t.true(isFuture(new Date(token.expires_at)));
});

test('generates an access token (expireMode=expires_in)', (t) => {
  const token = chance.accessToken({ expireMode: 'expires_in' });

  t.true(hasOwnProperty(token, 'expires_in'));
  t.is(typeof token.expires_in, 'number');
  t.false(hasOwnProperty(token, 'expires_at'));
});

test('generates an access token without expiration properties (expireMode=invalid value)', (t) => {
  const token = chance.accessToken({ expireMode: chance.string() });

  t.false(hasOwnProperty(token, 'expires_in'));
  t.false(hasOwnProperty(token, 'expires_at'));
});
