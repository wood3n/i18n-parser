'use strict';

const { createHash } = require('crypto');

export function generateHash(char) {
  const hash = createHash('md5');
  hash.update(char);
  return hash.digest('hex');
}
