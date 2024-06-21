import * as React from "react";
import PropTypes from "prop-types";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Divider } from "@mui/material";

function SimpleDialog(props) {
  const { onClose, selectedValue, open, apiData } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle textAlign={"center"} bgcolor={"#2d2d2d"} color={"white"}>
        <h2 style={{ margin: "0px", borderRadius: "5px" }}>API Data</h2>
      </DialogTitle>
      <Divider />
      <List sx={{ pt: 0, padding: "0px 30px 10px 30px" }}>
        <ListItem disableGutters key={0} style={{ cursor: "pointer" }}>
          <h3>Current Tick : {String(apiData["0"])}</h3>
        </ListItem>
        <ListItem disableGutters key={1}>
          <h3>Gap : {String(apiData["1"])}seconds</h3>
        </ListItem>
        <ListItem disableGutters key={2}>
          <h3>Reward : {String(apiData["2"])}GWEI</h3>
        </ListItem>
        <ListItem disableGutters key={3}>
          <h3> Fee : {String(apiData["3"])}GWEI</h3>
        </ListItem>
        <ListItem disableGutters key={4}>
          <h3> FRESH_SEC_DELTA : {String(apiData["4"])}seconds</h3>
        </ListItem>
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

const DetailedDialog = (props) => {
  const { dialogOpened, setDialogOpened, apiData } = props;

  const handleClose = (value) => {
    setDialogOpened(false);
  };

  return (
    <div>
      <SimpleDialog
        open={dialogOpened}
        onClose={handleClose}
        apiData={apiData}
      />
    </div>
  );
};

export default DetailedDialog;
