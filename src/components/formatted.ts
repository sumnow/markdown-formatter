export interface FormattedParams {
    needRegs: Array<RegExp>;
    removeRegs?: Array<RegExp>;
    formatOption?: Object;
}
export interface FormatFunction {
    text: string,
    formatted(args: FormattedParams): string;
}
