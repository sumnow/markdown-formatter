'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var vscode_1 = require('vscode');
// import * as escapeStringRegexp from 'escape-string-regexp'
var escapeStringRegexp = require('escape-string-regexp');
// import beautify from 'js-beautify'
var beautify = require('js-beautify');
var tableObj = {
    utils: {
        splitStringToTable: function (str) {
            return tableObj.utils.trim(String(str)).split('\n').map(function (row) {
                row = row.replace(/^[\|\s]+/, '');
                row = row.replace(/[\|\s]+$/, '');
                return row.split('|').map(tableObj.utils.trim);
            });
        },
        getMaxLengthPerColumn: function (table) {
            return table[0].map(function (str, column_index) {
                return tableObj.utils.getMaxLength(tableObj.utils.getColumn(table, column_index));
            });
        },
        getMaxLength: function (array) {
            var reg = /[\u4e00-\u9fa5]/g;
            return array.reduce(function (max, item) {
                var _length = item.length;
                // handler chinese
                if (!(item instanceof Array) && reg.test(item)) {
                    _length = _length - item.match(reg).length + Math.floor((item.match(reg).length) / 3 * 5);
                }
                return Math.max(max, _length);
            }, 0);
        },
        padHeaderSeparatorString: function (str, len) {
            switch (tableObj.utils.getAlignment(str)) {
                case 'l': return tableObj.utils.repeatStr('-', Math.max(3, len));
                case 'c': return ':' + tableObj.utils.repeatStr('-', Math.max(3, len - 2)) + ':';
                case 'r': return tableObj.utils.repeatStr('-', Math.max(3, len - 1)) + ':';
            }
        },
        getAlignment: function (str) {
            if (str[str.length - 1] === ':') {
                return str[0] === ':' ? 'c' : 'r';
            }
            return 'l';
        },
        fillInMissingColumns: function (table) {
            var max = tableObj.utils.getMaxLength(table);
            table.forEach(function (row, i) {
                while (row.length < max) {
                    row.push(i === 1 ? '---' : '');
                }
            });
        },
        getColumn: function (table, column_index) {
            return table.map(function (row) {
                return row[column_index];
            });
        },
        trim: function (str) {
            return str.trim();
        },
        padStringWithAlignment: function (str, len, alignment) {
            switch (alignment) {
                case 'l': return tableObj.utils.padRight(str, len);
                case 'c': return tableObj.utils.padLeftAndRight(str, len);
                case 'r': return tableObj.utils.padLeft(str, len);
            }
        },
        padLeft: function (str, len) {
            var reg = /[\u4e00-\u9fa5]/g;
            var _length = str.length;
            if (reg.test(str)) {
                _length = _length - str.match(reg).length + Math.ceil((str.match(reg).length) / 3 * 5);
            }
            return tableObj.utils.getPadding(len - _length) + str;
        },
        padRight: function (str, len) {
            var reg = /[\u4e00-\u9fa5]/g;
            var _length = str.length;
            if (reg.test(str)) {
                _length = _length - str.match(reg).length + Math.ceil((str.match(reg).length) / 3 * 5);
            }
            return str + tableObj.utils.getPadding(len - _length);
        },
        padLeftAndRight: function (str, len) {
            var reg = /[\u4e00-\u9fa5]/g;
            var _length = str.length;
            if (reg.test(str)) {
                _length = _length - str.match(reg).length + Math.ceil((str.match(reg).length) / 3 * 5);
            }
            var l = (len - _length) / 2;
            return tableObj.utils.getPadding(Math.ceil(l)) + str + tableObj.utils.getPadding(Math.floor(l));
        },
        getPadding: function (len) {
            return tableObj.utils.repeatStr(' ', len);
        },
        repeatStr: function (str, count) {
            return count > 0 ? Array(count + 1).join(str) : '';
        }
    },
    reformat: function (str) {
        var table = tableObj.utils.splitStringToTable(str), alignments, max_length_per_column;
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
};
var config = vscode_1.workspace.getConfiguration('markdownFormatter');
var commaEN = config.get('commaEN', '');
var enable = config.get('enable', true);
var formatOpt = config.get('formatOpt', {});
var codeAreaFormat = config.get('codeAreaFormat', true);
vscode_1.workspace.onDidChangeConfiguration(function (e) {
    config = vscode_1.workspace.getConfiguration('markdownFormatter');
    enable = config.get('enable', true);
    codeAreaFormat = config.get('codeAreaFormat', true);
    commaEN = config.get('commaEN', '');
    formatOpt = config.get('formatOpt', {});
});
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // comma symbol
    var COMMA_EXP = /[,，]\ */g;
    // period symbol
    var PERIOD_EXP = /([，,。;；！、？：])\ */g;
    // h1 symbol
    var H1_EXP = /^(# [^\n]+)\n*/g;
    // h2,h3,h4... symbol
    var H_EXP = /\n*(##+ [^\n]+)\n*/g;
    // table
    var TABLE_EXP = /((?:(?:[^\n]*?\|[^\n]*)\ *)?(?:\r?\n|^))(?:[^|]+)((?:\|\ *(?::?-+:?|::)\ *|\|?(?:\ *(?::?-+:?|::)\ *\|)+)(?:\ *(?::?-+:?|::)\ *)?\ *\r?\n)((?:(?:[^\n]*?\|[^\n]*)\ *(?:\r?\n|$))+)/g;
    //back quote
    var BACK_QUOTE_EXP = /\ *`([^`\n]+)`\ */g;
    // link 
    var LINK_SPACE_EXP = /\n(>+) *([^\n]+)/g;
    var LINK_EXP = /\n((>+[^\n]+\n)+)/g;
    // duplicated line
    var EXTRALINE_EXP = /\n\n+/g;
    // code block
    // const CODE_AREA_EXP = /\n+((?:(?: {4}|\t)+[^\n\-\+\*][^\n]+\n*)+)/g;
    var CODE_AREA_EXP = /\n+((?:(?: {4}|\t)+(?!\d\.|\+|\-|\*)[^\n]+\n*)+)/g;
    // const CODE_AREA_EXP = /(?:(?: {4}|\t)+[^\n]+\n*)+/g;
    var CODE_EXP = /\n*```([\s\S]+?)```\n*/g;
    var ISCODE_EXP = /\n*```(?: *)(\w*)\n([\s\S]+?)```\n*/g;
    // line-break
    var LINE_BREAK_EXP = /\r\n/g;
    // 
    // const line_EXP = /\n*```(\w*)\n([\s\S]+?)```\n*/g
    var LIST_EXP = /(((?:\n)+(?: {4}|\t)*(?:\d+\.|\-|\*|\+) [^\n]+)+)/g;
    function extractTables(text) {
        return text.match(TABLE_EXP);
    }
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('markdown', {
        provideDocumentFormattingEdits: function (document, options, token) {
            if (!enable) {
                return;
            }
            var beautifyOpt = {};
            if (formatOpt) {
                beautifyOpt = Object.assign(beautify, formatOpt);
            }
            var result = [];
            var start = new vscode.Position(0, 0);
            var end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
            var range = new vscode.Range(start, end);
            var text = document.getText(range);
            text = text.replace(LINE_BREAK_EXP, '\n');
            // handler table
            var _tableArr = extractTables(text);
            if (_tableArr && _tableArr.length > 0) {
                _tableArr.forEach(function (table) {
                    var re = new RegExp(escapeStringRegexp(String(table)), 'g');
                    text = text.replace(re, function (substring) { return tableObj.reformat(table); });
                });
            }
            // handler js
            if (formatOpt !== false) {
                var _codeArr = text.match(ISCODE_EXP);
                if (_codeArr && _codeArr.length > 0) {
                    _codeArr.forEach(function (e) {
                        var isJs = e.replace(ISCODE_EXP, '$1').toLocaleLowerCase();
                        if (isJs === 'js' || isJs === 'javascript' || isJs === '') {
                            var re = new RegExp(escapeStringRegexp(e.replace(ISCODE_EXP, '$2')), 'g');
                            text = text.replace(re, '' + beautify(e.replace(ISCODE_EXP, '$2'), beautifyOpt) + '\n');
                        }
                    });
                }
                var temp_text = text.replace(ISCODE_EXP, '\n');
                var _jsArr = temp_text.match(CODE_AREA_EXP);
                if (codeAreaFormat && _jsArr && _jsArr.length > 0) {
                    _jsArr.forEach(function (e) {
                        var re = new RegExp(escapeStringRegexp(e), 'g');
                        // console.log(e.replace(CODE_AREA_EXP, '$1'))
                        text = text.replace(re, '\n\n' + beautify(e.replace(CODE_AREA_EXP, '$1'), beautifyOpt) + '\n\n');
                        // console.log(text)
                    });
                }
                // handle fullwidth character
                if (commaEN) {
                    var fullwidthArr_1 = "\uFF0C\uFF1A\uFF1B\uFF01\u201C\u201D\u2018\u2019\uFF08\uFF09\uFF1F".split('');
                    var halfwidthArr_1 = ",:;!\"\"''()?".split('');
                    var commaArr = commaEN.split('');
                    commaArr.forEach(function (e) {
                        var _i = fullwidthArr_1.indexOf(e);
                        if (_i > -1) {
                            var _reg = new RegExp('\\' + e, 'g');
                            text = text.replace(_reg, halfwidthArr_1[_i]);
                        }
                    });
                }
                text = text.replace(LIST_EXP, '\n' + '$1' + '\n');
                text = text.replace(PERIOD_EXP, '$1 ');
                text = text.replace(BACK_QUOTE_EXP, ' `$1` ');
                text = text.replace(H_EXP, '\n\n' + '$1' + '\n\n');
                text = text.replace(H1_EXP, '$1' + '\n\n');
                text = text.replace(CODE_EXP, '\n\n```' + '$1' + '```\n\n');
                text = text.replace(LINK_EXP, '\n\n' + '$1' + '\n\n');
                text = text.replace(LINK_SPACE_EXP, '\n' + '$1 $2');
                text = text.replace(EXTRALINE_EXP, '\n\n');
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