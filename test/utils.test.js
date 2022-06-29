const assert = require('assert');
const callReplace = require('../out/src/utils/callReplace').default;
const onReplace = require('../out/src/utils/handlerReplace').default;
const formatted = require('../out/src/format').default;
const removeReplace = require('../out/src/utils/removeReplace').removeReplace;
const { getFormatParam, generateTimeHeader, allTest, generateVsCodeParam } = require('./test.params')

function getTemp1() {
    return generateVsCodeParam({
        codeAreaToBlock: ""
        , displayTime: true
        , enable: true
        , formatCodes: true
        , formatOpt: { indent_size: 4 }
        , formatTable: true
        , formatULSymbol: true
        , fullWidthTurnHalfWidth: "，：；！“”‘’（）？。"
        , spaceAfterFullWidthOrHalfWidth: "half"
    })
}

function getTemp2() {
    return generateVsCodeParam({
        codeAreaToBlock: "js"
        , displayTime: false
        , enable: true
        , formatCodes: true
        , formatOpt: {}
        , formatTable: true
        , formatULSymbol: true
        , fullWidthTurnHalfWidth: "，：；！“”‘’（）？。"
        , spaceAfterFullWidthOrHalfWidth: "half"
    })
}


const _local_time = new Date();


describe('[*]Test utils function', () => {
    it('test callReplace function', () => {
        assert.equal(callReplace({ text: 'I am test', exp: /est/g, target: `op` }), `I am top`);
    });

    it(`test handle time function (no use yet)`, () => {
        assert.equal(
            formatted(getFormatParam(`# asd`, { date: _local_time }, {displayTime: true})),
            generateTimeHeader(_local_time, `# asd`)
        )
    });

    it(`test handle replace function`, () => {
        assert.equal(onReplace(`Do test`, / t/g, ` gu`), `Do guest`);
    });

    it(`test removeReplace function`, () => {
        assert.equal(removeReplace({
            text: `
It was the best of times, it was the worst of times, 
it was the age of wisdom, it was the age of foolishness, 
it was the epoch of belief, it was the epoch of incredulity, 
it was the season of Light, it was the season of Darkness, 
it was the spring of hope, it was the winter of despair.


we had everything before us, we had nothing before us, 
we were all going direct to Heaven, we were all going direct the other way
--in short, the period was so far like the present period, that some of its noisiest authorities insisted on its being received, for good or for evil, in the superlative degree of comparison only.`,
            reg: [/was/g, /of/g],
            func: function doNothing(t) { return t.replace(/was/g, 'is') },
        }), `
It was the best of times, it was the worst of times, 
it was the age of wisdom, it was the age of foolishness, 
it was the epoch of belief, it was the epoch of incredulity, 
it was the season of Light, it was the season of Darkness, 
it was the spring of hope, it was the winter of despair.


we had everything before us, we had nothing before us, 
we were all going direct to Heaven, we were all going direct the other way
--in short, the period was so far like the present period, that some of its noisiest authorities insisted on its being received, for good or for evil, in the superlative degree of comparison only.`)
    });
});


