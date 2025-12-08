import nodemailer from 'nodemailer';

let transporter;

const createTransporter = async () => {
  if (transporter) return transporter;

  try {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    console.log('Ethereal Email Configured');
    console.log('User:', testAccount.user);
    console.log('Pass:', testAccount.pass);
  } catch (error) {
    console.error('Failed to create email transporter:', error);
  }
  return transporter;
};

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const emailTransporter = await createTransporter();
    if (!emailTransporter) return;

    const info = await emailTransporter.sendMail({
      from: '"CareerFlow" <no-reply@careerflow.com>', // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
