export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  role: "admin" | "member";
  preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type ProfileUpdate = Partial<
  Pick<Profile, "full_name" | "avatar_url" | "preferences">
>;
