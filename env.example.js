// Database
//
// To create these values, follow the steps for creating your postgres database from the Readme.md.
process.env['DB_USER'] = 'memcode';
process.env['DB_PASSWORD'] = 'memcode';

// Github Signups
//
// To create these values, go to https://github.com/settings/developers and
// 1. click "New Oauth App"
// 2. fill in the values with anything you like, but, importantly:
//    Homepage URL: http://localhost:3000
//    Authorization callback URL: http://localhost:3000/api/auth/github/callback
// 3. Copy "Client ID" (this will give you 'GITHUB_OAUTH_ID') and "Generate a new client secret" (this will give you 'GITHUB_OAUTH_SECRET').
process.env['GITHUB_OAUTH_ID'] = '';
process.env['GITHUB_OAUTH_SECRET'] = '';

// Google Signups
process.env['GOOGLE_OAUTH_ID'] = '';
process.env['GOOGLE_OAUTH_SECRET'] = '';
process.env['GOOGLE_OAUTH_CALLBACK'] = 'http://localhost:3000/api/auth/google/callback';

// For image uploads (we upload images to Amazon S3)
process.env['AWS_ACCESS_KEY_ID'] = '';
process.env['AWS_SECRET_ACCESS_KEY'] = '';
process.env['AWS_REGION'] = '';
process.env['AWS_BUCKET_NAME'] = '';

process.env['CONTACT_EMAIL'] = 'contact@memcode.com';

process.env['JWT_SECRET'] = 'can_be_anything';

// ES module export (even though we don't use it, it makes it a proper ES module)
export default {};
