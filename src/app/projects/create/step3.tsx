"use client";

import LoadingModal from "@components/LoadingModal";
import ProgressBar from "@components/ProgressBar";
import { ProjectItem, Resource } from "@customTypes/apiResponse";
import { Box, Button } from "@mui/material";
import { useInvalidate, useNotification } from "@refinedev/core";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import GoogleDriveService from "@services/googleDrive.service";
import ResourcesService from "@services/resources.service";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import CancelIcon from "@mui/icons-material/Cancel";

const CreateProjectStep3 = ({ project }: { project: ProjectItem | null }) => {
  const [files, setFiles] = useState<{ file: File; base64: string }[]>([]);
  const [progress, setProgress] = useState(0);
  const [isUploading, setUploading] = useState(false);
  const [isLoaing, setLoading] = useState(false);
  const [resource, setResource] = useState<Resource | null>(null);
  const { open } = useNotification();
  const invalidate = useInvalidate();
  const onDrop = useCallback(async (acceptedFiles: any) => {
    const files = acceptedFiles;
    const filesArr: { file: File; base64: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64 = (await toBase64(file)) as string;
      filesArr.push({ file, base64 });
    }
    setFiles((prev) => [...prev, ...filesArr]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });
  const {
    saveButtonProps,
    refineCore: { formLoading, onFinish },
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<Resource>({});
  const { data: userData } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!project) return;
    const getResourceDetails = async () => {
      const response = await ResourcesService.getResourceById(
        project.folder_id
      );
      if (response.status === "error") {
        return;
      }
      setResource(response.resource);
    };
    getResourceDetails();
  }, [project]);

  const handleUploadFiles = async () => {
    if (!files || files.length === 0) return;
    if (!userData) return;
    setUploading(true);
    if (resource) {
      const percentPerItem = (1 / files.length) * 100;
      const uploadAllFiles = files.map(async (file) => {
        const token = userData as any;
        const accesstoken = token["access_token"];
        const metadata = {
          name: file.file.name,
          parents: [resource.resource_id],
        };
        const body = new FormData();
        body.append(
          "metadata",
          new Blob([JSON.stringify(metadata)], { type: "application/json" })
        );
        body.append("file", file.file);
        const response = await GoogleDriveService.uploadFile(accesstoken, body);
        if (!response) return;
        const createResourceBody = {
          resource_id: response,
          type: "image",
          parent_resource_id: resource.id,
        };
        try {
          const createResourceResponse = await axios({
            url: `${process.env.NEXT_PUBLIC_BASE_API_URL}/resources`,
            method: "POST",
            data: createResourceBody,
          });

          setProgress((oldProgress) => Math.ceil(oldProgress + percentPerItem));
          invalidate({
            resource: "resources",
            invalidates: ["all"],
          });
        } catch (err) {
          alert(err);
        }
      });
      await Promise.all(uploadAllFiles);
      setUploading(false);
      setLoading(true);
      open?.({ message: "Create project success", type: "success" });
      router.push(`/projects/edit/${project?.id}`);
    }
  };

  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString());
      reader.onerror = reject;
    });

  return (
    <Edit
      title={
        <h1 className="font-bold text-[1.5rem]">Step 3: Add project images</h1>
      }
      isLoading={formLoading}
      saveButtonProps={{ hidden: true, style: { display: "none" } }}
    >
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
        autoComplete="off"
      >
        <input {...getInputProps()} />

        <div
          {...getRootProps()}
          style={{
            minHeight: "200px",
            background: isDragActive ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.05)",
            boxShadow: isDragActive
              ? "0px 0px 10px 0px rgba(0,0,0,0.05)"
              : "none",
            transition: "all 0.2s ease",
          }}
          className="w-full flex flex-row flex-wrap gap-[10px] items-center p-[20px]"
        >
          {files?.length > 0 &&
            files.map((file, index) => (
              <div key={file.file.name} className="relative mb-[10px]">
                <img
                  src={file.base64}
                  alt="resource-img"
                  style={{ maxHeight: "200px" }}
                />
                <button
                  type="button"
                  className="absolute -top-[5px] -left-[5px] bg-[white] rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFiles((prev) => prev.filter((_, i) => i !== index));
                  }}
                >
                  <CancelIcon htmlColor="#F44336" />
                </button>
              </div>
            ))}
          <div className="w-full text-center">
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag and drop some files here, or click to select files</p>
            )}
          </div>
        </div>
      </Box>
      {files.length > 0 && (
        <div className="w-full flex flex-row justify-center items-center px-[60px] pt-[40px]">
          {/* <input
            type="file"
            multiple
            accept="image/*"
            onChange={async (e) => {
              if (e.target.files && e.target.files.length > 0) {
                const files = e.target.files as FileList;
                const filesArr: { file: File; base64: string }[] = [];
                for (let i = 0; i < files.length; i++) {
                  const file = files[i];
                  const base64 = (await toBase64(file)) as string;
                  filesArr.push({ file, base64 });
                }
                setFiles(filesArr);
              }
            }}
          /> */}

          <Button
            disabled={isUploading}
            type="button"
            onClick={handleUploadFiles}
            variant="contained"
            style={{
              width: "120px",
              padding: "8px 0px",
            }}
          >
            {!isUploading ? "Upload" : "Uploading..."}
          </Button>
        </div>
      )}
      {isUploading && <ProgressBar progress={progress} />}
      {isLoaing && <LoadingModal />}
    </Edit>
  );
};

export default CreateProjectStep3;
