import { Resend } from "resend";
import { getServerEnv } from "@/src/lib/env";

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
}

export interface EmailTransport {
  ownerEmail: string;
  send(message: EmailMessage): Promise<void>;
}

// Null when emails are not configured: the notifier then skips sending.
export function createResendTransport(): EmailTransport | null {
  const { RESEND_API_KEY, OWNER_EMAIL, EMAIL_FROM } = getServerEnv();
  if (!RESEND_API_KEY || !OWNER_EMAIL || !EMAIL_FROM) return null;

  const resend = new Resend(RESEND_API_KEY);
  return {
    ownerEmail: OWNER_EMAIL,
    async send(message) {
      const { error } = await resend.emails.send({ from: EMAIL_FROM, ...message });
      if (error) throw new Error(`resend failed: ${error.name}`);
    },
  };
}
