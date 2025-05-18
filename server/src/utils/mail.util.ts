import transporter from "../config/mail.config";
import { InternalServerErrorException } from "../exceptions/internal-server-error.exception";
import logger from "./logger.util";

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
      logger.error("Error sending email:", error);
      throw new InternalServerErrorException("Failed to send email. Please try again.");
    }
  }
}

export default new MailUtil();
