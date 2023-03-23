import type {
  ExtensionContext,
  DiagnosticCollection,
} from 'vscode';
import {
  workspace,
  languages,
  Location,
} from 'vscode';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { parse as babelParser } from '@babel/parser';

let diagnosticCollection: DiagnosticCollection;

export function activate(context: ExtensionContext) {
  const workSpaceFolder = workspace.workspaceFolders?.[0]?.uri?.fsPath ?? '';
  const configPath: string = workspace.getConfiguration().get('i18n.conf.localePath')
    ?? 'src/i18n/zh-CN.json';
  const zhLocalePath = path.resolve(workSpaceFolder, configPath);
  const zhJSON = JSON.parse(readFileSync(zhLocalePath, 'utf8'));

  const disposableHover = languages.registerHoverProvider(
    [
      {
        scheme: 'file',
        language: 'javascript',
      },
      {
        scheme: 'file',
        language: 'vue',
      },
    ],
    {
      provideHover(document, position, token) {
        // 当前hover的字符串
        const range = document.getWordRangeAtPosition(position);
        const key = document.getText(range);

        if (workSpaceFolder) {
          // 获取文件相对于项目根目录的相对路径，并组成key值
          const fileRelativePath = path.relative(
            workSpaceFolder,
            document.fileName,
          );
          const src = fileRelativePath.split(path.sep).join('.');

          const localeValue = zhJSON[src][key];
          if (localeValue) {
            return {
              contents: [localeValue, 'sweet-i18n 提供翻译提示'],
            };
          }
        }
      },
    },
  );

  context.subscriptions.push(disposableHover);
}
