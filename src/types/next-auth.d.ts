import "next-auth";
import "next-auth/jwt";

import type { UserRole } from "@/types/profile";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      /** Presente quando o JWT já tem o claim; senão requireAuth resolve via DB. */
      role?: UserRole;
    };
  }

  interface User {
    id: string;
    email?: string | null;
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}
