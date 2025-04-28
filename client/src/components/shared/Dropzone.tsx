import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";

type DropzoneField = {
  onChange: (file: File | File[]) => void;
  value: File | File[] | null;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxSize?: number;
};

const Dropzone = ({
  onChange,
  value,
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024,
}: DropzoneField) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    multiple,
    maxSize,
    onDrop: (acceptedFiles) => {
      if (multiple) {
        onChange(acceptedFiles);
      } else {
        onChange(acceptedFiles[0]);
      }
    },
  });
  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-primary! flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-4 text-sm",
        isDragActive ? "border-primary bg-primary/10" : "border-muted",
      )}
    >
      <input {...getInputProps()} />
      {value ? (
        <span className="text-primary flex items-center gap-2">
          <Upload className="size-5" />
          <p className="text-center">
            {Array.isArray(value)
              ? value.map((f) => f.name).join(", ")
              : value.name}
          </p>
        </span>
      ) : (
        <p className="text-primary text-center">
          Drag & drop file here, or click to select
        </p>
      )}
    </div>
  );
};

export default Dropzone;
