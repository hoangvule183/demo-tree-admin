"use client";

import {
  Accordion,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import { useList, useNotification } from "@refinedev/core";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import GoogleDriveService from "@services/googleDrive.service";
import ProjectsService from "@services/projects.service";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CreateProjectStep2 from "./step2";
import { ProjectItem } from "@customTypes/apiResponse";
import LoadingModal from "@components/LoadingModal";
import { group } from "console";
import CreateProjectStep3 from "./step3";

export type GroupWithTags = {
  group_id: number;
  tag_ids: number[];
};

export default function CreatePage() {
  const {
    setValue,
    refineCore: { formLoading, onFinish },
    handleSubmit,
    register,
    clearErrors,
    getValues,
    setError,
    formState: { errors },
  } = useForm({});
  const { data: userData } = useSession();
  const [isLoading, setLoading] = useState(false);
  const { open, close } = useNotification();
  const [selectedGroups, setSelectedGroups] = useState<GroupWithTags[]>([]);
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [createdProject, setCreatedProject] = useState<ProjectItem | null>(
    null
  );

  const { data: getGroupsData, isLoading: isLoadingGroups } = useList({
    resource: "groups",
    pagination: { mode: "off" },
  });

  const { data: getTagsData, isLoading: isLoadingTags } = useList({
    resource: "tags",
    pagination: { mode: "off" },
  });

  useEffect(() => {
    setValue("groups_tags", selectedGroups);
  }, [selectedGroups, setValue]);

  const onFinishHandler = async (e: any) => {
    clearErrors();

    const emptyTagsGroupIds: number[] = [];
    selectedGroups.forEach((group) => {
      if (!group.tag_ids || group.tag_ids.length === 0) {
        emptyTagsGroupIds.push(group.group_id);
      }
    });

    if (emptyTagsGroupIds.length > 0) {
      emptyTagsGroupIds.forEach((id) => {
        setError(`group_${id}`, {
          message: "you have to choose at least one tag bellow",
        });
      });
      return;
    }

    const name = getValues("name");
    const description = getValues("description");
    const start_date = getValues("start_date");
    const groups_tags = getValues("groups_tags");

    const token = userData as any;
    const accesstoken = token["access_token"];
    if (!accesstoken) return;
    setLoading(true);
    const response = await GoogleDriveService.uploadFolder(accesstoken, name);
    if (!response) {
      setLoading(false);
      return;
    }

    const data = {
      name,
      description,
      start_date,
      groups_tags,
      folder_id: response,
    };

    const createProjectRes = await ProjectsService.create(data);
    if (createProjectRes.status === "error") {
      open?.({
        message:
          "Cannot update project informations. " + createProjectRes.errorMsg,
        type: "error",
      });
      handleError(createProjectRes.errorMsg, response, accesstoken);
      setLoading(false);
      return;
    }
    setLoading(false);
    open?.({
      message: "Create project's basic informations success",
      type: "success",
    });
    setCreatedProject(createProjectRes.project);
    setStep(2);
  };

  const handleError = async (
    message: string,
    folderId: string,
    accessToken: string
  ) => {
    if (message.includes("project_name")) {
      setError("name", { message });
    }
    if (message.includes("description")) {
      setError("description", { message });
    }
    if (message.includes("start_date")) {
      setError("start_date", { message });
    }
    const deleteFolderRes = await GoogleDriveService.deleteFileOrFolder(
      folderId,
      accessToken
    );
    if (deleteFolderRes) {
    } else {
    }
  };

  if (step === 2) {
    return <CreateProjectStep2 project={createdProject} setStep={setStep} />;
  }

  if (step === 3) {
    return <CreateProjectStep3 project={createdProject} />;
  }

  return (
    <form onSubmit={handleSubmit(onFinishHandler)}>
      <Create
        title={
          <h1 className="font-bold text-[1.5rem]">
            Step 1: Add project basic informations
          </h1>
        }
        isLoading={isLoading}
        saveButtonProps={{ onClick: onFinishHandler }}
      >
        <TextField
          {...register("name", {
            required: "This field is required",
          })}
          required
          error={!!(errors as any)?.name}
          helperText={(errors as any)?.name?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"Name"}
          name="name"
        />

        <TextField
          {...register("description")}
          error={!!(errors as any)?.description}
          helperText={(errors as any)?.description?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"Description"}
          name="description"
        />

        <TextField
          {...register("start_date", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.start_date}
          helperText={(errors as any)?.start_date?.message}
          margin="normal"
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          type="date"
          label={"Start date"}
          name="start_date"
          defaultValue={new Date()}
        />

        <div className="w-full flex flex-row justify-between mt-[20px]">
          {!isLoadingGroups &&
            getGroupsData?.data &&
            getGroupsData.data.length > 0 && (
              <FormGroup className="w-[100%]">
                <div className="mb-[15px]">Groups & Tags</div>
                {getGroupsData?.data.map((data, gIndex) => (
                  <div key={data.id + "_" + selectedGroups.length}>
                    <FormControlLabel
                      onClick={() => {
                        const isIn =
                          selectedGroups.findIndex(
                            (ele) => ele.group_id === (data.id as number)
                          ) !== -1;
                        if (!isIn) {
                          setSelectedGroups((prevGroups) => [
                            ...prevGroups,
                            {
                              group_id: data.id as number,
                              tag_ids: [],
                            },
                          ]);
                        } else {
                          setSelectedGroups((prevGroups) =>
                            prevGroups.filter(
                              (item) => item.group_id != (data.id as number)
                            )
                          );
                        }
                      }}
                      control={
                        <Checkbox
                          checked={
                            selectedGroups.findIndex(
                              (ele) => ele.group_id === (data.id as number)
                            ) !== -1
                          }
                        />
                      }
                      label={data.name}
                    />
                    {(errors as any)?.[`group_${data.id}`]?.message && (
                      <div className="text-[#FF3300] text-[0.95rem]">
                        Error: {(errors as any)?.[`group_${data.id}`]?.message}
                      </div>
                    )}
                    {!isLoadingTags &&
                      getTagsData?.data &&
                      getTagsData.data.length > 0 &&
                      selectedGroups.findIndex(
                        (ele) => ele.group_id === (data.id as number)
                      ) !== -1 && (
                        <Accordion
                          style={{
                            background: "white",
                          }}
                          expanded={
                            selectedGroups.findIndex(
                              (ele) => ele.group_id === (data.id as number)
                            ) !== -1
                          }
                          defaultExpanded={false}
                          disabled={
                            selectedGroups.findIndex(
                              (ele) => ele.group_id === (data.id as number)
                            ) !== -1
                          }
                        >
                          {/* <AccordionSummary
                            expandIcon={<GridExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                          >
                            Tag(s)
                          </AccordionSummary> */}
                          <AccordionDetails>
                            <FormGroup className="w-[100%]">
                              {getTagsData?.data.map((tag) => {
                                return (
                                  <FormControlLabel
                                    onClick={(e) => {
                                      let updatedSelectedGroups = Object.assign(
                                        [],
                                        selectedGroups
                                      ) as GroupWithTags[];
                                      const foundIndex =
                                        updatedSelectedGroups.findIndex(
                                          (ele) => ele.group_id === data.id
                                        );
                                      const isIn = updatedSelectedGroups[
                                        foundIndex
                                      ].tag_ids.includes(tag.id as number);
                                      if (!isIn) {
                                        updatedSelectedGroups[
                                          foundIndex
                                        ].tag_ids.push(tag.id as number);
                                      } else {
                                        updatedSelectedGroups[
                                          foundIndex
                                        ].tag_ids = updatedSelectedGroups[
                                          foundIndex
                                        ].tag_ids.filter(
                                          (ele) => ele !== (tag.id as number)
                                        );
                                      }
                                      setSelectedGroups(updatedSelectedGroups);
                                    }}
                                    key={data.id}
                                    control={
                                      <Checkbox
                                        checked={selectedGroups[
                                          gIndex
                                        ]?.tag_ids?.includes(tag.id as number)}
                                      />
                                    }
                                    label={tag.name}
                                  />
                                );
                              })}
                            </FormGroup>
                          </AccordionDetails>
                        </Accordion>
                      )}
                  </div>
                ))}
              </FormGroup>
            )}
        </div>
      </Create>
      {isLoading && <LoadingModal />}
    </form>
  );
}
