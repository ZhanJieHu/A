# Personal Homepage

一个不依赖构建工具的纯静态 GitHub Pages 个人主页。

## 目录

- `index.html`：主页框架，自动加载 Writing 列表
- `articles/article.html`：所有文章共用的页面框架
- `source/index.md`：主页上的 Writing 列表
- `source/article-*.md`：文章标题、日期、简介和正文
- `assets/style.css`：主页与文章共用样式
- `assets/markdown.js`：在浏览器中读取并渲染 Markdown

## 更新文章

修改已有文章时，只需要编辑对应的 `source/article-*.md`。

新增文章时：

1. 在 `source/` 新建 Markdown 文件，例如 `article-4.md`。
2. 在文件顶部填写标题、日期和简介：

   ```md
   ---
   title: 文章标题
   date: 2026 年 9 月 9 日
   description: 一句话简介。
   ---
   ```

3. 在 `source/index.md` 增加文章入口，链接格式为：

   ```md
   [文章标题](articles/article.html?name=article-4)
   ```

不需要为新文章创建 HTML 页面。

## 本地预览

页面通过 `fetch` 读取 Markdown，因此不能直接双击 `index.html` 预览。请在项目目录启动任意静态 HTTP 服务，或发布到 GitHub Pages 后访问。

项目不需要安装依赖或执行构建命令。根目录中的 `.nojekyll` 会让 GitHub Pages 原样发布 Markdown 文件，供页面读取。
