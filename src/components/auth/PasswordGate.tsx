import { useState, type FormEvent, type ReactNode } from "react";
import { Lock, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { brand } from "@/config/brand";

const MASTER_KEY = brand.accessPassword;
const STORAGE_KEY = "mem_authed";

export function PasswordGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState<boolean>(
    () => typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "1"
  );
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value === MASTER_KEY) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setError(false);
      setAuthed(true);
      toast.success("Access granted");
    } else {
      setError(true);
      toast.error("Invalid master entry string code");
    }
  };

  return (
    <>
      {children}
      {!authed && (
        <div className="fixed inset-0 z-50 bg-[#FBFCFC] h-screen w-screen flex flex-col items-center justify-center p-6">
          <form
            onSubmit={onSubmit}
            className="bg-white border border-[#D9D9D9] rounded-xl p-8 max-w-md w-full shadow-lg"
          >
            <img src={brand.logoSrc} alt={brand.logoAlt} className="h-10 w-auto mx-auto mb-5" />
            <h1 className="text-xl font-bold text-[#222222] text-center tracking-tight mb-2">
              {brand.productName}
            </h1>
            <p className="text-sm text-[#6C6B6B] text-center mb-6">
              This environment is protected. Please enter the master access password supplied by your {brand.coordinatorTitle}.
            </p>

            <label
              htmlFor="mem-access-password"
              className="block text-xs font-bold uppercase text-[#6C6B6B] tracking-wider mb-2"
            >
              Access Password
            </label>

            <div className="relative">
              <Lock
                strokeWidth={1.75}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6C6B6B] pointer-events-none"
              />
              <Input
                id="mem-access-password"
                type="password"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (error) setError(false);
                }}
                autoFocus
                className={cn(
                  "border border-[#D9D9D9] focus:bg-[#E0E6F5] focus:border-[#4D4D4D] rounded-lg pl-10 pr-4 py-2.5 w-full text-sm font-mono h-auto",
                  error && "border-[#C82333] ring-1 ring-[#C82333]"
                )}
              />
            </div>

            {error && (
              <div className="text-[#C82333] text-xs font-medium mt-2 flex items-center gap-1">
                ✕ Invalid master entry string code. Please cross-check settings or contact support.
              </div>
            )}

            <button
              type="submit"
              className="bg-[#222222] hover:bg-[#4D4D4D] text-white font-medium rounded-full py-2.5 mt-4 w-full transition-all duration-150 flex items-center justify-center gap-2"
            >
              <LogIn strokeWidth={1.75} className="h-4 w-4" />
              Unlock Prototype
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default PasswordGate;
