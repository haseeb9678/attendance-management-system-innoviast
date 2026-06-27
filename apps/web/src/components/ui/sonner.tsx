import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster"
      richColors
      closeButton
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "bg-bg-card border border-border text-text-base shadow-xl rounded-xl",

          title:
            "text-text-base font-medium",

          description:
            "text-text-secondary",

          actionButton:
            "bg-primary text-white",

          cancelButton:
            "bg-surface text-text-base border border-border",

          closeButton:
            "bg-transparent border-0 text-text-secondary hover:text-text-base",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };