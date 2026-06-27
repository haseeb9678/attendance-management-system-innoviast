import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import FormButton from "./FormButton";
import type { LucideIcon } from "lucide-react";
import {
    AlertTriangle,
    CircleCheckBig,
    Info,
    TriangleAlert,
} from "lucide-react";

type Variant = "danger" | "warning" | "success" | "info";

interface ConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    title: string;
    description: string;

    confirmText?: string;
    cancelText?: string;

    onConfirm: () => void;
    onCancel?: () => void;

    loading?: boolean;

    variant?: Variant;
    icon?: LucideIcon;
}

const variants = {
    danger: {
        Icon: AlertTriangle,
        iconBg: "bg-red-100 text-red-600",
        button: "bg-red-600 hover:bg-red-700",
    },
    warning: {
        Icon: TriangleAlert,
        iconBg: "bg-amber-100 text-amber-600",
        button: "bg-amber-500 hover:bg-amber-600",
    },
    success: {
        Icon: CircleCheckBig,
        iconBg: "bg-green-100 text-green-600",
        button: "bg-green-600 hover:bg-green-700",
    },
    info: {
        Icon: Info,
        iconBg: "bg-primary/10 text-primary",
        button: "bg-primary hover:bg-primary-hover",
    },
};

const ConfirmationDialog = ({
    open,
    onOpenChange,

    title,
    description,

    confirmText = "Confirm",
    cancelText = "Cancel",

    onConfirm,
    onCancel,

    loading = false,

    variant = "info",
    icon,
}: ConfirmationDialogProps) => {
    const style = variants[variant];
    const Icon = icon ?? style.Icon;

    return (
        <Dialog

            open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md rounded-2xl p-7">
                <DialogHeader className="items-center text-center gap-4">
                    <div
                        className={`
                            h-16 w-16 rounded-full
                            flex items-center justify-center
                            ${style.iconBg}
                        `}
                    >
                        <Icon className="h-8 w-8" />
                    </div>

                    <DialogTitle className="text-xl font-semibold">
                        {title}
                    </DialogTitle>

                    <p className="text-sm text-text-secondary leading-6">
                        {description}
                    </p>
                </DialogHeader>

                <DialogFooter className="mt-5 flex-col-reverse sm:flex-row gap-3">
                    <FormButton
                        type="button"
                        text={cancelText}
                        variant="secondary"

                        onClick={() => {
                            onCancel?.();
                            onOpenChange(false);
                        }}
                    />

                    <FormButton
                        type="button"
                        text={confirmText}
                        loading={loading}
                        className={` text-white ${style.button}`}
                        onClick={onConfirm}
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmationDialog;