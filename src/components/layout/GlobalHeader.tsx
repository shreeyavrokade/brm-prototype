import { Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePortalView, setPortalView, type PortalView } from "@/store/portalContextStore";
import { brand } from "@/config/brand";

const OPTIONS: { key: PortalView; label: string; Icon: typeof User }[] = [
  { key: "STAKEHOLDER", label: "Participant View (USP)", Icon: User },
  { key: "SPP_ENGINEER", label: `${brand.clientShortName} Engineer View (EP)`, Icon: Shield },
];

const GlobalHeader = () => {
  const view = usePortalView();

  return (
    <header className="h-14 shrink-0 bg-atmo-1 border-b border-atmo-3 flex items-center justify-between px-4">
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={brand.logoSrc}
          alt={brand.logoAlt}
          className={cn(brand.logoClassName, "select-none shrink-0")}
        />
        {brand.showProductNameInHeader && (
          <>
            <span aria-hidden="true" className="h-6 w-px bg-atmo-4 shrink-0" />
            <span className="text-sm font-semibold text-foreground truncate">{brand.productName}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-lg bg-[#E2E8F0] p-1">
          {OPTIONS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setPortalView(key)}
              aria-pressed={view === key}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                view === key
                  ? "bg-atmo-0 text-foreground shadow-sm"
                  : "text-atmo-9 hover:text-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
        <div className="h-8 w-8 rounded-full bg-atmo-3 flex items-center justify-center text-xs font-medium text-atmo-10">
          EL
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
