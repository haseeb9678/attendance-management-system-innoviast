import { SEO } from "@/shared/components/SEO";
import AuthShowcase from "../components/AuthShowcase";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
    return (
        <>
            <SEO
                title="Login | Attendix"
                description="Sign in to Attendix to manage attendance, classes, departments, teachers, and student records securely."
                noindex
            />
            <section
                className="
                flex items-center justify-center
                 px-4 py-8 flex-1 max-w-7xl mx-auto 
            "
            >
                <div
                    className="
                    flex w-full mx-auto overflow-hidden
                    rounded-2xl lg:border border-border bg-bg-card
                    shadow-md lg:shadow-xl
                    h-[73vh] max-h-300
                "
                >
                    {/* Left Showcase (Desktop Only) */}
                    <AuthShowcase />

                    {/* Right Login Form */}
                    <div
                        className="
                        flex flex-1 items-center justify-center
                        p-6 sm:p-8 lg:p-12 lg:min-w-md
                    "
                    >
                        <LoginForm />
                    </div>
                </div>
            </section>
        </>
    );
};

export default LoginPage;