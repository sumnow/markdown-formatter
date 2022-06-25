import { FormatComponent } from './FormatComponent';
var escapeStringRegexp = require('escape-string-regexp');

export class FormatHTML extends FormatComponent {
    name: string = 'html';
    super(text: string) {
        this.text = text;
    }

    public formatted({ expTagStart, expTagSingle, expTagEnd }): string {
        // this.outputBeforeInfo()
        var as = this.text.match(expTagStart);
        var asd = this.text.match(expTagSingle);
        var asde = this.text.match(expTagEnd);


        // this.outputAfterInfo()
        return this.text;
    }
}