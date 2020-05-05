import { removeReplace } from "./removeReplace";
import { FormatComponent } from './FormatComponent'
import { FormatTableTool } from './FormatTableTool';
var escapeStringRegexp = require('escape-string-regexp');

export class FormatLink extends FormatComponent {
    name: string = 'html'
    super(text: string) {
        this.text = text;
    }

    public formatted({ LINK_SPACE_EXP, LINK_EXP, CODE_BLOCK_EXP, TABLE_EXP }: {
        LINK_SPACE_EXP: RegExp, LINK_EXP: RegExp, CODE_BLOCK_EXP: RegExp, TABLE_EXP: RegExp
    }): string {
        // this.outputBeforeInfo()
        this.text = removeReplace({
            text: this.text,
            reg: [CODE_BLOCK_EXP],
            func(text: string) {
                text = text.replace(LINK_EXP, '\n\n' + '$1' + '\n\n')
                text = text.replace(LINK_SPACE_EXP, '\n' + '$1 $2')
                // hanler table in link
                // https://github.com/sumnow/markdown-formatter/issues/20
                if (text.match(LINK_EXP)) {
                    text.match(LINK_EXP).forEach(e => {
                        const textRemoveLinkSymbol = e.replace(/\n\>\ /g, '\n');
                        if (textRemoveLinkSymbol.match(TABLE_EXP)) {
                            const textResult = `\n${new FormatTableTool().reformat(textRemoveLinkSymbol)}`.replace(/\n\|/g, '\n> |')
                            const _reg = new RegExp(escapeStringRegexp(e));
                            text = text.replace(_reg, textResult)
                        }

                    })
                }
                // textTable.forEach(e => {
                //     const les = new FormatTableTool().reformat(e)
                //     console.log(456, les)
                // })
                return text
            }
        })

        // this.outputAfterInfo()
        return this.text
    }
}