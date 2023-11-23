import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { useUploadThing } from "@/helpers/UploadThingHelper";

const Upload = ({
  acceptedFileTypes,
  uploadDirectory,
  onUploadComplete,
  accessToken,
}) => {

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const { startUpload, permittedFileInfo } = useUploadThing(
    "imageUploader",
    {
      onClientUploadComplete: () => {
        setIsLoading(false);
        setMessage("uploaded successfully!");
      },
      onUploadError: () => {
        setIsLoading(false);
        setMessage("error occurred while uploading");
        setIsError(true)
      },
      onUploadBegin: () => {
        setIsLoading(true);
        console.log('begin')
        setMessage("upload has begun");
      },
    },
  );

  const onDrop = useCallback(
    async (acceptedFiles) => {
      // const formData = new FormData();
      //formData.append("directory", uploadDirectory);



      setIsLoading(true);
      console.log('begin')
      setMessage("upload has begun");

      const imagePath = await startUpload(acceptedFiles)

      console.log(imagePath[0].url)

      onUploadComplete(imagePath[0].url)

      // acceptedFiles.forEach((file) => {
      //   formData.append("files", file);
      //   formData.append("name", file.name);
      // });


      // const filesInfo = acceptedFiles.map(file => ({
      //   name: file.name,
      //   size: file.size,
      //   type: file.type
      // }));

      // const requestBody = {
      //   "0": {
      //     "json": {
      //       "appId": "alg72gsj7k",
      //       "files": filesInfo
      //     }
      //   }
      // };

      // try {
      //   const response = await fetch("/api/uploadthing", {
      //     method: "POST",
      //     body: formData,
      //     headers: {
      //       authorization: `bearer ${accessToken}`,
      //     },
      //   });

      //   if (response.ok) {
      //     console.log("this ok");
      //     console.log(response)
      //     const imagePath = await response.text();
      //     onUploadComplete(imagePath); // Pass the image path to the parent component
      //     console.log("Files uploaded successfully!");
      //   } else {
      //     console.error("Error uploading files:", response.statusText);
      //   }
      // } catch (error) {
      //   console.error("Error uploading files:", error);
      // }
    },
    [onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.join(","),
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? "active" : ""}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here...</p>
      ) : (
        <p>Drag and drop some files here, or click to select files</p>
      )}
      {isLoading && (
        <div className="flex flex-col items-center justify-center">
          <div class="rounded-full bg-slate-600 flex flex-row items-center justify-center py-1 px-3 my-3 gap-3 w-fit">
            <span class="text-white">{message}</span>
            <span class="loading loading-infinity loading-md text-white"></span>
          </div>
        </div>
      )}

      {message && !isLoading && (
        <div className="flex flex-col items-center justify-center">
          <div class={`rounded-full ${isError ? 'bg-red-600 ' : 'bg-green-600 '}bg-slate-600 flex flex-row items-center justify-center py-1 px-3 my-3 gap-3 w-fit`}>
            <span class="text-white">{message}</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default Upload;
