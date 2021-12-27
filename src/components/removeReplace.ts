var escapeStringRegexp = require('escape-string-regexp');
import onReplace from './handlerReplace'
export function removeReplace({ text, reg, func, type }: {
    text: string;
    reg: Array<RegExp>;
    func: Function;
    type?: string;
}): string {
    const _tempRegArr: any[] = [];
    reg.forEach(e => {
        // e = escapeStringRegexp(`${e}`)
        const _arr = text.match(e);
        if (_arr)
            // replace second param need to escaped
            _tempRegArr.push(..._arr.map(e => { return { content: (e), hasN: e.includes('\n') }; }));
    });
    if (_tempRegArr && _tempRegArr.length > 0) {
        _tempRegArr.forEach((e, i) => {
            const _reg = new RegExp(escapeStringRegexp(e.content), 'g');
            text = text.replace(_reg, e.hasN ? `\n\n$mdFormatter$${i}$mdFormatter$\n\n` : `$mdFormatter$${i}$mdFormatter$`);
        });
        if (type) {
            console.log(`=== === ${type} --- start === ===`)
            console.log(text)
        }
        text = func(text);
        _tempRegArr.forEach((e, i) => {
            let _mdFormatter = e.hasN ? `\n\n$mdFormatter$${i}$mdFormatter$\n\n` : `$mdFormatter$${i}$mdFormatter$`;
            const _reg = new RegExp(escapeStringRegexp(_mdFormatter), 'g');
            text = onReplace(text, _reg, _tempRegArr[i].content);
        });
        if (type) {
            console.log(`--- --- handler ${type} after --- ---`)
            console.log(text)
            console.log(`  === === ${type} --- end === ===`)
        }
    }
    else {
        text = func(text);
    }
    return text;
}
