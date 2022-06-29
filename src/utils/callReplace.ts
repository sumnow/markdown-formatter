
export default function callReplace({ text, exp, target }: { text: string, exp: RegExp | string, target: string }): string {

    const targetText = text.replace(exp, target);

    return targetText;
}