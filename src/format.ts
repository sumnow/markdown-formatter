import { FormatList } from './components/FormatList';
import { FormatTable } from './components/FormatTable';
import { FormatPunctuation } from './components/FormatPunctuation';
import { FormatCode } from './components/FormatCode';
import { FormatLink } from './components/FormatLink';
// import { FormatHTML } from './components/FormatHTML';
import { handlerTime } from './utils/handlerTime';

type VscodeObjType = {
    fullWidthTurnHalfWidth: string
    codeAreaToBlock: string
    displayTime: boolean
    enable: boolean
    formatCodes: boolean
    formatTable: boolean
    formatOpt: any
    formatULSymbol: boolean
    spaceAfterFullWidthOrHalfWidth: string
};

type OtherParamType = {
    date?: Date
};

// console.log(vscode.window.activeTextEditor.options.tabSize)
// replace symbol
const chineseSymbol = `，、：；！“”‘’（）？。`;
const englishSymbol = `,,:;!""''()?.`;

// chinese symbol
const chineseCharacterSymbol = `([\\u4e00-\\u9fa5])`;
const englishCharacterSymbol = `([A-Za-z])`;

const expEllipsis = /(\.\.\.)+/g;

// const SPACE_EXP = /\n+\ +\n+/g;

// breakline before the text 
const expBeginLine = /^\n+/g;
// punctuation which need a space after it
// const PUNCTUATION_EXP = /([，,。；;！、？：])\ */g;
// const PUNCTUATION_ALL_EXP = /([，,。；;！、？：])\ */g;
const expPunctuationChinese = /([，。；！、？：])\ */g;
const expPunctuationEnglish = /([,;])\ */g;
// period which need a space after it
const expPunctuationSpacialEnglish = /([\.\!\?\:])([A-Z\u4e00-\u9fa5])/g;
// h1 symbol
const expH1 = /\n+(# [^\n]+)\n*/g;
// h2,h3,h4... symbol
const expHeaders = /\n+(##+ [^\n]+)\n/g;
// table
const expTable = /((?:(?:[^\n]*?\|[^\n]*)\ *)?(?:\r?\n|^))(?:[^|]+)((?:\|\ *(?::?-+:?|::)\ *|\|?(?:\ *(?::?-+:?|::)\ *\|)+)(?:\ *(?::?-+:?|::)\ *)?\ *\r?\n)((?:(?:[^\n]*?\|[^\n]*)\ *(?:\r?\n|$))+)/g;
//back quote
const expBackQuote = /\ *`([^`\n]+)`\ */g;
const expQuoteAfterBreakLine = /\n\ `([^`\n]+)`\ /g;
// issue: https://github.com/sumnow/markdown-formatter/issues/48
const expBackQuoteWithSpace = /\ `([^`\n]+)`\ /g;
// image link
const expImage = /([^[])(\!\[[^\n]+\]\([^\n]+\))/g;


// split line 
const expSplitLine = /\- \- \-( \-)*/g;
// list 
// const expList = /(((?:\n)+(?: {4}|\t)*(?:\d+\.|\-|\*|\+) [^\n]+)+)/g;
const expList = /((\n(?: {2}|\t)*(?:\d+\.|\-|\*|\+) [^\n]+)+)/g;
// const LIST_OL_EXP = /((\n(?: {2}|\t)*(\d+)\. [^\n]+)+)/g
const expListOLLi = /(\n(?: {2}|\t)*)(\d+)(\. [^\n]+)/g;
// avoid - - - format to * - -
// const expUL1st = /\n(?:\-|\*|\+) ([^\n]+)/g;
const expUL1st = /\n(?:\-|\*|\+) ([^\n]+)/g;
const expUL2nd = /\n(?: {2}|\t)(?:\-|\*|\+) ([^\n]+)/g;
const expUL3th = /\n(?: {2}|\t){2}(?:\-|\*|\+) ([^\n]+)/g;

// const NO_PERIOD_expBackQuote = /\ *`([^.`\n]+)`\ */g;
// const NO_PERIOD_expBackQuote1 = /\ *`([^`\n]*\.[^`\n]*)`\ */g;
// link 
const expLinkSpace = /\n(>+) *([^\n]+)/g;
const expLink = /\n((>+[^\n]*\n)+)/g;

//href
const expHref = /(?:http|https|file|ftp):\/\/[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+/g;
// duplicated line
const expExtraLine = /\n\n+/g;

const expEndLine = /\n\n$/g;

// code block
// const expCodeArea = /\n+((?:(?: {4}|\t)+[^\n\-\+\*][^\n]+\n*)+)/g;
// const expCodeArea = /\n+((?:(?: {4}|\t)+(?!\d\.|\+|\-|\*)[^\n]+\n)+)/g;
// const expCodeArea = /\n+((?:(?: {4}|\t)+([^\+\d\.\-\*])[^\n]+\n)+)/g
const expCodeArea = /\n+((?:(?: {4}|\t)[^\n]*\n)+)/g;
// const CODE_AREAS_EXP = /(\n(?:(?: {4}|\t)[^\n]*\n))\n/g
// const expCodeArea = /(?:(?: {4}|\t)+[^\n]+\n*)+/g;
// const CODE_EXP = /\n*```([\s\S]+?)```\n*/g;

const expCodeBlock = /\n*```(?: *)(\w*)\n([\s\S]+?)(```)+\n+/g;

// line-break
const expBreakLine = /\r\n/g;

const expTime = /(<!--\nCreated: [^\n]+\nModified: )[^\n]+(\n-->)(\n+)/g;

// disable format for block or file
const expDisable = /<!-- \/\* md-file-format-disable \*\/ -->/g;
const expDisableBlock = /<!-- md-ignore-block-start --> [\S\s]+? <!-- md-ignore-block-end -->/g;

const expTagStart = /<(?:[^\/])(?:[^"'>]|"[^"]*"|'[^']*')*[^\/]>/g;
const expTagSingle = /<(?:[^\/])(?:[^"'>]|"[^"]*"|'[^']*')*\/>/g;
const expTagEnd = /<\/(?:[^"'>]|"[^"]*"|'[^']*')*>/g;

const expItalic = /\*\ (`[^`]+`)\ \*/g;
const expBold = /\*\*\ (`[^`]+`)\ \*\*/g;
const expItalicBold = /\*\*\*\ (`[^`]+`)\ \*\*\*/g;
const expLineDeprecated = /\~\~\ (`[^`]+`)\ \~\~/g;

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
export default function formatted({ textP, vsParam, throwError, otherParam }: { textP: string, vsParam: VscodeObjType, throwError: (p: string) => void, otherParam: OtherParamType }): string {
    const { fullWidthTurnHalfWidth,
        codeAreaToBlock,
        displayTime,
        enable,
        formatCodes,
        formatTable,
        formatOpt,
        formatULSymbol,
        spaceAfterFullWidthOrHalfWidth } = vsParam;
    const { date } = otherParam;
    if (!enable) { return textP; }
    // let text = document.getText(range) + '\n\n'

    if (textP.match(expDisable)) {
        console.log('format current file disabled');
        return textP;
    }

    
        
    let text = '\n' + textP + '\n\n';

    const textLast = text;


    // format \r\n to \n,fix
    text = text.replace(expBreakLine, '\n');

    // handler time
    if (displayTime) {
        text = text.match(expTime) ? text.replace(expTime, `$1${handlerTime(date)}$2\n`) : `<!--\nCreated: ${handlerTime(date)}\nModified: ${handlerTime(date)}\n-->\n\n` + text;
    }
    try {
        // format PUNCTUATION_EXP
        text = new FormatPunctuation(text).formatted({ fullWidthTurnHalfWidth, spaceAfterFullWidthOrHalfWidth, expBackQuoteWithSpace, expCodeBlock, expCodeArea, expHref, expListOLLi, expBackQuote, expPunctuationChinese, expPunctuationEnglish, expPunctuationSpacialEnglish, chineseSymbol, englishSymbol, englishCharacterSymbol, chineseCharacterSymbol });

        text = new FormatLink(text).formatted({ expLinkSpace, expLink, expCodeBlock, expTable });

        if (formatTable) {
            // handler table
            text = new FormatTable(text).formatted({ expTable, expLink, expCodeBlock, expCodeArea });
        }

        // handler js
        text = new FormatCode(text).formatted({ formatCodes, formatOpt, codeAreaToBlock, expCodeBlock, expList, expCodeArea, expH1, expBackQuote });

        // handler list
        text = new FormatList(text).formatted({ formatULSymbol, expList, expUL1st, expUL2nd, expUL3th, expListOLLi, expSplitLine, expCodeBlock, expCodeArea });

        // text = new FormatHTML(text).formatted({expTagStart,expTagSingle,expTagEnd})
        // text = text.replace(expBackQuote, ' `$1` ')

        // remove space in `something`+space+breakline
        // https://github.com/sumnow/markdown-formatter/issues/36
        text = text.replace(/` \n+/g, '`\n\n');

        text = text.replace(expExtraLine, '\n\n');

        text = text.replace(expQuoteAfterBreakLine, '\n`$1` ');
        text = text.replace(expHeaders, '\n\n' + '$1' + '\n\n');
        // text = text.replace(expH1, '$1' + '\n\n')
        text = text.replace(expImage, '$1\n\n' + '$2' + '\n\n');
        text = text.replace(expCodeBlock, '\n\n```' + '$1\n$2' + '```\n\n');
        // text = text.replace(expLink, '\n\n' + '$1' + '\n\n')
        // text = text.replace(expLinkSpace, '\n' + '$1 $2')

        text = text.replace(expItalicBold, ` ***$1*** `);
        text = text.replace(expBold, ' **$1** ');
        text = text.replace(expItalic, ' *$1* ');
        text = text.replace(expLineDeprecated, ' ~~$1~~ ');
        // clear begin-line
        text = text.replace(expBeginLine, '');


        // decrease end line
        // https://github.com/sumnow/markdown-formatter/issues/24
        text = text.replace(expEndLine, '\n');
    } catch (e) {
        text = textLast;
        throwError(`[Error Format]:${e} \n you can ask for help by https://github.com/sumnow/markdown-formatter/issues`);
    }
    return text;
}