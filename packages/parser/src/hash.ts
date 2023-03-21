const {
  createHash,
} = require('node:crypto');

export function generateHash(char: string) {
  const hash = createHash('md5');
  hash.update(char);
  return hash.digest('hex').slice();
}
