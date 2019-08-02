var escapeStringRegexp = require('escape-string-regexp');

export function removeReplace({ text, reg, func }: {
    text: string;
    reg: Array<RegExp>;
    func: Function;
}): string {
    const _tempRegArr = [];
    reg.forEach(e => {
        const _arr = text.match(e);
        if (_arr)
            _tempRegArr.push(..._arr.map(e => { return { content: e, hasN: e.includes('\n') }; }));
    });
    if (_tempRegArr && _tempRegArr.length > 0) {
        _tempRegArr.forEach((e, i) => {
            const _reg = new RegExp(escapeStringRegexp(e.content), 'g');
            text = text.replace(_reg, e.hasN ? `\n\n$mdFormatter$${i}$mdFormatter$\n\n` : `$mdFormatter$${i}$mdFormatter$`);
        });
        text = func(text);
        _tempRegArr.forEach((e, i) => {
            let _mdformatter = e.hasN ? `\n\n$mdFormatter$${i}$mdFormatter$\n\n` : `$mdFormatter$${i}$mdFormatter$`;
            const _reg = new RegExp(escapeStringRegexp(_mdformatter), 'g');
            text = text.replace(_reg, _tempRegArr[i].content);
        });
    }
    else {
        text = func(text);
    }
    return text;
}
