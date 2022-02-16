"use strict";

const { createHash } = require("crypto");

export function generateHash(char, length) {
  const hash = createHash("md5");
  hash.update(char);
  return hash.digest("hex").slice(0, length);
}
