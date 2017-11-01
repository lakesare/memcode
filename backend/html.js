import { escape } from 'querystring';

const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <title>Memcode</title>
    <link href="/index.css" rel="stylesheet">
    <!-- to verify google webmasters -->
    <meta name="google-site-verification" content="Cv256pnTnFWM0T6qi3SXK1u1K-B6W7IJQ9JoOQ_1I_E"/>
    <!-- to make site look bigger on mobiles -->
    <meta id="meta" name="viewport" content="width=device-width, initial-scale=1.0"/>

    <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32"/>
    <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16"/>

    <!-- data-react-helmet="true" for react-helmet to supersede it instead of adding a new description tag -->
    <meta name="description" content="Create your own course to memorize anything you want. Flashcard-based, with formatting and images, with multiple flashcard types." data-react-helmet="true"/>
  </head>
  <body>
    <div id="root"></div>
    <script>
      window.env = {
        githubSignInLink: 'https://github.com/login/oauth/authorize?scope=user:email&client_id=${process.env['GITHUB_OAUTH_ID']}',
        googleSignInLink: 'https://accounts.google.com/o/oauth2/v2/auth?scope=profile%20email&redirect_uri=${escape(process.env['GOOGLE_OAUTH_CALLBACK'])}&response_type=code&client_id=${process.env['GOOGLE_OAUTH_ID']}'
      };
    </script>
    <script type="text/javascript" src="/index.js"></script>
    <link rel="stylesheet" href="//cdn.quilljs.com/1.2.6/quill.snow.css">
  </html>
`;

export { html };
