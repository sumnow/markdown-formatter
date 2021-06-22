import { FormatComponent } from './FormatComponent'
import { removeReplace } from "./removeReplace";
import onReplace from './handlerReplace'
var escapeStringRegexp = require('escape-string-regexp');
var beautify = require('js-beautify')
var beautify_js = require('js-beautify').js;
var beautify_css = require('js-beautify').css;
var beautify_html = require('js-beautify').html;

export class FormatCode extends FormatComponent {
    name: string = 'code'
    text: string;
    super(text: string) {
        this.text = text
    }
    formatted({ formatCodes, formatOpt, codeAreaToBlock, CODE_BLOCK_EXP, LIST_EXP, CODE_AREA_EXP, H1_EXP, BACK_QUOTE_EXP }: { formatCodes: boolean, formatOpt: any, codeAreaToBlock: string, CODE_BLOCK_EXP: RegExp, LIST_EXP: RegExp, CODE_AREA_EXP: RegExp, H1_EXP: RegExp, BACK_QUOTE_EXP: RegExp }): string {
        if (!formatCodes) {
            return this.text
        }
        let beautifyOpt = {}
        if (formatOpt) {
            beautifyOpt = Object.assign(beautify, formatOpt)
        }

        // if two code areas linked by only a block line , these code areas is together
        // this.text = this.text.replace(CODE_AREAS_EXP, '$1    ' + '\n')
        if (formatOpt !== false) {
            this.text = removeReplace({
                text: this.text,
                reg: [CODE_BLOCK_EXP, LIST_EXP],
                func: (text: string): string => {
                    const _jsArr = text.match(CODE_AREA_EXP);
                    codeAreaToBlock = codeAreaToBlock.toLowerCase()
                    if (_jsArr && _jsArr.length > 0) {
                        if (codeAreaToBlock === '') {
                            _jsArr.forEach(e => {
                                // e = escapeStringRegexp(e)
                                const re = new RegExp(escapeStringRegexp(e), 'g');
                                // text = text.replace(re, '\n\n\n' + beautify(e.replace(CODE_AREA_EXP, '$1'), beautifyOpt) + '\n\n\n');
                                // text = text.replace(re, '\n\n\n' + e.replace(CODE_AREA_EXP, '$1') + '\n\n\n');
                                text = onReplace(text, re, '\n\n\n' + e.replace(CODE_AREA_EXP, '$1') + '\n\n\n');
                            });
                        } else {
                            _jsArr.forEach(e => {
                                // e = escapeStringRegexp(e)
                                const re = new RegExp(escapeStringRegexp(e), 'g');
                                // text = text.replace(re, '\n\n\n``` ' + codeAreaToBlock + '\n' + e.replace(CODE_AREA_EXP, '$1').replace(/(\ {4}|\t)/g, '') + '```\n\n\n');
                                text = onReplace(text, re, '\n\n\n``` ' + codeAreaToBlock + '\n' + e.replace(CODE_AREA_EXP, '$1').replace(/(\ {4}|\t)/g, '') + '```\n\n\n');
                            });
                        }
                    }
                    // specail handler: format H1 and `` 
                    text = text.replace(H1_EXP, '\n\n\n' + '$1' + '\n\n')
                    text = text.replace(BACK_QUOTE_EXP, ' `$1` ')

                    return text;
                },
                // type: 'code'
            })
        }

        const _codeArr = this.text.match(CODE_BLOCK_EXP)
        if (_codeArr && _codeArr.length > 0) {
            _codeArr.forEach(e => {
                // e = escapeStringRegexp(e)
                const isJs = e.replace(CODE_BLOCK_EXP, '$1').toLocaleLowerCase()
                if (isJs === 'js' || isJs === 'javascript') {
                    const re = new RegExp(escapeStringRegexp(e.replace(CODE_BLOCK_EXP, '$2')), 'g')
                    this.text = onReplace(this.text, re, '' + beautify_js(e.replace(CODE_BLOCK_EXP, '$2'), beautifyOpt) + '\n')
                }
                if (isJs === 'html') {
                    const re = new RegExp(escapeStringRegexp(e.replace(CODE_BLOCK_EXP, '$2')), 'g')
                    this.text = onReplace(this.text, re, '' + beautify_html(e.replace(CODE_BLOCK_EXP, '$2'), beautifyOpt) + '\n')
                }
                if (isJs === 'css') {
                    const re = new RegExp(escapeStringRegexp(e.replace(CODE_BLOCK_EXP, '$2')), 'g')
                    this.text = onReplace(this.text, re, '' + beautify_css(e.replace(CODE_BLOCK_EXP, '$2'), beautifyOpt) + '\n')
                }
            })
        }

        return this.text
    }
}