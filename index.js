'use strict';

const expireModes = {
  in: 'expires_in',
  at: 'expires_at',
};

const tokenDefaultOptions = {
  expireMode: expireModes.in,
  dateFormat: 'iso',
  expired: false,
};

/**
 * Either generates a past or future date depending on the `expired` argument
 * @param {Chance} chance
 * @param {Boolean} expired Indicates if the generated date should be expired
 */
const getExpirationDate = (chance, expired) => {
  const millisecondsOffset = chance.second() * 1000;

  if (expired) {
    return new Date(Date.now() - millisecondsOffset);
  }

  return new Date(Date.now() + millisecondsOffset);
};

module.exports = function accessToken(options = {}) {
  const opts = Object.assign({}, tokenDefaultOptions, options);

  const baseAccessToken = {
    access_token: this.guid(),
    refresh_token: this.guid(),
    token_type: 'bearer',
  };

  if (opts.expireMode === expireModes.in) {
    const secondsToExpire = this.minute() * 60;

    return Object.assign({}, baseAccessToken, {
      expires_in: secondsToExpire,
    });
  }

  if (opts.expireMode === expireModes.at) {
    const expirationDateValue = getExpirationDate(this, opts.expired);
    const expirationDate = {
      date: expirationDateValue,
      iso: expirationDateValue.toISOString(),
      unix: Math.round(expirationDateValue.getTime() / 1000),
    }[opts.dateFormat];

    return Object.assign({}, baseAccessToken, {
      expires_at: expirationDate,
    });
  }

  return baseAccessToken;
};
