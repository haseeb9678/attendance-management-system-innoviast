import { type ButtonHTMLAttributes, type ComponentType } from "react";
import { Spinner } from "../ui/spinner";

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    isLoading?: boolean;
    loadingText?: string;
    Icon?: ComponentType<{ className?: string }>;
}

const FormButton = ({
    type = "button",
    text,
    isLoading = false,
    loadingText = "Loading...",
    Icon,
    className = "",
    disabled,
    ...props
}: FormButtonProps) => {
    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            className={`flex min-h-12 w-full items-center justify-center 
                gap-2 rounded-3xl bg-primary hover:bg-primary-hover px-2 cursor-pointer
                 text-white shadow-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
            {...props}
        >
            {Icon && <Icon className="size-5" />}

            <span>{isLoading ? loadingText : text}</span>

            {isLoading && <Spinner />}
        </button>
    );
};

export default FormButton;