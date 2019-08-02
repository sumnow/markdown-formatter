"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FormatComponent_1 = require('./FormatComponent');
var escapeStringRegexp = require('escape-string-regexp');
var FormatList = (function (_super) {
    __extends(FormatList, _super);
    function FormatList() {
        _super.apply(this, arguments);
        this.name = 'list';
    }
    FormatList.prototype.super = function (text) {
        this.text = text;
    };
    FormatList.prototype.repeatZero = function (_a) {
        var number = _a.number, str = _a.str;
        if (number === 0) {
            return str;
        }
        else {
            return this.repeatZero({ number: number - 1, str: "0" + str });
        }
    };
    FormatList.prototype.formatLineBetween = function (_a) {
        var LIST_EXP = _a.LIST_EXP;
        this.text = this.text.replace(LIST_EXP, '\n\n' + '$1' + '\n\n');
    };
    FormatList.prototype.formatUL = function (_a) {
        var formatULSymbol = _a.formatULSymbol, LIST_UL_ST_EXP = _a.LIST_UL_ST_EXP, LIST_UL_ND_EXP = _a.LIST_UL_ND_EXP, LIST_UL_TH_EXP = _a.LIST_UL_TH_EXP;
        if (formatULSymbol) {
            this.text = this.text.replace(LIST_UL_ST_EXP, '\n* ' + '$1');
            this.text = this.text.replace(LIST_UL_ND_EXP, '\n  + ' + '$1');
            this.text = this.text.replace(LIST_UL_TH_EXP, '\n    - ' + '$1');
        }
    };
    FormatList.prototype.formatOL = function (_a) {
        var _this = this;
        var LIST_OL_LI_EXP = _a.LIST_OL_LI_EXP;
        // format ol
        var _arr = this.text.match(LIST_OL_LI_EXP);
        var _length = _arr !== null ? _arr.map(function (e) {
            return e.replace(LIST_OL_LI_EXP, '$2').length;
        }) : [];
        var maxLength = Math.max.apply(Math, _length);
        if (maxLength > 1) {
            _arr.forEach(function (e, i) {
                if (_length[i] < maxLength) {
                    var _reg = new RegExp(escapeStringRegexp(e), 'g');
                    _this.text = _this.text.replace(_reg, e.replace(LIST_OL_LI_EXP, "$1" + _this.repeatZero({ number: maxLength - _length[i], str: '' }) + "$2$3"));
                }
            });
        }
    };
    FormatList.prototype.formatted = function (_a) {
        // this.outputBeforeInfo()
        var formatULSymbol = _a.formatULSymbol, LIST_EXP = _a.LIST_EXP, LIST_UL_ST_EXP = _a.LIST_UL_ST_EXP, LIST_UL_ND_EXP = _a.LIST_UL_ND_EXP, LIST_UL_TH_EXP = _a.LIST_UL_TH_EXP, LIST_OL_LI_EXP = _a.LIST_OL_LI_EXP;
        // format list
        this.formatLineBetween({ LIST_EXP: LIST_EXP });
        // format ul
        this.formatUL({ formatULSymbol: formatULSymbol, LIST_UL_ST_EXP: LIST_UL_ST_EXP, LIST_UL_ND_EXP: LIST_UL_ND_EXP, LIST_UL_TH_EXP: LIST_UL_TH_EXP });
        // format ol
        this.formatOL({ LIST_OL_LI_EXP: LIST_OL_LI_EXP });
        // this.outputAfterInfo()
        return this.text;
    };
    return FormatList;
}(FormatComponent_1.FormatComponent));
exports.FormatList = FormatList;
//# sourceMappingURL=FormatList.js.map