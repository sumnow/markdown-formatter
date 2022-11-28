import { FormatComponent } from './FormatComponent';
import { removeReplace } from "../utils/removeReplace";

export class FormatSpecialFont extends FormatComponent {
    name: string = 'special';
    super(text: string) {
        this.text = text;
    }

    public formatted({ expItalicBold,
        expBold,
        expItalic,
        expLineDeprecated }: {
            expItalicBold: RegExp,
            expBold: RegExp,
            expItalic: RegExp,
            expLineDeprecated: RegExp,
        }): string {
        let t = this.text;
        t = t.replace(expLineDeprecated, ' ~~$1~~ ');
        t = t.replace(expItalicBold, ` ***$1*** `);

        t = removeReplace({
            text: t,
            reg: [expItalicBold,],
            func: (tex) => {
                tex = tex.replace(expBold, ' **$1** ');
                tex = removeReplace({
                    text: tex,
                    reg: [expBold],
                    func: (tx) => {
                        tx = tx.replace(expItalic, ' *$1* ');
                        return tx;
                    }
                })
                return tex
            }
        })
        return t;
    }
}