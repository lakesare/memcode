import React from 'react';

// import { Draft } from './components/Draft';
import { Problem } from '~/components/Problem';

import { commonFetch } from '~/api/commonFetch';
window.onerror = function (message, url, lineNo, colNo, error) {

   console.log(arguments);

   let container = document.createElement('div');

   container.style.color = 'red';
   container.style.position = 'fixed';
   container.style.background = '#eee';
   container.style.padding = '2em';
   container.style.top = '1em';
   container.style.left = '1em';

   let msg = document.createElement('pre');
   msg.innerText = [
      'Message: ' + message,
      'URL: ' + url,
      'Line: ' + lineNo,
      'Column: ' + colNo,
      'Stack: ' + (error && error.stack)
   ].join('\n');

   container.appendChild(msg);

   document.body.appendChild(container);
};

window.addEventListener("unhandledrejection", function(err, promise) { 
    // handle error here, for example log   

    console.log(err)

    let container = document.createElement('div');

    container.style.color = 'blue';
    container.style.position = 'fixed';
    container.style.background = '#eee';
    container.style.padding = '2em';
    container.style.top = '1em';
    container.style.left = '1em';

    let msg = document.createElement('pre');
    msg.innerText = [
      err.reason.message,
      JSON.stringify(err.reason.stack)
    ].join('\n');

    container.appendChild(msg);

    document.body.appendChild(container);
});


class Page_test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speGetPage: { status: 'initial' }
    };
  }

  render = () =>
    <div>
      {botCheck() ? 'true' : 'false'}<br/>
      {navigator.userAgent} 
    </div>
  
}


function botCheck(){
  var botPattern = "(googlebot\/|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)";
    var re = new RegExp(botPattern, 'i');
    var userAgent = navigator.userAgent;
    if (re.test(userAgent)) {
      return true;
    }else{
      return false;
    }
}

export { Page_test };


// simple draft - okay
// simple fetch /api/pages/courses/5 - okay


