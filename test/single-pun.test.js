const assert = require('assert');
const { getFormatParam, generateTimeHeader, generateVsCodeParam } = require('./test.params')
const format = require('../out/src/format').default;
const _local_time = new Date(0);




function getDefaultTextTemp() {
    const c = `# Test Punctuation

English first english,symbol English then
English first chinese，symbolEnglish then
中文先中，符中文后
中文先英,符中文后
中文先,English Then
中文先，English Then
English first,中文后
English first，中文后`
    return c
}
function getTemp1() {
    return generateVsCodeParam({
        formatTable: true
    })
}

function getTemp2() {
    return generateVsCodeParam({
    })
}


function getTemp3() {
    return generateVsCodeParam({
        enable: false,
    })
}

function getTemp4() {
    return generateVsCodeParam({
        formatCodes: false,
    })
}

function getTemp5() {
    return generateVsCodeParam({
        codeAreaToBlock: "js",
        formatOpt: { "indent_size": 4 },
        formatCodes: true,
    })
}



function getTemp6() {
    return generateVsCodeParam({
        fullWidthTurnHalfWidth: "，：；！“”‘’（）？。"
        , spaceAfterFullWidthOrHalfWidth: "all"
    })
}

function getTemp7() {
    return generateVsCodeParam({
        fullWidthTurnHalfWidth: "，：；！“”‘’（）？。"
        , spaceAfterFullWidthOrHalfWidth: "neither"
    })
}

function getTemp8() {
    return generateVsCodeParam({
        fullWidthTurnHalfWidth: "，：；！“”‘’（）？。",
        spaceAfterFullWidthOrHalfWidth: "full"
    })
}

function getTemp9() {
    return generateVsCodeParam({
        fullWidthTurnHalfWidth: "，：；！“”‘’（）？。",
        spaceAfterFullWidthOrHalfWidth: "half"
    })
}

function getTemp10() {
    return generateVsCodeParam({
        codeAreaToBlock: ''
    })
}

describe('[PUN] Test PUN feature', () => {


    it(`test Punctuation when set all punctuation to half-width, and space only after half-width half`, () => {
        assert.equal(
            format(getFormatParam(getDefaultTextTemp(), {}, getTemp9())),
            `# Test Punctuation

English first english, symbol English then
English first chinese, symbolEnglish then
中文先中, 符中文后
中文先英, 符中文后
中文先, English Then
中文先, English Then
English first, 中文后
English first, 中文后
`
        )
    });
    it(`test Punctuation when change all punctuation to half-width, and set space only after full-width`, () => {
        assert.equal(
            format(getFormatParam(getDefaultTextTemp(), {}, getTemp8())),
            `# Test Punctuation

English first english,symbol English then
English first chinese,symbolEnglish then
中文先中,符中文后
中文先英,符中文后
中文先,English Then
中文先,English Then
English first,中文后
English first,中文后
`
        )
    });
    it(`test Punctuation  when change all  punctuation to half-width, and all punctuation have space`, () => {
        assert.equal(
            format(getFormatParam(getDefaultTextTemp(), {}, getTemp6())),
            `# Test Punctuation

English first english, symbol English then
English first chinese, symbolEnglish then
中文先中, 符中文后
中文先英, 符中文后
中文先, English Then
中文先, English Then
English first, 中文后
English first, 中文后
`
        )
    });
    it(`test Punctuation when change all punctuation to half-width and set all punctuation have no space`, () => {
        assert.equal(
            format(getFormatParam(getDefaultTextTemp(), {}, getTemp7())),
            `# Test Punctuation

English first english,symbol English then
English first chinese,symbolEnglish then
中文先中,符中文后
中文先英,符中文后
中文先,English Then
中文先,English Then
English first,中文后
English first,中文后
`
        )
    });

});





