import { AlertOctagon } from "lucide-react";

interface UploadErrorCardProps {
  title?: string;
  messages?: string[];
  /** What the user should do next. */
  nextStep?: string;
}

const DEFAULT_MESSAGE =
  "Format validation failed. Error parsing .prj topology lines. Please upload an authenticated file format structure.";

const UploadErrorCard = ({ title, messages, nextStep }: UploadErrorCardProps) => {
  return (
    <div role="alert" className="mt-3 rounded-md bg-base-negative px-5 py-4 border border-destructive/30">
      <div className="flex items-start gap-3">
        <AlertOctagon className="h-5 w-5 text-destructive shrink-0 mt-0.5" strokeWidth={2} />
        <div className="text-sm leading-relaxed">
          {title ? (
            <>
              <p className="text-destructive font-semibold">{title}</p>
              {messages && messages.length > 0 && (
                <ul className="mt-1 list-disc pl-5 text-[#7A1520] space-y-0.5">
                  {messages.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              )}
              {nextStep && <p className="mt-2 text-[#222222]">{nextStep}</p>}
            </>
          ) : (
            <p className="text-destructive font-medium">{DEFAULT_MESSAGE}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadErrorCard;
