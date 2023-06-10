const assert = require('assert');
const { getFormatParam, generateTimeHeader, generateVsCodeParam } = require('./test.params')
const format = require('../out/src/format').default;
const _local_time = new Date(0);

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

describe('[*] Test single feature', () => {

    it(`test add date function`, () => {
        assert.equal(
            format(getFormatParam(`# asd`, { date: _local_time, }, { displayTime: true })),
            generateTimeHeader(_local_time, `# asd`)
        )
    });

    it(`test link function`, () => {
        assert.equal(format(getFormatParam(`
# Test link
> asd
> asd`, {}, getTemp2())), `# Test link

> asd
> asd
`)
    });



    it(`test extra line function`, () => {
        assert.equal(format(getFormatParam(`# Test line
i am line



i am line



`, {}, getTemp2())), `# Test line

i am line

i am line
`)
    });


    it(`test header function`, () => {
        assert.equal(format(getFormatParam(`# Test header
## second line
### third line
`, {}, getTemp2())), `# Test header

## second line

### third line
`)
    });



    it(`test image function`, () => {
        assert.equal(format(getFormatParam(`# Test image
i am image ![image](http://image.second.png) end image
![image](http://image.thrid.png) test me
`, {}, getTemp2())), `# Test image

i am image 

![image](http://image.second.png) 

end image

![image](http://image.thrid.png) 

test me
`)
    });

    it(`test special font function`, () => {
        assert.equal(format(getFormatParam(`# Test special font
first*q*second**a**third***z***forth~~w~~fifth
`, {}, getTemp2())), `# Test special font

first *q* second **a** third ***z*** forth ~~w~~ fifth
`)
    });

    it(`test extra line before text and after text function`, () => {
        assert.equal(format(getFormatParam(`



# Test extra line before



`, {}, getTemp2())), `# Test extra line before
`)
    });

    it(`test format when md-file-format-disable is true`, () => {
        assert.equal(format(getFormatParam(`
<!-- /* md-file-format-disable */ -->


# Test extra line before

`, {}, getTemp2())), `
<!-- /* md-file-format-disable */ -->


# Test extra line before

`)
    });



    it(`test uncaught error occurred`, () => {
        assert.throws(() => format(getFormatParam(NaN, {}, getTemp2())), Error, "Error thrown")
    })


    it(`test vscode params enable is false function`, () => {
        assert.equal(format(getFormatParam(`# Test header
## second line
### third line
`, {}, getTemp3())), `# Test header
## second line
### third line
`)
    });


    it(`test \` in different wrap`, () => {
        assert.equal(format(getFormatParam("# Test qua\nasd`zxc`qwe\n`asd`zxcqwe\nasdzxc`qwe`", {}, getTemp3())),
            `# Test qua

asd \`zxc\` qwe
\`asd\` zxcqwe
asdzxc \`qwe\`
`)
    });

});





