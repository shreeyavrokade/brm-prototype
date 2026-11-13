import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      // NEXT 6.3.1 Snackbar (Figma 672:196677): solid semantic pill, Body text,
      // Secondary notification button. Untyped toast() uses Informational.
      toastOptions={{
        classNames: {
          toast:
            "group toast notification-toast !rounded-[24px] !border-0 !min-h-12 !py-2 !pl-3 !pr-4 !gap-2 !text-sm !leading-6 !font-sans !shadow-[0_0_8px_rgba(34,34,34,0.12)]",
          title: "!font-normal",
          description: "!opacity-100 !text-inherit",
          actionButton:
            "!h-8 !rounded-full !border !border-current !bg-transparent !px-4 !text-sm !font-semibold !text-inherit",
          cancelButton: "!bg-transparent !text-inherit !opacity-100",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
