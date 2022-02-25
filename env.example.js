// When you import 'env.js', this code gets executed, and variables get added to your environment.
// (http://thewebivore.com/super-simple-environment-variables-node-js).

// Github Signups
process.env['GITHUB_OAUTH_ID'] = '';     // Required for local development
process.env['GITHUB_OAUTH_SECRET'] = ''; // Required for local development

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

process.env['DB_USER'] = '';     // Required for local development
process.env['DB_PASSWORD'] = ''; // Required for local development

process.env['SENDGRID_API_KEY'] = '';
