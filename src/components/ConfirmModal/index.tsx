"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Fragment } from "react";

const ConfirmModal = ({
  open,
  handleCancel,
  handleOk,
  content,
  title = "",
}: {
  open: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  content: string;
  title?: string;
}) => {
  return (
    <Fragment>
      <Dialog
        fullScreen={false}
        open={open}
        onClose={handleCancel}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleOk} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default ConfirmModal;
