import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function Alert({ open, topic, handleClose, handleAgreed }) {
  return (
    <Dialog open={open}>
      <DialogTitle id="alert-dialog-title">{"Create topic"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {topic}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAgreed}>Agree</Button>
        <Button onClick={handleClose}>Disable</Button>
      </DialogActions>
    </Dialog>
  );
}
