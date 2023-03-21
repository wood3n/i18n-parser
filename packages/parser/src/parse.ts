import { parse as vueParser } from '@vue/compiler-sfc';
import { parse as babelParser } from '@babel/parser';

export function parseVue(code: string) {
  return vueParser(code).descriptor;
}

export function parseJS(code: string) {
  return babelParser(code, {
    sourceType: 'module',
    plugins: ['jsx'],
  });
}
