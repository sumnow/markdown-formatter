var escapeStringRegexp = require('escape-string-regexp');
import onReplace from './handlerReplace';

function getUUID() {
    return Number(Math.random().toString().substring(2, 16) + Date.now()).toString(36)
}
export function removeReplace({ text, reg, func, type }: {
    text: string;
    reg: Array<RegExp>;
    func: Function;
    type?: string;
}): string {
    const _tempRegArr: { [key: string]: any } = {};
    reg.forEach(e => {
        // e = escapeStringRegexp(`${e}`)
        const _arr = text.match(e);
        if (_arr) {
            _arr.forEach(e => {
                const l = getUUID()
                if (_tempRegArr[l]) {
                    console.log(`duplicate key ${_tempRegArr[l]}`)
                }
                _tempRegArr[l] = {
                    content: e,
                    hasN: e.includes('\n')
                }

            })
            // replace second param need to escaped
            // _tempRegArr.push(..._arr.map(e => { return { content: (e), hasN: e.includes('\n') }; }));
        }
    });
    const _tempKeyList = Object.keys(_tempRegArr)
    if (_tempKeyList && _tempKeyList.length > 0) {
        _tempKeyList.forEach((e) => {

            const _reg = new RegExp(escapeStringRegexp(_tempRegArr[e].content), 'g');
            text = text.replace(_reg, _tempRegArr[e].hasN ? `\n\n$mdFormatter$${e}$mdFormatter$\n\n` : `$mdFormatter$${e}$mdFormatter$`);
        });
        // if (type) {
        //     console.log(`=== === ${type} --- start === ===`);
        //     console.log(text);
        // }
        text = func(text);
        _tempKeyList.forEach((e) => {
            let _mdFormatter = _tempRegArr[e].hasN ? `\n\n$mdFormatter$${e}$mdFormatter$\n\n` : `$mdFormatter$${e}$mdFormatter$`;
            const _reg = new RegExp(escapeStringRegexp(_mdFormatter), 'g');
            text = onReplace(text, _reg, _tempRegArr[e].content);
        });
        // if (type) {
        //     console.log(`--- --- handler ${type} after --- ---`);
        //     console.log(text);
        //     console.log(`  === === ${type} --- end === ===`);
        // }
    }
    else {
        text = func(text);
    }
    return text;
}
