import brevo from "@getbrevo/brevo";

const sendVerificationEmail = async (to, code) => {
  try {
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: "SugVoyage",
      email: "hanzhmagbal@gmail.com",
    };

    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.subject = "SugVoyage - Verify Your Email";
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">SugVoyage</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Explore Cebu Like Never Before</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 22px; text-align: center;">
            Verify Your Email Address
          </h2>
          
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 30px;">
            Welcome to SugVoyage! Use the verification code below to complete your registration and start exploring Cebu.
          </p>
          
          <!-- Verification Code -->
          <div style="background: #fef2f2; border: 2px solid #fecaca; border-radius: 10px; padding: 20px; text-align: center; margin: 30px 0;">
            <div style="font-size: 32px; font-weight: bold; color: #dc2626; letter-spacing: 8px;">
              ${code}
            </div>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 20px 0;">
            This code will expire in <strong>10 minutes</strong>.
          </p>
          
          <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
              If you didn't create a SugVoyage account, please ignore this email.
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8fafc; padding: 20px; text-align: center;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            © 2025 SugVoyage. All rights reserved.<br>
            Cebu's Smart Travel Companion
          </p>
        </div>
      </div>
    `;

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    console.error("Brevo API error:", error);

    // More detailed error logging
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }

    return {
      success: false,
      message: "Failed to send verification email. Please try again.",
    };
  }
};

export default sendVerificationEmail;
