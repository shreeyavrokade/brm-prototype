import { AlertOctagon } from "lucide-react";

const UploadErrorCard = () => {
  return (
    <div className="mt-3 rounded-md bg-base-negative px-5 py-4 border border-destructive/30">
      <div className="flex items-start gap-3">
        <AlertOctagon className="h-5 w-5 text-destructive shrink-0 mt-0.5" strokeWidth={2} />
        <p className="text-sm text-destructive font-medium leading-relaxed">
          Format validation failed. Error parsing .prj topology lines. Please upload an authenticated file format structure.
        </p>
      </div>
    </div>
  );
};

export default UploadErrorCard;
