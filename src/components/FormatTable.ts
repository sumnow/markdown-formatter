import { FormatComponent } from "./FormatComponent";
import { FormatTableTool } from './FormatTableTool'

var escapeStringRegexp = require('escape-string-regexp');

export class FormatTable extends FormatComponent {
    text: string;
    super(text: string) {
        this.text = text
    }
    formatted(TABLE_EXP: RegExp): string {
        const _tableArr = this.text.match(TABLE_EXP)
        if (_tableArr && _tableArr.length > 0) {
            _tableArr.forEach((table) => {
                var re = new RegExp(escapeStringRegexp(String(table)), 'g')
                this.text = this.text.replace(re, (substring: string) => '\n\n' + new FormatTableTool().reformat(table) + '\n\n')
            })
        }
        return this.text
    }
}
