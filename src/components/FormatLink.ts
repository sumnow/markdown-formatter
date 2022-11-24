import { removeReplace } from "../utils/removeReplace";
import { FormatComponent } from './FormatComponent';
import { FormatTableTool } from './FormatTableTool';
var escapeStringRegexp = require('escape-string-regexp');

export class FormatLink extends FormatComponent {
    name: string = 'html';
    super(text: string) {
        this.text = text;
    }

    public formatted({ expLinkSpace, expLink, expCodeBlock, expTable, formatTableOpt }: {
        expLinkSpace: RegExp, expLink: RegExp, expCodeBlock: RegExp, expTable: RegExp, formatTableOpt: Options.TypeFormatTableOpt
    }): string {
        // this.outputBeforeInfo()
        this.text = removeReplace({
            text: this.text,
            reg: [expCodeBlock],
            func(text: string) {
                text = text.replace(expLink, '\n\n' + '$1' + '\n\n');
                text = text.replace(expLinkSpace, '\n' + '$1 $2');
                // hanler table in link
                // https://github.com/sumnow/markdown-formatter/issues/20
                if (text.match(expLink)) {
                    text.match(expLink).forEach(e => {
                        const textRemoveLinkSymbol = e.replace(/\n\>\ /g, '\n');
                        if (textRemoveLinkSymbol.match(expTable)) {
                            const textResult = `\n${new FormatTableTool(formatTableOpt.chineseCharterWidth).reformat(textRemoveLinkSymbol)}`.replace(/\n\|/g, '\n> |');
                            const _reg = new RegExp(escapeStringRegexp(e));
                            text = text.replace(_reg, textResult);
                        }

                    });
                }
                // textTable.forEach(e => {
                //     const les = new FormatTableTool().reformat(e)
                //     console.log(456, les)
                // })
                return text;
            }
        });

        // this.outputAfterInfo()
        return this.text;
    }
}