"use client";

import {
  Accordion,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import { useList, useOnError } from "@refinedev/core";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import GoogleDriveService from "@services/googleDrive.service";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type GroupWithTags = {
  group_id: number;
  tag_ids: number[];
};

export default function CreatePage() {
  const {
    saveButtonProps,
    setValue,
    refineCore: { formLoading, onFinish },
    handleSubmit,
    register,
    control,
    getValues,
    formState: { errors },
  } = useForm({});
  const { data: userData } = useSession();
  const { mutate: onError } = useOnError();
  const [selectedGroups, setSelectedGroups] = useState<GroupWithTags[]>([]);

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
    const name = getValues("name");
    const description = getValues("description");
    const start_date = getValues("start_date");
    const groups_tags = getValues("groups_tags");

    const token = userData as any;
    const accesstoken = token["access_token"];
    if (!accesstoken) return;
    const response = await GoogleDriveService.uploadFolder(accesstoken, name);
    if (!response) return;

    const data = {
      name,
      description,
      start_date,
      groups_tags,
      folder_id: response,
    };
    onFinish(data);
  };

  return (
    <form onSubmit={handleSubmit(onFinishHandler)}>
      <Create
        isLoading={formLoading}
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
                              {getTagsData?.data.map((data) => {
                                return (
                                  <FormControlLabel
                                    onClick={(e) => {
                                      let updatedSelectedGroups = Object.assign(
                                        [],
                                        selectedGroups
                                      ) as GroupWithTags[];
                                      const isIn = updatedSelectedGroups[
                                        gIndex
                                      ].tag_ids.includes(data.id as number);
                                      if (!isIn) {
                                        updatedSelectedGroups[
                                          gIndex
                                        ].tag_ids.push(data.id as number);
                                      } else {
                                        updatedSelectedGroups[gIndex].tag_ids =
                                          updatedSelectedGroups[
                                            gIndex
                                          ].tag_ids.filter(
                                            (ele) => ele !== (data.id as number)
                                          );
                                      }
                                      setSelectedGroups(updatedSelectedGroups);
                                    }}
                                    key={data.id}
                                    control={
                                      <Checkbox
                                        checked={selectedGroups[
                                          gIndex
                                        ]?.tag_ids?.includes(data.id as number)}
                                      />
                                    }
                                    label={data.name}
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
    </form>
  );
}
