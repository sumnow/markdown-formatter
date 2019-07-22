# markdown-formatter

[English Document](./README.md)

## 介绍

这是个提高markdown写作效率的工具, 不仅为 `markdown` 使用者提供了相对统一的格式, 并且提供了一些快捷功能. 

## 使用手册

安装完成以后, 你可能需要重新启动你的vscode. 

在任何 `.md` 为后缀的 `markdown` 标准文件中, 都可以使用 `shift+option+f` 快速格式化代码. 

![example.gif](https://raw.githubusercontent.com/sumnow/markdown-formatter/master/images/example.gif)

> 它并不会修复你的 `markdown` 语法错误, 例如作为标题, `#` 后没有加空格, 这是因为在代码中#是一个可用字符, 广泛得用作注释或变量声明. 

## 功能

### 代码段部分

#### 插入图片

键入 `img` 

![img](./images/example-img.gif)

#### 插入表格

键入 `tab` 

![img](./images/example-tab.gif)

#### 插入代码

键入 `js` , `html` , `css` , `python` , `go` , `java` , or `code` 

![img](./images/example-code.gif)

#### 插入列表

键入 `ul` 或者 `ol` 

![img](./images/example-list.gif)

### 格式化部分

#### 标点符号

* `，,。;；！、？：` 这些符号后添加一个空格; 
* `，：；！“”‘’（）？。` , 转换为半角符(可选); 
* 支持根据上下文将中文后的符号转换为全角符号, 或者将英文后的转化为半角符; 
* `.!?` 后如果是大写的英文字母或者中文会添加一个空格; 
* 反逗号前后空一格, 反逗号内的内容不会被格式化; 

#### 空行

* 标题上下空出一行; 
* 代码块上下空出一行; 
* 为引用上下空出一行; 
* 相邻的空行合并; 

#### 表格

表格自动对齐

![alt](./images/example-tab_format.gif)

#### 列表

##### 无序列表符号格式化

将 `*` , `+` , `-` 按照层级关系标记

``` markdown

* 大标题
    + 中标题
        - 小标题

```

![alt](./images/example-list_format.gif)

#### 代码格式化

* 依据配置会格式化文章中的代码, 使用 `js-beautify` 工具, 目前只有 `javascript` , `html` 和 `css` 语言; 

##### 代码区

function sayHello() {
  console.log('hello')
}

如果 `codeAreaFormat` 为 `true` (默认值), 会被格式化. 

##### 代码块

``` lang
function sayHello() {console.log('hello')}
```

1. 如果 `lang` 为 `js` 或者 `javascript` 或者为空, 会按照js语法格式化 
2. 如果 `lang` 为 `html` , 会按照html语法格式化. 
3. 如果 `lang` 为 `css` , 会按照css语法格式化. 
4. 如果你很少写入js代码, *你可以通过配置参数 `formatOpt` 为false来禁止代码块和代码区的自动格式化代码*. 

> 可以通过配置参数 `formatOpt` 更改js格式化规则, 参照[js-beautify](https://github.com/beautify-web/js-beautify).

> 代码块可以清晰标记出语言的类型，因此推荐使用代码块，可以配置 `codeAreaToBlock` 来设置转换方式

## 配置

```typescript
// 是否启用格式化
enable = config.get <boolean> ('enable', true); 
// 是否自动格式化代码区
codeAreaFormat = config.get<boolean>('codeAreaFormat', true); 
// 将配置里的全角符号转化为半角符号, 例如 `，：；！“”‘’（）？。` 
// 当设置为 'auto' 的时候, 自动根据上下文转换符号
// 当设置为 '_' 或者 '' 的时候, 不转换符号
fullWidthTurnHalfWidth = config.get<string>('fullWidthTurnHalfWidth', 'auto'); 
// 转换代码块为代码区，默认为''（空字符）,不转换
// 可以设置为任意合法字符串
// 只有设置成js或者javascript，才会按照js语言语法格式化
codeAreaToBlock = config.get<string>('codeAreaToBlock', '');
// 是否格式化代码或者配置js-beautify
// false: 不格式化代码
// {}: beautifyjs的配置设置
formatOpt = config.get <any> ('formatOpt', {}); 
// 格式化无序列表的符号 
// * > + > -
formatULSymbol = config.get<boolean>('formatULSymbol', true); 
// 全角符号后是否需要空格
spaceAfterFullWidth = config.get<boolean>('spaceAfterFullWidth', false); 
```

配置 `js-beautify` , 可以参考[这里](https://github.com/beautify-web/js-beautify)

你可以参考我的配置方法: 

```js
// markdown-formatter conf
"markdownFormatter.codeAreaFormat:": true,
"markdownFormatter.fullWidthTurnHalfWidth": "auto",
// "markdownFormatter.fullWidthTurnHalfWidth": "，：；！“”‘’（）？。",
"markdownFormatter.formatOpt": {
  "indent_size": 2
},
"[markdown]": {
  // 自动保存
  "editor.formatOnSave": true,
  // 显示空格
  "editor.renderWhitespace": "all",
  // 快速补全
  "editor.quickSuggestions": {
    "other": true,
    "comments": true,
    "strings": true
  },
  "editor.snippetSuggestions": "top",
  "editor.tabCompletion": "on",
  "editor.acceptSuggestionOnEnter": "on"
}
```

## 开发环境

#### 开发版本

VSCode 版本 1.29.1 (macOS Mojave)

#### 测试版本

VSCode 版本 1.33.1 (macOS Mojave)

## 联系

如果你有任何想法, 请联系我. 

如果你知道如何使用前端库格式化其他语言, 欢迎告诉我. 

email: mydiamervin@gmail.com 或者 [这里](https://github.com/sumnow/markdown-formatter/issues)
