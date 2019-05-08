# markdown-formatter

[EN](#Introduction) or [中文](#介绍）

---

## Introduction

This is a developer-oriented markdown development tool that provides a relatively uniform format for the `markdown` user.

## Instructions

After the installation is complete, you will need to restart your vscode.

In any `markdown` standard file with a `.md` suffix, you can use `shift+option+f` to quickly format the code.

![example.gif](https://github.com/sumnow/markdown-formatter/blob/master/images/example.gif)

> PS: It does not fix your markdown syntax errors, for example, there is no space after `#` as a title , because in the code # is a usable character that is widely used as a comment or variable declaration.

## Feature

- For `，,。;；！、？：` add a space after these symbols; 
- `，：；！“”‘’（）？。` , unify it as a half-width character(Optional); 
- Supports converting Chinese symbols into full-width symbols according to context, or converting English into half-width symbols; 
- `.!?` add a space after these symbols, if before uppercases or chineses; 
- a space before and after the back-quote, which wrapped by back-quote will not be formatted; 
- Empty a line for the title; 
- Empty a line for the code block; 
- The table is aligned automatically; 
- Empty a line for the link block; 
- erase dulicated line; 
- Format the code, by `js-beautify` tool, currently only the `javascript` language; 

### code area

    function sayHello() {
        console.log('hello')
    }

Will always be formatted according to js syntax, if `codeAreaFormat` is `true` (default)

### code block

``` lang
function sayHello() {console.log('hello')}
```

If `lang` is `js` or `javascript` or empty, it will be formatted according to js syntax. *You can disable code block or code area autoformat code by setting the parameter `formatOpt` to false*.

> The js formatting rules can be configured in `settings.json` .

## Software version

#### develop version

VSCode version 1.29.1 (macOS Mojave)

#### test version

VSCode version 1.33.1 (macOS Mojave)

## Config

```typescript
// enable/disable markdown-formatter
enable = config.get <boolean> ('enable', true); 
// automatically format the code area or not
codeAreaFormat = config.get<boolean>('codeAreaFormat', true); 
// fullwidth character translate into halfwidth character. Automatically convert symbols based on context when set to false
charactersTurnHalf = config.get<any>('charactersTurnHalf', false); 
// enable/disable format code or config beautifyjs(false: disable format code , {}: config beautifyjs)
formatOpt = config.get <any> ('formatOpt', {}); 
```

How to config `beautifyjs` , you can click[here](https://github.com/beautify-web/js-beautify)

## Contact

If you have any ideas, please contact me.

email: mydiamervin@gmail.com

or

[here](https://github.com/sumnow/markdown-formatter/issues)

---

## 介绍

这是个面向开发者的文档（markdown)开发工具， 为 `markdown` 使用者提供了相对统一的格式。 

## 使用手册

安装完成以后， 你需要重新启动你的vscode. 

在任何 `.md` 为后缀的 `markdown` 标准文件中， 都可以使用 `shift+option+f` 快速格式化代码。 

![example.gif](https://github.com/sumnow/markdown-formatter/blob/master/images/example.gif)

> 它并不会修复你的 `markdown` 语法错误， 例如作为标题， `#` 后没有加空格， 这是因为在代码中#是一个可用字符， 广泛得用作注释或变量声明。 

## 功能

- `，,。;；！、？：` 这些符号后添加一个空格； 
- `，：；！“”‘’（）？。` , 转换为半角符（可选）; 
- 支持根据上下文将中文中的符号转换为全角符号， 或者将英文中的转化为半角符； 
- `.!?` 后如果是大写的英文字母或者中文会添加一个空格； 
- 反逗号前后空一格， 反逗号内的内容不会被格式化； 
- 标题上下空出一行； 
- 代码块上下空出一行； 
- 表格自动对齐； 
- 为引用上下空出一行； 
- 相邻的空行合并； 
- 依据配置会格式化代码块中代码， 依据 `js-beautify` 工具， 目前只有 `javascript` 语言； 

### 代码区

    function sayHello() {
        console.log('hello')
    }

总是会被按照js语法格式化， 如果 `codeAreaFormat` 为 `true` (默认值）

### 代码块

``` lang
function sayHello() {console.log('hello')}
```

如果 `lang` 为 `js` 或者 `javascript` 或者为空， 会按照js语法格式化， 如果你很少写入js代码， *你可以通过配置参数 `formatOpt` 为false来禁止代码块或者代码区的自动格式化代码*. 

此外， 还可以通过配置参数 `formatOpt` 更改js格式化规则， 参照[js-beautify](https://github.com/beautify-web/js-beautify).

## 测试版本

#### 开发版本

VSCode 版本 1.29.1 (macOS Mojave)

#### 测试版本

VSCode 版本 1.33.1 (macOS Mojave)

## 配置

```typescript
// 是否启用格式化
enable = config.get <boolean> ('enable', true); 
// 是否自动格式化代码区
codeAreaFormat = config.get<boolean>('codeAreaFormat', true); 
// 将配置里的全角符号转化为半角符号， 例如 `，：；！“”‘’（）？。` ， 当设置为false的时候， 自动根据上下文转换符号
charactersTurnHalf = config.get<any>('charactersTurnHalf', false); 
// 是否格式化代码或者配置js-beautify(false: 不格式化代码， {}: 配置beautifyjs)
formatOpt = config.get <any> ('formatOpt', {}); 
```

配置 `js-beautify` , 可以参考[这里](https://github.com/beautify-web/js-beautify)

## 联系

如果你有任何想法， 请联系我

email: mydiamervin@gmail.com

或者

[这里](https://github.com/sumnow/markdown-formatter/issues)

