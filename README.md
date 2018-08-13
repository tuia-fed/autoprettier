# Desc

自动根据工程中（已存在的）eslintrc配置以递归形式格式化指定目录

# Install

```shell
npm i @qingf/autoprettier -D

OR

yarn add @qingf/autoprettier -D

OR

pnpm i @qingf/autoprettier -D
```

# Usage


```js
require('@qingf/autoprettier')(require('path').resolve(__dirname, 'client/pages/pro'), /\.(js|jsx)$/)
```

> no need表示该文件符合eslint配置的语法规则；autofixed表示已根据语法规则自动修补
