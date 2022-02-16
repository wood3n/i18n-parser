import babelTraverse, { Visitor } from "@babel/traverse";
import * as t from "@babel/types";
import path from "path";
import {
  ElementNode,
  SimpleExpressionNode,
  NodeTypes,
} from "@vue/compiler-core";
import { parseVue, parseJS } from "./parse";
import {
  generateTemplate,
  generateJS,
  generateInterpolation,
  generateSfc,
} from "./generator";
import { hasChineseCharacter, logError } from "./utils";
import { generateHash } from "./hash";
import { ConfigOptions, FileType } from "./typings";

function createDirectiveAttr(type: string, name: string, value: string) {
  // 处理特殊的事件属性
  if (type === "on") {
    return {
      name: "on",
      type: NodeTypes.DIRECTIVE,
      loc: {
        source: `@${name}="${value}"`,
      },
    };
  }

  return {
    name: "bind",
    type: NodeTypes.DIRECTIVE,
    loc: {
      source: `:${name}="${value}"`,
    },
  };
}

function createInterpolationNode(content: string) {
  return {
    type: NodeTypes.INTERPOLATION,
    loc: {
      source: `{{ ${content} }}`,
    },
  };
}

interface Options extends ConfigOptions {
  code: string;
  locales: Record<string, string>;
  filename: string;
}

class Transformer {
  // 转换后的代码
  result = "";
  // 提取的中文键值对
  locales: Record<string, string> = {};
  sourceCode: string;
  // 单一的JS文件
  filename: string;
  fileType: FileType;
  importVar = "I18N";
  importPath = "";

  constructor({ code, locales, importPath, filename }: Options) {
    this.sourceCode = code;
    this.result = code;
    this.locales = locales;
    this.importPath = importPath;
    this.filename = filename;
    this.fileType = path.extname(filename) as FileType;

    this.startTransform();
  }

  startTransform() {
    if (!Object.values(FileType).includes(this.fileType)) {
      logError(`Unsupported file type: ${this.filename}`);
      return;
    }

    if (hasChineseCharacter(this.sourceCode)) {
      if (
        this.fileType === FileType.JS &&
        this.hasChineseCharacterInJS(this.sourceCode)
      ) {
        this.result = generateJS(this.transformJS(this.sourceCode));
      } else if (this.fileType === FileType.VUE) {
        const descriptor = parseVue(this.sourceCode);
        if (
          descriptor?.template?.content &&
          hasChineseCharacter(descriptor?.template?.content)
        ) {
          descriptor.template.content = generateTemplate({
            ...this.transformTemplate(descriptor?.template.ast),
            tag: "",
          });
        }

        if (
          descriptor?.script?.content &&
          this.hasChineseCharacterInJS(descriptor?.script?.content)
        ) {
          descriptor.script.content = generateJS(
            this.transformJS(descriptor.script.content)
          );
        } else if (
          descriptor?.scriptSetup?.content &&
          this.hasChineseCharacterInJS(descriptor?.scriptSetup?.content)
        ) {
          descriptor.scriptSetup.content = generateJS(
            this.transformJS(descriptor.scriptSetup.content)
          );
        }

        this.result = generateSfc(descriptor);
      }
    }
  }

  hasChineseCharacterInJS = (code: string) => {
    let result = false;
    babelTraverse(parseJS(code), {
      enter: (path) => {
        if (
          path.node.type === "StringLiteral" &&
          hasChineseCharacter(path.node.extra?.rawValue as string)
        ) {
          path.stop();
          result = true;
        }

        if (
          path.node.type === "TemplateLiteral" &&
          path.node.quasis.some((q) => hasChineseCharacter(q.value.cooked))
        ) {
          path.stop();
          result = true;
        }

        if (
          path.node.type === "JSXText" &&
          hasChineseCharacter(path.node.value)
        ) {
          path.stop();
          result = true;
        }
      },
    });

    return result;
  };

  /**
   * 转换template节点
   */
  transformTemplate = (ast: ElementNode) => {
    /**
     * this is a hack
     * FIXME:指定 v-pre 的元素的属性及其子元素的属性和插值语法都不需要解析，
     * 但是 @vue/compiler-sfc 解析后的props中不会包含 v-pre 的属性名，所以这里暂时使用正则表达式匹配v-pre，并生动注入 v-pre 到 props 中
     * https://github.com/vuejs/vue-next/issues/4975
     */
    if (
      ast.type === NodeTypes.ELEMENT &&
      /^<+?[^>]+\s+(v-pre)[^>]*>+?[\s\S]*<+?\/[\s\S]*>+?$/gm.test(
        ast.loc.source
      )
    ) {
      ast.props = [
        {
          type: NodeTypes.DIRECTIVE,
          name: "pre",
          // @ts-expect-error 类型“{ source: string; }”缺少类型“SourceLocation”中的以下属性: start, endts(2739)
          loc: {
            source: "v-pre",
          },
        },
      ];
      return ast;
    }

    if (ast.props.length) {
      // @ts-expect-error 类型“{ name: string; type: number; loc: { source: string; }; }”缺少类型“DirectiveNode”中的以下属性: exp, arg, modifiersts(2322)
      ast.props = ast.props.map((prop) => {
        // vue指令
        if (
          prop.type === NodeTypes.DIRECTIVE &&
          hasChineseCharacter((prop.exp as SimpleExpressionNode)?.content)
        ) {
          const jsCode = generateInterpolation(
            this.transformJS((prop.exp as SimpleExpressionNode)?.content, true)
          );
          return createDirectiveAttr(
            prop.name,
            (prop.arg as SimpleExpressionNode)?.content,
            jsCode
          );
        }
        // 普通属性
        if (
          prop.type === NodeTypes.ATTRIBUTE &&
          hasChineseCharacter(prop.value?.content)
        ) {
          const localeKey = this.extractChar(prop.value!.content);
          return createDirectiveAttr("bind", prop.name, `$t('${localeKey}')`);
        }

        return prop;
      });
    }

    if (ast.children.length) {
      // @ts-expect-error 类型“{ type: number; loc: { source: string; }; }”缺少类型“TextCallNode”中的以下属性: content, codegenNodets(2322)
      ast.children = ast.children.map((child) => {
        if (
          child.type === NodeTypes.TEXT &&
          hasChineseCharacter(child.content)
        ) {
          const localeKey = this.extractChar(child.content);
          return createInterpolationNode(`$t('${localeKey}')`);
        }

        // 插值语法，插值语法的内容包含在child.content内部，如果匹配到中文字符，则进行JS表达式解析并替换
        if (
          child.type === NodeTypes.INTERPOLATION &&
          hasChineseCharacter((child.content as SimpleExpressionNode)?.content)
        ) {
          const jsCode = generateInterpolation(
            this.transformJS(
              (child.content as SimpleExpressionNode)?.content,
              true
            )
          );
          return createInterpolationNode(jsCode);
        }

        // 元素
        if (child.type === NodeTypes.ELEMENT) {
          return this.transformTemplate(child);
        }

        return child;
      });
    }

    return ast;
  };

  transformJS = (code: string, isInTemplate?: boolean) => {
    const ast = parseJS(code);
    let shouldImportVar = false;

    const visitor: Visitor = {
      Program: {
        exit: (path) => {
          if (this.fileType === FileType.JS) {
            // 解析import语句
            path.traverse({
              ImportDeclaration: (path) => {
                if (
                  path.node.specifiers.find(
                    (item) => item.local.name === this.importVar
                  )
                ) {
                  shouldImportVar = false;
                  path.stop();
                }
              },
            });

            if (shouldImportVar) {
              path.unshiftContainer(
                "body",
                t.importDeclaration(
                  [t.importDefaultSpecifier(t.identifier(this.importVar))],
                  t.stringLiteral(this.importPath)
                )
              );
            }
          }
        },
      },
      StringLiteral: {
        exit: (path) => {
          if (hasChineseCharacter(path.node.extra?.rawValue as string)) {
            const localeKey = this.extractChar(
              path.node.extra?.rawValue as string
            );

            if (this.fileType === FileType.JS) {
              shouldImportVar = true;
              path.replaceWith(
                t.callExpression(
                  t.memberExpression(
                    t.identifier(this.importVar),
                    t.identifier("t")
                  ),
                  [t.stringLiteral(localeKey)]
                )
              );
            } else if (this.fileType === FileType.VUE) {
              if (isInTemplate) {
                path.replaceWith(
                  t.callExpression(t.identifier("$t"), [
                    t.stringLiteral(localeKey),
                  ])
                );
              } else {
                // this.$t
                path.replaceWith(
                  t.callExpression(
                    t.memberExpression(t.thisExpression(), t.identifier("$t")),
                    [t.stringLiteral(localeKey)]
                  )
                );
              }
            }
          }
        },
      },
      TemplateLiteral: {
        exit: (path) => {
          // 检测模板字符串内部是否含有中文字符
          if (
            path.node.quasis.some((q) => hasChineseCharacter(q.value.cooked))
          ) {
            // 生成替换字符串，注意这里不需要过滤quasis里的空字符串
            const replaceStr = path.node.quasis
              .map((q) => q.value.cooked)
              .join("%s");
            const localeKey = this.extractChar(replaceStr);
            const isIncludeInterpolation = !!path.node.expressions?.length;
            if (this.fileType === FileType.JS) {
              shouldImportVar = true;
              if (isIncludeInterpolation) {
                path.replaceWith(
                  t.callExpression(
                    t.memberExpression(
                      t.identifier(this.importVar),
                      t.identifier("tExtend")
                    ),
                    [
                      t.stringLiteral(localeKey),
                      t.arrayExpression(
                        path.node.expressions as t.Expression[]
                      ),
                    ]
                  )
                );
              } else {
                path.replaceWith(
                  t.callExpression(
                    t.memberExpression(
                      t.identifier(this.importVar),
                      t.identifier("t")
                    ),
                    [t.stringLiteral(localeKey)]
                  )
                );
              }
            } else if (this.fileType === FileType.VUE) {
              if (isInTemplate) {
                if (isIncludeInterpolation) {
                  path.replaceWith(
                    t.callExpression(
                      t.memberExpression(
                        t.identifier("$i18n"),
                        t.identifier("tExtend")
                      ),
                      [
                        t.stringLiteral(localeKey),
                        t.arrayExpression(
                          path.node.expressions as t.Expression[]
                        ),
                      ]
                    )
                  );
                } else {
                  path.replaceWith(
                    t.callExpression(t.identifier("$t"), [
                      t.stringLiteral(localeKey),
                    ])
                  );
                }
              } else {
                if (isIncludeInterpolation) {
                  path.replaceWith(
                    t.callExpression(
                      t.memberExpression(
                        t.memberExpression(
                          t.thisExpression(),
                          t.identifier("$i18n")
                        ),
                        t.identifier("tExtend")
                      ),
                      [
                        t.stringLiteral(localeKey),
                        t.arrayExpression(
                          path.node.expressions as t.Expression[]
                        ),
                      ]
                    )
                  );
                } else {
                  path.replaceWith(
                    t.callExpression(
                      t.memberExpression(
                        t.thisExpression(),
                        t.identifier("$t")
                      ),
                      [t.stringLiteral(localeKey)]
                    )
                  );
                }
              }
            }
          }
        },
      },
      JSXText: {
        exit: (path) => {
          if (hasChineseCharacter(path.node.value)) {
            const localeKey = this.extractChar(
              path.node.extra?.rawValue as string
            );

            path.replaceWith(
              t.jsxExpressionContainer(
                t.callExpression(t.identifier("$t"), [
                  t.stringLiteral(localeKey),
                ])
              )
            );
          }
        },
      },
    };

    babelTraverse(ast, visitor);
    return ast;
  };

  extractChar = (char: string) => {
    const locale = char.trim();
    const key = generateHash(locale);
    this.locales[key] = locale;
    return key;
  };
}

export default Transformer;
