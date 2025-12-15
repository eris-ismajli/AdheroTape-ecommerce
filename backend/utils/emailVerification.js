import { transporter } from "./mailer.js";

export async function sendVerificationEmail(email, code) {
  await transporter.sendMail({
    from: `"AdheroTape" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5">
        <h2>Email verification</h2>
        <p>Your verification code is:</p>
        <div style="
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 4px;
          margin: 16px 0;
        ">
          ${code}
        </div>
        <p>This code expires in <b>10 minutes</b>.</p>
        <p>If you didn’t request this, you can ignore this email.</p>
      </div>
    `,
  });
}
