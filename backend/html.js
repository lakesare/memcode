import { escape } from 'querystring';

const googleAnalyticsScriptTag = process.env['NODE_ENV'] === 'production' ?
  `
    <!-- https://analytics.google.com/analytics/web/?authuser=0#management/Settings/a109178648w163012947p163935248/%3Fm.page%3DTrackingCode%26_r.ghFlowId%3D6324039/ -->
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script src="https://www.googletagmanager.com/gtag/js?id=UA-109178648-1" async></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());

      gtag('config', 'UA-109178648-1');
    </script>
  ` :
  '';

const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <title>Memcode</title>

    <!-- css -->
    <link href="/index.css?cacheBust-1" rel="stylesheet">

    <!-- katex support -->
    <link rel="stylesheet" href="/nonNpmLibraries/katex.min.css"/>
    <script src="/nonNpmLibraries/katex.min.js"></script>

    <!-- to verify google webmasters -->
    <meta name="google-site-verification" content="Cv256pnTnFWM0T6qi3SXK1u1K-B6W7IJQ9JoOQ_1I_E"/>
    <!-- to make site look bigger on mobiles -->
    <meta id="meta" name="viewport" content="width=device-width, initial-scale=1.0"/>

    <!-- as per https://realfavicongenerator.net/favicon_result?file_id=p1cd8gt6qj1kvp121l103k18gh1u4c6#.WvYIatOuzhM -->
    <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32"/>
    <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16"/>
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ba2490">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="msapplication-TileColor" content="#9f00a7">
    <meta name="theme-color" content="#ffffff">

    <!-- data-react-helmet="true" for react-helmet to supersede it instead of adding a new description tag -->
    <meta name="description" content="Create your own course to memorize anything you want. Flashcard-based, with formatting and images, with multiple flashcard types." data-react-helmet="true"/>
  </head>
  <body>
    <div id="root"></div>

    <!-- env vars -->
    <script>
      window.env = {
        githubSignInLink: 'https://github.com/login/oauth/authorize?scope=user:email&client_id=${process.env['GITHUB_OAUTH_ID']}',
        googleSignInLink: 'https://accounts.google.com/o/oauth2/v2/auth?scope=profile%20email&redirect_uri=${escape(process.env['GOOGLE_OAUTH_CALLBACK'])}&response_type=code&client_id=${process.env['GOOGLE_OAUTH_ID']}',
        contactEmail: 'contact@memcode.com'
      };
    </script>

    <!-- main js file -->
    <script type="text/javascript" src="/index.js?cacheBust-1" defer></script>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet">

    ${googleAnalyticsScriptTag}
  </html>
`;

export default html;
