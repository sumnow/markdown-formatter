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

describe('[LIST] Test single feature', () => {


    it(`test list function`, () => {
        assert.equal(format(getFormatParam(`# Test list
1. first
2. second
3. third
* first
* second
* third
  * second-first
  * second-second
    * third-first
    * third-second
`, {}, getTemp2())), `# Test list
1. first
2. second
3. third
* first
* second
* third
  + second-first
  + second-second
    - third-first
    - third-second
`)
    });



    it(`test long orderly list function`, () => {
        assert.equal(format(getFormatParam(`# Test list
1. first
2. second
3. third
4. forth
5. fifth
6. sixth
7. seventh
8. eighth
9. ninth
10. tenth
11. eleven
`, {}, getTemp2())), `# Test list
01. first
02. second
03. third
04. forth
05. fifth
06. sixth
07. seventh
08. eighth
09. ninth
10. tenth
11. eleven
`)
    });

});





