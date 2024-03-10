"use client";

import {FC} from "react";
import Image from "next/image";

import {UploadDropzone} from "@/lib/uploadthing";
import {X} from "lucide-react";

import "@uploadthing/react/styles.css";

export type FileUploadProps = {
  endpoint: "messageFile" | "serveImage";
  value: string;
  onChange: (url?: string) => void;
};

export const FileUpload: FC<FileUploadProps> = ({endpoint, value, onChange}) => {

  const fileType = value?.split(".").pop();

  if (value && fileType != "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="uploaded" className="rounded-full"/>
        <button onClick={() => onChange("")}
                className="absolute top-0 right-0 bg-rose-500 text-white p-1 rounded-full shadow-sm" type="button">
          <X className="h-4 w-4"/>
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(err) => {
        console.log("Upload error", err);
      }}
    />
  );
};