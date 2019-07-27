'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// import { vscode.workspace } from 'vscode';
import { removeReplace } from "./removeReplace";
import { Table } from './Table';
var escapeStringRegexp = require('escape-string-regexp');
// import beautify from 'js-beautify'
var beautify = require('js-beautify')
var beautify_js = require('js-beautify').js;
var beautify_css = require('js-beautify').css;
var beautify_html = require('js-beautify').html;

let config = vscode.workspace.getConfiguration('markdownFormatter');
let fullWidthTurnHalfWidth: string = config.get<string>('fullWidthTurnHalfWidth', 'auto');
let codeAreaFormat: boolean = config.get<boolean>('codeAreaFormat', true);
let codeAreaToBlock: string = config.get<string>('codeAreaToBlock', '')
let enable: boolean = config.get<boolean>('enable', true);
let formatOpt: any = config.get<any>('formatOpt', {});
let formatULSymbol: boolean = config.get<boolean>('formatULSymbol', true)
let spaceAfterFullWidth: boolean = config.get<boolean>('spaceAfterFullWidth', false);

vscode.workspace.onDidChangeConfiguration(_ => {
    config = vscode.workspace.getConfiguration('markdownFormatter');
    fullWidthTurnHalfWidth = config.get<string>('fullWidthTurnHalfWidth', 'auto');
    codeAreaFormat = config.get<boolean>('codeAreaFormat', true);
    codeAreaToBlock = config.get<string>('codeAreaToBlock', '');
    enable = config.get<boolean>('enable', true);
    formatOpt = config.get<any>('formatOpt', {});
    formatULSymbol = config.get<boolean>('formatULSymbol', true);
    spaceAfterFullWidth = config.get<boolean>('spaceAfterFullWidth', false);
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
    const PUNCTUATION_EXP = spaceAfterFullWidth ? /([，,。；;！、？：])\ */g : /([,;])\ */g;
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
    const IMG_EXP = /([^[])(\!\[[^\n]+\]\([^\n]+\))/g;

    // list 
    // const LIST_EXP = /(((?:\n)+(?: {4}|\t)*(?:\d+\.|\-|\*|\+) [^\n]+)+)/g;
    const LIST_EXP = /((\n(?: {4}|\t)*(?:\d+\.|\-|\*|\+) [^\n]+)+)/g
    const LIST_ST_EXP = /\n(?:\-|\*|\+) ([^\n]+)/g;
    const LIST_ND_EXP = /\n(?: {4}|\t)(?:\-|\*|\+) ([^\n]+)/g;
    const LIST_TH_EXP = /\n(?: {4}|\t){2}(?:\-|\*|\+) ([^\n]+)/g;

    // const NO_PERIOD_BACK_QUOTE_EXP = /\ *`([^.`\n]+)`\ */g;
    // const NO_PERIOD_BACK_QUOTE_EXP1 = /\ *`([^`\n]*\.[^`\n]*)`\ */g;
    // link 
    const LINK_SPACE_EXP = /\n(>+) *([^\n]+)/g
    const LINK_EXP = /\n((>+[^\n]*\n)+)/g

    // duplicated line
    const EXTRALINE_EXP = /\n\n+/g;

    // code block
    // const CODE_AREA_EXP = /\n+((?:(?: {4}|\t)+[^\n\-\+\*][^\n]+\n*)+)/g;
    const CODE_AREA_EXP = /\n+((?:(?: {4}|\t)+(?!\d\.|\+|\-|\*)[^\n]+\n)+)/g;
    // const CODE_AREA_EXP = /(?:(?: {4}|\t)+[^\n]+\n*)+/g;
    // const CODE_EXP = /\n*```([\s\S]+?)```\n*/g;
    const CODE_BLOCK_EXP = /\n*```(?: *)(\w*)\n([^```]+)(```)+?\n+/g
    // const CODE_BLOCK_EXP = /\n*```(?: *)(\w*)\n([\s\S]+)(```)+?\n+/g

    // line-break
    const LINE_BREAK_EXP = /\r\n/g;

    // const TAG_START_EXP = /<(?:[^\/])(?:[^"'>]|"[^"]*"|'[^']*')*>/g
    // const TAG_SINGLE_EXP = /<(?:[^\/])(?:[^"'>]|"[^"]*"|'[^']*')*\/>/g
    // const TAG_END_EXP = /<\/(?:[^"'>]|"[^"]*"|'[^']*')*>/g

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
            let text = document.getText(range) + '\n'
            // if (text === textLast) {
            //     vscode.window.showInformationMessage('No text to format.');
            //     return void 0;
            // }

            // textLast = text;
            const textLast = text

            // format \r\n to \n,fix
            text = text.replace(LINE_BREAK_EXP, '\n');

            try {
                // format PUNCTUATION_EXP
                const _replacewithCharcter = ({ target, judge, pad }: { target: string[]; judge: string; pad: string[]; }) => {
                    target.forEach((e, i) => {
                        const _reg = new RegExp(`${judge}\\${e}`, 'g');
                        text = text.replace(_reg, `$1${pad[i]}`);
                    });
                };

                text = removeReplace({
                    text, reg: [BACK_QUOTE_EXP, CODE_BLOCK_EXP, CODE_AREA_EXP], func: (text: string): string => {
                        // handle fullwidth character
                        const fullwidthArr = CHINESE_SYMBOL.split('');
                        const halfwidthArr = ENGLISH_SYMBOL.split('');

                        if (fullWidthTurnHalfWidth === 'auto') {
                            _replacewithCharcter({ target: fullwidthArr, judge: ENGLISH_CHARCTER_SYMBOL, pad: halfwidthArr });
                            _replacewithCharcter({ target: halfwidthArr, judge: CHINESE_CHARCTER_SYMBOL, pad: fullwidthArr });
                        } else {
                            if (fullWidthTurnHalfWidth !== '' && fullWidthTurnHalfWidth !== '_') {
                                const _commaArr = fullWidthTurnHalfWidth.split('');
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
                        }
                        text = text.replace(PUNCTUATION_EXP, '$1 ');
                        text = text.replace(PERIOD_EXP, '$1 $2');
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
                    const _codeArr = text.match(CODE_BLOCK_EXP)

                    if (_codeArr && _codeArr.length > 0) {
                        _codeArr.forEach(e => {
                            const isJs = e.replace(CODE_BLOCK_EXP, '$1').toLocaleLowerCase()

                            if (isJs === 'js' || isJs === 'javascript' || isJs === '') {
                                const re = new RegExp(escapeStringRegexp(e.replace(CODE_BLOCK_EXP, '$2')), 'g')
                                text = text.replace(re, '' + beautify_js(e.replace(CODE_BLOCK_EXP, '$2'), beautifyOpt) + '\n')
                            }
                            if (isJs === 'html') {
                                const re = new RegExp(escapeStringRegexp(e.replace(CODE_BLOCK_EXP, '$2')), 'g')
                                text = text.replace(re, '' + beautify_html(e.replace(CODE_BLOCK_EXP, '$2'), beautifyOpt) + '\n')
                            }
                            if (isJs === 'css') {
                                const re = new RegExp(escapeStringRegexp(e.replace(CODE_BLOCK_EXP, '$2')), 'g')
                                text = text.replace(re, '' + beautify_css(e.replace(CODE_BLOCK_EXP, '$2'), beautifyOpt) + '\n')
                            }
                        })
                    }

                    text = removeReplace({
                        text, reg: [CODE_BLOCK_EXP, LIST_EXP], func: (text: string): string => {
                            const _jsArr = text.match(CODE_AREA_EXP);

                            codeAreaToBlock = codeAreaToBlock.toLowerCase()
                            if (codeAreaFormat && _jsArr && _jsArr.length > 0) {
                                if (codeAreaToBlock === '') {
                                    _jsArr.forEach(e => {
                                        const re = new RegExp(escapeStringRegexp(e), 'g');
                                        // text = text.replace(re, '\n\n\n' + beautify(e.replace(CODE_AREA_EXP, '$1'), beautifyOpt) + '\n\n\n');
                                        text = text.replace(re, '\n\n\n' + e.replace(CODE_AREA_EXP, '$1') + '\n\n\n');
                                    });
                                } else {
                                    if (codeAreaToBlock === 'js' || codeAreaToBlock === 'javascript') {
                                        _jsArr.forEach(e => {
                                            const re = new RegExp(escapeStringRegexp(e), 'g');
                                            text = text.replace(re, '\n\n\n``` ' + codeAreaToBlock + '\n' + beautify_js(e.replace(CODE_AREA_EXP, '$1').replace(/(\ {4}|\t)/g, ''), beautifyOpt) + '\n```\n\n\n');
                                        });
                                    } else if (codeAreaToBlock === 'html') {
                                        _jsArr.forEach(e => {
                                            const re = new RegExp(escapeStringRegexp(e), 'g');
                                            text = text.replace(re, '\n\n\n``` ' + codeAreaToBlock + '\n' + beautify_html(e.replace(CODE_AREA_EXP, '$1').replace(/(\ {4}|\t)/g, ''), beautifyOpt) + '\n```\n\n\n');
                                        });
                                    } else if (codeAreaToBlock === 'css') {
                                        _jsArr.forEach(e => {
                                            const re = new RegExp(escapeStringRegexp(e), 'g');
                                            text = text.replace(re, '\n\n\n``` ' + codeAreaToBlock + '\n' + beautify_css(e.replace(CODE_AREA_EXP, '$1').replace(/(\ {4}|\t)/g, ''), beautifyOpt) + '\n```\n\n\n');
                                        });
                                    } else {
                                        _jsArr.forEach(e => {
                                            const re = new RegExp(escapeStringRegexp(e), 'g');
                                            // text = text.replace(re, '\n\n\n' + beautify(e.replace(CODE_AREA_EXP, '$1'), beautifyOpt) + '\n\n\n');
                                            text = text.replace(re, '\n\n\n``` ' + codeAreaToBlock + '\n' + e.replace(CODE_AREA_EXP, '$1').replace(/(\ {4}|\t)/g, '') + '```\n\n\n');
                                        });
                                    }
                                }
                            }
                            return text;
                        }
                    })
                }

                text = text.replace(LIST_EXP, '\n\n' + '$1' + '\n\n');
                if (formatULSymbol) {
                    text = text.replace(LIST_ST_EXP, '\n* ' + '$1');
                    text = text.replace(LIST_ND_EXP, '\n    + ' + '$1');
                    text = text.replace(LIST_TH_EXP, '\n        - ' + '$1');
                }
                text = text.replace(BACK_QUOTE_EXP, ' `$1` ')
                text = text.replace(H_EXP, '\n\n' + '$1' + '\n\n')
                text = text.replace(H1_EXP, '$1' + '\n\n')
                text = text.replace(IMG_EXP, '$1\n\n' + '$2' + '\n\n')
                text = text.replace(CODE_BLOCK_EXP, '\n\n``` ' + '$1\n$2' + '```\n\n')
                text = text.replace(LINK_EXP, '\n\n' + '$1' + '\n\n')
                text = text.replace(LINK_SPACE_EXP, '\n' + '$1 $2')
                text = text.replace(EXTRALINE_EXP, '\n\n')
            } catch (e) {
                text = textLast
                vscode.window.showInformationMessage(`[Error Format]:${e} \n you can ask for help by https://github.com/sumnow/markdown-formatter/issues`);
            }

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