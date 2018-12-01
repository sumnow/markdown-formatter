# markdown-formatter

[CN](#介绍)
[EN](#Introduction)

## 介绍

这是个面向开发者的文档（markdown）开发工具，为`markdown`使用者提供了相对统一的格式。

## 使用手册

安装完成以后，你需要重新启动你的vscode。

在任何`.md`为后缀的`markdown`标准文件中，都可以使用 `shift+option+f` 快速格式化代码。

![example.gif](images/example.gif)

**注意** 它并不会修复你的markdown语法错误，例如作为标题,`#`后没有加空格，这是因为在代码中#是一个可用字符，广泛得用作注释或变量声明。

## 主要功能

- `。;；！、？：`这些符号后添加一个空格；
- `,，`后一个空格，同一为半角符(可选)；
- 反逗号前后空一格；
- 标题上下空出一行；
- 代码块上下空出一行；
- 表格自动对齐；
- 为引用上下空出一行；
- 会格式化代码块中代码，依据`js-beautify`工具，目前只有`javascript`语言；
- 相邻的空行合并

> 在`settings.json` 可以配置js格式化规则.

## 测试版本

VSCode 版本 1.29.1 (macOS Mojave)

## 配置

    enable = config.get<boolean>('enable', true); // 是否启用格式化
    commaEN = config.get<boolean>('commaEN', false); // 是否统一符号
    formatOpt = config.get<any>('formatOpt', {}); // 是否格式化代码或者配置beautifyjs(false: 不格式化代码，{}: 配置beautifyjs)

配置beautifyjs, 可以参考[这里](https://github.com/beautify-web/js-beautify)

## 联系

如果你有任何想法,请联系我

email: mydiamervin@gmail.com

或者

[这里](https://github.com/sumnow/markdown-formatter/issues)

---

## Introduction

This is a developer-oriented markdown development tool that provides a relatively uniform format for the `markdown` user.

## Instructions

After the installation is complete, you will need to restart your vscode.

In any `markdown` standard file with a `.md` suffix, you can use `shift+option+f` to quickly format the code.

> PS: It does not fix your markdown syntax errors, for example, there is no space after `#` as a title , because in the code # is a usable character that is widely used as a comment or variable declaration.

## Function

- For `。 ；;！ ？ ：`Add a space after these symbols;
- Provide a space for `,，` , unify it as a half-width character(Optional);
- a space before and after the back-quote;
- Empty a line for the title;
- Empty a line for the code block;
- The table is aligned automatically;
- Empty a line for the link block;
- Will format the code, by `js-beautify` tool, currently only the `javascript` language;
- erase dulicated line

> The js formatting rules can be configured in `settings.json`.

## Software version

VSCode version 1.29.1 (macOS Mojave)

## Config

    enable = config.get<boolean>('enable', true); // enable/disable markdown-formatter
    commaEN = config.get<boolean>('commaEN', false); // unity to ','
    formatOpt = config.get<any>('formatOpt', {}); // enable/disable format code or config beautifyjs(false: disable format code , {}: config beautifyjs)

How to config beautifyjs, you can click[here](https://github.com/beautify-web/js-beautify)

## Contact

If you have any ideas, please contact me.

email: mydiamervin@gmail.com

or

[here](https://github.com/sumnow/markdown-formatter/issues)
