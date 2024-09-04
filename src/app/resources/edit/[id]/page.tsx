/* eslint-disable @next/next/no-img-element */
"use client";

import { Autocomplete, Box, Button, Select, TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { Edit, useAutocomplete } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import GoogleDriveService from "@services/googleDrive.service";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useInvalidate } from "@refinedev/core";
import { Resource } from "@customTypes/apiResponse";
import { useDropzone } from "react-dropzone";
import CancelIcon from "@mui/icons-material/Cancel";
import ProgressBar from "@components/ProgressBar";
import ConfirmModal from "@components/ConfirmModal";
import ResourcesService from "@services/resources.service";
import { useParams, useSearchParams } from "next/navigation";

export default function EditPage() {
  const [type, setType] = useState<"thumbnail" | "resources">("resources");
  const [file, setFile] = useState<File | null>(null);
  const [isOpenConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [isUploading, setUploading] = useState(false);
  const invalidate = useInvalidate();
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading, onFinish },
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<Resource>({});
  const searchParams = useSearchParams();
  const { data: userData } = useSession();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: type === "thumbnail" ? 1 : 100,
  });
  const [resourceToBeDeleted, setResourceToBeDeleted] =
    useState<Resource | null>(null);

  useEffect(() => {
    if (searchParams.has("type") && searchParams.get("type") === "thumbnail") {
      setType("thumbnail");
    } else {
      setType("resources");
    }
  }, [searchParams]);

  const handleUploadFile = async () => {
    if (!file) return;
    if (!userData) return;
    setUploading(true);
    if (queryResult?.data?.data) {
      const token = userData as any;
      const accesstoken = token["access_token"];

      const metadata = {
        name: file.name,
        parents: [queryResult.data.data.resource_id],
      };

      const body = new FormData();
      body.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      body.append("file", file);
      const response = await GoogleDriveService.uploadFile(accesstoken, body);
      if (!response) return;
      const createResourceBody = {
        resource_id: response,
        type: "image",
        parent_resource_id: queryResult.data.data.id,
        is_thumbnail: type === "thumbnail" ? true : false,
      };
      try {
        const createResourceResponse = await axios({
          url: `${process.env.NEXT_PUBLIC_BASE_API_URL}/resources`,
          method: "POST",
          data: createResourceBody,
        });
        invalidate({
          resource: "resources",
          invalidates: ["all"],
        });
      } catch (err) {
        alert(err);
      }
      setUploading(false);
    }
  };

  const handleDeleteResource = async () => {
    setOpenConfirmDeleteModal(false);
    if (!userData || !resourceToBeDeleted) return;
    const token = userData as any;
    const accesstoken = token["access_token"];
    const deleteFromGGDriveRes = await GoogleDriveService.deleteFileOrFolder(
      resourceToBeDeleted.resource_id,
      accesstoken
    );
    if (!deleteFromGGDriveRes) {
      return;
    }
    const deleteFromDBRes = await ResourcesService.deteleResource(
      resourceToBeDeleted.id
    );
    if (!deleteFromDBRes) {
      return;
    }
    alert("success");
    invalidate({
      resource: "resources",
      invalidates: ["all"],
    });
  };

  return (
    <Edit
      title={
        <h1 className="font-bold text-[1.5rem]">
          {type === "thumbnail"
            ? `Project's thumbnail`
            : `All project's images`}
        </h1>
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
            background: isDragActive
              ? "rgba(255, 118, 118, 0.1)"
              : "rgba(0,0,0,0.05)",
            boxShadow: isDragActive
              ? "0px 0px 10px 0px rgba(0,0,0,0.05)"
              : "none",
            transition: "all 0.2s ease",
          }}
          className="w-full flex flex-row flex-wrap gap-[10px] items-center p-[20px]"
        >
          {queryResult?.data?.data.child_resources &&
            queryResult.data.data.child_resources.length > 0 &&
            queryResult.data.data.child_resources
              .filter((item) =>
                type === "thumbnail"
                  ? item.is_thumbnail === true
                  : item.is_thumbnail === false
              )
              .map((resource) => (
                <div
                  key={resource.id}
                  className="w-[24%] aspect-square relative mb-[10px]"
                >
                  <img
                    src={`https://lh3.googleusercontent.com/d/${resource.resource_id}`}
                    alt="resource-img"
                    width="100%"
                  />
                  <button
                    type="button"
                    className="absolute -top-[5px] -left-[5px] bg-[white] rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setResourceToBeDeleted(resource);
                      setOpenConfirmDeleteModal(true);
                    }}
                  >
                    <CancelIcon htmlColor="#F44336" />
                  </button>
                </div>
              ))}

          <div className="w-full text-center">
            {type === "resources" &&
              (isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag and drop some files here, or click to select files</p>
              ))}

            {type === "thumbnail" &&
              (isDragActive ? (
                <p>Drop the your thumbnail image here ...</p>
              ) : (
                <p>
                  Drag and drop your thumbnail here, or click to select file
                </p>
              ))}
          </div>
        </div>
      </Box>
      {/* {files.length > 0 && (
        <div className="w-full flex flex-row justify-center items-center px-[60px] pt-[40px]">
          <Button
            disabled={isUploading}
            type="button"
            // onClick={handleUploadFiles}
            variant="contained"
            style={{
              width: "120px",
              padding: "8px 0px",
            }}
          >
            {!isUploading ? "Upload" : "Uploading..."}
          </Button>
        </div>
      )} */}
      {/* {isUploading && <ProgressBar progress={progress} />}
      {isLoaing && <LoadingModal />} */}
      <ConfirmModal
        open={isOpenConfirmDeleteModal && resourceToBeDeleted ? true : false}
        title="Delete"
        content="Are you sure you want to delete this item?"
        handleCancel={() => setOpenConfirmDeleteModal(false)}
        handleOk={handleDeleteResource}
      />
    </Edit>
  );
}
