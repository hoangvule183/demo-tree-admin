"use client";

import { Group, ProjectItem, Tag } from "@customTypes/apiResponse";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useList, useMany, useShow } from "@refinedev/core";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import React, { FormEvent, useCallback, useEffect, useState } from "react";

export default function GroupList() {
  const [name, setName] = useState("");
  const [filteredBy, setFilteredBy] = useState<{
    groupIds: number[];
    tagIds: number[];
  }>({
    groupIds: [],
    tagIds: [],
  });
  const { data: getGroupsData } = useList<Group>({
    resource: "groups",
  });
  const { data: getTagsData } = useList<Tag>({
    resource: "tags",
  });
  const [projectResourcePath, setProjectResourcePath] = useState("projects");
  const { dataGridProps } = useDataGrid<ProjectItem>({
    resource: projectResourcePath,
    pagination: { mode: "off" },
  });

  const getUpdatedResourcePath = useCallback(() => {
    let updatedResourcePath = "projects";
    if (filteredBy.groupIds.length > 0 || filteredBy.tagIds.length > 0) {
      updatedResourcePath = "projects/search?";
      if (filteredBy.groupIds.length > 0) {
        filteredBy.groupIds.forEach((groupId, i) => {
          updatedResourcePath += `group_id=${groupId}`;
          if (i < filteredBy.groupIds.length - 1) {
            updatedResourcePath += "&";
          }
        });
      }
      if (filteredBy.tagIds.length > 0) {
        filteredBy.tagIds.forEach((tagId, i) => {
          updatedResourcePath += `tag_id=${tagId}`;
          if (i < filteredBy.tagIds.length - 1) {
            updatedResourcePath += "&";
          }
        });
      }
    }
    return updatedResourcePath;
  }, [filteredBy]);

  useEffect(() => {
    const updatedResourcePath = getUpdatedResourcePath();
    setProjectResourcePath(updatedResourcePath);
  }, [filteredBy, getUpdatedResourcePath]);

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        type: "number",
        width: 150,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "project_name",
        headerName: "Name",
        flex: 1,
      },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        renderCell: function render({ row }) {
          return (
            <>
              <EditButton hideText recordItemId={row.id} />
              <ShowButton hideText recordItemId={row.id} />
            </>
          );
        },
        align: "center",
        headerAlign: "center",
        width: 200,
      },
    ],
    []
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length > 0) {
      let updatedResourcePath = getUpdatedResourcePath();
      if (updatedResourcePath.includes("search")) {
        updatedResourcePath += `&q=${name}`;
      } else {
        updatedResourcePath += `/search?q=${name}`;
      }
      setProjectResourcePath(updatedResourcePath);
    } else {
      let updatedResourcePath = getUpdatedResourcePath();
      setProjectResourcePath(updatedResourcePath);
    }
  };

  return (
    <List>
      <div className="w-full flex flex-row flex-wrap justify-start pb-[40px]">
        <form onSubmit={submit} className="w-full mb-[20px]">
          <TextField
            value={name}
            style={{ width: "400px" }}
            label="Project name"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setName(event.target.value);
            }}
          />
        </form>
        {getGroupsData?.data && getGroupsData.data.length > 0 && (
          <FormGroup className="w-[30%]">
            <div className="w-full mb-[10px]">Filter by groups:</div>
            {getGroupsData.data.map((group) => (
              <FormControlLabel
                key={group.id}
                control={
                  <Checkbox
                    checked={filteredBy.groupIds.includes(group.id)}
                    onClick={() => {
                      const updatedFilteredBy = Object.assign({}, filteredBy);
                      const isChecked = filteredBy.groupIds.includes(group.id);
                      if (!isChecked) {
                        updatedFilteredBy.groupIds.push(group.id);
                      } else {
                        updatedFilteredBy.groupIds =
                          updatedFilteredBy.groupIds.filter(
                            (id) => id !== group.id
                          );
                      }
                      setFilteredBy(updatedFilteredBy);
                    }}
                  />
                }
                label={group.name}
              />
            ))}
          </FormGroup>
        )}
        {getTagsData?.data && getTagsData.data.length > 0 && (
          <FormGroup className="w-[30%]">
            <div className="w-full mb-[10px]">Filter by tags:</div>
            {getTagsData.data.map((tag) => (
              <FormControlLabel
                key={tag.id}
                control={
                  <Checkbox
                    checked={filteredBy.tagIds.includes(tag.id)}
                    onClick={() => {
                      const updatedFilteredBy = Object.assign({}, filteredBy);
                      const isChecked = filteredBy.tagIds.includes(tag.id);
                      if (!isChecked) {
                        updatedFilteredBy.tagIds.push(tag.id);
                      } else {
                        updatedFilteredBy.tagIds =
                          updatedFilteredBy.tagIds.filter(
                            (id) => id !== tag.id
                          );
                      }
                      setFilteredBy(updatedFilteredBy);
                    }}
                  />
                }
                label={tag.name}
              />
            ))}
          </FormGroup>
        )}
      </div>

      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        sortingMode="client"
        paginationMode="client"
      />
    </List>
  );
}
