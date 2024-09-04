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

type Group = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string | null;
};

export default function GroupList() {
  const { dataGridProps } = useDataGrid<Group>({
    resource: "projects",
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
