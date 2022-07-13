const assert = require('assert');
const { getFormatParam, generateTimeHeader, generateVsCodeParam } = require('./test.params')
const format = require('../out/src/format').default;
const _local_time = new Date();

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


    it(`test Punctuation when set half function`, () => {
        assert.equal(
            format(getFormatParam(`# Test Punctuation

English first english,symbol English then
English first chinese，symbolEnglish then
中文先中，符中文后
中文先英,符中文后
中文先,English Then
中文先，English Then
English first,中文后
English first，中文后`, {}, getTemp9())),
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
    it(`test Punctuation when set full function`, () => {
        assert.equal(
            format(getFormatParam(`# Test Punctuation

English first english,symbol English then
English first chinese，symbolEnglish then
中文先中，符中文后
中文先英,符中文后
中文先,English Then
中文先，English Then
English first,中文后
English first，中文后`, {}, getTemp8())),
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
    it(`test Punctuation when set all function`, () => {
        assert.equal(
            format(getFormatParam(`# Test Punctuation

English first english,symbol English then
English first chinese，symbolEnglish then
中文先中，符中文后
中文先英,符中文后
中文先,English Then
中文先，English Then
English first,中文后
English first，中文后`, {}, getTemp6())),
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
    it(`test Punctuation when neither function`, () => {
        assert.equal(
            format(getFormatParam(`# Test Punctuation

English first english,symbol English then
English first chinese，symbolEnglish then
中文先中，符中文后
中文先英,符中文后
中文先,English Then
中文先，English Then
English first,中文后
English first，中文后`, {}, getTemp7())),
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

});





