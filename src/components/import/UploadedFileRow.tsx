import { CheckCircle2, X } from "lucide-react";

export interface UploadedFile {
  id: string;
  name: string;
  sizeKb: number;
}

interface Props {
  file: UploadedFile;
  onRemove: (id: string) => void;
}

const UploadedFileRow = ({ file, onRemove }: Props) => {
  return (
    <div className="relative mt-3">
      <div className="absolute right-3 -top-2.5 z-10">
        <span className="bg-base-positive text-atmo-10 text-[10px] font-semibold px-2 py-0.5 rounded-full">
          Success
        </span>
      </div>
      <div className="flex items-center justify-between bg-base-positive px-3 py-2.5 rounded-md border border-success/30">
        <div className="flex items-center gap-2 text-sm text-atmo-10">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <span className="font-medium">{file.name}</span>
          <span className="text-atmo-7">|</span>
          <span className="text-atmo-9">{file.sizeKb}KB</span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(file.id)}
          className="text-atmo-9 hover:text-foreground"
          aria-label="Remove file"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default UploadedFileRow;
