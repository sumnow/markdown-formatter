'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { workspace } from 'vscode';
import { removeReplace } from "./removeReplace";
import { Table } from './Table';
var escapeStringRegexp = require('escape-string-regexp');
// import beautify from 'js-beautify'
var beautify = require('js-beautify')
var beautify_css = require('js-beautify').css;
var beautify_html = require('js-beautify').html;

let config = workspace.getConfiguration('markdownFormatter');
let charactersTurnHalf: any = config.get<any>('charactersTurnHalf', false);
let enable: boolean = config.get<boolean>('enable', true);
let spaceAfterFullWidth: boolean = config.get<boolean>('spaceAfterFullWidth', false);
let formatOpt: any = config.get<any>('formatOpt', {});
let codeAreaFormat: boolean = config.get<boolean>('codeAreaFormat', true);

workspace.onDidChangeConfiguration(_ => {
    config = workspace.getConfiguration('markdownFormatter');
    enable = config.get<boolean>('enable', true);
    spaceAfterFullWidth = config.get<boolean>('spaceAfterFullWidth', false);
    codeAreaFormat = config.get<boolean>('codeAreaFormat', true);
    charactersTurnHalf = config.get<any>('charactersTurnHalf', false);
    formatOpt = config.get<any>('formatOpt', {});
});

// let textLast = ''
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // repalce symbol
    const CHINESE_SYMBOL = `，：；！“”‘’（）？。`;
    const ENGLISH_SYMBOL = `,:;!""''()?.`;

    // chinese symbol
    const CHINESE_CHARCTER_SYMBOL = `([\\u4e00-\\u9fa5])`;
    const ENGLISH_CHARCTER_SYMBOL = `([A-Za-z])`;

    // punctuation which need a space after it
    // const PUNCTUATION_EXP = /([，,。；;！、？：])\ */g;
    const PUNCTUATION_EXP =  spaceAfterFullWidth ? /([，,。；;！、？：])\ */g : /([,;])\ */g;
    // period which need a space after it
    const PERIOD_EXP = /([\.\!\?\:])([A-Z\u4e00-\u9fa5])/g;
    // h1 symbol
    const H1_EXP = /^(# [^\n]+)\n*/g;
    // h2,h3,h4... symbol
    const H_EXP = /\n*(##+ [^\n]+)\n*/g;
    // table
    const TABLE_EXP = /((?:(?:[^\n]*?\|[^\n]*)\ *)?(?:\r?\n|^))(?:[^|]+)((?:\|\ *(?::?-+:?|::)\ *|\|?(?:\ *(?::?-+:?|::)\ *\|)+)(?:\ *(?::?-+:?|::)\ *)?\ *\r?\n)((?:(?:[^\n]*?\|[^\n]*)\ *(?:\r?\n|$))+)/g;
    //back quote
    const BACK_QUOTE_EXP = /\ *`([^`\n]+)`\ */g;
    // image link
    const IMG_EXP = /(\!\[[^\n]+\]\([^\n]+\))/g;
    // list 
    const LIST_EXP = /(((?:\n)+(?: {4}|\t)*(?:\d+\.|\-|\*|\+) [^\n]+)+)/g;

    // const NO_PERIOD_BACK_QUOTE_EXP = /\ *`([^.`\n]+)`\ */g;
    // const NO_PERIOD_BACK_QUOTE_EXP1 = /\ *`([^`\n]*\.[^`\n]*)`\ */g;
    // link 
    const LINK_SPACE_EXP = /\n(>+) *([^\n]+)/g
    const LINK_EXP = /\n((>+[^\n]+\n)+)/g

    // duplicated line
    const EXTRALINE_EXP = /\n\n+/g;

    // code block
    // const CODE_AREA_EXP = /\n+((?:(?: {4}|\t)+[^\n\-\+\*][^\n]+\n*)+)/g;
    const CODE_AREA_EXP = /\n+((?:(?: {4}|\t)+(?!\d\.|\+|\-|\*)[^\n]+\n*)+)/g;
    // const CODE_AREA_EXP = /(?:(?: {4}|\t)+[^\n]+\n*)+/g;
    const CODE_EXP = /\n*```([\s\S]+?)```\n*/g;
    const ISCODE_EXP = /\n*```(?: *)(\w*)\n([\s\S]+?)(```)+?\n+/g

    // line-break
    const LINE_BREAK_EXP = /\r\n/g;

    function extractTables(text: string): string[] {
        return text.match(TABLE_EXP);
    }
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('markdown', {
        provideDocumentFormattingEdits(document, options, token) {
            if (!enable) { return void 0 }

            let beautifyOpt = {}
            if (formatOpt) {
                beautifyOpt = Object.assign(beautify, formatOpt)
            }
            const result: vscode.TextEdit[] = [];

            const start = new vscode.Position(0, 0);
            const end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
            const range = new vscode.Range(start, end);
            let text = document.getText(range)
            // if (text === textLast) {
            //     vscode.window.showInformationMessage('No text to format.');
            //     return void 0;
            // }
            // textLast = text;
            // format \r\n to \n,fix
            text = text.replace(LINE_BREAK_EXP, '\n');

            // format PUNCTUATION_EXP
            const _replacewithCharcter = ({ target, judge, pad }: { target: string[]; judge: string; pad: string[]; }) => {
                target.forEach((e, i) => {
                    const _reg = new RegExp(`${judge}\\${e}`, 'g');
                    text = text.replace(_reg, `$1${pad[i]}`);
                });
            };
            text = removeReplace({
                text, reg: [BACK_QUOTE_EXP, ISCODE_EXP, CODE_AREA_EXP], func: (text: string): string => {
                    text = text.replace(PUNCTUATION_EXP, '$1 ');
                    text = text.replace(PERIOD_EXP, '$1 $2');
                    // handle fullwidth character
                    const fullwidthArr = CHINESE_SYMBOL.split('');
                    const halfwidthArr = ENGLISH_SYMBOL.split('');
                    if (charactersTurnHalf) {
                        const _commaArr = charactersTurnHalf.split('');
                        if (_commaArr && _commaArr.length > 0) {
                            _commaArr.forEach(e => {
                                const _i = fullwidthArr.indexOf(e);
                                if (_i > -1) {
                                    const _reg = new RegExp('\\' + e, 'g');
                                    text = text.replace(_reg, halfwidthArr[_i]);
                                }
                            });
                        }
                    }
                    else {
                        _replacewithCharcter({ target: fullwidthArr, judge: ENGLISH_CHARCTER_SYMBOL, pad: halfwidthArr });
                        _replacewithCharcter({ target: halfwidthArr, judge: CHINESE_CHARCTER_SYMBOL, pad: fullwidthArr });
                    }
                    return text;
                }
            })
            // handler table
            const _tableArr = extractTables(text)
            if (_tableArr && _tableArr.length > 0) {
                _tableArr.forEach((table) => {
                    var re = new RegExp(escapeStringRegexp(String(table)), 'g')
                    text = text.replace(re, (substring: string) => '\n\n' + new Table().reformat(table) + '\n\n')
                })
            }

            // handler js
            if (formatOpt !== false) {
                const _codeArr = text.match(ISCODE_EXP)
                if (_codeArr && _codeArr.length > 0) {
                    _codeArr.forEach(e => {
                        const isJs = e.replace(ISCODE_EXP, '$1').toLocaleLowerCase()
                        if (isJs === 'js' || isJs === 'javascript' || isJs === '') {
                            const re = new RegExp(escapeStringRegexp(e.replace(ISCODE_EXP, '$2')), 'g')
                            text = text.replace(re, '' + beautify(e.replace(ISCODE_EXP, '$2'), beautifyOpt) + '\n')
                        }
                        if (isJs === 'html') {
                            const re = new RegExp(escapeStringRegexp(e.replace(ISCODE_EXP, '$2')), 'g')
                            text = text.replace(re, '' + beautify_html(e.replace(ISCODE_EXP, '$2'), beautifyOpt) + '\n')
                        }
                        if (isJs === 'css') {
                            const re = new RegExp(escapeStringRegexp(e.replace(ISCODE_EXP, '$2')), 'g')
                            text = text.replace(re, '' + beautify_css(e.replace(ISCODE_EXP, '$2'), beautifyOpt) + '\n')
                        }
                    })
                }
                text = removeReplace({
                    text, reg: [ISCODE_EXP], func: (text: string): string => {
                        const _jsArr = text.match(CODE_AREA_EXP);
                        if (codeAreaFormat && _jsArr && _jsArr.length > 0) {
                            _jsArr.forEach(e => {
                                const re = new RegExp(escapeStringRegexp(e), 'g');
                                text = text.replace(re, '\n\n' + beautify(e.replace(CODE_AREA_EXP, '$1'), beautifyOpt) + '\n\n');
                            });
                        }
                        return text;
                    }
                })
            }


            text = text.replace(LIST_EXP, '\n' + '$1' + '\n');
            text = text.replace(BACK_QUOTE_EXP, ' `$1` ')
            text = text.replace(H_EXP, '\n\n' + '$1' + '\n\n')
            text = text.replace(H1_EXP, '$1' + '\n\n')
            text = text.replace(IMG_EXP, '\n\n' + '$1' + '\n\n')
            text = text.replace(CODE_EXP, '\n\n```' + '$1' + '```\n\n')
            text = text.replace(LINK_EXP, '\n\n' + '$1' + '\n\n')
            text = text.replace(LINK_SPACE_EXP, '\n' + '$1 $2')
            text = text.replace(EXTRALINE_EXP, '\n\n')

            result.push(new vscode.TextEdit(range, text));
            vscode.window.showInformationMessage('Formatted text succeeded!');
            return result;
        }
    }))


    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "markdown-formatter" is now active!');

    // The command has been defined in the README.md file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in README.md
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