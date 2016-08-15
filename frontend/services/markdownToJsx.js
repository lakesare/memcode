import markdown from 'markdown-it';
import jsx from 'markdown-it-jsx';

const md = markdown();
md.use(jsx);

const MarkdownStringToHtmlString = (markdownedString) => {
  const htmlString = md.render(markdownedString);
  return htmlString;
}

const HtmlStringToComponent = (htmlString) => {
  const jsxString = Babel.transform(
    '() => (<div>' + htmlString + '</div>)',
    { presets: ['react', 'es2015'] }
  ).code;

  const jsx = eval(jsxString);
  const component = React.createElement(jsx);
  return component;
}

export { MarkdownStringToHtmlString, HtmlStringToComponent };