import { FormatComponent } from "./FormatComponent";
import { FormatTableTool } from './FormatTableTool';
import { removeReplace } from "../utils/removeReplace";

var escapeStringRegexp = require('escape-string-regexp');

export class FormatTable extends FormatComponent {
    name: string = 'table';
    text: string;
    super(text: string) {
        this.text = text;
    }
    formatted({ expTable, expLink, expCodeBlock, expCodeArea, formatTableOpt }: { expTable: RegExp, expLink?: RegExp, expCodeBlock?: RegExp, expCodeArea?: RegExp, formatTableOpt: Options.TypeFormatTableOpt }): string {
        this.text = removeReplace({
            text: this.text, reg: [expLink, expCodeBlock, expCodeArea], func(text: string) {
                const _tableArr = text.match(expTable);

                if (_tableArr && _tableArr.length > 0) {
                    _tableArr.forEach((table) => {
                        var re = new RegExp(escapeStringRegexp(String(table)), 'g');
                        text = text.replace(re, (substring: string) => '\n\n' + new FormatTableTool(formatTableOpt.chineseCharterWidth).reformat(table) + '\n\n');
                    });
                }
                return text;
            }
        });
        return this.text;
    }
}
