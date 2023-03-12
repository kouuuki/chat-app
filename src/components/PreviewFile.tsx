import Image from "next/image";
import { useEffect, useState } from "react";

export default function FilePreview({ file }: { file: File }) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [file]);

  return (
    <div>
      {previewUrl && (
        <Image src={previewUrl} alt={file.name} width={150} height={150} />
      )}
    </div>
  );
}
