import transporter from "../config/mail.config";

class MailUtil {
  async sendEmail(to: string, subject: string, html?: string): Promise<void> {
    try {
      await transporter.sendMail({
        from: `Kevin | REST`,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email. Please try again.");
    }
  }
}

export default new MailUtil();
