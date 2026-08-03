import { LoginForm } from "@/components/forms/login-form";
import { SectionHeading } from "@/components/shared";

export const metadata = {
    title: "Login",
    description: "Sign in to the admin or family portal.",
};

export default function LoginPage() {
    return (
        <div className="section-padding">
            <div className="mx-auto max-w-xl">
                <SectionHeading title="Sign in" description="Use your admin or portal credentials to access the protected workspace." />
                <div className="mt-8 glass-card p-8">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
