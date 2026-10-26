import { BrevoClient } from "@getbrevo/brevo";

const getRequiredEnvironmentVariable = (name) => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} must be configured before sending email`);
  }

  return value;
};

const normalizeRecipients = (to) => {
  const recipients = Array.isArray(to) ? to : [to];

  if (
    recipients.length === 0 ||
    recipients.some(
      (recipient) =>
        !recipient ||
        typeof recipient !== "object" ||
        typeof recipient.email !== "string" ||
        !recipient.email.trim()
    )
  ) {
    throw new TypeError(
      "Email recipients must be an object or array of objects with an email"
    );
  }

  return recipients.map((recipient) => ({
    email: recipient.email.trim(),
    ...(recipient.name ? { name: recipient.name } : {}),
  }));
};

const normalizeSender = (sender) => {
  const email = sender?.email?.trim() || getRequiredEnvironmentVariable("BREVO_SENDER_EMAIL");
  const name = sender?.name?.trim() || process.env.BREVO_SENDER_NAME?.trim();

  return {
    email,
    ...(name ? { name } : {}),
  };
};

/**
 * Sends a transactional email through Brevo.
 *
 * @param {Object} options
 * @param {Object|Object[]} options.to Recipient object(s), each with an email and optional name.
 * @param {string} options.subject Email subject.
 * @param {string} [options.textContent] Plain-text email body.
 * @param {string} [options.htmlContent] HTML email body.
 * @param {{email: string, name?: string}} [options.sender] Overrides the configured sender.
 * @returns {Promise<Object>} Brevo's send transaction response.
 */
export const sendEmail = async ({
  to,
  subject,
  textContent,
  htmlContent,
  sender,
}) => {
  if (!subject?.trim()) {
    throw new TypeError("Email subject is required");
  }

  if (!textContent?.trim() && !htmlContent?.trim()) {
    throw new TypeError("Email textContent or htmlContent is required");
  }

  const client = new BrevoClient({
    apiKey: getRequiredEnvironmentVariable("BREVO_API_KEY"),
  });

  const message = {
    sender: normalizeSender(sender),
    to: normalizeRecipients(to),
    subject: subject.trim(),
    ...(textContent?.trim() ? { textContent: textContent.trim() } : {}),
    ...(htmlContent?.trim() ? { htmlContent: htmlContent.trim() } : {}),
  };

  try {
    return await client.transactionalEmails.sendTransacEmail(message);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Brevo email delivery failed: ${message}`, {
      cause: error,
    });
  }
};
