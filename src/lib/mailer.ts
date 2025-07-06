import nodemailer from 'nodemailer';

/**
 * Create a Nodemailer transporter using Gmail credentials
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Email template for booking confirmation
 * @param bookingData - The booking data to include in the email
 * @returns HTML string for the email
 */
export const bookingConfirmationTemplate = (bookingData: {
  bookingId: string;
  packageName: string;
  startDate: string;
  numberOfPeople: number;
  totalAmount: number;
  customerName: string;
}) => {
  const { bookingId, packageName, startDate, numberOfPeople, totalAmount, customerName } = bookingData;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4a6f8a;">Booking Confirmation</h1>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p>Dear ${customerName},</p>
        <p>Thank you for booking with Budh Bhraman! Your travel adventure is confirmed.</p>
      </div>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <h2 style="color: #4a6f8a; margin-top: 0;">Booking Details</h2>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p><strong>Package:</strong> ${packageName}</p>
        <p><strong>Start Date:</strong> ${startDate}</p>
        <p><strong>Number of People:</strong> ${numberOfPeople}</p>
        <p><strong>Total Amount:</strong> ₹${totalAmount.toLocaleString('en-IN')}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p>We're excited to have you join us! If you have any questions or need to make changes to your booking, please contact us.</p>
        <p>Happy travels!</p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #777; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Budh Bhraman. All rights reserved.</p>
      </div>
    </div>
  `;
};

/**
 * Send an email
 * @param options - Email options including recipient, subject, and HTML content
 * @returns The Nodemailer send response
 */
export const sendEmail = async (options: { to: string; subject: string; html: string }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Budh Bhraman" <${process.env.GMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

export default transporter;