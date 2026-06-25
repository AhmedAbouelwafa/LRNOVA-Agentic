import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'renderMarkdown', standalone: true })
export class RenderMarkdownPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(md: string): SafeHtml {
    if (!md) return '';
    let html = md;

    // Code blocks (triple backtick)
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="md-code-block"><code>$1</code></pre>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>');

    // H2
    html = html.replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>');
    // H3
    html = html.replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>');
    // H1
    html = html.replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr class="md-hr"/>');

    // Blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>');

    // Tables (simple)
    html = html.replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split('|').filter(c => c.trim() !== '');
      // Skip separator rows
      if (cells.every(c => /^[\s\-:]+$/.test(c))) return '';
      const tds = cells.map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${tds}</tr>`;
    });
    // Wrap consecutive <tr> in <table>
    html = html.replace(/((<tr>.*?<\/tr>\s*)+)/g, '<table class="md-table">$1</table>');

    // Unordered lists
    html = html.replace(/^- (.+)$/gm, '<li class="md-li">$1</li>');
    html = html.replace(/((<li class="md-li">.*?<\/li>\s*)+)/g, '<ul class="md-ul">$1</ul>');

    // Ordered lists  
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="md-oli">$1</li>');
    html = html.replace(/((<li class="md-oli">.*?<\/li>\s*)+)/g, '<ol class="md-ol">$1</ol>');

    // Paragraphs (lines that aren't already wrapped)
    html = html.replace(/^(?!<[a-z])((?!^\s*$).+)$/gm, '<p class="md-p">$1</p>');

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
