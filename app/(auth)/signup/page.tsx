import type { Metadata } from "next";
import { SignupForm } from "@/src/features/auth/components/SignupForm";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your free Smaky Track account and start tracking your cigarette smoking habits with detailed analytics.",
};

export default function SignupPage() {
  return <SignupForm />;
}
