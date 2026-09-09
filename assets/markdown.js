(function () {
  "use strict";

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function safeHref(value) {
    const href = String(value).trim();
    const normalized = href.toLowerCase().replace(/\s/g, "");
    if (normalized.startsWith("javascript:") || normalized.startsWith("data:")) {
      return "#";
    }
    return escapeHtml(href);
  }

  function inlineMarkdown(value) {
    return escapeHtml(value)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, label, href) {
        return '<a href="' + safeHref(href) + '">' + label + "</a>";
      });
  }

  function renderMarkdown(markdown) {
    const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
    const output = [];
    let index = 0;

    function isBlockStart(line) {
      return /^#{1,6}\s+/.test(line) || /^```/.test(line) || /^>\s?/.test(line) || /^[-*+]\s+/.test(line) || /^\d+\.\s+/.test(line) || /^---+$/.test(line.trim());
    }

    while (index < lines.length) {
      const line = lines[index];

      if (!line.trim()) {
        index += 1;
        continue;
      }

      const fence = line.match(/^```\s*([\w-]*)\s*$/);
      if (fence) {
        const code = [];
        index += 1;
        while (index < lines.length && !/^```\s*$/.test(lines[index])) {
          code.push(lines[index]);
          index += 1;
        }
        index += 1;
        const language = fence[1] ? ' class="language-' + escapeHtml(fence[1]) + '"' : "";
        output.push("<pre><code" + language + ">" + escapeHtml(code.join("\n")) + "</code></pre>");
        continue;
      }

      const heading = line.match(/^(#{1,6})\s+(.+)$/);
      if (heading) {
        const level = heading[1].length;
        output.push("<h" + level + ">" + inlineMarkdown(heading[2]) + "</h" + level + ">");
        index += 1;
        continue;
      }

      if (/^---+$/.test(line.trim())) {
        output.push("<hr />");
        index += 1;
        continue;
      }

      if (/^>\s?/.test(line)) {
        const quote = [];
        while (index < lines.length && /^>\s?/.test(lines[index])) {
          quote.push(lines[index].replace(/^>\s?/, ""));
          index += 1;
        }
        output.push("<blockquote><p>" + inlineMarkdown(quote.join(" ")) + "</p></blockquote>");
        continue;
      }

      const unordered = /^[-*+]\s+/.test(line);
      const ordered = /^\d+\.\s+/.test(line);
      if (unordered || ordered) {
        const tag = ordered ? "ol" : "ul";
        const matcher = ordered ? /^\d+\.\s+/ : /^[-*+]\s+/;
        const items = [];
        while (index < lines.length && matcher.test(lines[index])) {
          items.push("<li>" + inlineMarkdown(lines[index].replace(matcher, "")) + "</li>");
          index += 1;
        }
        output.push("<" + tag + ">" + items.join("") + "</" + tag + ">");
        continue;
      }

      const paragraph = [line.trim()];
      index += 1;
      while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index])) {
        paragraph.push(lines[index].trim());
        index += 1;
      }
      output.push("<p>" + inlineMarkdown(paragraph.join(" ")) + "</p>");
    }

    return output.join("\n");
  }

  function parseFrontMatter(markdown) {
    const normalized = markdown.replace(/\r\n?/g, "\n");
    if (!normalized.startsWith("---\n")) {
      return { attributes: {}, body: normalized };
    }

    const end = normalized.indexOf("\n---\n", 4);
    if (end === -1) {
      return { attributes: {}, body: normalized };
    }

    const attributes = {};
    normalized.slice(4, end).split("\n").forEach(function (line) {
      const separator = line.indexOf(":");
      if (separator > 0) {
        const key = line.slice(0, separator).trim();
        const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
        attributes[key] = value;
      }
    });

    return { attributes: attributes, body: normalized.slice(end + 5) };
  }

  async function fetchMarkdown(path) {
    const response = await fetch(path, { cache: "no-cache" });
    if (!response.ok) {
      throw new Error("Markdown request failed: " + response.status);
    }
    return response.text();
  }

  async function loadMarkdownSections() {
    const sections = document.querySelectorAll("[data-markdown-source]");
    await Promise.all(Array.from(sections).map(async function (section) {
      try {
        const markdown = await fetchMarkdown(section.dataset.markdownSource);
        section.innerHTML = renderMarkdown(markdown);
      } catch (error) {
        section.innerHTML = '<p class="error-message">文章列表加载失败，请通过 GitHub Pages 或本地 HTTP 服务访问。</p>';
      }
    }));
  }

  async function loadArticle() {
    const target = document.querySelector("[data-article-content]");
    if (!target) return;

    const name = new URLSearchParams(window.location.search).get("name") || "";
    if (!/^[a-z0-9-]+$/.test(name)) {
      target.innerHTML = '<p class="error-message">文章地址无效。</p>';
      return;
    }

    try {
      const markdown = await fetchMarkdown("../source/" + name + ".md");
      const parsed = parseFrontMatter(markdown);
      const title = parsed.attributes.title || "未命名文章";
      const date = parsed.attributes.date || "";
      const description = parsed.attributes.description || "";
      const meta = date;

      document.title = title + "｜胡战捷";
      const descriptionElement = document.querySelector('meta[name="description"]');
      if (descriptionElement && description) descriptionElement.content = description;

      target.innerHTML =
        '<header class="article-header"><h1>' + escapeHtml(title) + "</h1>" +
        (meta ? '<p class="article-meta">' + escapeHtml(meta) + "</p>" : "") +
        "</header>" + renderMarkdown(parsed.body);
    } catch (error) {
      target.innerHTML = '<p class="error-message">文章加载失败，请检查文章文件是否存在。</p>';
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    loadMarkdownSections();
    loadArticle();
  });
})();
