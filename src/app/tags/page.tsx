"use client";

import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import React from "react";

type Tag = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string | null;
};

export default function TagList() {
  const { dataGridProps } = useDataGrid<Tag>({
    resource: "tags",
    pagination: { mode: "off" },
  });

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
        field: "name",
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

  return (
    <List>
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
