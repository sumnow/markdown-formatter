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

describe('[*] Test single feature', () => {

    it(`test add date function`, () => {
        assert.equal(
            format(getFormatParam(`# asd`, { date: _local_time, }, { displayTime: true })),
            generateTimeHeader(_local_time, `# asd`)
        )
    });

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



    it(`test link function`, () => {
        assert.equal(format(getFormatParam(`
# Test link
> asd
> asd`, {}, getTemp2())), `# Test link

> asd
> asd
`)
    });

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




});



