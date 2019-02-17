import React from "react";
import AppBarAwr from "../common/app-bar-awr";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Redirect } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import ToggleOnIcon from "@material-ui/icons/ToggleOn";
import ToggleOffIcon from "@material-ui/icons/ToggleOff";
import Fade from "@material-ui/core/Fade";
import CircularProgress from "@material-ui/core/CircularProgress";
import { requestInsertOrUpdateCredential } from "../common/requests";
import AbstractFilterDataForTable from "../common/abstract-filtered-data";
import ModalInfo from "../common/modal-info";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";

const rowsPerPage = 7;

const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(4);

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3,
    width: 650,
    minWidth: 650
  },
  paperRoot: {
    padding: theme.spacing.unit * 3
  },
  paperTable: {
    overflowX: "auto"
  },
  tableCellButtons: {
    width: 80,
    minWidth: 80
  },
  tableCellEnabled: {
    width: 40,
    minWidth: 40
  },
  spiner: {
    marginLeft: "auto",
    color: "#6798e5",
    animationDuration: "550ms"
  },
  paperAdd: {
    padding: 17,
    marginTop: theme.spacing.unit * 2
  },
  snackbar: {
    padding: theme.spacing.unit / 2
  }
});

class Admin extends AbstractFilterDataForTable {
  constructor(props) {
    super(props, rowsPerPage);
    this.state = {
      data: [],
      numAllRows: 0,
      page: 0,
      isLoad: true,
      forbidden: false,
      row: { user: "", pass: "", role: "" },
      isOpenSnackbar: false,
      messageSnackbar: "",
      isntRedirect: true
    };

    this.innerMeta.endPointRequest = "edit/admin";
    this.innerMeta.typeRequest = "content";
    this.innerMeta.initMethod();
    this.innerMeta.initMethod = null;
  }

  inserOrUpdateCallback = resp => {
    if (resp.success === true)
      this.setState({
        data: resp.body.data,
        isLoad: false,
        numAllRows: resp.body.properties.allRows,        
      });
    else
      this.setState({
        isLoad: false,
        isOpenSnackbar: true,
        messageSnackbar: resp.body
      });
  };

  handleOperateRow = (id, action) => () => {
    this.setState({ isLoad: true });
    requestInsertOrUpdateCredential(
      "edit/admin",
      "operate",
      {
        id: id,
        action: action,
        pageNumber: 0,
        countRowsPerPage: rowsPerPage
      },
      this.inserOrUpdateCallback,
      this.forbidenCallBack
    );
  };

  hadleClickSubmit = () => {
    this.setState({ isLoad: true });

    const row = { ...this.state.row };
    row.pass = bcrypt.hashSync(row.pass, salt);

    requestInsertOrUpdateCredential(
      "edit/admin",
      "insert",
      {
        ...row,
        pageNumber: 0,
        countRowsPerPage: rowsPerPage
      },
      this.inserOrUpdateCallback,
      this.forbidenCallBack
    );
  };

  handleChangeRow = name => event => {
    const { row } = this.state;
    row[name] = event.target.value;
    this.setState({ row: row });
  };

  handleCloseModal = () => {
    this.setState({
      data: [],
      numAllRows: 0,
      page: 0,
      isLoad: true,
      forbidden: false,
      row: { user: "", pass: "", role: "" },
      isOpenSnackbar: false,
      messageSnackbar: "",
      isntRedirect: false
    });
  };

  render() {
    const { classes } = this.props;
    const {
      data,
      numAllRows,
      page,
      isLoad,
      forbidden,
      row,
      isOpenSnackbar,
      messageSnackbar,
      isntRedirect
    } = this.state;
    const emptyRows = rowsPerPage - data.length;

    if (isntRedirect)
      return (
        <React.Fragment>
          <AppBarAwr />
          <div className={classes.root}>
            <Paper className={classes.paperRoot}>
              <Paper className={classes.paperTable}>
                <Toolbar>
                  <Typography variant="h6" id="tableTitle">
                    Editing list of users
                  </Typography>

                  <Fade in={isLoad}>
                    <CircularProgress
                      variant="indeterminate"
                      disableShrink
                      className={classes.spiner}
                      size={24}
                      thickness={4}
                    />
                  </Fade>
                </Toolbar>
                <Table>
                  <TableHead>
                    <TableRow className={classes.tableRow}>
                      <TableCell padding="dense" align="left">
                        Username
                      </TableCell>
                      <TableCell padding="dense" align="left">
                        Role
                      </TableCell>
                      <TableCell
                        padding="none"
                        className={classes.tableCellEnabled}
                        align="left"
                      >
                        Enabled
                      </TableCell>
                      <TableCell
                        colSpan={1}
                        padding="dense"
                        className={classes.tableCellButtons}
                        align="left"
                      />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map(row => {
                      return (
                        <TableRow className={classes.tableRow} key={row.id}>
                          <TableCell padding="dense">{row.username}</TableCell>
                          <TableCell padding="dense" align="left">
                            {row.role}
                          </TableCell>
                          <TableCell padding="dense" align="left">
                            {row.enabled + ""}
                          </TableCell>
                          <TableCell padding="none" align="left">
                            <IconButton
                              onClick={this.handleOperateRow(
                                row.id,
                                row.enabled === true ? "disable" : "enable"
                              )}
                              style={{ marginLeft: 10 }}
                              aria-label="Operate"
                              disabled={isLoad}
                            >
                              {row.enabled === true ? (
                                <ToggleOnIcon />
                              ) : (
                                <ToggleOffIcon />
                              )}
                            </IconButton>
                            <IconButton
                              style={{ marginLeft: 10 }}
                              onClick={this.handleOperateRow(row.id, "delete")}
                              aria-label="Delete"
                              disabled={isLoad}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 49 * emptyRows }}>
                        <TableCell colSpan={6}>
                          <Fade in={emptyRows === rowsPerPage}>
                            <Typography variant="h6" id="tableTitle">
                              Loading...
                            </Typography>
                          </Fade>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[rowsPerPage]}
                  component="div"
                  count={numAllRows}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  backIconButtonProps={{
                    "aria-label": "Previous Page"
                  }}
                  nextIconButtonProps={{
                    "aria-label": "Next Page"
                  }}
                  onChangePage={this.handleChangePage}
                />
              </Paper>
              <Paper className={classes.paperAdd}>
                <form
                  autocomplete="off"
                  action="#"
                  onSubmit={this.hadleClickSubmit}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <TextField
                    required
                    style={{ width: 180, marginRight: 10 }}
                    id="username"
                    label="Username"
                    onChange={this.handleChangeRow("user")}
                    value={row["user"]}
                  />
                  <TextField
                    required
                    style={{ width: 180, marginRight: 10 }}
                    id="password"
                    label="Password"
                    type="password"
                    onChange={this.handleChangeRow("pass")}
                    value={row["pass"]}
                  />
                  <TextField
                    required
                    select
                    style={{ width: 90, marginRight: 10 }}
                    id="role"
                    label="Role"
                    onChange={this.handleChangeRow("role")}
                    value={row["role"]}
                  >
                    <MenuItem key="ROLE_ADMIN" value="ROLE_ADMIN">
                      admin
                    </MenuItem>
                    <MenuItem key="ROLE_USER" value="ROLE_USER">
                      user
                    </MenuItem>
                  </TextField>
                  <Button
                    disabled={isLoad}
                    type="submit"
                    variant="contained"
                    size="large"
                    color="secondary"
                  >
                    Add
                  </Button>
                </form>
              </Paper>
            </Paper>
          </div>
          <ModalInfo
            open={forbidden}
            hadleClickClose={this.handleCloseModal}
            title="Access forbidden..."
            content="You were logged out, or session timed out. If you need to continue editing on this page, please login again"
            route="/login"
            routeButtonName="Login"
          />
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left"
            }}
            open={isOpenSnackbar}
            autoHideDuration={6000}
            onClose={this.handleCloseSnackbar}
            ContentProps={{
              "aria-describedby": "message-id"
            }}
            message={<span id="message-id">{messageSnackbar}</span>}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.snackbar}
                onClick={this.handleCloseSnackbar}
              >
                <CloseIcon />
              </IconButton>
            ]}
          />
        </React.Fragment>
      );
    else return <Redirect to="/" />;
  }
}

Admin.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Admin);
