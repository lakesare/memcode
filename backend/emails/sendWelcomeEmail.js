import sendgrid from '#~/emails/sendgrid';

const sendWelcomeEmail = (email) => {
  const msg = {
    to: email,
    from: 'contact@memcode.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    html: 'RIIIGHT??? <strong>and easy to do anywhere, even with Node.js</strong>',
  };
  return sendgrid.send(msg);
};

export default sendWelcomeEmail;
