'use strict';
var vscode = require('vscode');
var FormatList_1 = require('./components/FormatList');
var FormatTable_1 = require('./components/FormatTable');
var FormatPunctuation_1 = require('./components/FormatPunctuation');
var FormatCode_1 = require('./components/FormatCode');
var FormatLink_1 = require('./components/FormatLink');
// import { FormatHTML } from './components/FormatHTML';
var handlerTime_1 = require('./components/handlerTime');
var escapeStringRegexp = require('escape-string-regexp');
var config = vscode.workspace.getConfiguration('markdownFormatter');
var fullWidthTurnHalfWidth = config.get('fullWidthTurnHalfWidth', 'auto');
var codeAreaToBlock = config.get('codeAreaToBlock', '');
var displayTime = config.get('displayTime', false);
var enable = config.get('enable', true);
var formatCodes = config.get('formatCodes', true);
var formatOpt = config.get('formatOpt', {});
var formatULSymbol = config.get('formatULSymbol', true);
var spaceAfterFullWidth = config.get('spaceAfterFullWidth', false);
vscode.workspace.onDidChangeConfiguration(function (_) {
    config = vscode.workspace.getConfiguration('markdownFormatter');
    fullWidthTurnHalfWidth = config.get('fullWidthTurnHalfWidth', 'auto');
    codeAreaToBlock = config.get('codeAreaToBlock', '');
    displayTime = config.get('displayTime', false);
    enable = config.get('enable', true);
    formatCodes = config.get('formatCodes', true);
    formatOpt = config.get('formatOpt', {});
    formatULSymbol = config.get('formatULSymbol', true);
    spaceAfterFullWidth = config.get('spaceAfterFullWidth', false);
});
// console.log(vscode.window.activeTextEditor.options.tabSize)
// repalce symbol
var CHINESE_SYMBOL = "\uFF0C\u3001\uFF1A\uFF1B\uFF01\u201C\u201D\u2018\u2019\uFF08\uFF09\uFF1F\u3002";
var ENGLISH_SYMBOL = ",,:;!\"\"''()?.";
// chinese symbol
var CHINESE_CHARCTER_SYMBOL = "([\\u4e00-\\u9fa5])";
var ENGLISH_CHARCTER_SYMBOL = "([A-Za-z])";
var ELLIPSIS_EXP = /(\.\.\.)+/g;
// const SPACE_EXP = /\n+\ +\n+/g;
// breakline before the text 
var BEGIN_LINE_EXP = /^\n+/g;
// punctuation which need a space after it
// const PUNCTUATION_EXP = /([，,。；;！、？：])\ */g;
// const PUNCTUATION_ALL_EXP = /([，,。；;！、？：])\ */g;
var PUNCTUATION_CHINESE_EXP = /([，。；！、？：])\ */g;
var PUNCTUATION_ENGLISH_EXP = /([,;])\ */g;
// period which need a space after it
var PUNCTUATION_SPACIAL_ENGLISH_EXP = /([\.\!\?\:])([A-Z\u4e00-\u9fa5])/g;
// h1 symbol
var H1_EXP = /\n+(# [^\n]+)\n*/g;
// h2,h3,h4... symbol
var H_EXP = /\n+(##+ [^\n]+)\n*/g;
// table
var TABLE_EXP = /((?:(?:[^\n]*?\|[^\n]*)\ *)?(?:\r?\n|^))(?:[^|]+)((?:\|\ *(?::?-+:?|::)\ *|\|?(?:\ *(?::?-+:?|::)\ *\|)+)(?:\ *(?::?-+:?|::)\ *)?\ *\r?\n)((?:(?:[^\n]*?\|[^\n]*)\ *(?:\r?\n|$))+)/g;
//back quote
var BACK_QUOTE_EXP = /\ *`([^`\n]+)`\ */g;
var BACK_QUOTE_AFTER_BREAKLINE_EXP = /\n\ `([^`\n]+)`\ /g;
// image link
var IMG_EXP = /([^[])(\!\[[^\n]+\]\([^\n]+\))/g;
// split line 
var SPLIT_LINE_EXP = /\- \- \-( \-)*/g;
// list 
// const LIST_EXP = /(((?:\n)+(?: {4}|\t)*(?:\d+\.|\-|\*|\+) [^\n]+)+)/g;
var LIST_EXP = /((\n(?: {2}|\t)*(?:\d+\.|\-|\*|\+) [^\n]+)+)/g;
// const LIST_OL_EXP = /((\n(?: {2}|\t)*(\d+)\. [^\n]+)+)/g
var LIST_OL_LI_EXP = /(\n(?: {2}|\t)*)(\d+)(\. [^\n]+)/g;
// avoid - - - format to * - -
// const LIST_UL_ST_EXP = /\n(?:\-|\*|\+) ([^\n]+)/g;
var LIST_UL_ST_EXP = /\n(?:\-|\*|\+) ([^\n]+)/g;
var LIST_UL_ND_EXP = /\n(?: {2}|\t)(?:\-|\*|\+) ([^\n]+)/g;
var LIST_UL_TH_EXP = /\n(?: {2}|\t){2}(?:\-|\*|\+) ([^\n]+)/g;
// const NO_PERIOD_BACK_QUOTE_EXP = /\ *`([^.`\n]+)`\ */g;
// const NO_PERIOD_BACK_QUOTE_EXP1 = /\ *`([^`\n]*\.[^`\n]*)`\ */g;
// link 
var LINK_SPACE_EXP = /\n(>+) *([^\n]+)/g;
var LINK_EXP = /\n((>+[^\n]*\n)+)/g;
//href
var HREF_EXP = /(?:http|https|file|ftp):\/\/[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+/g;
// duplicated line
var EXTRALINE_EXP = /\n\n+/g;
var END_LINE_EXP = /\n\n$/g;
// code block
// const CODE_AREA_EXP = /\n+((?:(?: {4}|\t)+[^\n\-\+\*][^\n]+\n*)+)/g;
// const CODE_AREA_EXP = /\n+((?:(?: {4}|\t)+(?!\d\.|\+|\-|\*)[^\n]+\n)+)/g;
// const CODE_AREA_EXP = /\n+((?:(?: {4}|\t)+([^\+\d\.\-\*])[^\n]+\n)+)/g
var CODE_AREA_EXP = /\n+((?:(?: {4}|\t)[^\n]*\n)+)/g;
// const CODE_AREAS_EXP = /(\n(?:(?: {4}|\t)[^\n]*\n))\n/g
// const CODE_AREA_EXP = /(?:(?: {4}|\t)+[^\n]+\n*)+/g;
// const CODE_EXP = /\n*```([\s\S]+?)```\n*/g;
var CODE_BLOCK_EXP = /\n*```(?: *)(\w*)\n([\s\S]+?)(```)+\n+/g;
// line-break
var LINE_BREAK_EXP = /\r\n/g;
var TIME_EXP = /(<!--\nCreated: [^\n]+\nModified: )[^\n]+(\n-->)(\n+)/g;
var TAG_START_EXP = /<(?:[^\/])(?:[^"'>]|"[^"]*"|'[^']*')*[^\/]>/g;
var TAG_SINGLE_EXP = /<(?:[^\/])(?:[^"'>]|"[^"]*"|'[^']*')*\/>/g;
var TAG_END_EXP = /<\/(?:[^"'>]|"[^"]*"|'[^']*')*>/g;
var ITALIC_EXP = /\*\ (`[^`]+`)\ \*/g;
var BOLD_EXP = /\*\*\ (`[^`]+`)\ \*\*/g;
var ITALIC_BOLD_EXP = /\*\*\*\ (`[^`]+`)\ \*\*\*/g;
var LINE_THROUGH_EXP = /\~\~\ (`[^`]+`)\ \~\~/g;
function formatted(textP) {
    if (!enable) {
        return void 0;
    }
    // let text = document.getText(range) + '\n\n'
    var text = textP + '\n\n';
    var textLast = text;
    // format \r\n to \n,fix
    text = text.replace(LINE_BREAK_EXP, '\n');
    // handler time
    if (displayTime) {
        text = text.match(TIME_EXP) ? text.replace(TIME_EXP, "$1" + handlerTime_1.handlerTime(new Date()) + "$2\n") : ("<!--\nCreated: " + handlerTime_1.handlerTime(new Date()) + "\nModified: " + handlerTime_1.handlerTime(new Date()) + "\n-->\n\n") + text;
    }
    try {
        // format PUNCTUATION_EXP
        text = new FormatPunctuation_1.FormatPunctuation(text).formatted({ fullWidthTurnHalfWidth: fullWidthTurnHalfWidth, spaceAfterFullWidth: spaceAfterFullWidth, BACK_QUOTE_EXP: BACK_QUOTE_EXP, CODE_BLOCK_EXP: CODE_BLOCK_EXP, CODE_AREA_EXP: CODE_AREA_EXP, HREF_EXP: HREF_EXP, LIST_OL_LI_EXP: LIST_OL_LI_EXP, PUNCTUATION_CHINESE_EXP: PUNCTUATION_CHINESE_EXP, PUNCTUATION_ENGLISH_EXP: PUNCTUATION_ENGLISH_EXP, PUNCTUATION_SPACIAL_ENGLISH_EXP: PUNCTUATION_SPACIAL_ENGLISH_EXP, CHINESE_SYMBOL: CHINESE_SYMBOL, ENGLISH_SYMBOL: ENGLISH_SYMBOL, ENGLISH_CHARCTER_SYMBOL: ENGLISH_CHARCTER_SYMBOL, CHINESE_CHARCTER_SYMBOL: CHINESE_CHARCTER_SYMBOL });
        // handler table
        text = new FormatTable_1.FormatTable(text).formatted(TABLE_EXP);
        // handler js
        text = new FormatCode_1.FormatCode(text).formatted({ formatCodes: formatCodes, formatOpt: formatOpt, codeAreaToBlock: codeAreaToBlock, CODE_BLOCK_EXP: CODE_BLOCK_EXP, LIST_EXP: LIST_EXP, CODE_AREA_EXP: CODE_AREA_EXP, H1_EXP: H1_EXP });
        // handler list
        text = new FormatList_1.FormatList(text).formatted({ formatULSymbol: formatULSymbol, LIST_EXP: LIST_EXP, LIST_UL_ST_EXP: LIST_UL_ST_EXP, LIST_UL_ND_EXP: LIST_UL_ND_EXP, LIST_UL_TH_EXP: LIST_UL_TH_EXP, LIST_OL_LI_EXP: LIST_OL_LI_EXP, SPLIT_LINE_EXP: SPLIT_LINE_EXP });
        text = new FormatLink_1.FormatLink(text).formatted({ LINK_SPACE_EXP: LINK_SPACE_EXP, LINK_EXP: LINK_EXP, CODE_BLOCK_EXP: CODE_BLOCK_EXP });
        // text = new FormatHTML(text).formatted({TAG_START_EXP,TAG_SINGLE_EXP,TAG_END_EXP})
        text = text.replace(BACK_QUOTE_EXP, ' `$1` ');
        text = text.replace(BACK_QUOTE_AFTER_BREAKLINE_EXP, '\n`$1` ');
        text = text.replace(H_EXP, '\n\n' + '$1' + '\n\n');
        // text = text.replace(H1_EXP, '$1' + '\n\n')
        text = text.replace(IMG_EXP, '$1\n\n' + '$2' + '\n\n');
        text = text.replace(CODE_BLOCK_EXP, '\n\n``` ' + '$1\n$2' + '```\n\n');
        // text = text.replace(LINK_EXP, '\n\n' + '$1' + '\n\n')
        // text = text.replace(LINK_SPACE_EXP, '\n' + '$1 $2')
        text = text.replace(EXTRALINE_EXP, '\n\n');
        text = text.replace(ITALIC_BOLD_EXP, "***$1***");
        text = text.replace(BOLD_EXP, '**$1**');
        text = text.replace(ITALIC_EXP, '*$1*');
        text = text.replace(LINE_THROUGH_EXP, '~~$1~~');
        // clear breakline
        text = text.replace(BEGIN_LINE_EXP, '');
        // decrease end line
        // https://github.com/sumnow/markdown-formatter/issues/24
        text = text.replace(END_LINE_EXP, '\n');
    }
    catch (e) {
        text = textLast;
        vscode.window.showInformationMessage("[Error Format]:" + e + " \n you can ask for help by https://github.com/sumnow/markdown-formatter/issues");
    }
    return text;
}
exports.formatted = formatted;
// let textLast = ''
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('markdown', {
        provideDocumentFormattingEdits: function (document, options, token) {
            if (!enable) {
                return void 0;
            }
            var result = [];
            var start = new vscode.Position(0, 0);
            var end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
            var range = new vscode.Range(start, end);
            var text = formatted(document.getText(range));
            result.push(new vscode.TextEdit(range, text));
            vscode.window.showInformationMessage('Formatted text succeeded!');
            return result;
        }
    }));
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
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map