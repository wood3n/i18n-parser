/**
 * 配置项类型
 */
export interface ConfigOptions {
  /**
   * glob匹配模式：
   */
  pattern?: string;
  /**
   * 排除的文件：https://github.com/isaacs/node-glob#options
   */
  ignore?: string | string[];
  /**
   * 输出的文件名或者文件名路径
   */
  output?: string;
  /**
   * 是否为每一个中文文案都使用单独的key
   */
  useUniqKey?: boolean;
  /**
   * 指定引入vue-i18n变量的路径
   */
  importPath: string;
}

/**
 * 文件类型
 */
export enum FileType {
  JS = '.js',
  VUE = '.vue',
  JSX = '.jsx',
  TSX = '.tsx',
  TS = '.ts',
}

/**
 * CLI
 */
export interface CommanderOptions {
  import?: string;
  output?: string;
}

/**
 * vue ast节点类型
 */
export const enum NodeTypes {
  ROOT = 0,
  ELEMENT = 1,
  TEXT = 2,
  COMMENT = 3,
  SIMPLE_EXPRESSION = 4,
  INTERPOLATION = 5,
  ATTRIBUTE = 6,
  DIRECTIVE = 7,
  COMPOUND_EXPRESSION = 8,
  IF = 9,
  IF_BRANCH = 10,
  FOR = 11,
  TEXT_CALL = 12,
  VNODE_CALL = 13,
  JS_CALL_EXPRESSION = 14,
  JS_OBJECT_EXPRESSION = 15,
  JS_PROPERTY = 16,
  JS_ARRAY_EXPRESSION = 17,
  JS_FUNCTION_EXPRESSION = 18,
  JS_CONDITIONAL_EXPRESSION = 19,
  JS_CACHE_EXPRESSION = 20,
  JS_BLOCK_STATEMENT = 21,
  JS_TEMPLATE_LITERAL = 22,
  JS_IF_STATEMENT = 23,
  JS_ASSIGNMENT_EXPRESSION = 24,
  JS_SEQUENCE_EXPRESSION = 25,
  JS_RETURN_STATEMENT = 26,
}
