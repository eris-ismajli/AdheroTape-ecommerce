import DealerData from "../data/dealer-data.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

class DealerService {
  async submit(form) {
    if (
      !form.company_name ||
      !form.contact_name ||
      !form.email ||
      !form.phone
    ) {
      throw new Error("Required fields missing");
    }

    const id = await DealerData.save(form);

    await transporter.sendMail({
      from: `"AdheroTape" <${process.env.EMAIL_USER}>`,
      to: process.env.TARGET_EMAIL,
      subject: "New Dealer / Wholesaler Application",
      html: `
        <h2>New Application Received</h2>
        <p><b>Company:</b> ${form.company_name}</p>
        <p><b>Name:</b> ${form.contact_name}</p>
        <p><b>Email:</b> ${form.email}</p>
        <p><b>Phone:</b> ${form.phone}</p>
        <p><b>Type:</b> ${form.business_type}</p>
        <p><b>Message:</b> ${form.message || "None"}</p>
      `,
    });

    return { success: true, id };
  }
}

export default new DealerService();
