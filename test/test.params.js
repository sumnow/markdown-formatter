function generateVsCodeParam(obj = {}) {
    const common = {
        codeAreaToBlock: ""
        , displayTime: false
        , enable: true
        , formatCodes: true
        , formatOpt: {}
        , formatTable: false
        , formatTableOpt: { chineseCharterWidth: 2 }
        , formatULSymbol: true
        , formatULSymbolOpt: { tag: ['*', '+', '-'] }
        , fullWidthTurnHalfWidth: "auto"
        , spaceAfterFullWidthOrHalfWidth: "half",
    }

    return { ...common, ...obj }
}

function isEmptyObject(obj) {
    return Object.keys(obj).length === 0
}

/**
 * 
 * @param {*} textP 
 * @param {*} otherParam 
 * @param {*} vscodeParam 
 * @param {?} throwError
 * @returns 
 */
function getFormatParam(textP, otherParam, vscodeParam, throwError) {
    if (!vscodeParam) {
        vsParam = {}
    }
    if (!otherParam) {
        otherParam = {}
    }
    if (isEmptyObject(vscodeParam)) {
        vscodeParam = generateVsCodeParam();
    } else {
        vscodeParam = generateVsCodeParam(vscodeParam)
    }
    if (otherParam.date) {
        otherParam.date = new Date(0);
    }
    const params = { textP, vsParam: vscodeParam, otherParam, throwError: throwError && typeof throwError === 'function' ? throwError : () => void 0, }
    return params
}

function exportVsCodeParam() {

}

function generateTimeHeader(date, text) {
    const c = `<!--\nCreated: ${date.toString()}\nModified: ${date.toString()}\n-->\n\n${text}\n`
    return c;
}

function allTest() {
    const c = `# I am testFile
## Test table
table is 
apple| banana |cat| dog
---|---|---|---
a|b|c|d
## Test Code
## Test Punctuation
English first english,symbol English then
English first chinese，symbolEnglish then
中文先中，符中文后
中文先英,符中文后
中文先,English Then
中文先，English Then
English first,中文后
English first，中文后
## Test Code
### code block
    i am code
### code area
\`\`\`
I am code
\`\`\`
## Test list
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
## Test much line


## Test block
asd\`I need space\`
## Test image
![alt](https://i.am.image.png)
## Test special font
asd***ad***,**asd**,*1*,~~as~~
`
    return c;
}
function resultAllTest() {
    const c = `# I am testFile

## Test table

table is 

| apple | banana | cat | dog |
|-------|--------|-----|-----|
| a     | b      | c   | d   |

## Test Code

## Test Punctuation
English first english, symbol English then
English first chinese, symbolEnglish then
中文先中, 符中文后
中文先英, 符中文后
中文先, English Then
中文先, English Then
English first, 中文后
English first, 中文后

## Test Code

### code block

    i am code

### code area

\`\`\`
I am code
\`\`\`

## Test list

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

## Test much line



## Test block

asd \`I need space\`

## Test image



![alt](https://i.am.image.png)



## Test special font

asd***ad***, **asd**, *1*, ~~as~~


`
    return c;
}
module.exports = {
    generateVsCodeParam,
    exportVsCodeParam,
    getFormatParam,
    generateTimeHeader,
    allTest
}