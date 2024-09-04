"use client";

import { ProjectDetails } from "@customTypes/apiResponse";
import { CheckBox } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Select,
  TextField,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useNotification } from "@refinedev/core";
import { Edit, useAutocomplete } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import ProjectsService from "@services/projects.service";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";

export default function EditPage() {
  const router = useRouter();
  const { open } = useNotification();
  const [file, setFile] = useState<File | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading, onFinish },
    handleSubmit,
    register,
    getValues,
    control,
    setError,
    formState: { errors },
  } = useForm<ProjectDetails>({});

  const onFinishHandler = async (e: any) => {
    e.preventDefault();
    if (queryResult?.data?.data) {
      const name = getValues("project_name");
      const description = getValues("description");
      const is_show = getValues("is_show");
      const response = await ProjectsService.update(queryResult.data.data.id, {
        name,
        description,
        is_show,
      });
      if (response.status === "error") {
        open?.({
          message: "Cannot update project informations. " + response.errorMsg,
          type: "error",
        });
        handleError(response.errorMsg);
        return;
      }
      open?.({
        message: "Update project informations success.",
        type: "success",
      });
    }
  };

  const handleError = async (message: string) => {
    if (message.includes("project_name")) {
      setError("project_name", { message });
    }
    if (message.includes("description")) {
      setError("description", { message });
    }
    if (message.includes("start_date")) {
      setError("start_date", { message });
    }
  };

  return (
    <Edit
      isLoading={formLoading}
      saveButtonProps={{ onClick: onFinishHandler }}
    >
      <Box
        onSubmit={handleSubmit(onFinishHandler)}
        component="form"
        sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
        autoComplete="off"
      >
        <TextField
          {...register("project_name", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.project_name}
          helperText={(errors as any)?.project_name?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"Name"}
          name="project_name"
        />

        <TextField
          {...register("description", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.description}
          helperText={(errors as any)?.description?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"Description"}
          name="description"
        />

        <div className="w-full flex flex-row items-center gap-[10px] pb-[15px] pt-[10px]">
          <TextField
            {...register("is_show")}
            error={!!(errors as any)?.is_show}
            helperText={(errors as any)?.is_show?.message}
            margin="normal"
            type="checkbox"
            name="is_show"
            InputLabelProps={{ hidden: true, style: { display: "none" } }}
            FormHelperTextProps={{ hidden: true }}
            InputProps={{ style: { width: "22px" } }}
          />
          <div className="pt-[10px]">Show on landing page</div>
        </div>

        <div className="w-full flex items-center gap-[10px]">
          <Button
            type="button"
            onClick={() => {
              router.push(
                `/resources/edit/${queryResult?.data?.data.folder_id}?type=thumbnail`
              );
            }}
            variant="contained"
            style={{
              marginTop: "10px",
            }}
          >
            View thumbnail
          </Button>

          <Button
            type="button"
            onClick={() => {
              router.push(
                `/resources/edit/${queryResult?.data?.data.folder_id}`
              );
            }}
            variant="contained"
            style={{
              marginTop: "10px",
            }}
          >
            View images
          </Button>
        </div>
      </Box>
    </Edit>
  );
}
