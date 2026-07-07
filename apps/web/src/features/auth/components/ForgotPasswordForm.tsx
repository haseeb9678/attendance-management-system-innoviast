import FormButton from "@/components/common/FormButton";
import FormInput from "@/components/common/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@attendance/shared-zod";
import { LucideArrowLeft, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useForgotPassword } from "../hooks/useAuthMutation";

type ForgotPasswordFormValues = {
    email: string;
};

const ForgotPasswordForm = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const { mutate: forgotPasswordMutation, isPending } = useForgotPassword();

    const onSubmit = (data: ForgotPasswordFormValues) => {
        forgotPasswordMutation(data, {
            onSuccess: (res) => {
                toast.success(
                    res?.message ||
                    "If an account with that email exists, a reset link has been sent."
                );

                navigate("/login");
            },

            onError: (error: Error) => {
                toast.error(error.message);
            },
        });
    };

    return (
        <div
            className="border border-border bg-bg-card lg:bg-transparent
            lg:border-0 rounded-2xl p-5 w-full max-w-md h-full
            flex flex-col  justify-center gap-12"
        >
            <div className="flex flex-col gap-1 items-center justify-center">
                <h2 className="font-bold text-3xl text-primary">
                    Forgot Password
                </h2>
                <p className="text-sm text-text-secondary text-center">
                    Enter your email address and we’ll send you a password reset
                    link.
                </p>
            </div>

            <div className="flex flex-col gap-5">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-5"
                    method="post"
                >
                    <div className="grid grid-cols-1 gap-3">
                        <FormInput
                            register={register}
                            type="email"
                            placeholder="Enter your email"
                            name="email"
                            errors={errors}
                            label="Email"
                            Icon={Mail}
                        />
                    </div>

                    <FormButton
                        type="submit"
                        text="Send Reset Link"
                        loadingText="Sending..."
                        isLoading={isPending}
                    />
                </form>

                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-sm text-primary hover:underline
                    flex items-center gap-1 justify-center cursor-pointer
                    hover:text-primary-hover transition-all duration-200"
                >
                    <LucideArrowLeft
                        strokeWidth={1}
                        size={18}
                    />
                    Back to Login
                </button>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;