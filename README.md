# WhaleTag_Page

本项目是 **WhaleTag** 的 GitHub Pages 使用说明站点,纯静态 HTML/CSS/JS。

## 访问地址

部署后可通过以下链接访问:

```
https://FE-Berserker.github.io/WhaleTag_Page
```

## 本地预览

因为只是静态文件,直接用浏览器打开 `index.html` 即可,或者起一个本地静态服务器:

```bash
cd WhaleTag_Page
npx serve .
```

## 如何启用 GitHub Pages

1. 打开 GitHub 仓库:https://github.com/FE-Berserker/WhaleTag_Page
2. 进入 **Settings → Pages**
3. Source 选择 **Deploy from a branch**
4. Branch 选择 **main**,文件夹选择 **/(root)**
5. 点击 **Save**,稍等片刻即可通过上方域名访问

## 目录说明

```
WhaleTag_Page/
├── index.html              # 首页
├── css/style.css           # 全局样式
├── js/app.js               # 移动端导航
├── pages/                  # 各功能说明页
│   ├── getting-started.html
│   ├── file-browser.html
│   ├── tagging.html
│   ├── perspectives.html
│   ├── search.html
│   ├── themes.html
│   ├── extensions.html
│   └── ai-assistant.html
└── README.md               # 本文件
```

## 添加截图

在 `pages/*.html` 中有多处 `<div class="screenshot-placeholder">...</div>` 占位。把 WhaleTag 实际界面截图放到合适位置,替换为 `<img src="../images/xxx.png" alt="...">` 即可。

## 修改内容

直接编辑对应 `.html` 文件即可。站点框架已经搭好,后续按需补充文字和截图。
