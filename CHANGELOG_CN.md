# 日志

[English Document](./CHANGELOG.md)

## 0.8.6

- 修复问题: 标题间的空行未被格式化
- 更新 `CHANGELOG.md`

## 0.8.5

- 修复问题: [[Error Format]:TypeError: Cannot read property 'forEach' of null](https://github.com/sumnow/markdown-formatter/issues/28)
- 更新 `CHANGELOG.md`

## 0.8.4

- 修复问题: [引用下的表格](https://github.com/sumnow/markdown-formatter/issues/20)
- 更新 `CHANGELOG.md`

## 0.8.3

- 去除格式化提醒
- 添加可配置空格 `spaceAfterFullWidthOrHalfWidth`
- 更新 `CHANGELOG.md`

## 0.8.2

- 修复问题
- 更新 `CHANGELOG.md`

## 0.8.1

- 修复问题: [2 blank lines added at the end of file, conflicts with markdownlint](https://github.com/sumnow/markdown-formatter/issues/22)
- 修复问题: [能否不要删除code block](https://github.com/sumnow/markdown-formatter/issues/18)

## 0.8.0

- 修复问题: [It's not formatting properly lines that contain regexp](https://github.com/sumnow/markdown-formatter/issues/22)
- 修复问题: [Formatting adds a "*" to Markdown Rules](https://github.com/sumnow/markdown-formatter/issues/23)

## 0.7.9

- 修复问题: [列表接着一级标题格式化出错 #16](https://github.com/sumnow/markdown-formatter/issues/16)
- 更新中英文 `CHANGELOG.md`

## 0.7.8

- 更新中英文 `README.md`
- 更新中英文 `CHANGELOG.md`

## 0.7.7

- 重新上传

## 0.7.6

- 修复问题: [bad formatting for dots](https://github.com/sumnow/markdown-formatter/issues/13) 
- 更新中英文 `CHANGELOG.md`

## 0.7.5

- 修复问题: [格式化错误](https://github.com/sumnow/markdown-formatter/issues/12) 
> 出现问题的原因在于文章中的一级标题会删除顶部的空行,导致格式化代码依赖的空行的被误删.
- 修复问题: 在代码块中以`>`开头会被错误格式化为链接.
- 更新中英文 `CHANGELOG.md`

## 0.7.4

- 修复问题: 格式化连续代码块某些情况下失败.
- 修改snippets的描述
- 更新中英文 `CHANGELOG.md`

## 0.7.3

- 修复问题: 列表格式化某些情况下失败.
- 更新中英文 `CHANGELOG.md`

## 0.7.2

- 修复问题: 列表后的代码可能会格式化失败.
- 更新中英文 `CHANGELOG.md`

## 0.7.1

- 修复问题
- 更新中英文 `CHANGELOG.md`

## 0.7.0

- 修复问题: 在显示时间的时候,标题不会空出额外一行.
- 更新中英文 `CHANGELOG.md`

## 0.6.9

- 修复问题: 格式化加粗,倾斜内的代码块无法正确格式化
- 更新中英文 `CHANGELOG.md`

## 0.6.8

- 更新中英文 `README.md`

## 0.6.7

- 将符号后的多个空格删减为1个
- 添加用半角逗号，替换全角顿号的功能
- 更新中英文 `README.md`
- 更新中英文 `CHANGELOG.md`

## 0.6.6

- 新功能: 文件创建时间戳记录
- 更新中英文 `CHANGELOG.md`

## 0.6.5

- 移除h1之前的空行
- 更新中英文 `CHANGELOG.md`

## 0.6.4

- 代码块中的一个空行被视作连续
- 更新中英文 `README.md` 
- 更新中英文 `CHANGELOG.md`

## 0.6.3

- 添加新 `Snippets`: 'time' 并优化已有的 `Snippets`
- 更新 `CHANGELOG.md`

## 0.6.2

- 行首的反逗号不会空出一格了.
- 更新中英文 `CHANGELOG.md`

## 0.6.1

- 如果`codeAreaToBlock` 是默认值, 不会格式化代码区的内容
- 更新中英文 `README.md` 
- 更新中英文 `CHANGELOG.md`

## 0.6.0

- 删除配置属性 `codeAreaFormat` 
- 更新中英文 `README.md` 
- 更新中英文 `CHANGELOG.md`

## 0.5.9

- 修复问题: 代码块转化偶发的bug
- 优化代码结构
- 更新中英文 `CHANGELOG.md`

## 0.5.8

- 优化代码结构
- 更新中英文 `CHANGELOG.md`


## 0.5.7

- 修复问题： 代码块转代码区的偶发bug
- 更新中英文 `CHANGELOG.md`

## 0.5.6

- 功能: 有序列表序号对齐
- 更新中英文 `CHANGELOG.md`

## 0.5.5

- 修复问题: [半角符号不能转换](https://github.com/sumnow/markdown-formatter/issues/5)
- 修复问题: [格式化操作会破坏`markdown-all-in-one`插件生成的目录](https://github.com/sumnow/markdown-formatter/issues/8)
- 修复问题: [格式化操作会破坏原有链接](https://github.com/sumnow/markdown-formatter/issues/9)
- 更新中英文 `CHANGELOG.md`

## 0.5.4

- 修复问题: [关于嵌套的连接的格式化问题](https://github.com/sumnow/markdown-formatter/issues/7)
- 修复问题: [对于引用区域的格式化是否可以控制不要添加多余的行？](https://github.com/sumnow/markdown-formatter/issues/6)
- 更新中英文 `CHANGELOG.md`

## 0.5.3

- 修复问题: 格式化代码区里的HTML和CSS
- 更新中英文 `CHANGELOG.md`

## 0.5.2

- 修复问题: 特殊情况下， 代码块格式化出现错误。 
- 更新中英文 `CHANGELOG.md`

## 0.5.1

- 新功能: 配置`fullWidthTurnHalfWidth`, 转换全角符号为半角符号 
- 更新中英文 `README.md` 
- 更新中英文 `CHANGELOG.md`

## 0.5.0

- 修复问题： 连续代码区格式化错误
- 更新中英文 `CHANGELOG.md`

## 0.4.9

- 提供转化代码区为代码块的功能
- 更新中英文 `README.md` 
- 更新中英文 `CHANGELOG.md`

## 0.4.8

- 格式化代码块的代码类型
- 更新中英文 `README.md` 
- 更新中英文 `CHANGELOG.md`

## 0.4.7

- 更新中英文 `README.md` 
- 更新中英文 `CHANGELOG.md`

## 0.4.6

- 修复问题: 在最后一行的代码块不会正确格式化
- 更新中英文 `CHANGELOG.md` 

## 0.4.5

- 可以格式化无序列表的符号，如 * > + > -
- 更新中英文 `CHANGELOG.md` 

## 0.4.4

- 修复问题：三级列表不对齐
- 更新中英文 `CHANGELOG.md` 

## 0.4.3

- 全角符号后的空格现在是可选的了！[搞不懂为什么要把全角符号改成半角的](https://github.com/sumnow/markdown-formatter/issues/3)
- 更新中英文 `CHANGELOG.md` 


## 0.4.2

- 快捷输入支持更多的语言，例如 `java` , `python` 等
- 修复在多个代码区中格式化错误的问题
- 更新中英文 `README.md` 
- 更新中英文 `CHANGELOG.md` 

## 0.4.1

- 更新中英文 `README.md` 
- 更新中英文 `CHANGELOG.md` 

## 0.4.0

- 添加代码段功能
- 更新中英文 `README.md` 
- 更新中英文 `CHANGELOG.md` 

## 0.3.4

- 表格上下空出一行
- 图片上下空出一行
- 更新中英文 `README.md` 
- 更新中英文 `CHANGELOG.md` 

## 0.3.3

- 更新 `README.md` 

## 0.3.2

- 优化代码结构
- 更新 `README.md` 
- 提供格式化 `CSS` 和 `HTML` 
- 修复问题

## 0.3.1

- 优化代码结构
- 更新 `README.md` 
- 更新 `CHANGELOG.md` 

## 0.3.0

- 修复问题: [代码块中格式化错误](https://github.com/sumnow/markdown-formatter/issues/1)

## 0.2.9

- 更新 `CHANGLOG.md` 

## 0.2.8

- 更新 `README.md` 中的图片

## 0.2.7

- 更新 `README.md` 
- 支持根据上下文将中文中的符号转换为全角符号, 或者将英文中的转化为半角符 

## 0.2.6

- 更新 `README.md` 
- 正确格式化 `?!.` 

## 0.2.5

- 更新 `README.md` 

## 0.2.4

1. 修复小bug: 偶尔格式化失败. 

## 0.2.3

- 更新 `README.md` 

## 0.2.2

- 修复问题

## 0.2.1

- 避免重复格式化

## 0.2.0

- 更新 `README.md` 

## 0.1.9

- 现在可以正常格式化句号了

## 0.1.8

- 修复问题: 表格中中文字符对齐

## 0.1.7

- 修复问题: list长度大于9时换行

## 0.1.6

- 修复code里的list显示的问题

## 0.1.5

- 提高 `js-beautify` 的显示效果

## 0.1.4

- 修复列表bug

## 0.1.3

- 添加 符号 '? ' 转换为 '?'

## 0.1.2

- 修复问题: 代码区域下的代码块没有被正确格式化

## 0.1.1

- 添加功能: 列表格式化
- 添加功能: 全角, 半角的转换

## 0.1.0

- 修复表格格式化bug

## 0.0.9

- 修复代码区域bug

## 0.0.8

- 是否格式化代码

## 0.0.7

- 修复问题: 代码重复格式化
- 修复问题:  `PC/UNIX` 行尾符号
- 更新 README.md

## 0.0.6

- 修复问题: 引用显示
- 更新README.md和图标

## 0.0.5

- 修复问题

## 0.0.4

- 消除重复空行

## 0.0.3

- 添加标题上下空一行的功能

## 0.0.2

- 修复在代码块中的反逗号问题

## 0.0.1  

- 初始化 `markdown-formatter` 版本

