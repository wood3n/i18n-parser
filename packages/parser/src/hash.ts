import {
  createHash,
} from 'node:crypto';

export function generateHash(char: string): string {
  const hash = createHash('md5');
  hash.update(char);
  return hash.digest('hex').slice();
}
