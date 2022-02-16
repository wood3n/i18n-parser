var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// src/index.ts
__export(exports, {
  activate: () => activate
});
var import_vscode = __toModule(require("vscode"));
var import_fs = __toModule(require("fs"));
var import_path = __toModule(require("path"));
function activate(context) {
  var _a, _b;
  const workSpaceFolder = (_b = (_a = import_vscode.workspace.workspaceFolders) == null ? void 0 : _a[0]) == null ? void 0 : _b.uri.fsPath;
  const zhLocalePath = import_vscode.workspace.getConfiguration().get("i18n.conf.localePath");
  const disposableHover = import_vscode.languages.registerHoverProvider([
    {
      scheme: "file",
      language: "javascript"
    },
    {
      scheme: "file",
      language: "vue"
    }
  ], {
    provideHover(document, position, token) {
      const range = document.getWordRangeAtPosition(position);
      const key = document.getText(range);
      const options = import_vscode.workspace.getConfiguration("sweet-i18n").get("configurations");
      console.log(options);
      if (workSpaceFolder) {
        const localePath = import_path.default.resolve(workSpaceFolder, "src/i18n/zh-CN.json");
        const locales = JSON.parse((0, import_fs.readFileSync)(localePath, "utf8"));
        const fileRelativePath = import_path.default.relative(workSpaceFolder, document.fileName);
        const src = fileRelativePath.split(import_path.default.sep).join(".");
        const localeValue = locales[src][key];
        if (localeValue) {
          return {
            contents: [localeValue, "sweet-i18n \u63D0\u4F9B\u7FFB\u8BD1\u63D0\u793A"]
          };
        }
      }
      return;
    }
  });
  const disposableDefinition = import_vscode.languages.registerDefinitionProvider([
    {
      scheme: "file",
      language: "javascript"
    },
    {
      scheme: "file",
      language: "vue"
    }
  ], {
    provideDefinition(document, position, token) {
      return new import_vscode.Location({
        scheme: "file",
        path: "/path/sfsffdf",
        query: "?start=1&end=2",
        fragment: "#rerrr",
        fsPath: ""
      });
    }
  });
  context.subscriptions.push(disposableHover);
  context.subscriptions.push(disposableDefinition);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate
});
//# sourceMappingURL=index.js.map
