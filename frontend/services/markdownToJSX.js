import markdown from 'markdown-it';
import jsx from 'markdown-it-jsx';

const md = markdown();
md.use(jsx);

const MarkdownToJSX = (markdownedText=[], answers=[]) => {
  const markdownCompileResult = md.render(markdownedText);
  const babelCompileResult = Babel.transform(
    '() => (<div>' + markdownCompileResult + '</div>)',
    { presets: ['react', 'es2015'] }
  ).code;

  return babelCompileResult;
}

export { MarkdownToJSX };