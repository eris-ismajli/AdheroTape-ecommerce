import { transporter } from "./mailer.js";

export async function sendReceiptEmail({
  email,
  customerName,
  orderId,
  items,
  shippingAddress,
  total,
  paymentMethod,
}) {
  // Generate the HTML for the items table
  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 4px 8px;">${item.title}</td>
      <td style="padding: 4px 8px; text-align:center;">${item.quantity}</td>
      <td style="padding: 4px 8px; text-align:right;">
        $${parseFloat(item.price_raw.replace(/[^0-9.]/g, "")).toFixed(2)}
      </td>
    </tr>
  `
    )
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
      <h2 style="color:#FBBF24;">Thank you for your purchase, ${customerName} 🎉</h2>
      <p>Your order <b>#${orderId}</b> has been confirmed. A receipt is below:</p>

      <h3>Order Summary:</h3>
      <table style="width:100%; border-collapse: collapse;">
        <thead>
          <tr style="background:#FBBF24; color:#000;">
            <th style="padding:4px 8px;">Item</th>
            <th style="padding:4px 8px;">Qty</th>
            <th style="padding:4px 8px;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <p style="text-align:right; font-weight:bold;">Total: $${total.toFixed(
        2
      )}</p>

      <h3>Shipping Address:</h3>
      <p>
        ${shippingAddress.fullName}<br/>
        ${shippingAddress.address}<br/>
        ${shippingAddress.city}, ${shippingAddress.state} ${
    shippingAddress.zip
  }<br/>
        ${shippingAddress.country}<br/>
        Email: ${email}
      </p>

      <h3>Payment Details:</h3>
      <p>Paid with: ${paymentMethod}</p>

      <p style="margin-top:20px; font-size:0.9em; color:#555;">
        If you have any questions, contact us at <a href="mailto:support@adherotape.com">support@adherotape.com</a>.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"AdheroTape" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your Receipt - Order #${orderId}`,
    html,
  });
}
