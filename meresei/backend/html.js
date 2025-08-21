// We should check if it works, can be checked here https://analytics.google.com/analytics/web/?authuser=0#/a109178648w163012947p163935248/admin/property/create
const googleAnalyticsScriptTag = process.env['NODE_ENV'] === 'production' ?
  `
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-S07F4K3Z57"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-S07F4K3Z57');
    </script>
  ` :
  '';

const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <title>Meresei</title>

    <!-- css -->
    <link href="/index.css" rel="stylesheet">

    <!-- to make site look bigger on mobiles -->
    <meta id="meta" name="viewport" content="width=device-width, initial-scale=1.0"/>

    <!-- as per https://realfavicongenerator.net/favicon_result?file_id=p1cd8gt6qj1kvp121l103k18gh1u4c6#.WvYIatOuzhM -->
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">

    <meta name="msapplication-TileColor" content="#9f00a7">

    <!-- data-react-helmet="true" for react-helmet to supersede it instead of adding a new description tag -->
    <meta name="description" content="Non-24 sleep wake disorder calendar" data-react-helmet="true"/>
  </head>
  <body>
    <div id="root"></div>

    <script type="text/javascript" src="/index.js" defer></script>

    ${googleAnalyticsScriptTag}
  </html>
`;

export default html;
