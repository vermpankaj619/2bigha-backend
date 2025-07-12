import { EmailClient, KnownEmailSendStatus } from "@azure/communication-email"
import { logError, logInfo } from "../../utils/logger"
import dotenv from 'dotenv'
dotenv.config()

interface AzureEmailConfig {
  connectionString: string
  fromAddress: string
  fromDisplayName: string
}

interface EmailOptions {
  to: string[]
  subject: string
  htmlContent: string
  textContent?: string
  attachments?: EmailAttachment[]
}

interface EmailAttachment {
  name: string
  contentType: string
  contentInBase64: string
}

interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

export class AzureEmailService {
  private emailClient: EmailClient
  private fromAddress: string
  private fromDisplayName: string

  constructor() {
    const config: AzureEmailConfig = {
      connectionString: process.env.AZURE_COMMUNICATION_CONNECTION_STRING || "",
      fromAddress: process.env.AZURE_EMAIL_FROM_ADDRESS || "noreply@yourdomain.com",
      fromDisplayName: process.env.AZURE_EMAIL_FROM_NAME || "2bigha Admin",
    }

    if (!config.connectionString) {
      throw new Error("AZURE_COMMUNICATION_CONNECTION_STRING is required")
    }

    this.emailClient = new EmailClient(config.connectionString)
    this.fromAddress = config.fromAddress
    this.fromDisplayName = config.fromDisplayName
  }

  // Send OTP email using Azure Communication Services
  async sendOTPEmail(email: string, otp: string, type: string): Promise<boolean> {
    try {
      const subject = this.getOTPSubject(type)
      const htmlContent = this.generateOTPEmailHTML(otp, type)
      const textContent = this.generateOTPEmailText(otp, type)

      const result = await this.sendEmail({
        to: [email],
        subject,
        htmlContent,
        textContent,
      })

      if (result.success) {
        logInfo(`OTP email sent successfully via Azure`, {
          email,
          type,
          messageId: result.messageId,
        })
        return true
      } else {
        logError("Failed to send OTP email via Azure", new Error(result.error || "Unknown error"), {
          email,
          type,
        })
        return false
      }
    } catch (error) {
      logError("Azure OTP email service error", error as Error, { email, type })
      return false
    }
  }

  // Send welcome email
  async sendWelcomeEmail(email: string, firstName: string): Promise<boolean> {
    try {
      const subject = "Welcome to 2bigha"
      const htmlContent = this.generateWelcomeEmailHTML(firstName)
      const textContent = this.generateWelcomeEmailText(firstName)

      const result = await this.sendEmail({
        to: [email],
        subject,
        htmlContent,
        textContent,
      })

      if (result.success) {
        logInfo(`Welcome email sent successfully via Azure`, {
          email,
          messageId: result.messageId,
        })
        return true
      } else {
        logError("Failed to send welcome email via Azure", new Error(result.error || "Unknown error"), {
          email,
        })
        return false
      }
    } catch (error) {
      logError("Azure welcome email service error", error as Error, { email })
      return false
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    try {
      const subject = "Password Reset Request"
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
      const htmlContent = this.generatePasswordResetEmailHTML(resetUrl)
      const textContent = this.generatePasswordResetEmailText(resetUrl)

      const result = await this.sendEmail({
        to: [email],
        subject,
        htmlContent,
        textContent,
      })

      if (result.success) {
        logInfo(`Password reset email sent successfully via Azure`, {
          email,
          messageId: result.messageId,
        })
        return true
      } else {
        logError("Failed to send password reset email via Azure", new Error(result.error || "Unknown error"), {
          email,
        })
        return false
      }
    } catch (error) {
      logError("Azure password reset email service error", error as Error, { email })
      return false
    }
  }

  // Send email verification
  async sendEmailVerification(email: string, verificationUrl: string): Promise<boolean> {
    try {
      const subject = "Verify Your Email Address"
      const htmlContent = this.generateEmailVerificationHTML(verificationUrl)
      const textContent = this.generateEmailVerificationText(verificationUrl)

      const result = await this.sendEmail({
        to: [email],
        subject,
        htmlContent,
        textContent,
      })

      if (result.success) {
        logInfo(`Email verification sent successfully via Azure`, {
          email,
          messageId: result.messageId,
        })
        return true
      } else {
        logError("Failed to send email verification via Azure", new Error(result.error || "Unknown error"), {
          email,
        })
        return false
      }
    } catch (error) {
      logError("Azure email verification service error", error as Error, { email })
      return false
    }
  }

  // Send bulk notification emails
  async sendBulkNotificationEmail(
    emails: string[],
    subject: string,
    htmlContent: string,
    textContent?: string,
  ): Promise<{ success: number; failed: number; results: EmailResult[] }> {
    const results: EmailResult[] = []
    let successCount = 0
    let failedCount = 0

    // Process emails in batches to avoid rate limits
    const batchSize = 10
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize)

      const batchPromises = batch.map(async (email) => {
        try {
          const result = await this.sendEmail({
            to: [email],
            subject,
            htmlContent,
            textContent,
          })

          if (result.success) {
            successCount++
          } else {
            failedCount++
          }

          results.push(result)
          return result
        } catch (error) {
          failedCount++
          const errorResult: EmailResult = {
            success: false,
            error: (error as Error).message,
          }
          results.push(errorResult)
          return errorResult
        }
      })

      await Promise.all(batchPromises)

      // Add delay between batches to respect rate limits
      if (i + batchSize < emails.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    logInfo(`Bulk email completed`, {
      totalEmails: emails.length,
      successful: successCount,
      failed: failedCount,
    })

    return { success: successCount, failed: failedCount, results }
  }

  // Generic email sender using Azure Communication Services
  public async sendEmail(options: EmailOptions): Promise<EmailResult> {
    try {
      const emailMessage = {
        senderAddress: this.fromAddress,
        content: {
          subject: options.subject,
          html: options.htmlContent,
          plainText: options.textContent || this.stripHtml(options.htmlContent),
        },
        recipients: {
          to: options.to.map((email) => ({ address: email })),
        },
        attachments: options.attachments || [],
      }

      const poller = await this.emailClient.beginSend(emailMessage)
      const result = await poller.pollUntilDone()

      if (result.status === KnownEmailSendStatus.Succeeded) {
        return {
          success: true,
          messageId: result.id,
        }
      } else {
        return {
          success: false,
          error: `Email send failed with status: ${result.status}`,
        }
      }
    } catch (error) {
      logError("Azure email send error", error as Error)
      return {
        success: false,
        error: (error as Error).message,
      }
    }
  }

  // Get email delivery status
  async getEmailStatus(messageId: string): Promise<any> {
    try {
      // const status = await this.emailClient.getSendStatus(messageId)
      // return status
    } catch (error) {
      logError("Failed to get email status", error as Error, { messageId })
      return null
    }
  }

  // Test Azure email service connection
  async testConnection(): Promise<boolean> {
    try {
      // Send a test email to verify connection
      const testResult = await this.sendEmail({
        to: [process.env.TEST_EMAIL || "test@example.com"],
        subject: "Azure Email Service Test",
        htmlContent: "<p>This is a test email from Azure Communication Services.</p>",
        textContent: "This is a test email from Azure Communication Services.",
      })

      if (testResult.success) {
        logInfo("Azure email service connection test successful", {
          messageId: testResult.messageId,
        })
        return true
      } else {
        logError("Azure email service connection test failed", new Error(testResult.error || "Unknown error"))
        return false
      }
    } catch (error) {
      logError("Azure email service connection test error", error as Error)
      return false
    }
  }

  // Utility method to strip HTML tags for plain text
  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim()
  }

  // Get OTP email subject based on type
  private getOTPSubject(type: string): string {
    switch (type) {
      case "LOGIN_2FA":
        return "Your Login Verification Code"
      case "PASSWORD_RESET":
        return "Password Reset Verification Code"
      case "EMAIL_VERIFICATION":
        return "Email Verification Code"
      case "ACCOUNT_RECOVERY":
        return "Account Recovery Code"
      default:
        return "Your Verification Code"
    }
  }

  // Generate OTP email HTML
  private generateOTPEmailHTML(otp: string, type: string): string {
    const title = this.getOTPSubject(type)
    const message = this.getOTPMessage(type)

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
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
          .otp-container {
            text-align: center;
            margin: 30px 0;
          }
          .otp-code { 
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); 
            color: white; 
            font-size: 36px; 
            font-weight: bold; 
            text-align: center; 
            padding: 20px; 
            margin: 20px auto; 
            letter-spacing: 8px;
            border-radius: 12px;
            display: inline-block;
            min-width: 200px;
            box-shadow: 0 4px 15px rgba(30, 60, 114, 0.3);
          }
          .warning { 
            background: #fff3cd; 
            border: 1px solid #ffeaa7; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 25px 0; 
            border-left: 4px solid #f39c12;
          }
          .warning-title {
            font-weight: bold;
            color: #856404;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
          }
          .warning ul {
            margin: 10px 0 0 0;
            padding-left: 20px;
            color: #856404;
          }
          .footer { 
            text-align: center; 
            color: #6c757d; 
            font-size: 14px; 
            padding: 20px 30px; 
            background-color: #f8f9fa;
            border-top: 1px solid #e9ecef;
          }
          .brand {
            font-weight: 600;
            color: #495057;
          }
          .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #dee2e6, transparent);
            margin: 30px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 ${title}</h1>
          </div>
          <div class="content">
            <p style="font-size: 16px; margin-bottom: 20px;">Hello,</p>
            <p style="font-size: 16px; line-height: 1.6;">${message}</p>
            
            <div class="otp-container">
              <div class="otp-code">${otp}</div>
            </div>
            
            <div class="divider"></div>
            
            <div class="warning">
              <div class="warning-title">
                ⚠️ Security Notice
              </div>
              <ul>
                <li>This code expires in <strong>10 minutes</strong></li>
                <li>Never share this code with anyone</li>
                <li>If you didn't request this, please ignore this email</li>
                <li>Our team will never ask for this code via phone or email</li>
              </ul>
            </div>
            
            <p style="margin-top: 30px;">If you have any questions or concerns, please contact our support team immediately.</p>
            
            <p style="margin-top: 20px;">
              Best regards,<br>
              <span class="brand">2bigha Admin Team</span>
            </p>
          </div>
          <div class="footer">
            <p>This is an automated security message from Azure Communication Services.</p>
            <p>Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  // Generate OTP email text version
  private generateOTPEmailText(otp: string, type: string): string {
    const title = this.getOTPSubject(type)
    const message = this.getOTPMessage(type)

    return `
${title}

Hello,

${message}

Your verification code is: ${otp}

SECURITY NOTICE:
- This code expires in 10 minutes
- Never share this code with anyone
- If you didn't request this, please ignore this email
- Our team will never ask for this code via phone or email

If you have any questions or concerns, please contact our support team immediately.

Best regards,
2bigha Admin Team

---
This is an automated security message from Azure Communication Services.
Please do not reply to this email.
    `
  }

  // Get OTP message based on type
  private getOTPMessage(type: string): string {
    switch (type) {
      case "LOGIN_2FA":
        return "You are attempting to log in to your admin account. Please use the verification code below to complete your login process:"
      case "PASSWORD_RESET":
        return "You have requested to reset your password. Please use the verification code below to proceed with the password reset:"
      case "EMAIL_VERIFICATION":
        return "Please verify your email address using the verification code below:"
      case "ACCOUNT_RECOVERY":
        return "You have requested account recovery. Please use the verification code below to recover your account:"
      default:
        return "Please use the verification code below to complete your request:"
    }
  }

  // Generate welcome email HTML
  private generateWelcomeEmailHTML(firstName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to 2bigha</title>
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
            background: linear-gradient(135deg, #00b894 0%, #00a085 100%); 
            color: white; 
            padding: 40px 20px; 
            text-align: center; 
          }
          .content { 
            padding: 40px 30px; 
          }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #00b894 0%, #00a085 100%); 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 8px; 
            margin: 25px 0; 
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(0, 184, 148, 0.3);
            transition: transform 0.2s;
          }
          .features {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
          }
          .features ul {
            margin: 0;
            padding-left: 20px;
          }
          .features li {
            margin: 10px 0;
            font-size: 15px;
          }
          .footer { 
            text-align: center; 
            color: #6c757d; 
            font-size: 14px; 
            padding: 20px 30px; 
            background-color: #f8f9fa;
            border-top: 1px solid #e9ecef;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to 2bigha!</h1>
          </div>
          <div class="content">
            <p style="font-size: 18px; font-weight: 600;">Hello ${firstName},</p>
            
            <p>Welcome to the 2bigha! Your account has been successfully created and you now have access to our comprehensive management system.</p>
            
            <div class="features">
              <p><strong>🚀 What you can do with your new account:</strong></p>
              <ul>
                <li>📊 View comprehensive analytics and detailed reports</li>
                <li>🏠 Manage property listings and handle approvals</li>
                <li>👥 Administer user accounts and permissions</li>
                <li>📝 Create and manage blog content</li>
                <li>⚙️ Configure system settings and preferences</li>
                <li>📧 Send notifications and communications</li>
                <li>🔐 Manage security settings and access controls</li>
              </ul>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/login" class="button">Access Your Dashboard</a>
            </div>
            
            <p style="margin-top: 30px;">If you have any questions or need assistance getting started, please don't hesitate to contact our support team. We're here to help you make the most of your admin portal.</p>
            
            <p style="margin-top: 20px;">
              Best regards,<br>
              <strong>2bigha Admin Team</strong>
            </p>
          </div>
          <div class="footer">
            <p>Powered by Azure Communication Services</p>
            <p>This email was sent to you because an admin account was created for your email address.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  // Generate welcome email text version
  private generateWelcomeEmailText(firstName: string): string {
    return `
Welcome to 2bigha!

Hello ${firstName},

Welcome to the 2bigha! Your account has been successfully created and you now have access to our comprehensive management system.

What you can do with your new account:
- View comprehensive analytics and detailed reports
- Manage property listings and handle approvals
- Administer user accounts and permissions
- Create and manage blog content
- Configure system settings and preferences
- Send notifications and communications
- Manage security settings and access controls

Access your dashboard: ${process.env.FRONTEND_URL}/login

If you have any questions or need assistance getting started, please don't hesitate to contact our support team. We're here to help you make the most of your admin portal.

Best regards,
2bigha Admin Team

---
Powered by Azure Communication Services
This email was sent to you because an admin account was created for your email address.
    `
  }

  // Generate password reset email HTML
  private generatePasswordResetEmailHTML(resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
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
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
          }
          .content { 
            padding: 40px 30px; 
          }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 8px; 
            margin: 25px 0; 
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
          }
          .url-box {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            word-break: break-all;
            font-family: monospace;
            border-left: 4px solid #e74c3c;
            margin: 20px 0;
          }
          .warning { 
            background: #fff3cd; 
            border: 1px solid #ffeaa7; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 25px 0; 
            border-left: 4px solid #f39c12;
          }
          .footer { 
            text-align: center; 
            color: #6c757d; 
            font-size: 14px; 
            padding: 20px 30px; 
            background-color: #f8f9fa;
            border-top: 1px solid #e9ecef;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            
            <p>You have requested to reset your password for your 2bigha Admin account. Click the button below to create a new password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Your Password</a>
            </div>
            
            <p>If the button doesn't work, copy and paste this link in your browser:</p>
            <div class="url-box">${resetUrl}</div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul>
                <li>This link expires in <strong>1 hour</strong></li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Your current password will remain unchanged until you create a new one</li>
                <li>For security reasons, this link can only be used once</li>
              </ul>
            </div>
            
            <p>If you continue to have problems or didn't request this password reset, please contact our support team immediately.</p>
            
            <p>Best regards,<br><strong>2bigha Admin Team</strong></p>
          </div>
          <div class="footer">
            <p>Powered by Azure Communication Services</p>
            <p>This is an automated security message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  // Generate password reset email text version
  private generatePasswordResetEmailText(resetUrl: string): string {
    return `
Password Reset Request

Hello,

You have requested to reset your password for your 2bigha Admin account. 

To reset your password, copy and paste this link in your browser:
${resetUrl}

SECURITY NOTICE:
- This link expires in 1 hour
- If you didn't request this reset, please ignore this email
- Your current password will remain unchanged until you create a new one
- For security reasons, this link can only be used once

If you continue to have problems or didn't request this password reset, please contact our support team immediately.

Best regards,
2bigha Admin Team

---
Powered by Azure Communication Services
This is an automated security message. Please do not reply to this email.
    `
  }

  // Generate email verification HTML
  private generateEmailVerificationHTML(verificationUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email Address</title>
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
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
          }
          .content { 
            padding: 40px 30px; 
          }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 8px; 
            margin: 25px 0; 
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
          }
          .url-box {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            word-break: break-all;
            font-family: monospace;
            border-left: 4px solid #3498db;
            margin: 20px 0;
          }
          .info { 
            background: #e3f2fd; 
            border: 1px solid #bbdefb; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 25px 0; 
            border-left: 4px solid #2196f3;
          }
          .footer { 
            text-align: center; 
            color: #6c757d; 
            font-size: 14px; 
            padding: 20px 30px; 
            background-color: #f8f9fa;
            border-top: 1px solid #e9ecef;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 Verify Your Email Address</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            
            <p>Thank you for creating an account with 2bigha Platform! To complete your registration and secure your account, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p>If the button doesn't work, copy and paste this link in your browser:</p>
            <div class="url-box">${verificationUrl}</div>
            
            <div class="info">
              <strong>ℹ️ Important Information:</strong>
              <ul>
                <li>This verification link expires in <strong>24 hours</strong></li>
                <li>You won't be able to access all features until your email is verified</li>
                <li>If you didn't create an account, please ignore this email</li>
                <li>This link can only be used once</li>
              </ul>
            </div>
            
            <p>Once verified, you'll have full access to browse properties, connect with agents, and manage your account preferences.</p>
            
            <p>If you need help or have questions, please contact our support team.</p>
            
            <p>Best regards,<br><strong>2bigha Platform Team</strong></p>
          </div>
          <div class="footer">
            <p>Powered by Azure Communication Services</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  // Generate email verification text version
  private generateEmailVerificationText(verificationUrl: string): string {
    return `
Verify Your Email Address

Hello,

Thank you for creating an account with 2bigha Platform! To complete your registration and secure your account, please verify your email address.

Verification Link:
${verificationUrl}

IMPORTANT INFORMATION:
- This verification link expires in 24 hours
- You won't be able to access all features until your email is verified
- If you didn't create an account, please ignore this email
- This link can only be used once

Once verified, you'll have full access to browse properties, connect with agents, and manage your account preferences.

If you need help or have questions, please contact our support team.

Best regards,
2bigha Platform Team

---
Powered by Azure Communication Services
This is an automated message. Please do not reply to this email.
    `
  }
}

// Export singleton instance
export const azureEmailService = new AzureEmailService()
