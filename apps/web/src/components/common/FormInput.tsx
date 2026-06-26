import { useState, type InputHTMLAttributes } from "react";
import type {
    FieldErrors,
    FieldValues,
    Path,
    UseFormRegister,
} from "react-hook-form";
import { EyeClosed, EyeIcon, type LucideIcon } from "lucide-react";

interface FormInputProps<T extends FieldValues>
    extends InputHTMLAttributes<HTMLInputElement> {
    register: UseFormRegister<T>;
    name: Path<T>;
    errors: FieldErrors<T>;
    type: string
    label?: string;
    Icon?: LucideIcon;
    showLabel?: boolean;
}

const FormInput = <T extends FieldValues>({
    register,
    name,
    type,
    errors,
    label,
    Icon,
    showLabel = true,
    className = "",
    ...props
}: FormInputProps<T>) => {
    const error = errors[name]?.message as string | undefined;

    const [showPassword, setShowPassword] = useState(false)

    const togglePassword = () => {
        setShowPassword(p => !p)
    }

    const isPassword = type === "password"

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
                {showLabel && label && (
                    <label
                        htmlFor={name}
                        className="text-xs font-medium text-text-secondary dark:text-gray-200 ml-2"
                    >
                        {label}
                    </label>
                )}

                <div
                    className={`flex h-12 items-center gap-2 rounded-3xl border px-4 transition-colors duration-200
                        text-sm
          ${error
                            ? `border-red-500 focus-within:border-red-500 
                            focus-within:ring-3 focus-within:ring-red-600/15`
                            : `border-gray-300 focus-within:ring-3
                             focus-within:ring-primary-hover/15 focus-within:border-primary-hover dark:border-gray-700`
                        }`}
                >
                    {Icon && (
                        <Icon className="size-5 shrink-0 text-text-secondary" />
                    )}

                    <input
                        id={name}
                        {...register(name)}
                        {...props}
                        type={isPassword ? showPassword ? "text" : "password" : type}
                        className={`w-full bg-transparent outline-none placeholder:text-text-secondary/70 ${className}`}
                    />
                    {isPassword && (
                        showPassword ?
                            <EyeIcon
                                onClick={togglePassword}
                                className="size-5 shrink-0 text-text-secondary" />
                            : <EyeClosed
                                onClick={togglePassword}
                                className="size-5 shrink-0 text-text-secondary" />
                    )}
                </div>
            </div>

            {error && (
                <p className="text-xs text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
};

export default FormInput;