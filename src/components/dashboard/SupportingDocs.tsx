import { SupportingDoc } from "./types";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SupportingDocsProps {
  docs: SupportingDoc[];
  onReplace?: (id: string) => void;
  onUpload?: () => void;
}


const SupportingDocs = ({ docs, onReplace, onUpload }: SupportingDocsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceTargetId = useRef<string | null>(null);

  const handleReplaceClick = (id: string) => {
    replaceTargetId.current = id;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] && replaceTargetId.current && onReplace) {
      onReplace(replaceTargetId.current);
    }
    e.target.value = "";
    replaceTargetId.current = null;
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
      {/* Upload button */}
      <div className="px-4 py-3 border-b shrink-0">
        <Button size="sm" className="text-xs gap-1.5 w-full rounded-full" onClick={onUpload}>
          <Upload className="h-3.5 w-3.5" />
          Upload Document
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Name</TableHead>
              
              <TableHead className="text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {docs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="text-xs font-medium max-w-[180px]">
                    <p className="truncate">{doc.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Attached {doc.uploadedAt}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {onReplace && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => handleReplaceClick(doc.id)}
                        >
                          Replace
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SupportingDocs;
