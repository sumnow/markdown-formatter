'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { workspace } from 'vscode';
// import * as escapeStringRegexp from 'escape-string-regexp'
var escapeStringRegexp = require('escape-string-regexp');
// import beautify from 'js-beautify'
var beautify = require('js-beautify')

// table format object
var tableObj = {
    utils: {
        splitStringToTable(str) {
            return tableObj.utils.trim(String(str)).split('\n').map(function (row) {
                row = row.replace(/^[\|\s]+/, '');
                row = row.replace(/[\|\s]+$/, '');
                return row.split('|').map(tableObj.utils.trim);
            });
        }
        , getMaxLengthPerColumn(table) {
            return table[0].map(function (str, column_index) {
                return tableObj.utils.getMaxLength(tableObj.utils.getColumn(table, column_index));
            });
        }
        , getMaxLength(array) {
            // chinese character
            var reg = /[\u4e00-\u9fa5]/g;
            return array.reduce(function (max, item) {
                var _length = item.length
                // handler chinese
                if (!(item instanceof Array) && reg.test(item)) {
                    _length = _length - item.match(reg).length + Math.floor((item.match(reg).length) / 3 * 5)
                }
                return Math.max(max, _length);
            }, 0);
        }
        , padHeaderSeparatorString(str, len) {
            switch (tableObj.utils.getAlignment(str)) {
                case 'l': return tableObj.utils.repeatStr('-', Math.max(3, len));
                case 'c': return ':' + tableObj.utils.repeatStr('-', Math.max(3, len - 2)) + ':';
                case 'r': return tableObj.utils.repeatStr('-', Math.max(3, len - 1)) + ':';
            }
        }
        , getAlignment(str) {
            if (str[str.length - 1] === ':') {
                return str[0] === ':' ? 'c' : 'r';
            }
            return 'l';
        }
        , fillInMissingColumns(table) {
            var max = tableObj.utils.getMaxLength(table);
            table.forEach(function (row, i) {
                while (row.length < max) {
                    row.push(i === 1 ? '---' : '');
                }
            });
        }
        , getColumn(table, column_index) {
            return table.map(function (row) {
                return row[column_index];
            });
        }
        , trim(str) {
            return str.trim();
        }
        , padStringWithAlignment(str, len, alignment) {
            switch (alignment) {
                case 'l': return tableObj.utils.padRight(str, len);
                case 'c': return tableObj.utils.padLeftAndRight(str, len);
                case 'r': return tableObj.utils.padLeft(str, len);
            }
        }
        , padLeft(str, len) {
            var reg = /[\u4e00-\u9fa5]/g;
            var _length = str.length
            if (reg.test(str)) {
                _length = _length - str.match(reg).length + Math.ceil((str.match(reg).length) / 3 * 5)
            }
            return tableObj.utils.getPadding(len - _length) + str;
        }
        , padRight(str, len) {
            var reg = /[\u4e00-\u9fa5]/g;
            var _length = str.length
            if (reg.test(str)) {
                _length = _length - str.match(reg).length + Math.ceil((str.match(reg).length) / 3 * 5)
            }
            return str + tableObj.utils.getPadding(len - _length);
        }
        , padLeftAndRight(str, len) {
            var reg = /[\u4e00-\u9fa5]/g;
            var _length = str.length
            if (reg.test(str)) {
                _length = _length - str.match(reg).length + Math.ceil((str.match(reg).length) / 3 * 5)
            }
            var l = (len - _length) / 2;
            return tableObj.utils.getPadding(Math.ceil(l)) + str + tableObj.utils.getPadding(Math.floor(l));
        }
        , getPadding(len) {
            return tableObj.utils.repeatStr(' ', len);
        }
        , repeatStr(str, count) {
            return count > 0 ? Array(count + 1).join(str) : '';
        }
    },
    reformat: function (str) {
        var table = tableObj.utils.splitStringToTable(str),
            alignments,
            max_length_per_column;

        table[1] = table[1].map(function (cell) {
            return tableObj.utils.padHeaderSeparatorString(cell, 0);
        });

        tableObj.utils.fillInMissingColumns(table);

        alignments = table[1].map(tableObj.utils.getAlignment);
        max_length_per_column = tableObj.utils.getMaxLengthPerColumn(table);

        return table.map(function (row, row_index) {
            return '|' + row.map(function (cell, column_index) {
                var column_length = max_length_per_column[column_index];
                if (row_index === 1) {
                    return tableObj.utils.padHeaderSeparatorString(cell, column_length + 2);
                }
                return ' ' + tableObj.utils.padStringWithAlignment(cell, column_length, alignments[column_index]) + ' ';
            }).join('|') + '|';
        }).join('\n') + '\n';
    }
}


function removeReplace(text: string, reg: RegExp, func: Function): string {
    const _tempRegArr = text.match(reg)
    if (_tempRegArr && _tempRegArr.length > 0) {
        const _tempArr = [];
        _tempRegArr.forEach((e, i) => {
            const _reg = new RegExp(escapeStringRegexp(e), 'g');
            _tempArr.push(e);
            text = text.replace(_reg, `$mdFormatter$${i}$mdFormatter$`);
        })
        text = func(text);
        const _mdformatterArr = text.match(/\$mdFormatter\$\d+\$mdFormatter\$/g)
        _mdformatterArr.forEach((e, i) => {
            const _reg = new RegExp(escapeStringRegexp(e), 'g');
            text = text.replace(_reg, _tempArr[i]);
        })
        return text
    }
}

let config = workspace.getConfiguration('markdownFormatter');
let commaEN: string = config.get<string>('commaEN', '');
let enable: boolean = config.get<boolean>('enable', true);
let formatOpt: any = config.get<any>('formatOpt', {});
let codeAreaFormat: boolean = config.get<boolean>('codeAreaFormat', true);

workspace.onDidChangeConfiguration(e => {
    config = workspace.getConfiguration('markdownFormatter');
    enable = config.get<boolean>('enable', true);
    codeAreaFormat = config.get<boolean>('codeAreaFormat', true);
    commaEN = config.get<string>('commaEN', '');
    formatOpt = config.get<any>('formatOpt', {});
});

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {


    // repalce symbol
    const CHINESE_SYMBOL = `，：；！“”‘’（）？。`;
    const ENGLISH_SYMBOL = `,:;!""''()?.`;

    // punctuation which need a space after it
    const PUNCTUATION_EXP = /([，,。;；！、？：:.])\ */g;
    // h1 symbol
    const H1_EXP = /^(# [^\n]+)\n*/g;
    // h2,h3,h4... symbol
    const H_EXP = /\n*(##+ [^\n]+)\n*/g;
    // table
    const TABLE_EXP = /((?:(?:[^\n]*?\|[^\n]*)\ *)?(?:\r?\n|^))(?:[^|]+)((?:\|\ *(?::?-+:?|::)\ *|\|?(?:\ *(?::?-+:?|::)\ *\|)+)(?:\ *(?::?-+:?|::)\ *)?\ *\r?\n)((?:(?:[^\n]*?\|[^\n]*)\ *(?:\r?\n|$))+)/g;
    //back quote
    const BACK_QUOTE_EXP = /\ *`([^`\n]+)`\ */g;
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
    const ISCODE_EXP = /\n*```(?: *)(\w*)\n([\s\S]+?)```\n*/g

    // line-break
    const LINE_BREAK_EXP = /\r\n/g;
    const LIST_EXP = /(((?:\n)+(?: {4}|\t)*(?:\d+\.|\-|\*|\+) [^\n]+)+)/g;

    function extractTables(text: string): string[] {
        return text.match(TABLE_EXP);
    }
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('markdown', {
        provideDocumentFormattingEdits(document, options, token) {
            if (!enable) { return }

            let beautifyOpt = {}
            if (formatOpt) {
                beautifyOpt = Object.assign(beautify, formatOpt)
            }
            const result: vscode.TextEdit[] = [];

            const start = new vscode.Position(0, 0);
            const end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
            const range = new vscode.Range(start, end);
            let text = document.getText(range)
            
            // format \r\n to \n,fix
            text = text.replace(LINE_BREAK_EXP, '\n');

            // format PUNCTUATION_EXP
            text = removeReplace(text, BACK_QUOTE_EXP, text => { 
                text = text.replace(PUNCTUATION_EXP, '$1 ') 
                // handle fullwidth character
                if (commaEN) {
                    const fullwidthArr = CHINESE_SYMBOL.split('')
                    const halfwidthArr = ENGLISH_SYMBOL.split('')
                    const commaArr = commaEN.split('')
                    commaArr.forEach(e => {
                        const _i = fullwidthArr.indexOf(e)
                        if (_i > -1) {
                            const _reg = new RegExp('\\' + e, 'g')
                            text = text.replace(_reg, halfwidthArr[_i])
                        }
                    })
                }
                return text
            })

            // handler table
            const _tableArr = extractTables(text)
            if (_tableArr && _tableArr.length > 0) {
                _tableArr.forEach((table) => {
                    var re = new RegExp(escapeStringRegexp(String(table)), 'g')
                    text = text.replace(re, (substring: string) => tableObj.reformat(table))
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
                    })
                }
                const temp_text = text.replace(ISCODE_EXP, '\n')
                const _jsArr = temp_text.match(CODE_AREA_EXP)
                if (codeAreaFormat && _jsArr && _jsArr.length > 0) {
                    _jsArr.forEach(e => {
                        const re = new RegExp(escapeStringRegexp(e), 'g')
                        text = text.replace(re, '\n\n' + beautify(e.replace(CODE_AREA_EXP, '$1'), beautifyOpt) + '\n\n')
                    })
                }

                // commaEN = CHINESE_SYMBOL
                text = text.replace(LIST_EXP, '\n' + '$1' + '\n');
                text = text.replace(BACK_QUOTE_EXP, ' `$1` ')
                text = text.replace(H_EXP, '\n\n' + '$1' + '\n\n')
                text = text.replace(H1_EXP, '$1' + '\n\n')
                text = text.replace(CODE_EXP, '\n\n```' + '$1' + '```\n\n')
                text = text.replace(LINK_EXP, '\n\n' + '$1' + '\n\n')
                text = text.replace(LINK_SPACE_EXP, '\n' + '$1 $2')
                text = text.replace(EXTRALINE_EXP, '\n\n')
            }

            result.push(new vscode.TextEdit(range, text));
            vscode.window.showInformationMessage('format .md successfully!');
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