import { removeReplace } from "../utils/removeReplace";
import { FormatComponent } from "./FormatComponent";


export class FormatPunctuation extends FormatComponent {
    name: string = 'punctuation';
    text: string;
    super(text: string) {
        this.text = text;
    }

    formatted({ fullWidthTurnHalfWidth, spaceAfterFullWidthOrHalfWidth, expBackQuoteWithSpace, expCodeBlock, expCodeArea, expHref, expListOLLi, expBackQuote, expPunctuationChinese, expPunctuationEnglish, expPunctuationSpacialEnglish, chineseSymbol, englishSymbol, englishCharacterSymbol, chineseCharacterSymbol }: {
        fullWidthTurnHalfWidth: string, spaceAfterFullWidthOrHalfWidth: string, expBackQuoteWithSpace: RegExp, expCodeBlock: RegExp, expCodeArea: RegExp, expHref: RegExp, expListOLLi: RegExp, expBackQuote: RegExp, expPunctuationChinese: RegExp, expPunctuationEnglish: RegExp, expPunctuationSpacialEnglish: RegExp, chineseSymbol: string, englishSymbol: string, englishCharacterSymbol: string, chineseCharacterSymbol: string
    }): string {

        const _replaceWithCHARACTER = ({ target, judge, pad }: { target: string[]; judge: string; pad: string[]; }) => {
            target.forEach((e, i) => {
                const _reg = new RegExp(`${judge}\\${e}`, 'g');
                this.text = this.text.replace(_reg, `$1${pad[i]}`);
            });
        };
        function handlerEnglish(text: string): string {
            text = text.replace(expPunctuationSpacialEnglish, '$1 $2');
            text = text.replace(expPunctuationEnglish, '$1 ');
            return text;
        }
        function handleChinese(text: string): string {
            return text.replace(expPunctuationChinese, '$1 ');
        }
        this.text = removeReplace({
            text: this.text, reg: [expCodeBlock, expCodeArea, expBackQuoteWithSpace, expHref, expListOLLi, expBackQuote], 
            func: (text: string): string => {
                // handle fullwidth character
                const fullwidthArr = chineseSymbol.split('');
                const halfwidthArr = englishSymbol.split('');
                if (fullWidthTurnHalfWidth === 'auto') {
                    _replaceWithCHARACTER({ target: fullwidthArr, judge: englishCharacterSymbol, pad: halfwidthArr });
                    _replaceWithCHARACTER({ target: halfwidthArr, judge: chineseCharacterSymbol, pad: fullwidthArr });
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

                // text = text.replace(/\.\ */g, '. ');

                // handle ELLIPSIS  
                text = text.replace(/(\. \. \. )/g, '... ');

                switch (spaceAfterFullWidthOrHalfWidth) {
                    case "full":
                        text = handleChinese(text);
                        break;
                    case "all":
                        text = handlerEnglish(text);
                        text = handleChinese(text);
                        break;
                    case "neither":
                        break;
                    case "half":
                        // handler '.!?:'
                        text = handlerEnglish(text);
                        break;
                    default:
                        text = handlerEnglish(text);
                }
                return text;
            },
            // type: 'pun'
        });
        return this.text;
    }

}