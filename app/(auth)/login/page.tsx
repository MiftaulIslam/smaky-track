import type { Metadata } from "next";
import { LoginForm } from "@/src/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Smaky Track account to view your smoking analytics and track your progress.",
};

export default function LoginPage() {
  return <LoginForm />;
}
