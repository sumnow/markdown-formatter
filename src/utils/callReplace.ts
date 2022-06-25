
export default function callReplace({ text, exp, target }: { text: string, exp: RegExp | string, target: string }): string {
    console.log(`RegExp is ${exp.toString()} === === === === ===`);
    console.log(`current file: `);
    // console.log(text)

    const targetText = text.replace(exp, target);

    console.log('will be:');
    // console.log(targetText)
    return targetText;
}