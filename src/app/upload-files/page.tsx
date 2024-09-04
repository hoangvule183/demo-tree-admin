"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

const UploadFiles = () => {
  const { data } = useSession();
  const [file, setFile] = useState<File | null>(null);

  const uploadFile = async () => {
    if (!file) return;

    const metadata = {
      name: file.name,
      parents: ["11ICDEszI_VYV5GD6HCzmX5Vq6YGmMt7Q"],
    };

    const body = new FormData();
    body.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    body.append("file", file);
    try {
      const token = data as any;
      const response = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          body: body,
          headers: {
            Authorization: `Bearer ${token["access_token"]}`,
          },
        }
      );
      const json = await response.json();
    } catch (error) {
      alert("Error");
    }
  };

  const createFolder = async () => {
    const token = data as any;
    let createFolderOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token["access_token"]}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mimeType: "application/vnd.google-apps.folder",
        name: "Create test fold!",
        parents: ["11ICDEszI_VYV5GD6HCzmX5Vq6YGmMt7Q"],
      }),
    };

    const response = await fetch(
      "https://www.googleapis.com/drive/v3/files",
      createFolderOptions
    );
    const json = await response.json();
  };

  return (
    <div className="w-full flex flex-col">
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            setFile(e.target.files[0]);
          }
        }}
      />
      <br />
      <button onClick={createFolder}>Upload</button>
    </div>
  );
};

export default UploadFiles;
