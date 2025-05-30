const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendApprovalEmail = async (licenseNumber, name, deviceId, adminEmail) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: 'New Device License Approval Request',
      text: `A new device is requesting access.\n\nLicense Number: ${licenseNumber}\nName: ${name}\nDevice ID: ${deviceId}\n\nPlease approve or deny this request via the admin dashboard at https://tmcybertech.netlify.app/admin/licenses.`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Approval email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send approval email');
  }
};

module.exports = { sendApprovalEmail };