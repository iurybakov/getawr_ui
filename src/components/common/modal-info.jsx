import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import { Link as RouteLinkHiddenName } from "react-router-dom";

const RouteLink = props => <RouteLinkHiddenName {...props} />;

class ModalInfo extends Component {
  state = {};
  render() {
    return (
      <Dialog
        disableRestoreFocus
        open={this.props.open}
        onClose={this.props.hadleClickClose}
        aria-labelledby="form-dialog-title"
      >
        <Paper style={{ padding: 20 }}>
          <DialogTitle>{this.props.title}</DialogTitle>
          <hr />
          <DialogContentText style={{ padding: 30 }}>
            {this.props.content}
          </DialogContentText>
          <hr />
          <DialogActions style={{ marginTop: 20 }}>
            <Button onClick={this.props.hadleClickClose} color="inherit">
              Close
            </Button>
            <Button
              style={{ marginLeft: 10 }}
              component={RouteLink}
              to={this.props.route}
              color="inherit"
            >
              {this.props.routeButtonName}
            </Button>
          </DialogActions>
        </Paper>
      </Dialog>
    );
  }
}

export default ModalInfo;
