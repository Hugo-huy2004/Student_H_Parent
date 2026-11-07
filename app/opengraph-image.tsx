import { ogSize, renderInvitationOg } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Invitation to the Student Honoring Ceremony, Summer 2026 Trimester — University of Greenwich (Vietnam)";

export default function Image() {
  return renderInvitationOg();
}
