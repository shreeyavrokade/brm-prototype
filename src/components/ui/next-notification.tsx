import * as React from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, OctagonAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * NEXT 6.3.1 Notification Banner (Figma IP7UpMBipYr1A9cGUNpPQd, node 672:196644).
 * Solid pill in the semantic colour, 8px padding, icon + Body text, optional
 * Notification Buttons (672:196740) and close. Dark-background statuses use
 * white text and white-outline buttons; light ones use #222222.
 */
export type NotificationStatus = "info" | "success" | "warning" | "error" | "catastrophic";

const NOTIFICATION_STYLES: Record<
  NotificationStatus,
  { bg: string; fg: string; dark: boolean; Icon: typeof Info; label: string }
> = {
  info: { bg: "var(--notification-info-background)", fg: "var(--notification-info-foreground)", dark: false, Icon: Info, label: "Information" },
  success: { bg: "var(--notification-success-background)", fg: "var(--notification-success-foreground)", dark: true, Icon: CheckCircle2, label: "Success" },
  warning: { bg: "var(--notification-warning-background)", fg: "var(--notification-warning-foreground)", dark: false, Icon: AlertTriangle, label: "Warning" },
  error: { bg: "var(--notification-error-background)", fg: "var(--notification-error-foreground)", dark: true, Icon: AlertCircle, label: "Error" },
  catastrophic: { bg: "var(--notification-catastrophic-background)", fg: "var(--notification-catastrophic-foreground)", dark: true, Icon: OctagonAlert, label: "Critical" },
};

export interface NotificationAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

interface Props {
  status: NotificationStatus;
  /** Bold lead-in, e.g. "Review Needed: 4 required fixes". */
  title?: React.ReactNode;
  children?: React.ReactNode;
  actions?: NotificationAction[];
  onClose?: () => void;
  className?: string;
}

/** NEXT Notification Button: Secondary, on dark or light notification background. */
const notificationButtonClass = (dark: boolean) =>
  cn(
    "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold leading-[21px] transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B78BE] focus-visible:ring-offset-1",
    dark ? "border-white text-white hover:bg-white/15" : "border-[#222222] text-[#222222] hover:bg-black/10",
  );

const NextNotification = ({ status, title, children, actions, onClose, className }: Props) => {
  const s = NOTIFICATION_STYLES[status];
  const Icon = s.Icon;
  return (
    <div
      role={status === "error" || status === "catastrophic" ? "alert" : "status"}
      className={cn("flex items-center gap-2 rounded-[24px] p-2 text-sm leading-6", className)}
      style={{ backgroundColor: s.bg, color: s.fg }}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center" aria-label={s.label}>
        <Icon className="h-6 w-6" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1 px-2 py-1">
        {title && <span className="font-semibold">{title}</span>}
        {title && children ? " " : null}
        {children}
      </div>
      {actions?.map((a) => (
        <button key={a.label} type="button" onClick={a.onClick} className={notificationButtonClass(s.dark)}>
          {a.icon}
          {a.label}
        </button>
      ))}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B78BE]"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default NextNotification;
