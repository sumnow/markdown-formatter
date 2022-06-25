import { FormatComponent } from './FormatComponent';
var escapeStringRegexp = require('escape-string-regexp');
import { removeReplace } from "../utils/removeReplace";

export class FormatList extends FormatComponent {
    name: string = 'list';
    super(text: string) {
        this.text = text;
    }
    private repeatZero({ number, str }: { number: number, str: string }): string {
        if (number === 0) {
            return str;
        } else {
            return this.repeatZero({ number: number - 1, str: `0${str}` });
        }
    }
    private formatLineBetween({ expList, expCodeBlock, expCodeArea }: { expList: RegExp, expCodeBlock: RegExp, expCodeArea: RegExp }) {
        removeReplace({
            text: this.text,
            reg: [expCodeBlock, expCodeArea],
            func(text: String) {
                text = text.replace(expList, '\n\n' + '$1' + '\n\n');
                return text;
            }
        });
    }
    private formatUL(text, { formatULSymbol, expUL1st, expUL2nd, expUL3th }: { formatULSymbol: Boolean, expUL1st: RegExp, expUL2nd: RegExp, expUL3th: RegExp }) {
        if (formatULSymbol) {
            text = text.replace(expUL1st, '\n* ' + '$1');
            text = text.replace(expUL2nd, '\n  + ' + '$1');
            text = text.replace(expUL3th, '\n    - ' + '$1');
        }
        return text;
    }
    private formatOL({ expListOLLi }: { expListOLLi: RegExp }) {
        // format ol
        const _arr: Array<string> = this.text.match(expListOLLi);
        const _length: Array<number> = _arr !== null ? _arr.map(e => {
            return e.replace(expListOLLi, '$2').length;
        }) : [];

        const maxLength: number = Math.max(..._length);
        if (maxLength > 1) {
            _arr.forEach((e, i) => {
                if (_length[i] < maxLength) {
                    // https://github.com/sumnow/markdown-formatter/issues/45
                    const _reg = new RegExp(escapeStringRegexp(e), 'g');
                    this.text = this.text.replace(_reg, e.replace(expListOLLi, `$1${this.repeatZero({ number: maxLength - _length[i], str: '' })}$2$3`));
                }
            });
        }
    }
    public formatted({ formatULSymbol, expList, expUL1st, expUL2nd, expUL3th, expListOLLi, expSplitLine, expCodeBlock, expCodeArea }): string {
        // this.outputBeforeInfo()
        // format list
        this.formatLineBetween({ expList, expCodeBlock, expCodeArea });
        // format ul
        const self = this;
        // https://github.com/sumnow/markdown-formatter/issues/23
        this.text = removeReplace({
            text: this.text,
            reg: [expSplitLine, expCodeBlock],
            func(text: String) {
                text = self.formatUL(text, { formatULSymbol, expUL1st, expUL2nd, expUL3th });
                return text;
            }
        });

        // format ol
        this.formatOL({ expListOLLi });

        // this.outputAfterInfo()
        return this.text;
    }
}