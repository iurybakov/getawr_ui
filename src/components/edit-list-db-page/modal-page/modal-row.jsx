import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Tooltip from "@material-ui/core/Tooltip";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";

class ModalRow extends Component {
  render() {
    return (
      <div>
        <Dialog
          disableRestoreFocus
          open={this.props.open}
          onClose={this.props.hadleClickModalRowClose}
          aria-labelledby="form-dialog-title"
        >
          <form
            style={{ padding: 30 }}
            autocomplete="off"
            action="#"
            onSubmit={this.props.hadleClickModalSubmit}
          >
            <DialogTitle id="form-dialog-title">
              <Typography inline color="inherit" variant="inherit">
                You can {this.props.isEditModalType ? "edit" : "add"} info about
                Oracle DB connection
              </Typography>
              <Fade
                in={
                  this.props.statusModal === "performing request, please wait"
                }
              >
                <CircularProgress
                  variant="indeterminate"
                  disableShrink
                  style={{
                    float: "right",
                    color: "#6798e5",
                    animationDuration: "550ms"
                  }}
                  size={24}
                  thickness={4}
                />
              </Fade>
            </DialogTitle>
            <DialogContent>
              <TextField
                required
                margin="dense"
                id="name"
                label="DB name (name)"
                fullWidth
                onChange={this.props.handleChangeRowModal("name")}
                value={this.props.values.name}
              />
              <TextField
                required
                margin="dense"
                id="host"
                label="Host"
                fullWidth
                onChange={this.props.handleChangeRowModal("host")}
                value={this.props.values.host}
              />
              <TextField
                required
                margin="dense"
                id="port"
                label="Port"
                fullWidth
                onChange={this.props.handleChangeRowModal("port")}
                value={this.props.values.port}
              />
              <TextField
                required
                margin="dense"
                id="sid"
                label="Sid"
                fullWidth
                onChange={this.props.handleChangeRowModal("sid")}
                value={this.props.values.sid}
              />
              <TextField
                required
                margin="dense"
                id="login"
                label="Login"
                fullWidth
                onChange={this.props.handleChangeRowModal("login")}
                value={this.props.values.login}
              />
              <Tooltip
                placement={"bottom-start"}
                title={
                  this.props.isEditModalType
                    ? "If you want edit reenter all password, or just don't change"
                    : ""
                }
              >
                <TextField
                  required
                  margin="dense"
                  id="pass"
                  label={"Password"}
                  onChange={this.props.handleChangeRowModal("pass")}
                  value={this.props.values.pass}
                  type="password"
                  fullWidth
                />
              </Tooltip>
            </DialogContent>

            <div style={{ display: "flex", flexDirection: "row", padding: 20 }}>
              <Typography
                style={{ padding: 10 }}
                color="inherit"
                variant="inherit"
              >
                status: {this.props.statusModal}
              </Typography>
            </div>
            <DialogActions>
              <Button
                onClick={this.props.hadleClickModalRowClose}
                color="primary"
              >
                Close
              </Button>
              <Button
                disabled={
                  this.props.statusModal === "performing request, please wait"
                }
                type="submit"
                color="primary"
              >
                Submit
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    );
  }
}

export default ModalRow;
