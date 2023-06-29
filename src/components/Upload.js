import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const Upload = ({
  acceptedFileTypes,
  uploadDirectory,
  onUploadComplete,
  accessToken,
}) => {
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const formData = new FormData();
      formData.append("directory", uploadDirectory);

      acceptedFiles.forEach((file) => {
        formData.append("files", file);
      });

      try {
        const response = await fetch("/api/upload/route", {
          method: "POST",
          body: formData,
          headers: {
            authorization: `bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          console.log("this ok");
          const imagePath = await response.text();
          onUploadComplete(imagePath); // Pass the image path to the parent component
          console.log("Files uploaded successfully!");
        } else {
          console.error("Error uploading files:", response.statusText);
        }
      } catch (error) {
        console.error("Error uploading files:", error);
      }
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
    </div>
  );
};

export default Upload;
