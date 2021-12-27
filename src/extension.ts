'use strict';

import * as vscode from 'vscode';
import { FormatList } from './components/FormatList'
import { FormatTable } from './components/FormatTable';
import { FormatPunctuation } from './components/FormatPunctuation';
import { FormatCode } from './components/FormatCode';
import { FormatLink } from './components/FormatLink'
// import { FormatHTML } from './components/FormatHTML';
import { handlerTime } from './components/handlerTime';

let config = vscode.workspace.getConfiguration('markdownFormatter');
let fullWidthTurnHalfWidth: string = config.get<string>('fullWidthTurnHalfWidth', 'auto');
let codeAreaToBlock: string = config.get<string>('codeAreaToBlock', '');
let displayTime: boolean = config.get<boolean>('displayTime', false);
let enable: boolean = config.get<boolean>('enable', true);
var formatCodes: boolean = config.get<boolean>('formatCodes', true)
let formatTable: boolean = config.get<boolean>('formatTable', false);
let formatOpt: any = config.get<any>('formatOpt', {});
let formatULSymbol: boolean = config.get<boolean>('formatULSymbol', true);
let spaceAfterFullWidthOrHalfWidth: string = config.get<string>
    ('spaceAfterFullWidthOrHalfWidth', 'half');


vscode.workspace.onDidChangeConfiguration(_ => {
    config = vscode.workspace.getConfiguration('markdownFormatter');
    fullWidthTurnHalfWidth = config.get<string>('fullWidthTurnHalfWidth', 'auto');
    codeAreaToBlock = config.get<string>('codeAreaToBlock', '');
    displayTime = config.get<boolean>('displayTime', false);
    enable = config.get<boolean>('enable', true);
    formatTable = config.get<boolean>('formatTable', false);
    formatCodes = config.get<boolean>('formatCodes', true);
    formatOpt = config.get<any>('formatOpt', {});
    formatULSymbol = config.get<boolean>('formatULSymbol', true);
    spaceAfterFullWidthOrHalfWidth = config.get<string>('spaceAfterFullWidthOrHalfWidth', 'half');
});

// console.log(vscode.window.activeTextEditor.options.tabSize)
// replace symbol
const CHINESE_SYMBOL = `，、：；！“”‘’（）？。`;
const ENGLISH_SYMBOL = `,,:;!""''()?.`;

// chinese symbol
const CHINESE_CHARACTER_SYMBOL = `([\\u4e00-\\u9fa5])`;
const ENGLISH_CHARACTER_SYMBOL = `([A-Za-z])`;

const ELLIPSIS_EXP = /(\.\.\.)+/g;

// const SPACE_EXP = /\n+\ +\n+/g;

// breakline before the text 
const BEGIN_LINE_EXP = /^\n+/g
// punctuation which need a space after it
// const PUNCTUATION_EXP = /([，,。；;！、？：])\ */g;
// const PUNCTUATION_ALL_EXP = /([，,。；;！、？：])\ */g;
const PUNCTUATION_CHINESE_EXP = /([，。；！、？：])\ */g;
const PUNCTUATION_ENGLISH_EXP = /([,;])\ */g;
// period which need a space after it
const PUNCTUATION_SPACIAL_ENGLISH_EXP = /([\.\!\?\:])([A-Z\u4e00-\u9fa5])/g;
// h1 symbol
const H1_EXP = /\n+(# [^\n]+)\n*/g;
// h2,h3,h4... symbol
const H_EXP = /\n+(##+ [^\n]+)\n/g;
// table
const TABLE_EXP = /((?:(?:[^\n]*?\|[^\n]*)\ *)?(?:\r?\n|^))(?:[^|]+)((?:\|\ *(?::?-+:?|::)\ *|\|?(?:\ *(?::?-+:?|::)\ *\|)+)(?:\ *(?::?-+:?|::)\ *)?\ *\r?\n)((?:(?:[^\n]*?\|[^\n]*)\ *(?:\r?\n|$))+)/g;
//back quote
const BACK_QUOTE_EXP = /\ *`([^`\n]+)`\ */g;
const BACK_QUOTE_AFTER_BREAKLINE_EXP = /\n\ `([^`\n]+)`\ /g;
// issue: https://github.com/sumnow/markdown-formatter/issues/48
const BACK_QUOTE_WITH_SPACE_EXP = /\ `([^`\n]+)`\ /g;
// image link
const IMG_EXP = /([^[])(\!\[[^\n]+\]\([^\n]+\))/g;


// split line 
const SPLIT_LINE_EXP = /\- \- \-( \-)*/g
// list 
// const LIST_EXP = /(((?:\n)+(?: {4}|\t)*(?:\d+\.|\-|\*|\+) [^\n]+)+)/g;
const LIST_EXP = /((\n(?: {2}|\t)*(?:\d+\.|\-|\*|\+) [^\n]+)+)/g
// const LIST_OL_EXP = /((\n(?: {2}|\t)*(\d+)\. [^\n]+)+)/g
const LIST_OL_LI_EXP = /(\n(?: {2}|\t)*)(\d+)(\. [^\n]+)/g
// avoid - - - format to * - -
// const LIST_UL_ST_EXP = /\n(?:\-|\*|\+) ([^\n]+)/g;
const LIST_UL_ST_EXP = /\n(?:\-|\*|\+) ([^\n]+)/g;
const LIST_UL_ND_EXP = /\n(?: {2}|\t)(?:\-|\*|\+) ([^\n]+)/g;
const LIST_UL_TH_EXP = /\n(?: {2}|\t){2}(?:\-|\*|\+) ([^\n]+)/g;

// const NO_PERIOD_BACK_QUOTE_EXP = /\ *`([^.`\n]+)`\ */g;
// const NO_PERIOD_BACK_QUOTE_EXP1 = /\ *`([^`\n]*\.[^`\n]*)`\ */g;
// link 
const LINK_SPACE_EXP = /\n(>+) *([^\n]+)/g
const LINK_EXP = /\n((>+[^\n]*\n)+)/g

//href
const HREF_EXP = /(?:http|https|file|ftp):\/\/[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+/g
// duplicated line
const EXTRALINE_EXP = /\n\n+/g;

const END_LINE_EXP = /\n\n$/g

// code block
// const CODE_AREA_EXP = /\n+((?:(?: {4}|\t)+[^\n\-\+\*][^\n]+\n*)+)/g;
// const CODE_AREA_EXP = /\n+((?:(?: {4}|\t)+(?!\d\.|\+|\-|\*)[^\n]+\n)+)/g;
// const CODE_AREA_EXP = /\n+((?:(?: {4}|\t)+([^\+\d\.\-\*])[^\n]+\n)+)/g
const CODE_AREA_EXP = /\n+((?:(?: {4}|\t)[^\n]*\n)+)/g;
// const CODE_AREAS_EXP = /(\n(?:(?: {4}|\t)[^\n]*\n))\n/g
// const CODE_AREA_EXP = /(?:(?: {4}|\t)+[^\n]+\n*)+/g;
// const CODE_EXP = /\n*```([\s\S]+?)```\n*/g;

const CODE_BLOCK_EXP = /\n*```(?: *)(\w*)\n([\s\S]+?)(```)+\n+/g

// line-break
const LINE_BREAK_EXP = /\r\n/g;

const TIME_EXP = /(<!--\nCreated: [^\n]+\nModified: )[^\n]+(\n-->)(\n+)/g

const DISABLE_EXP = /<!-- \/\* md-file-format-disable \*\/ -->/g


const TAG_START_EXP = /<(?:[^\/])(?:[^"'>]|"[^"]*"|'[^']*')*[^\/]>/g
const TAG_SINGLE_EXP = /<(?:[^\/])(?:[^"'>]|"[^"]*"|'[^']*')*\/>/g
const TAG_END_EXP = /<\/(?:[^"'>]|"[^"]*"|'[^']*')*>/g

const ITALIC_EXP = /\*\ (`[^`]+`)\ \*/g;
const BOLD_EXP = /\*\*\ (`[^`]+`)\ \*\*/g;
const ITALIC_BOLD_EXP = /\*\*\*\ (`[^`]+`)\ \*\*\*/g;
const LINE_THROUGH_EXP = /\~\~\ (`[^`]+`)\ \~\~/g;

/**
 * format sort:
 * 1. handler time
 * 2. punctuation
 * 3. link
 * 4. table
 * 5. code
 * 6. list
 * 7. enter '\n\n\n (more enter)'
 * 8. back_quote  '  ``  (more space)' 
 * 9. h
 * 10. img 
 * 11. code block ``` js\n ads\n ```
 * 12. italic or bold font
 * 13. clear break line and end line
 */
export function formatted(textP: string): string {
    if (!enable) { return textP }
    // let text = document.getText(range) + '\n\n'
    let text = '\n' + textP + '\n\n'

    const textLast = text

    if (text.match(DISABLE_EXP)) {
        console.log('format current file disabled')
        return textP
    }

    // format \r\n to \n,fix
    text = text.replace(LINE_BREAK_EXP, '\n');



    // handler time
    if (displayTime) {
        text = text.match(TIME_EXP) ? text.replace(TIME_EXP, `$1${handlerTime(new Date())}$2\n`) : `<!--\nCreated: ${handlerTime(new Date())}\nModified: ${handlerTime(new Date())}\n-->\n\n` + text
    }
    try {
        // format PUNCTUATION_EXP
        text = new FormatPunctuation(text).formatted({ fullWidthTurnHalfWidth, spaceAfterFullWidthOrHalfWidth, BACK_QUOTE_WITH_SPACE_EXP, CODE_BLOCK_EXP, CODE_AREA_EXP, HREF_EXP, LIST_OL_LI_EXP, BACK_QUOTE_EXP, PUNCTUATION_CHINESE_EXP, PUNCTUATION_ENGLISH_EXP, PUNCTUATION_SPACIAL_ENGLISH_EXP, CHINESE_SYMBOL, ENGLISH_SYMBOL, ENGLISH_CHARACTER_SYMBOL, CHINESE_CHARACTER_SYMBOL })

        text = new FormatLink(text).formatted({ LINK_SPACE_EXP, LINK_EXP, CODE_BLOCK_EXP, TABLE_EXP })

        if (formatTable) {
            // handler table
            text = new FormatTable(text).formatted({ TABLE_EXP, LINK_EXP, CODE_BLOCK_EXP, CODE_AREA_EXP })
        }

        // handler js
        text = new FormatCode(text).formatted({ formatCodes, formatOpt, codeAreaToBlock, CODE_BLOCK_EXP, LIST_EXP, CODE_AREA_EXP, H1_EXP, BACK_QUOTE_EXP })

        // handler list
        text = new FormatList(text).formatted({ formatULSymbol, LIST_EXP, LIST_UL_ST_EXP, LIST_UL_ND_EXP, LIST_UL_TH_EXP, LIST_OL_LI_EXP, SPLIT_LINE_EXP, CODE_BLOCK_EXP, CODE_AREA_EXP })

        // text = new FormatHTML(text).formatted({TAG_START_EXP,TAG_SINGLE_EXP,TAG_END_EXP})
        // text = text.replace(BACK_QUOTE_EXP, ' `$1` ')

        // remove space in `something`+space+breakline
        // https://github.com/sumnow/markdown-formatter/issues/36
        text = text.replace(/` \n+/g, '`\n\n')

        text = text.replace(EXTRALINE_EXP, '\n\n')

        text = text.replace(BACK_QUOTE_AFTER_BREAKLINE_EXP, '\n`$1` ')
        text = text.replace(H_EXP, '\n\n' + '$1' + '\n\n')
        // text = text.replace(H1_EXP, '$1' + '\n\n')
        text = text.replace(IMG_EXP, '$1\n\n' + '$2' + '\n\n')
        text = text.replace(CODE_BLOCK_EXP, '\n\n```' + '$1\n$2' + '```\n\n')
        // text = text.replace(LINK_EXP, '\n\n' + '$1' + '\n\n')
        // text = text.replace(LINK_SPACE_EXP, '\n' + '$1 $2')

        text = text.replace(ITALIC_BOLD_EXP, `***$1***`)
        text = text.replace(BOLD_EXP, '**$1**')
        text = text.replace(ITALIC_EXP, '*$1*')
        text = text.replace(LINE_THROUGH_EXP, '~~$1~~')
        // clear begin-line
        text = text.replace(BEGIN_LINE_EXP, '')


        // decrease end line
        // https://github.com/sumnow/markdown-formatter/issues/24
        text = text.replace(END_LINE_EXP, '\n')
    } catch (e) {
        text = textLast
        vscode.window.showInformationMessage(`[Error Format]:${e} \n you can ask for help by https://github.com/sumnow/markdown-formatter/issues`);
    }
    return text
}
// let textLast = ''
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('markdown', {
        provideDocumentFormattingEdits(document, options, token) {
            if (!enable) { return void 0 }

            const result: vscode.TextEdit[] = [];

            const start = new vscode.Position(0, 0);
            const end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
            const range = new vscode.Range(start, end);
            let text = formatted(document.getText(range))

            result.push(new vscode.TextEdit(range, text));
            // vscode.window.showInformationMessage('Formatted text succeeded!');
            return result;
        }
    }))


    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated

    console.log('Congratulation1s, your extension "markdown-formatter" is now active!');

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