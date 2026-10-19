# 牧泽销售通讯录（静态站）

河北牧泽农牧机械有限公司 · 销售服务通讯录。买青贮机、花生播种机、铺膜播种机，按区域对接 8 名业务员。

- 纯静态站点，无需服务器、无需数据库。
- 数据内嵌于 `data.js`，浏览器本地按省份/城市检索。
- 免费托管于 GitHub Pages：https://wytq-da88.github.io/muze-sales/

## 本地预览
直接用浏览器打开 `index.html` 即可（或 `python -m http.server`）。

## 更新数据
编辑 `data.js` 中的 `window.MUZE_DATA.managers`，提交并推送即可，GitHub Pages 会自动发布。

## 检索逻辑
`app.js` 内置省份→城市展开、城市→省份反查，以及「X（除A、B）」排除语义。
