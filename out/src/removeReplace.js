"use strict";
var escapeStringRegexp = require('escape-string-regexp');
function removeReplace(_a) {
    var text = _a.text, reg = _a.reg, func = _a.func;
    var _tempRegArr = [];
    reg.forEach(function (e) {
        var _arr = text.match(e);
        if (_arr)
            _tempRegArr.push.apply(_tempRegArr, _arr.map(function (e) { return { content: e, hasN: e.includes('\n') }; }));
    });
    if (_tempRegArr && _tempRegArr.length > 0) {
        _tempRegArr.forEach(function (e, i) {
            var _reg = new RegExp(escapeStringRegexp(e.content), 'g');
            text = text.replace(_reg, e.hasN ? "\n\n$mdFormatter$" + i + "$mdFormatter$\n\n" : "$mdFormatter$" + i + "$mdFormatter$");
        });
        text = func(text);
        _tempRegArr.forEach(function (e, i) {
            var _mdformatter = e.hasN ? "\n\n$mdFormatter$" + i + "$mdFormatter$\n\n" : "$mdFormatter$" + i + "$mdFormatter$";
            var _reg = new RegExp(escapeStringRegexp(_mdformatter), 'g');
            text = text.replace(_reg, _tempRegArr[i].content);
        });
    }
    else {
        text = func(text);
    }
    return text;
}
exports.removeReplace = removeReplace;
//# sourceMappingURL=removeReplace.js.map