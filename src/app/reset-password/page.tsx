import { ResetPasswordForm } from "@/components/forms/reset-password-form";
import { SectionHeading } from "@/components/shared";

export const metadata = {
  title: "Reset password",
  description: "Choose a new password for your account.",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = params.token ?? "";

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-xl">
        <SectionHeading
          title="Choose a new password"
          description="Use the reset link from your email to update your password."
        />
        <div className="mt-8 glass-card p-8">
          {!token ? (
            <p className="text-sm text-muted-foreground">This reset link is missing a token. Please request a new one.</p>
          ) : (
            <ResetPasswordForm token={token} />
          )}
        </div>
      </div>
    </div>
  );
}
