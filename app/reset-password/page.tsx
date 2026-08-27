import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata = {
  title: "Đặt lại mật khẩu · Ladysfit Plan",
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#FDE2DC" }} />
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
