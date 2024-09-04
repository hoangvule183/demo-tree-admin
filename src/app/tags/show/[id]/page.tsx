"use client";

import { Stack, Typography } from "@mui/material";
import { useOne, useShow } from "@refinedev/core";
import {
  DateField,
  MarkdownField,
  Show,
  TextFieldComponent as TextField,
} from "@refinedev/mui";

export default function BlogPostShow() {
  const { queryResult } = useShow({ resource: "tags" });

  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          {"ID"}
        </Typography>
        <TextField value={record?.id} />

        <Typography variant="body1" fontWeight="bold">
          {"Name"}
        </Typography>
        <TextField value={record?.name} />

        <Typography variant="body1" fontWeight="bold">
          {"CreatedAt"}
        </Typography>
        <DateField value={record?.createdAt} />

        <Typography variant="body1" fontWeight="bold">
          {"UpdatedAt"}
        </Typography>
        {record?.updatedAt ? (
          <DateField value={record?.updatedAt} />
        ) : (
          <TextField value={"..."} />
        )}
      </Stack>
    </Show>
  );
}
