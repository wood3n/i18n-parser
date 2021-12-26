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
  JS = ".js",
  VUE = ".vue",
}
