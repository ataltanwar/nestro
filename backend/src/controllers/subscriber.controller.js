import SubscriberModel from "../models/subscriber.model.js";
import { sendEmail } from "../utils/brevo.js";
import {
  sendBadRequest,
  sendConflict,
  sendCreated,
  sendServerError,
} from "../utils/response.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });

const buildWelcomeEmail = (name) => {
  const greeting = name ? `Hi ${name},` : "Hi there,";

  return {
    subject: "Welcome to Nestro",
    textContent: [
      greeting,
      "",
      "Thank you for subscribing to Nestro. You will be the first to hear about new collections, private sales, and stories from our workshop.",
      "",
      "We are delighted to have you with us.",
      "",
      "Warm regards,",
      "The Nestro Team",
    ].join("\n"),
    htmlContent: `
      <!DOCTYPE html>
      <html>
        <body style="margin: 0; padding: 0; background-color: #f6f1ea;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f1ea; padding: 32px 16px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #fffdf9; border: 1px solid #e8ddcf; border-radius: 4px;">
                  <tr>
                    <td style="padding: 40px 44px 0; text-align: center;">
                      <p style="margin: 0 0 28px; font-family: Georgia, 'Times New Roman', serif; font-size: 12px; letter-spacing: 0.35em; text-transform: uppercase; color: #9a7b4f;">Nestro</p>
                      <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: normal; letter-spacing: 0.02em; color: #18110b;">Welcome to Nestro</h1>
                      <div style="width: 48px; height: 1px; margin: 24px auto 0; background-color: #c9a97a;"></div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 32px 44px 40px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.75; color: #4a3f36;">
                      <p style="margin: 0 0 20px; font-size: 16px; color: #18110b;">${escapeHtml(greeting)}</p>
                      <p style="margin: 0 0 18px;">Thank you for subscribing to Nestro. You will be the first to hear about new collections, private sales, and stories from our workshop.</p>
                      <p style="margin: 0;">We are delighted to have you with us.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 44px 40px;">
                      <div style="border-top: 1px solid #eee3d5; padding-top: 24px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.7; color: #4a3f36;">
                        <p style="margin: 0;">Warm regards,</p>
                        <p style="margin: 4px 0 0; font-family: Georgia, 'Times New Roman', serif; font-size: 16px; letter-spacing: 0.02em; color: #18110b;">The Nestro Team</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 44px; border-top: 1px solid #eee3d5; background-color: #faf6ef; text-align: center; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; line-height: 1.6; letter-spacing: 0.08em; color: #a2917c;">
                      You are receiving this email because you subscribed to Nestro.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `.trim(),
  };
};

export const subscribe = async (req, res) => {
  try {
    const { email, name } = req.body ?? {};
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedName = typeof name === "string" ? name.trim() : "";

    if (!emailPattern.test(normalizedEmail)) {
      return sendBadRequest(res, "Please provide a valid email address");
    }

    if (normalizedName.length > 100) {
      return sendBadRequest(res, "Name cannot be longer than 100 characters");
    }

    const existingSubscriber = await SubscriberModel.findOne({ email: normalizedEmail });
    if (existingSubscriber) {
      return sendConflict(res, "This email is already subscribed");
    }

    let subscriber;

    try {
      subscriber = await SubscriberModel.create({
        email: normalizedEmail,
        name: normalizedName,
      });
    } catch (error) {
      if (error?.code === 11000) {
        return sendConflict(res, "This email is already subscribed");
      }

      throw error;
    }

    try {
      await sendEmail({
        to: {
          email: normalizedEmail,
          ...(normalizedName ? { name: normalizedName } : {}),
        },
        ...buildWelcomeEmail(normalizedName),
      });
    } catch (error) {
      await SubscriberModel.findByIdAndDelete(subscriber._id);
      console.error("Failed to send subscription welcome email:", error);
      return sendServerError(
        res,
        new Error("Unable to send the welcome email right now. Please try again later.")
      );
    }

    return sendCreated(res, "Subscribed successfully. Please check your inbox.");
  } catch (error) {
    return sendServerError(res, error);
  }
};
