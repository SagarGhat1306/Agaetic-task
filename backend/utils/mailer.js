// sends email over SMTP. if SMTP isn't configured we just skip it
const nodemailer = require("nodemailer");

const isConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const transporter = isConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT || 465) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

async function sendLoginDetails({ name, email, password, isReset }) {
  if (!transporter) return false;

  const loginUrl = (process.env.CLIENT_URL || "http://localhost:5173").split(",")[0] + "/login";
  const subject = isReset ? "Your new Employee Directory password" : "Your Employee Directory login";
  const intro = isReset
    ? "Your password has been reset by an admin."
    : "An admin has created an Employee Directory account for you.";

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: email,
      subject,
      text: `Hi ${name},\n\n${intro}\n\nLogin page: ${loginUrl}\nEmail: ${email}\nPassword: ${password}\n\nPlease keep this password private.`,
      html: `
        <p>Hi ${escapeHtml(name)},</p>
        <p>${intro}</p>
        <p>
          <b>Login page:</b> <a href="${loginUrl}">${loginUrl}</a><br />
          <b>Email:</b> ${escapeHtml(email)}<br />
          <b>Password:</b> <code style="font-size:16px">${escapeHtml(password)}</code>
        </p>
        <p>Please keep this password private.</p>
      `,
    });
    return true;
  } catch (error) {
    console.error("Could not send email:", error.message);
    return false;
  }
}

module.exports = { isConfigured, sendLoginDetails };
