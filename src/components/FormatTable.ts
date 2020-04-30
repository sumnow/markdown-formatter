import { FormatComponent } from "./FormatComponent";
import { FormatTableTool } from './FormatTableTool'
import { removeReplace } from "./removeReplace";


var escapeStringRegexp = require('escape-string-regexp');

export class FormatTable extends FormatComponent {
    name: string = 'table'
    text: string;
    super(text: string) {
        this.text = text
    }
    formatted({ TABLE_EXP, LINK_EXP, CODE_BLOCK_EXP, CODE_AREA_EXP }: { TABLE_EXP: RegExp, LINK_EXP?: RegExp, CODE_BLOCK_EXP?: RegExp, CODE_AREA_EXP?: RegExp }): string {
        this.text = removeReplace({
            text: this.text, reg: [LINK_EXP, CODE_BLOCK_EXP, CODE_AREA_EXP], func(text: string) {
                const _tableArr = text.match(TABLE_EXP)

                if (_tableArr && _tableArr.length > 0) {
                    _tableArr.forEach((table) => {
                        var re = new RegExp(escapeStringRegexp(String(table)), 'g')
                        text = text.replace(re, (substring: string) => '\n\n' + new FormatTableTool().reformat(table) + '\n\n')
                    })
                }
                return text
            }
        })
        return this.text
    }
}
