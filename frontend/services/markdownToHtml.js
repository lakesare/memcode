import markdown from 'markdown-it';

const md = markdown();
md.use(jsx);

const MarkdownToHtml = (markdownedString) => {
  const htmlString = md.render(markdownedString);
  return htmlString;
}

export { MarkdownToHtml };