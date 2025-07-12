import { azureEmailService } from "./email.service";
import { twilioSMSService } from "./twilio-sms.service";
import { logInfo, logError } from "../../utils/logger";

interface Property {
    id: string;
    title: string;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    price: number;
    address: string;
    city: string;
    state: string;
}

interface NotificationData {
    property: Property;
    action: "APPROVE" | "REJECT" | "VERIFY" | "UNVERIFY" | "FLAG";
    message: string;
    adminName?: string;
    reviewDate?: string;
    reason?: string;
}

export class PropertyNotificationService {
    // Send property status update notifications
    static async sendPropertyStatusNotification(data: NotificationData): Promise<{
        emailSent: boolean;
        smsSent: boolean;
        errors: string[];
    }> {
        const errors: string[] = [];
        let emailSent = false;
        let smsSent = false;

        try {
            // Send email notification
            emailSent = await this.sendEmailNotification(data);
            if (!emailSent) {
                errors.push("Failed to send email notification");
            }
        } catch (error) {
            logError("Email notification failed", error as Error, {
                propertyId: data.property.id,
            });
            errors.push(`Email error: ${(error as Error).message}`);
        }

        try {
            // Send SMS notification
            smsSent = await this.sendSMSNotification(data);
            if (!smsSent) {
                errors.push("Failed to send SMS notification");
            }
        } catch (error) {
            logError("SMS notification failed", error as Error, {
                propertyId: data.property.id,
            });
            errors.push(`SMS error: ${(error as Error).message}`);
        }

        logInfo("Property notification sent", {
            propertyId: data.property.id,
            action: data.action,
            emailSent,
            smsSent,
            errorCount: errors.length,
        });

        return { emailSent, smsSent, errors };
    }

    // Send email notification
    private static async sendEmailNotification(
        data: NotificationData
    ): Promise<boolean> {
        const { property, action, message, adminName, reviewDate, reason } = data;

        const subject = this.getEmailSubject(action, property.title);
        const htmlContent = this.generateEmailHTML(data);
        const textContent = this.generateEmailText(data);

        try {
            const result = await azureEmailService.sendEmail({
                to: [property.ownerEmail],
                subject,
                htmlContent,
                textContent,
            });

            return result.success;
        } catch (error) {
            logError("Failed to send property status email", error as Error, {
                propertyId: property.id,
                ownerEmail: property.ownerEmail,
                action,
            });
            return false;
        }
    }

    // Send SMS notification
    private static async sendSMSNotification(
        data: NotificationData
    ): Promise<boolean> {
        const { property, action } = data;

        const smsMessage = this.generateSMSMessage(data);

        try {
            return await twilioSMSService.sendSMS({
                to: property.ownerPhone,
                body: smsMessage,
            });
        } catch (error) {
            logError("Failed to send property status SMS", error as Error, {
                propertyId: property.id,
                ownerPhone: property.ownerPhone,
                action,
            });
            return false;
        }
    }

    // Generate email subject
    private static getEmailSubject(
        action: string,
        propertyTitle: string
    ): string {
        switch (action) {
            case "APPROVE":
                return `✅ Property Approved: ${propertyTitle}`;
            case "REJECT":
                return `❌ Property Rejected: ${propertyTitle}`;
            case "VERIFY":
                return `🔐 Property Verified: ${propertyTitle}`;
            case "UNVERIFY":
                return `⚠️ Property Verification Removed: ${propertyTitle}`;
            case "FLAG":
                return `🚩 Property Flagged for Review: ${propertyTitle}`;
            default:
                return `Property Status Update: ${propertyTitle}`;
        }
    }

    // Generate email HTML content
    private static generateEmailHTML(data: NotificationData): string {
        const { property, action, message, adminName, reviewDate, reason } = data;

        const actionColor = this.getActionColor(action);
        const actionIcon = this.getActionIcon(action);
        const actionText = this.getActionText(action);

        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Property Status Update</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f5f5f5; 
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
          }
          .header { 
            background: ${actionColor}; 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 { 
            margin: 0; 
            font-size: 24px; 
            font-weight: 600; 
          }
          .content { 
            padding: 40px 30px; 
          }
          .property-card {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid ${actionColor};
          }
          .property-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 15px 0;
          }
          .detail-item {
            display: flex;
            align-items: center;
            font-size: 14px;
          }
          .detail-label {
            font-weight: 600;
            margin-right: 8px;
            color: #666;
          }
          .message-box {
            background: #e3f2fd;
            border: 1px solid #bbdefb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .reason-box {
            background: #ffebee;
            border: 1px solid #ffcdd2;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
          }
          .button {
            display: inline-block;
            background: ${actionColor};
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
          }
          .footer { 
            text-align: center; 
            color: #6c757d; 
            font-size: 14px; 
            padding: 20px 30px; 
            background-color: #f8f9fa;
            border-top: 1px solid #e9ecef;
          }
          .status-badge {
            display: inline-block;
            background: ${actionColor};
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${actionIcon} Property ${actionText}</h1>
          </div>
          <div class="content">
            <p style="font-size: 16px; margin-bottom: 20px;">Dear ${property.ownerName
            },</p>
            
            <p>Your property listing has been <strong>${actionText.toLowerCase()}</strong> by our admin team.</p>
            
            <div class="property-card">
              <h3 style="margin: 0 0 15px 0; color: #333;">${property.title
            }</h3>
              <div class="status-badge">${actionText}</div>
              
              <div class="property-details">
                <div class="detail-item">
                  <span class="detail-label">Price:</span>
                  <span>₹${this.formatPrice(property.price)}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Location:</span>
                  <span>${property.city}, ${property.state}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Property ID:</span>
                  <span>#${property.id}</span>
                </div>
                ${reviewDate
                ? `
                <div class="detail-item">
                  <span class="detail-label">Review Date:</span>
                  <span>${reviewDate}</span>
                </div>
                `
                : ""
            }
              </div>
            </div>
            
            ${message
                ? `
            <div class="message-box">
              <h4 style="margin: 0 0 10px 0; color: #1976d2;">Message from Admin Team:</h4>
              <p style="margin: 0; color: #333;">${message}</p>
            </div>
            `
                : ""
            }
            
            ${reason
                ? `
            <div class="reason-box">
              <h4 style="margin: 0 0 10px 0; color: #d32f2f;">Reason:</h4>
              <p style="margin: 0; color: #333;">${reason}</p>
            </div>
            `
                : ""
            }
            
            ${adminName
                ? `
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              Reviewed by: <strong>${adminName}</strong>
            </p>
            `
                : ""
            }
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">
                View Dashboard
              </a>
            </div>
            
            <p style="margin-top: 30px;">
              If you have any questions or concerns, please contact our support team.
            </p>
            
            <p style="margin-top: 20px;">
              Best regards,<br>
              <strong>2bigha Admin Team</strong>
            </p>
          </div>
          <div class="footer">
            <p>This is an automated message from our property management system.</p>
            <p>Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    }

    // Generate email text content
    private static generateEmailText(data: NotificationData): string {
        const { property, action, message, adminName, reviewDate, reason } = data;
        const actionText = this.getActionText(action);

        return `
Property ${actionText}

Dear ${property.ownerName},

Your property listing has been ${actionText.toLowerCase()} by our admin team.

Property Details:
- Title: ${property.title}
- Price: ₹${this.formatPrice(property.price)}
- Location: ${property.city}, ${property.state}
- Property ID: #${property.id}
${reviewDate ? `- Review Date: ${reviewDate}` : ""}

${message
                ? `
Admin Message:
${message}
`
                : ""
            }

${reason
                ? `
Reason:
${reason}
`
                : ""
            }

${adminName ? `Reviewed by: ${adminName}` : ""}

View your dashboard: ${process.env.FRONTEND_URL}/dashboard

If you have any questions or concerns, please contact our support team.

Best regards,
2bigha Admin Team

---
This is an automated message from our property management system.
Please do not reply to this email.
    `;
    }

    // Generate SMS message
    private static generateSMSMessage(data: NotificationData): string {
        const { property, action, message } = data;
        const actionText = this.getActionText(action);

        let smsText = `🏠 2bigha: Your property "${property.title
            }" has been ${actionText.toLowerCase()}.`;

        if (message && message.length < 100) {
            smsText += ` ${message}`;
        }

        smsText += ` Check your dashboard: ${process.env.FRONTEND_URL}/manage`;

        // Ensure SMS is under 160 characters for single SMS
        if (smsText.length > 160) {
            smsText = `🏠 2bigha ${actionText.toLowerCase()}: "${property.title
                }". Check dashboard: ${process.env.FRONTEND_URL}/manage`;
        }

        return smsText;
    }

    // Helper methods
    private static getActionColor(action: string): string {
        switch (action) {
            case "APPROVE":
                return "#4caf50";
            case "REJECT":
                return "#f44336";
            case "VERIFY":
                return "#2196f3";
            case "UNVERIFY":
                return "#ff9800";
            case "FLAG":
                return "#ff5722";
            default:
                return "#6c757d";
        }
    }

    private static getActionIcon(action: string): string {
        switch (action) {
            case "APPROVE":
                return "✅";
            case "REJECT":
                return "❌";
            case "VERIFY":
                return "🔐";
            case "UNVERIFY":
                return "⚠️";
            case "FLAG":
                return "🚩";
            default:
                return "📋";
        }
    }

    private static getActionText(action: string): string {
        switch (action) {
            case "APPROVE":
                return "Approved";
            case "REJECT":
                return "Rejected";
            case "VERIFY":
                return "Verified";
            case "UNVERIFY":
                return "Unverified";
            case "FLAG":
                return "Flagged";
            default:
                return "Updated";
        }
    }

    private static formatPrice(price: number): string {
        if (price >= 10000000) {
            return `${(price / 10000000).toFixed(1)}Cr`;
        } else if (price >= 100000) {
            return `${(price / 100000).toFixed(1)}L`;
        } else {
            return price.toLocaleString();
        }
    }

    // Send bulk notifications for multiple properties
    static async sendBulkPropertyNotifications(
        notifications: NotificationData[]
    ): Promise<{
        totalSent: number;
        emailsSent: number;
        smsSent: number;
        errors: string[];
    }> {
        const results = {
            totalSent: 0,
            emailsSent: 0,
            smsSent: 0,
            errors: [] as string[],
        };

        for (const notification of notifications) {
            try {
                const result = await this.sendPropertyStatusNotification(notification);

                if (result.emailSent) results.emailsSent++;
                if (result.smsSent) results.smsSent++;
                if (result.emailSent || result.smsSent) results.totalSent++;

                results.errors.push(...result.errors);
            } catch (error) {
                results.errors.push(
                    `Failed to send notification for property ${notification.property.id
                    }: ${(error as Error).message}`
                );
            }

            // Add delay between notifications to avoid rate limiting
            await new Promise((resolve) => setTimeout(resolve, 500));
        }

        logInfo("Bulk property notifications completed", {
            totalNotifications: notifications.length,
            totalSent: results.totalSent,
            emailsSent: results.emailsSent,
            smsSent: results.smsSent,
            errorCount: results.errors.length,
        });

        return results;
    }
}

// Export singleton instance
export const propertyNotificationService = PropertyNotificationService;
