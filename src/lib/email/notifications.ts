import {
  buildClientProposalEmail,
  buildOwnerLeadEmail,
  buildOwnerMeetingEmail,
  type LeadEmailData,
  type MeetingEmailData,
} from "./templates";
import { createResendTransport, type EmailMessage, type EmailTransport } from "./transport";

// Methods never reject: a failed email is logged (kind of failure only, no addresses) and the visitor's flow goes on.
export interface Notifier {
  leadCreated(data: LeadEmailData): Promise<void>;
  meetingBooked(data: MeetingEmailData): Promise<void>;
}

export function createNotifier(transport: EmailTransport | null): Notifier {
  const deliver = async (kind: string, message: EmailMessage) => {
    try {
      await transport?.send(message);
    } catch (error) {
      console.error(`[email] ${kind}: ${error instanceof Error ? error.message : "send failed"}`);
    }
  };

  return {
    async leadCreated(data) {
      if (!transport) return;
      await Promise.all([
        deliver("owner lead", { to: transport.ownerEmail, ...buildOwnerLeadEmail(data) }),
        deliver("client proposal", { to: data.email, ...buildClientProposalEmail(data) }),
      ]);
    },
    async meetingBooked(data) {
      if (!transport) return;
      await deliver("owner meeting", { to: transport.ownerEmail, ...buildOwnerMeetingEmail(data) });
    },
  };
}

export const createDefaultNotifier = () => createNotifier(createResendTransport());
