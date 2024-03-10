import {CloudUpload} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRef, useState} from "react";

export const UploadAnything = () => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  const btnHiddenFileInput = useRef<HTMLInputElement | null>(null);

  const onClickUploadAnything = () => {
    if (!selectedFile) {
      return;
    }

    console.log(`Uploading ${selectedFile}`);
    try {
      const fileForm = new FormData();
      fileForm.append('file', selectedFile);

      const response = fetch('/api/ua', {
        method: 'POST',
        body: fileForm
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center gap-y-5 w-[400px] py-6 text-center border-2 rounded-lg border-dotted focus:border-amber-800 focus:border-solid">
        <CloudUpload size={60} color="#d8d8d8" className="text-gray-300"  />

        {selectedFile && (
          <div>
            <p className="text-blue-700 font-semibold text-sm overflow-ellipsis">
              {selectedFile.name}
            </p>
          </div>
        )}

        {!selectedFile && (
          <div>
            <p className="text-blue-700 font-semibold text-sm">
              Choose file or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              Image and pdfs
            </p>
          </div>
        )}

        <div className="w-full flex gap-x-8 px-10">
          <Button className="flex-grow font-semibold bg-blue-700/90 hover:bg-blue-800 " onClick={event => {
            if (btnHiddenFileInput.current) {
              btnHiddenFileInput.current.click();
            }
          }}>
            <input id="ua-fileupload-anything" type="file" className="hidden" ref={btnHiddenFileInput} onChange={event => {
              const files = event.target.files;
              if (files && files.length > 0) {
                setSelectedFile(files[0]);
              }
            }} />
            Choose File
          </Button>

          <Button className="flex-grow font-semibold bg-blue-700/90 hover:bg-blue-800" disabled={!selectedFile} onClick={onClickUploadAnything}>
            Upload
          </Button>
        </div>



      </div>

    </div>
  );
};
