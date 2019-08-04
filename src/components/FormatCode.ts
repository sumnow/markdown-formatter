import { FormatComponent } from './FormatComponent'
import { removeReplace } from "./removeReplace";
var escapeStringRegexp = require('escape-string-regexp');
var beautify = require('js-beautify')
var beautify_js = require('js-beautify').js;
var beautify_css = require('js-beautify').css;
var beautify_html = require('js-beautify').html;

export class FormatCode extends FormatComponent {
    text: string;
    super(text: string) {
        this.text = text
    }
    formatted({ formatOpt, codeAreaToBlock, codeAreaFormat, CODE_BLOCK_EXP, LIST_EXP, CODE_AREA_EXP }: { formatOpt: any, codeAreaToBlock: string, codeAreaFormat: boolean, CODE_BLOCK_EXP: RegExp, LIST_EXP: RegExp, CODE_AREA_EXP: RegExp }): string {

        let beautifyOpt = {}
        if (formatOpt) {
            beautifyOpt = Object.assign(beautify, formatOpt)
        }
        if (formatOpt !== false) {

            const _codeArr = this.text.match(CODE_BLOCK_EXP)

            if (_codeArr && _codeArr.length > 0) {
                _codeArr.forEach(e => {
                    const isJs = e.replace(CODE_BLOCK_EXP, '$1').toLocaleLowerCase()

                    if (isJs === 'js' || isJs === 'javascript' || isJs === '') {
                        const re = new RegExp(escapeStringRegexp(e.replace(CODE_BLOCK_EXP, '$2')), 'g')
                        this.text = this.text.replace(re, '' + beautify_js(e.replace(CODE_BLOCK_EXP, '$2'), beautifyOpt) + '\n')
                    }
                    if (isJs === 'html') {
                        const re = new RegExp(escapeStringRegexp(e.replace(CODE_BLOCK_EXP, '$2')), 'g')
                        this.text = this.text.replace(re, '' + beautify_html(e.replace(CODE_BLOCK_EXP, '$2'), beautifyOpt) + '\n')
                    }
                    if (isJs === 'css') {
                        const re = new RegExp(escapeStringRegexp(e.replace(CODE_BLOCK_EXP, '$2')), 'g')
                        this.text = this.text.replace(re, '' + beautify_css(e.replace(CODE_BLOCK_EXP, '$2'), beautifyOpt) + '\n')
                    }
                })
            }

            this.text = removeReplace({
                text: this.text,
                reg: [CODE_BLOCK_EXP, LIST_EXP],
                func: (text: string): string => {
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
                },
                type: 'code'
            })
        }
        return this.text
    }
}