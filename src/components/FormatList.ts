import { FormatComponent } from './FormatComponent'
var escapeStringRegexp = require('escape-string-regexp');
import { removeReplace } from "./removeReplace";

export class FormatList extends FormatComponent {
    name: string = 'list'
    super(text: string) {
        this.text = text;
    }
    private repeatZero({ number, str }: { number: number, str: string }): string {
        if (number === 0) {
            return str
        } else {
            return this.repeatZero({ number: number - 1, str: `0${str}` })
        }
    }
    private formatLineBetween({ LIST_EXP }: { LIST_EXP: RegExp }) {
        this.text = this.text.replace(LIST_EXP, '\n\n' + '$1' + '\n\n');
    }
    private formatUL(text, { formatULSymbol, LIST_UL_ST_EXP, LIST_UL_ND_EXP, LIST_UL_TH_EXP }: { formatULSymbol: Boolean, LIST_UL_ST_EXP: RegExp, LIST_UL_ND_EXP: RegExp, LIST_UL_TH_EXP: RegExp }) {
        if (formatULSymbol) {
            text = text.replace(LIST_UL_ST_EXP, '\n* ' + '$1');
            text = text.replace(LIST_UL_ND_EXP, '\n  + ' + '$1');
            text = text.replace(LIST_UL_TH_EXP, '\n    - ' + '$1');
        }
        return text
    }
    private formatOL({ LIST_OL_LI_EXP }: { LIST_OL_LI_EXP: RegExp }) {
        // format ol
        const _arr: Array<string> = this.text.match(LIST_OL_LI_EXP)
        const _length: Array<number> = _arr !== null ? _arr.map(e => {
            return e.replace(LIST_OL_LI_EXP, '$2').length
        }) : []

        const maxLength: number = Math.max(..._length)
        if (maxLength > 1) {
            _arr.forEach((e, i) => {
                if (_length[i] < maxLength) {
                    // https://github.com/sumnow/markdown-formatter/issues/45
                    const _reg = new RegExp(escapeStringRegexp(e), 'g');
                    this.text = this.text.replace(_reg, e.replace(LIST_OL_LI_EXP, `$1${this.repeatZero({ number: maxLength - _length[i], str: '' })}$2$3`))
                }
            })
        }
    }
    public formatted({ formatULSymbol, LIST_EXP, LIST_UL_ST_EXP, LIST_UL_ND_EXP, LIST_UL_TH_EXP, LIST_OL_LI_EXP, SPLIT_LINE_EXP }): string {
        // this.outputBeforeInfo()
        // format list
        this.formatLineBetween({ LIST_EXP })
        // format ul
        const self = this
        // https://github.com/sumnow/markdown-formatter/issues/23
        this.text = removeReplace({
            text: this.text,
            reg: [SPLIT_LINE_EXP],
            func(text: String) {
                text = self.formatUL(text, { formatULSymbol, LIST_UL_ST_EXP, LIST_UL_ND_EXP, LIST_UL_TH_EXP })
                return text
            }
        })

        // format ol
        this.formatOL({ LIST_OL_LI_EXP })

        // this.outputAfterInfo()
        return this.text
    }
}