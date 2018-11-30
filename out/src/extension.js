'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var vscode_1 = require('vscode');
// import { reformat } from 'reformat-markdown-table'
var reformat = require('reformat-markdown-table').reformat;
// import * as escapeStringRegexp from 'escape-string-regexp'
var escapeStringRegexp = require('escape-string-regexp');
// import beautify from 'js-beautify'
var beautify = require('js-beautify');
var config = vscode_1.workspace.getConfiguration('markdownFormatter');
var enable = config.get('enable', true);
var formatOpt = config.get('formatOpt', {});
vscode_1.workspace.onDidChangeConfiguration(function (e) {
    config = vscode_1.workspace.getConfiguration('markdownFormatter');
    enable = config.get('enable', true);
    formatOpt = config.get('formatOpt', {});
});
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // comma symbol
    var COMMA_EXP = /[,，]\ */g;
    // period symbol
    var PERIOD_EXP = /([。;；！、？：])\ */g;
    // h1 symbol
    var H1_EXP = /^(# [^\n]+)\n*/g;
    // h2,h3,h4... symbol
    var H_EXP = /\n*(##+ [^\n]+)\n*/g;
    // table
    var TABLE_EXP = /((?:(?:[^\n]*?\|[^\n]*)\ *)?(?:\r?\n|^))((?:\|\ *(?::?-+:?|::)\ *|\|?(?:\ *(?::?-+:?|::)\ *\|)+)(?:\ *(?::?-+:?|::)\ *)?\ *\r?\n)((?:(?:[^\n]*?\|[^\n]*)\ *(?:\r?\n|$))+)/g;
    //back quote
    var BACK_QUOTE_EXP = /\ *`([^`\n]+)`\ */g;
    // link 
    var LINK_SPACE_EXP = /\n(>+) *([^\n]+)/g;
    var LINK_EXP = /\n((>+[^\n]+\n)+)/g;
    // duplicated line
    var EXTRALINE_EXP = /\n\n+/g;
    // code block
    var JS_EXP = /( {4}[^\n]+\n*)+/g;
    var CODE_EXP = /\n*```([\s\S]+?)```\n*/g;
    function extractTables(text) {
        return text.match(TABLE_EXP);
    }
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('markdown', {
        provideDocumentFormattingEdits: function (document, options, token) {
            if (!enable) {
                return;
            }
            var beautifyOpt = formatOpt;
            var result = [];
            var start = new vscode.Position(0, 0);
            var end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
            var range = new vscode.Range(start, end);
            var text = document.getText(range);
            // simple handle
            text = text.replace(COMMA_EXP, ', ');
            text = text.replace(PERIOD_EXP, '$1 ');
            text = text.replace(BACK_QUOTE_EXP, ' `$1` ');
            text = text.replace(H_EXP, '\n\n' + '$1' + '\n\n');
            text = text.replace(H1_EXP, '$1' + '\n\n');
            text = text.replace(CODE_EXP, '\n\n```' + '$1' + '```\n\n');
            text = text.replace(LINK_EXP, '\n\n' + '$1' + '\n\n');
            text = text.replace(LINK_SPACE_EXP, '\n' + '$1 $2');
            text = text.replace(EXTRALINE_EXP, '\n\n');
            // handler js
            var _jsArr = text.match(JS_EXP);
            if (_jsArr && _jsArr.length > 0) {
                _jsArr.forEach(function (e) {
                    var re = new RegExp(escapeStringRegexp(e), 'g');
                    text = text.replace(re, beautify(e, beautifyOpt) + '\n\n');
                });
            }
            var _codeArr = text.match(CODE_EXP);
            if (_codeArr && _codeArr.length > 0) {
                _codeArr.forEach(function (e) {
                    var re = new RegExp(escapeStringRegexp(e.replace(CODE_EXP, '$1')), 'g');
                    text = text.replace(re, '\n' + beautify(e.replace(CODE_EXP, '$1'), beautifyOpt) + '\n');
                });
            }
            // handler table
            var _tableArr = extractTables(text);
            if (_tableArr && _tableArr.length > 0) {
                _tableArr.forEach(function (table) {
                    var re = new RegExp(escapeStringRegexp(String(table)), 'g');
                    text = text.replace(re, function (substring) { return reformat(table); });
                });
            }
            result.push(new vscode.TextEdit(range, text));
            return result;
        }
    }));
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "markdown-formatter" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    // let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    // vscode.window.showInformationMessage('Hello World!');
    // });
    // context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map