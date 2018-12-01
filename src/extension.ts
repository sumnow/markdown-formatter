'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { workspace } from 'vscode';
// import { reformat } from 'reformat-markdown-table'
var { reformat } = require('reformat-markdown-table')
// import * as escapeStringRegexp from 'escape-string-regexp'
var escapeStringRegexp = require('escape-string-regexp');
// import beautify from 'js-beautify'
var beautify = require('js-beautify')

let config = workspace.getConfiguration('markdownFormatter');
let commaEN = config.get<boolean>('commaEN', false);
let enable: boolean = config.get<boolean>('enable', true);
let formatOpt: any = config.get<any>('formatOpt', {});

workspace.onDidChangeConfiguration(e => {
    config = workspace.getConfiguration('markdownFormatter');
    enable = config.get<boolean>('enable', true);
    commaEN = config.get<boolean>('commaEN', false);
    formatOpt = config.get<any>('formatOpt', {});
});

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // comma symbol
    const COMMA_EXP = /[,，]\ */g;
    // period symbol
    const PERIOD_EXP = /([，,。;；！、？：])\ */g;
    // h1 symbol
    const H1_EXP = /^(# [^\n]+)\n*/g;
    // h2,h3,h4... symbol
    const H_EXP = /\n*(##+ [^\n]+)\n*/g;
    // table
    const TABLE_EXP = /((?:(?:[^\n]*?\|[^\n]*)\ *)?(?:\r?\n|^))((?:\|\ *(?::?-+:?|::)\ *|\|?(?:\ *(?::?-+:?|::)\ *\|)+)(?:\ *(?::?-+:?|::)\ *)?\ *\r?\n)((?:(?:[^\n]*?\|[^\n]*)\ *(?:\r?\n|$))+)/g;
    //back quote
    const BACK_QUOTE_EXP = /\ *`([^`\n]+)`\ */g;
    // link 
    const LINK_SPACE_EXP = /\n(>+) *([^\n]+)/g
    const LINK_EXP = /\n((>+[^\n]+\n)+)/g
    // duplicated line
    const EXTRALINE_EXP = /\n\n+/g;

    // code block
    // const JS_EXP = /( {4}[^\n]+\n*)+/g;
    const JS_EXP = /(( {4}|\t)[^\n]+\n*)+/g;
    const CODE_EXP = /\n*```([\s\S]+?)```\n*/g;
    const ISCODE_EXP = /\n*```(\w*)\n([\s\S]+?)```\n*/g

    // line-break
    const LINE_BREAK_EXP = /\r\n/g;
    // 
    // const line_EXP = /\n*```(\w*)\n([\s\S]+?)```\n*/g

    function extractTables(text: string): string[] {
        return text.match(TABLE_EXP);
    }
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('markdown', {
        provideDocumentFormattingEdits(document, options, token) {
            if (!enable) { return }

            let beautifyOpt = {}
            if (formatOpt !== false) {
                beautifyOpt = Object.assign({ "preserve_newlines": false }, formatOpt)
            }
            const result: vscode.TextEdit[] = [];

            const start = new vscode.Position(0, 0);
            const end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
            const range = new vscode.Range(start, end);
            let text = document.getText(range)
            text = text.replace(LINE_BREAK_EXP, '\n')
            // console.log(text.replace(line_EXP, '$1---$2'))

            // simple handle
            if (commaEN) {
                text = text.replace(COMMA_EXP, ',')
            }
            text = text.replace(PERIOD_EXP, '$1 ')
            text = text.replace(BACK_QUOTE_EXP, ' `$1` ')
            text = text.replace(H_EXP, '\n\n' + '$1' + '\n\n')
            text = text.replace(H1_EXP, '$1' + '\n\n')
            text = text.replace(CODE_EXP, '\n\n```' + '$1' + '```\n\n')
            text = text.replace(LINK_EXP, '\n\n' + '$1' + '\n\n')
            text = text.replace(LINK_SPACE_EXP, '\n' + '$1 $2')
            text = text.replace(EXTRALINE_EXP, '\n\n')

            // handler js
            if (formatOpt !== false) {
                const _jsArr = text.match(JS_EXP)
                if (_jsArr && _jsArr.length > 0) {
                    _jsArr.forEach(e => {
                        var re = new RegExp(escapeStringRegexp(e), 'g')
                        text = text.replace(re, beautify(e, beautifyOpt) + '\n\n')
                    })
                }
                const _codeArr = text.match(ISCODE_EXP)

                if (_codeArr && _codeArr.length > 0) {
                    _codeArr.forEach(e => {
                        var isJs = e.replace(ISCODE_EXP, '$1').toLocaleLowerCase()
                        if (isJs === 'js' || isJs === 'javascript' || isJs === '') {
                            var re = new RegExp(escapeStringRegexp(e.replace(ISCODE_EXP, '$2')), 'g')
                            text = text.replace(re, '\n' + beautify(e.replace(ISCODE_EXP, '$2'), beautifyOpt) + '\n')
                        }
                    })
                }
            }

            // handler table
            const _tableArr = extractTables(text)
            if (_tableArr && _tableArr.length > 0) {
                _tableArr.forEach((table) => {
                    var re = new RegExp(escapeStringRegexp(String(table)), 'g')
                    text = text.replace(re, (substring: string) => reformat(table))
                })
            }
            result.push(new vscode.TextEdit(range, text));
            return result;
        }
    }))


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

// this method is called when your extension is deactivated
export function deactivate() {
}