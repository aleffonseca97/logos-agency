export type UserRole = "admin" | "member";

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  role: UserRole;
  preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type ProfileUpdate = Partial<
  Pick<Profile, "full_name" | "avatar_url" | "preferences">
>;
