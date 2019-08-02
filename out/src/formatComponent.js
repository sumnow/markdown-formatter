"use strict";
var FormatComponent = (function () {
    function FormatComponent(text) {
        this.text = text;
    }
    FormatComponent.prototype.outputBeforeInfo = function () {
        console.log("< before format " + this.name + " >");
        console.log("" + this.text);
    };
    FormatComponent.prototype.outputAfterInfo = function () {
        console.log("< after format " + this.name + " >");
        console.log("" + this.text);
    };
    return FormatComponent;
}());
exports.FormatComponent = FormatComponent;
//# sourceMappingURL=FormatComponent.js.map