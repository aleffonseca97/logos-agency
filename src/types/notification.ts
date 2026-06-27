export type NotificationType =
  | "new_lead"
  | "proposal_accepted"
  | "meeting_today"
  | "stale_lead";

export type Notification = {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  created_at: string;
};
