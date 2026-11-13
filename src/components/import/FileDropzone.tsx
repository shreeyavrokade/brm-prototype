import { useRef } from "react";
import { FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  accept: string;
  multiple?: boolean;
  hint: string;
  label?: string;
  onFiles: (files: File[]) => void;
}

const FileDropzone = ({ accept, multiple, hint, label = "Add File", onFiles }: FileDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    onFiles(Array.from(files));
  };

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm font-medium text-primary-200">{label}</span>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handle(e.dataTransfer.files);
        }}
        className={cn(
          "border border-dashed border-atmo-4 rounded-md bg-atmo-1 cursor-pointer",
          "h-[140px] flex items-center justify-center gap-3 hover:bg-atmo-2 transition-colors"
        )}
      >
        <FileIcon className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
        <div className="text-sm text-foreground">
          <div>{multiple ? "Drop files here" : "Drop file here"}</div>
          <div className="text-atmo-9">
            or <span className="font-semibold text-foreground">click to upload</span>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handle(e.target.files)}
        />
      </div>
    </div>
  );
};

export default FileDropzone;
