import sendgrid from '@sendgrid/mail';

sendgrid.setApiKey(process.env['SENDGRID_API_KEY']);
