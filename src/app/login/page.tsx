import { Suspense } from "react";
import type { Metadata } from "next";

import { LoginForm } from "@/components/dashboard/auth/login-form";

export const metadata: Metadata = {
  title: "Login — LOGOS CRM",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
