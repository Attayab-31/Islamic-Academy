import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { SectionHeading } from "@/components/shared";

export const metadata = {
  title: "Forgot password",
  description: "Send a password reset link to your email.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="section-padding">
      <div className="mx-auto max-w-xl">
        <SectionHeading
          title="Reset your password"
          description="Enter the email address tied to your account and we will send a reset link."
        />
        <div className="mt-8 glass-card p-8">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
