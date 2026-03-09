import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const legalDir = path.join(rootDir, 'legal');

const pageMap = {
  privacy: {
    source: path.join(legalDir, 'privacy.md'),
    outputDir: path.join(rootDir, 'privacy'),
    title: 'Privacy Policy'
  },
  terms: {
    source: path.join(legalDir, 'terms.md'),
    outputDir: path.join(rootDir, 'terms'),
    title: 'Terms and Conditions'
  }
};

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const parseInlineMarkdown = (line) => {
  let html = escapeHtml(line);
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');
  return html;
};

const markdownToHtml = (markdown) => {
  const lines = markdown.split(/\r?\n/);
  const chunks = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      chunks.push('</ul>');
      inList = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      closeList();
      continue;
    }

    if (line.startsWith('# ')) {
      closeList();
      chunks.push(`<h1>${parseInlineMarkdown(line.slice(2).trim())}</h1>`);
      continue;
    }

    if (line.startsWith('## ')) {
      closeList();
      chunks.push(`<h2>${parseInlineMarkdown(line.slice(3).trim())}</h2>`);
      continue;
    }

    if (line.startsWith('### ')) {
      closeList();
      chunks.push(`<h3>${parseInlineMarkdown(line.slice(4).trim())}</h3>`);
      continue;
    }

    if (line.startsWith('- ')) {
      if (!inList) {
        chunks.push('<ul>');
        inList = true;
      }
      chunks.push(`<li>${parseInlineMarkdown(line.slice(2).trim())}</li>`);
      continue;
    }

    closeList();
    chunks.push(`<p>${parseInlineMarkdown(line)}</p>`);
  }

  closeList();
  return chunks.join('\n');
};

const buildPageHtml = ({ title, bodyHtml }) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Wolds Record | ${title}</title>
    <meta name="robots" content="index,follow" />
    <link rel="canonical" href="https://placeholder-domain.example/${title === 'Privacy Policy' ? 'privacy' : 'terms'}" />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <header class="site-header" aria-label="Top navigation">
      <div class="container nav-wrap">
        <p class="brand">Wolds Record</p>
        <a class="button button-secondary" href="/">Back to homepage</a>
      </div>
    </header>

    <main class="section" id="main-content">
      <article class="container narrow legal-content">
        ${bodyHtml}
      </article>
    </main>

    <footer class="site-footer" aria-label="Footer">
      <div class="container footer-wrap">
        <p class="small">&copy; <span id="year"></span> Wolds Canine Ltd. All rights reserved.</p>
      </div>
    </footer>

    <script>
      document.getElementById('year').textContent = new Date().getFullYear();
    </script>
  </body>
</html>
`;

const buildAllLegalPages = async () => {
  for (const page of Object.values(pageMap)) {
    const markdown = await fs.readFile(page.source, 'utf8');
    const bodyHtml = markdownToHtml(markdown);
    const fullHtml = buildPageHtml({ title: page.title, bodyHtml });

    await fs.mkdir(page.outputDir, { recursive: true });
    await fs.writeFile(path.join(page.outputDir, 'index.html'), fullHtml, 'utf8');
  }

  console.log('Built legal pages from markdown sources.');
};

buildAllLegalPages().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
