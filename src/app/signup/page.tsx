import { SignupForm } from "@/components/forms/signup-form";
import { SectionHeading } from "@/components/shared";

export const metadata = {
  title: "Create account",
  description: "Create a family portal account for Islamic Academy.",
};

export default function SignupPage() {
  return (
    <div className="section-padding">
      <div className="mx-auto max-w-xl">
        <SectionHeading
          title="Create your account"
          description="Set up your family portal account to review lessons, payments, and enrollments."
        />
        <div className="mt-8 glass-card p-8">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
