import { removeReplace } from "./removeReplace";
import { FormatComponent } from './FormatComponent'
var escapeStringRegexp = require('escape-string-regexp');

export class FormatHTML extends FormatComponent {
    name: string = 'html'
    super(text: string) {
        this.text = text;
    }

    public formatted({ TAG_START_EXP, TAG_SINGLE_EXP, TAG_END_EXP }): string {
        // this.outputBeforeInfo()
        var as = this.text.match(TAG_START_EXP)
        var asd = this.text.match(TAG_SINGLE_EXP)
        var asde = this.text.match(TAG_END_EXP)

        console.log(as, asd, asde)

        // this.outputAfterInfo()
        return this.text
    }
}