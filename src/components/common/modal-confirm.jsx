import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";
import Paper from "@material-ui/core/Paper";

class ModalConfirm extends Component {
  render() {
    return (
      <Dialog
        disableRestoreFocus
        open={this.props.open}
        onClose={this.props.hadleClickCloseConfirmModal}
        aria-labelledby="form-dialog-title"
      >
        <Paper style={{ padding: 20 }}>
          <DialogContentText style={{ padding: 30 }}>
            {this.props.content}
          </DialogContentText>
          <DialogActions style={{ marginTop: 20 }}>
            <Button onClick={this.props.hadleClickCloseConfirmModal} color="inherit">
              Close
            </Button>
            <Button onClick={this.props.hadleClickSubmitConfirmModal} color="inherit">
              Ok
            </Button>
          </DialogActions>
        </Paper>
      </Dialog>
    );
  }
}

export default ModalConfirm;
