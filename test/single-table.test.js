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

describe('[TABLE] Test single feature', () => {
    it(`test table function`, () => {
        assert.equal(format(getFormatParam(`# Test table
table is
apple| banana |cat| dog
---|---|---|---
is a|is b|is c|is d
`, {}, getTemp1())), `# Test table

table is

| apple | banana | cat  | dog  |
|-------|--------|------|------|
| is a  | is b   | is c | is d |
`)
    });


    it(`test table function`, () => {
        assert.equal(format(getFormatParam(`# Test table
table is
> apple| banana |cat| dog
> ---|---|---|---
> is a|is b|is c|is d
`, {}, getTemp1())), `# Test table

table is

> | apple | banana | cat  | dog  |
> |-------|--------|------|------|
> | is a  | is b   | is c | is d |
`)
    });


    it(`test table function`, () => {
        assert.equal(format(getFormatParam(`# Test table
table is
苹果| 香蕉 |猫| 狗
---|---|---|---
is a|is b|is c|is d
`, {}, getTemp1())), `# Test table

table is

| 苹果  |  香蕉  |  猫  | 狗   |
|-------|-------|------|------|
| is a  | is b  | is c | is d |
`)
    });






});





