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

describe('[CODE] Test single feature', () => {

    it(`test code function`, () => {
        assert.equal(format(getFormatParam(`# Test code
\`\`\`
function asd(){}
\`\`\`
    function js(){console.log(123)}
`, {}, getTemp5())), `# Test code

\`\`\`
function asd(){}
\`\`\`



\`\`\`js
function js() {
    console.log(123)
}
\`\`\`
`)
    });


    it(`test vscode params formatCode is false function`, () => {
        assert.equal(format(getFormatParam(`# Test code
\`\`\`
function asd(){}
\`\`\`
    function js(){console.log(123)}
`, {}, getTemp4())), `# Test code

\`\`\`
function asd(){}
\`\`\`

    function js(){console.log(123)}
`)
    });


    it(`test vscode params codeAreaToBlock is nil string function`, () => {
        assert.equal(format(getFormatParam(`# Test code
\`\`\`
function asd(){}
\`\`\`
    function js(){console.log(123)}
`, {}, getTemp10())), `# Test code

\`\`\`
function asd(){}
\`\`\`

    function js(){console.log(123)}
`)
    });


    it(`test vscode params codeAreaToBlock is nil string function`, () => {
        assert.equal(format(getFormatParam(`# Test code
\`\`\`
function asd(){}
\`\`\`
    function js(){console.log(123)}
`, {}, getTemp10())), `# Test code

\`\`\`
function asd(){}
\`\`\`

    function js(){console.log(123)}
`)
    });


    it(`test vscode params codeAreaToBlock is nil string function`, () => {
        assert.equal(format(getFormatParam(`# Test code
\`\`\`
function asd(){}
\`\`\`
    function js(){console.log(123)}
`, {}, getTemp10())), `# Test code

\`\`\`
function asd(){}
\`\`\`

    function js(){console.log(123)}
`)
    });


    it(`test vscode params codeAreaToBlock is true and code is html function`, () => {
        assert.equal(format(getFormatParam(`# Test code
\`\`\`html
<div id="loader-wrapper"><div id="loader"></div><div class="loader-section section-left"></div><div class="loader-section section-right"></div><div class="load_title">正在加载系统资源，请耐心等待</div></div>
\`\`\`
`, {}, getTemp10())), `# Test code

\`\`\`html
<div id="loader-wrapper">
    <div id="loader"></div>
    <div class="loader-section section-left"></div>
    <div class="loader-section section-right"></div>
    <div class="load_title">正在加载系统资源，请耐心等待</div>
</div>
\`\`\`
`)
    });

    it(`test vscode params codeAreaToBlock is true and code is css function`, () => {
        assert.equal(format(getFormatParam(`# Test code
\`\`\`css
html,body,#app {  height: 100%;  margin: 0px;  padding: 0px;}.chromeframe {  margin: 0.2em 0;  background: #ccc;  color: #000;  padding: 0.2em 0;}
\`\`\`
`, {}, getTemp10())), `# Test code

\`\`\`css
html,
body,
#app {
    height: 100%;
    margin: 0px;
    padding: 0px;
}

.chromeframe {
    margin: 0.2em 0;
    background: #ccc;
    color: #000;
    padding: 0.2em 0;
}
\`\`\`
`)
    });




});





