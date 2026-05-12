import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/src/features/admin/components/AdminLoginForm";
import { isAdminAuthenticated } from "@/src/features/admin/auth";

export default async function AdminLoginPage() {
  const alreadyAuthenticated = await isAdminAuthenticated();
  if (alreadyAuthenticated) redirect("/admin-dashboard");

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AdminLoginForm />
    </div>
  );
}
