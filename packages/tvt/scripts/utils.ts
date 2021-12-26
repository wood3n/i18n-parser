import chalk from "chalk";
import fs from "fs";
import path from "path";

/**
 * 匹配中文字符
 */
export function hasChineseCharacter(code?: string) {
  return code && /[\u{4E00}-\u{9FFF}]/gmu.test(code);
}

/**
 * print mistake
 */
export function logError(message: string) {
  console.log(chalk.red(message));
}

/**
 * print warning
 */
export function logWarn(message: string) {
  console.log(chalk.yellow(message));
}

/**
 * print basic infomation
 */
export function logInfo(message: string) {
  console.log(chalk.white(message));
}

/**
 * print note
 */
export function logNote(message: string) {
  console.log(chalk.cyan(message));
}

/**
 * 检查文件
 */
export function fileExists(path: string) {
  let flag = true;
  try {
    fs.accessSync(path, fs.constants.F_OK);
  } catch (e) {
    flag = false;
  }
  return flag;
}

/**
 * 递归创建目录
 */
export function mkdirSync(dirname: string) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}
