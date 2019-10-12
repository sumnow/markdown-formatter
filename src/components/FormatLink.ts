import { removeReplace } from "./removeReplace";
import { FormatComponent } from './FormatComponent'

export class FormatLink extends FormatComponent {
    name: string = 'html'
    super(text: string) {
        this.text = text;
    }

    public formatted({ LINK_SPACE_EXP, LINK_EXP, CODE_BLOCK_EXP }: {
        LINK_SPACE_EXP: RegExp, LINK_EXP: RegExp, CODE_BLOCK_EXP: RegExp
    }): string {
        // this.outputBeforeInfo()
        this.text = removeReplace({
            text: this.text,
            reg: [CODE_BLOCK_EXP],
            func(text: String) {
                text = text.replace(LINK_EXP, '\n\n' + '$1' + '\n\n')
                text = text.replace(LINK_SPACE_EXP, '\n' + '$1 $2')
                return text
            }
        })

        // this.outputAfterInfo()
        return this.text
    }
}