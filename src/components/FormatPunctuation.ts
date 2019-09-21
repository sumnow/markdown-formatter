import { removeReplace } from "./removeReplace";
import { FormatComponent } from "./FormatComponent";

export class FormatPunctuation extends FormatComponent {
    name: string = 'punctuation'
    text: string;
    super(text: string) {
        this.text = text
    }

    formatted({ fullWidthTurnHalfWidth, spaceAfterFullWidth, BACK_QUOTE_EXP, CODE_BLOCK_EXP, CODE_AREA_EXP, HREF_EXP, LIST_OL_LI_EXP, PUNCTUATION_CHINESE_EXP, PUNCTUATION_ENGLISH_EXP, PUNCTUATION_SPACIAL_ENGLISH_EXP, CHINESE_SYMBOL, ENGLISH_SYMBOL, ENGLISH_CHARCTER_SYMBOL, CHINESE_CHARCTER_SYMBOL }: {
        fullWidthTurnHalfWidth: string, spaceAfterFullWidth: boolean, BACK_QUOTE_EXP: RegExp, CODE_BLOCK_EXP: RegExp, CODE_AREA_EXP: RegExp, HREF_EXP: RegExp, LIST_OL_LI_EXP: RegExp, PUNCTUATION_CHINESE_EXP: RegExp, PUNCTUATION_ENGLISH_EXP: RegExp, PUNCTUATION_SPACIAL_ENGLISH_EXP: RegExp, CHINESE_SYMBOL: string, ENGLISH_SYMBOL: string, ENGLISH_CHARCTER_SYMBOL: string, CHINESE_CHARCTER_SYMBOL: string
    }): string {

        const _replacewithCharcter = ({ target, judge, pad }: { target: string[]; judge: string; pad: string[]; }) => {
            target.forEach((e, i) => {
                const _reg = new RegExp(`${judge}\\${e}`, 'g');
                this.text = this.text.replace(_reg, `$1${pad[i]}`);
            });
        };

        this.text = removeReplace({
            text: this.text, reg: [CODE_BLOCK_EXP, CODE_AREA_EXP, BACK_QUOTE_EXP, HREF_EXP, LIST_OL_LI_EXP], func: (text: string): string => {
                // handle fullwidth character
                const fullwidthArr = CHINESE_SYMBOL.split('');
                const halfwidthArr = ENGLISH_SYMBOL.split('');

                if (fullWidthTurnHalfWidth === 'auto') {
                    _replacewithCharcter({ target: fullwidthArr, judge: ENGLISH_CHARCTER_SYMBOL, pad: halfwidthArr });
                    _replacewithCharcter({ target: halfwidthArr, judge: CHINESE_CHARCTER_SYMBOL, pad: fullwidthArr });
                } else {
                    if (fullWidthTurnHalfWidth !== '' && fullWidthTurnHalfWidth !== '_') {
                        const _commaArr = fullWidthTurnHalfWidth.split('');
                        if (_commaArr && _commaArr.length > 0) {
                            _commaArr.forEach(e => {
                                const _i = fullwidthArr.indexOf(e);
                                if (_i > -1) {
                                    const _reg = new RegExp('\\' + e, 'g');
                                    text = text.replace(_reg, halfwidthArr[_i]);
                                }
                            });
                        }
                    }
                }

                // handle the spaces after '.' 
                text = text.replace(/\.\ */g, '.');

                // hanlde '.!?:'
                text = text.replace(PUNCTUATION_SPACIAL_ENGLISH_EXP, '$1 $2');

                if (spaceAfterFullWidth) {
                    text = text.replace(PUNCTUATION_CHINESE_EXP, '$1 ');
                }

                text = text.replace(PUNCTUATION_ENGLISH_EXP, '$1 ');



                return text;
            }
        })
        return this.text
    }

}