import { FormatComponent } from './FormatComponent';
import { removeReplace } from "../utils/removeReplace";
import onReplace from '../utils/handlerReplace';
var escapeStringRegexp = require('escape-string-regexp');
var beautify = require('js-beautify');
var beautifyJs = require('js-beautify').js;
var beautifyCss = require('js-beautify').css;
var beautifyHtml = require('js-beautify').html;

export class FormatCode extends FormatComponent {
    name: string = 'code';
    text: string;
    super(text: string) {
        this.text = text;
    }
    formatted({ formatCodes, formatOpt, codeAreaToBlock, expCodeBlock, expList, expCodeArea, expH1, expBackQuote }: { formatCodes: boolean, formatOpt: any, codeAreaToBlock: string, expCodeBlock: RegExp, expList: RegExp, expCodeArea: RegExp, expH1: RegExp, expBackQuote: RegExp }): string {
        if (!formatCodes) {
            return this.text;
        }
        let beautifyOpt = {};
        if (formatOpt) {
            beautifyOpt = Object.assign(beautify, formatOpt);
        }

        // if two code areas linked by only a block line , these code areas is together
        // this.text = this.text.replace(CODE_AREAS_EXP, '$1    ' + '\n')
        if (formatOpt !== false) {
            this.text = removeReplace({
                text: this.text,
                reg: [expCodeBlock, expList],
                func: (text: string): string => {
                    const _jsArr = text.match(expCodeArea);
                    codeAreaToBlock = codeAreaToBlock.toLowerCase();
                    if (_jsArr && _jsArr.length > 0) {
                        if (codeAreaToBlock === '') {
                            _jsArr.forEach(e => {
                                // e = escapeStringRegexp(e)
                                const re = new RegExp(escapeStringRegexp(e), 'g');
                                // text = text.replace(re, '\n\n\n' + beautify(e.replace(expCodeArea, '$1'), beautifyOpt) + '\n\n\n');
                                // text = text.replace(re, '\n\n\n' + e.replace(expCodeArea, '$1') + '\n\n\n');
                                text = onReplace(text, re, '\n\n\n' + e.replace(expCodeArea, '$1') + '\n\n\n');
                            });
                        } else {
                            _jsArr.forEach(e => {
                                // e = escapeStringRegexp(e)
                                const re = new RegExp(escapeStringRegexp(e), 'g');
                                // text = text.replace(re, '\n\n\n``` ' + codeAreaToBlock + '\n' + e.replace(expCodeArea, '$1').replace(/(\ {4}|\t)/g, '') + '```\n\n\n');
                                text = onReplace(text, re, '\n\n\n``` ' + codeAreaToBlock + '\n' + e.replace(expCodeArea, '$1').replace(/(\ {4}|\t)/g, '') + '```\n\n\n');
                            });
                        }
                    }
                    // specail handler: format H1 and `` 
                    text = text.replace(expH1, '\n\n\n' + '$1' + '\n\n');
                    text = text.replace(expBackQuote, ' `$1` ');

                    return text;
                },
                // type: 'code'
            });
        }

        const _codeArr = this.text.match(expCodeBlock);
        if (_codeArr && _codeArr.length > 0) {
            _codeArr.forEach(e => {
                // e = escapeStringRegexp(e)
                const isJs = e.replace(expCodeBlock, '$1').toLocaleLowerCase();
                if (isJs === 'js' || isJs === 'javascript') {
                    const re = new RegExp(escapeStringRegexp(e.replace(expCodeBlock, '$2')), 'g');
                    this.text = onReplace(this.text, re, '' + beautifyJs(e.replace(expCodeBlock, '$2'), beautifyOpt) + '\n');
                }
                if (isJs === 'html') {
                    const re = new RegExp(escapeStringRegexp(e.replace(expCodeBlock, '$2')), 'g');
                    this.text = onReplace(this.text, re, '' + beautifyHtml(e.replace(expCodeBlock, '$2'), beautifyOpt) + '\n');
                }
                if (isJs === 'css') {
                    const re = new RegExp(escapeStringRegexp(e.replace(expCodeBlock, '$2')), 'g');
                    this.text = onReplace(this.text, re, '' + beautifyCss(e.replace(expCodeBlock, '$2'), beautifyOpt) + '\n');
                }
            });
        }

        return this.text;
    }
}