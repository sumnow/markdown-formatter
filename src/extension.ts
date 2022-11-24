'use strict';
import * as vscode from 'vscode';

import formatted from './format';

// get configure from vscode `markdown-formater` at user's preference file `setting.json`

let config = vscode.workspace.getConfiguration('markdownFormatter');
let fullWidthTurnHalfWidth: string = config.get<string>('fullWidthTurnHalfWidth', 'auto');
let codeAreaToBlock: string = config.get<string>('codeAreaToBlock', '');
let displayTime: boolean = config.get<boolean>('displayTime', false);
let enable: boolean = config.get<boolean>('enable', true);
var formatCodes: boolean = config.get<boolean>('formatCodes', true);
let formatTable: boolean = config.get<boolean>('formatTable', false);
let formatTableOpt: Options.TypeFormatTableOpt = config.get<Options.TypeFormatTableOpt>('formatTableOpt', { chineseCharterWidth: 2 });
let formatOpt: any = config.get<any>('formatOpt', {});
let formatULSymbol: boolean = config.get<boolean>('formatULSymbol', true);
let formatULSymbolOpt: Options.TypeFormatULSymbolOpt = config.get<Options.TypeFormatULSymbolOpt>('formatULSymbolOpt', { "tag": ["*", "+", "-"] });
let spaceAfterFullWidthOrHalfWidth: string = config.get<string>('spaceAfterFullWidthOrHalfWidth', 'half');

vscode.workspace.onDidChangeConfiguration(_ => {
    config = vscode.workspace.getConfiguration('markdownFormatter');
    fullWidthTurnHalfWidth = config.get<string>('fullWidthTurnHalfWidth', 'auto');
    codeAreaToBlock = config.get<string>('codeAreaToBlock', '');
    displayTime = config.get<boolean>('displayTime', false);
    enable = config.get<boolean>('enable', true);
    formatTable = config.get<boolean>('formatTable', false);
    formatTableOpt = config.get<Options.TypeFormatTableOpt>('formatTable', { chineseCharterWidth: 2 });
    formatCodes = config.get<boolean>('formatCodes', true);
    formatOpt = config.get<any>('formatOpt', {});
    formatULSymbol = config.get<boolean>('formatULSymbol', true);
    formatULSymbolOpt = config.get<Options.TypeFormatULSymbolOpt>('formatULSymbolOpt', { "tag": ["*", "+", "-"] });
    spaceAfterFullWidthOrHalfWidth = config.get<string>('spaceAfterFullWidthOrHalfWidth', 'half');
});

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('markdown', {
        provideDocumentFormattingEdits(document, options, token) {
            if (!enable) { return void 0; }

            const result: vscode.TextEdit[] = [];

            const start = new vscode.Position(0, 0);
            const end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
            const range = new vscode.Range(start, end);
            let text = formatted({
                textP: document.getText(range),
                vsParam: {
                    fullWidthTurnHalfWidth,
                    codeAreaToBlock,
                    displayTime,
                    enable,
                    formatCodes,
                    formatTable,
                    formatTableOpt,
                    formatOpt,
                    formatULSymbol,
                    formatULSymbolOpt,
                    spaceAfterFullWidthOrHalfWidth,
                },
                throwError: vscode.window.showInformationMessage,
                otherParam: {
                    date: new Date()
                }
            });

            result.push(new vscode.TextEdit(range, text));
            // vscode.window.showInformationMessage('Formatted text succeeded!');
            return result;
        }
    }));


    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated

    console.log('Congratulations, your extension "markdown-formatter" is now active!');

    // The command has been defined in the README.md file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in README.md
    // let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    // vscode.window.showInformationMessage('Hello World!');
    // });

    // context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}