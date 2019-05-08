'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var vscode_1 = require('vscode');
// import * as escapeStringRegexp from 'escape-string-regexp'
var escapeStringRegexp = require('escape-string-regexp');
// import beautify from 'js-beautify'
var beautify = require('js-beautify');
// table format object
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
            // chinese character
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
function removeReplace(text, reg, func) {
    var _tempRegArr = text.match(reg);
    if (_tempRegArr && _tempRegArr.length > 0) {
        var _tempArr_1 = [];
        _tempRegArr.forEach(function (e, i) {
            var _reg = new RegExp(escapeStringRegexp(e), 'g');
            _tempArr_1.push(e);
            text = text.replace(_reg, "$mdFormatter$" + i + "$mdFormatter$");
        });
        text = func(text);
        var _mdformatterArr = text.match(/\$mdFormatter\$\d+\$mdFormatter\$/g);
        _mdformatterArr.forEach(function (e, i) {
            var _reg = new RegExp(escapeStringRegexp(e), 'g');
            text = text.replace(_reg, _tempArr_1[i]);
        });
    }
    else {
        text = func(text);
    }
    return text;
}
var config = vscode_1.workspace.getConfiguration('markdownFormatter');
var charactersTurnHalf = config.get('charactersTurnHalf', false);
var enable = config.get('enable', true);
var formatOpt = config.get('formatOpt', {});
var codeAreaFormat = config.get('codeAreaFormat', true);
vscode_1.workspace.onDidChangeConfiguration(function (e) {
    config = vscode_1.workspace.getConfiguration('markdownFormatter');
    enable = config.get('enable', true);
    codeAreaFormat = config.get('codeAreaFormat', true);
    charactersTurnHalf = config.get('charactersTurnHalf', false);
    formatOpt = config.get('formatOpt', {});
});
var textLast = '';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // repalce symbol
    var CHINESE_SYMBOL = "\uFF0C\uFF1A\uFF1B\uFF01\u201C\u201D\u2018\u2019\uFF08\uFF09\uFF1F\u3002";
    var ENGLISH_SYMBOL = ",:;!\"\"''()?.";
    // chinese symbol
    var CHINESE_CHARCTER_SYMBOL = "([\\u4e00-\\u9fa5])";
    var ENGLISH_CHARCTER_SYMBOL = "([A-Za-z])";
    // punctuation which need a space after it
    var PUNCTUATION_EXP = /([，,。；;！、？：])\ */g;
    // period which need a space after it
    var PERIOD_EXP = /([\.\!\?])([A-Z\u4e00-\u9fa5])/g;
    // h1 symbol
    var H1_EXP = /^(# [^\n]+)\n*/g;
    // h2,h3,h4... symbol
    var H_EXP = /\n*(##+ [^\n]+)\n*/g;
    // table
    var TABLE_EXP = /((?:(?:[^\n]*?\|[^\n]*)\ *)?(?:\r?\n|^))(?:[^|]+)((?:\|\ *(?::?-+:?|::)\ *|\|?(?:\ *(?::?-+:?|::)\ *\|)+)(?:\ *(?::?-+:?|::)\ *)?\ *\r?\n)((?:(?:[^\n]*?\|[^\n]*)\ *(?:\r?\n|$))+)/g;
    //back quote
    var BACK_QUOTE_EXP = /\ *`([^`\n]+)`\ */g;
    // const NO_PERIOD_BACK_QUOTE_EXP = /\ *`([^.`\n]+)`\ */g;
    // const NO_PERIOD_BACK_QUOTE_EXP1 = /\ *`([^`\n]*\.[^`\n]*)`\ */g;
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
            if (text === textLast) {
                vscode.window.showInformationMessage('No text to format.');
                return void 0;
            }
            textLast = text;
            // format \r\n to \n,fix
            text = text.replace(LINE_BREAK_EXP, '\n');
            // format PUNCTUATION_EXP
            text = removeReplace(text, BACK_QUOTE_EXP, function (text) {
                text = text.replace(PUNCTUATION_EXP, '$1 ');
                text = text.replace(PERIOD_EXP, '$1 $2');
                // handle fullwidth character
                var fullwidthArr = CHINESE_SYMBOL.split('');
                var halfwidthArr = ENGLISH_SYMBOL.split('');
                if (charactersTurnHalf) {
                    var _commaArr = charactersTurnHalf.split('');
                    if (_commaArr && _commaArr.length > 0) {
                        _commaArr.forEach(function (e) {
                            var _i = fullwidthArr.indexOf(e);
                            if (_i > -1) {
                                var _reg = new RegExp('\\' + e, 'g');
                                text = text.replace(_reg, halfwidthArr[_i]);
                            }
                        });
                    }
                }
                else {
                    var _replacewithCharcter = function (target, judge, pad) {
                        target.forEach(function (e, i) {
                            var _reg = new RegExp(judge + "\\" + e, 'g');
                            text = text.replace(_reg, "$1" + pad[i]);
                        });
                    };
                    _replacewithCharcter(fullwidthArr, ENGLISH_CHARCTER_SYMBOL, halfwidthArr);
                    _replacewithCharcter(halfwidthArr, CHINESE_CHARCTER_SYMBOL, fullwidthArr);
                }
                return text;
            });
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
                        text = text.replace(re, '\n\n' + beautify(e.replace(CODE_AREA_EXP, '$1'), beautifyOpt) + '\n\n');
                    });
                }
                // charactersTurnHalf = CHINESE_SYMBOL
                text = text.replace(LIST_EXP, '\n' + '$1' + '\n');
                text = text.replace(BACK_QUOTE_EXP, ' `$1` ');
                text = text.replace(H_EXP, '\n\n' + '$1' + '\n\n');
                text = text.replace(H1_EXP, '$1' + '\n\n');
                text = text.replace(CODE_EXP, '\n\n```' + '$1' + '```\n\n');
                text = text.replace(LINK_EXP, '\n\n' + '$1' + '\n\n');
                text = text.replace(LINK_SPACE_EXP, '\n' + '$1 $2');
                text = text.replace(EXTRALINE_EXP, '\n\n');
            }
            result.push(new vscode.TextEdit(range, text));
            vscode.window.showInformationMessage('Formatted text succeeded!');
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