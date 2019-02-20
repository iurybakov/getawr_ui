import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import Edit from "@material-ui/icons/Edit";
import TableToolBar from "./toolbar";
import IconButton from "@material-ui/core/IconButton";
import ModalRow from "../modal-page/modal-row";
import TextField from "@material-ui/core/TextField";
import AbstractFilterDataForTable from "../../common/abstract-filtered-data";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import {
  requestInsertOrUpdateCredential,
  requestDeleteContent
} from "../../common/requests";
import Fade from "@material-ui/core/Fade";
import { Redirect } from "react-router-dom";
import ModalInfo from "../../common/modal-info";

const rowsPerPage = 10;

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3,
    width: "70%",
    minWidth: 1050
  },
  paperRoot: {
    padding: theme.spacing.unit * 3
  },
  paperTable: {
    overflowX: "auto"
  },
  tableCellName: {
    wordBreak:"break-all",
    width: "20%"
  },
  tableCellButton: {
    width: "10%"
  },
  tableCellOther: {
    wordBreak:"break-all",
    width: "20%"
  },
  tableCellPortSid: {
    wordBreak:"break-all",
    width: "15%"
  },
  snackbar: {
    padding: theme.spacing.unit / 2
  }
});

class TableEditDB extends AbstractFilterDataForTable {
  state = {
    forbidden: false,
    filterDraft: { name: "", host: "", port: "", sid: "", login: "" },
    page: 0,
    numAllRows: 0,
    data: [],
    isLoad: true,
    isNotFound: false,
    isOpenModal: false,
    selected: [],
    rowDataModal: {
      id: "",
      name: "",
      host: "",
      port: "",
      sid: "",
      login: "",
      pass: ""
    },
    statusModal: "on open...",
    isEditModalType: false,
    isOpenSnackbar: false,
    deleteStatus: "",
    isntRedirect: true
  };

  constructor(props) {
    super(props, rowsPerPage);
    this.innerMeta.endPointRequest = "edit";
    this.innerMeta.typeRequest = "content";
    this.innerMeta.initMethod();
    this.innerMeta.initMethod = null;
    this.innerMeta.notEditingRow = {};
  }

  handleDeleteRows = () => {
    this.setState({ data: [], page: 0, isLoad: true, selected: [] });
    requestDeleteContent(
      "edit",
      this.state.selected,
      resp => {
        this.setState({ isOpenSnackbar: true, deleteStatus: resp.body });
        if (resp.success === true) this.refreshPage(0);
      },
      this.forbidenCallBack
    );
  };

  handleChangeRowModal = name => event => {
    const { rowDataModal } = this.state;
    if (name === "port" && !/^\d*$/.test(event.target.value))
      rowDataModal[name] = "";
    else rowDataModal[name] = event.target.value;
    this.setState({ rowDataModal: rowDataModal });
  };

  hadleClickModalSubmit = event => {
    const { rowDataModal } = this.state;

    let type = "insert";
    if (this.state.isEditModalType) {
      let i = 0;
      type = "update";
      for (const key in rowDataModal)
        if (rowDataModal[key] !== this.innerMeta.notEditingRow[key]) ++i;
      if (i === 0) return;
    }
    this.setState({ statusModal: "performing request, please wait" });
    requestInsertOrUpdateCredential(
      this.innerMeta.endPointRequest,
      type,
      rowDataModal,
      resp => {
        if (this.state.statusModal === "performing request, please wait") {
          this.setState({ statusModal: resp.body });
          if (resp.body === "row updated successfully")
            this.innerMeta.notEditingRow = { ...rowDataModal };
        }
      },
      this.forbidenCallBack
    );
  };

  hadleClickModalRowOpen = (isEditModalType, rowData) => () => {
    if (isEditModalType) {
      this.innerMeta.notEditingRow = { ...rowData };
      this.innerMeta.notEditingRow.pass = "================";
    } else
      this.innerMeta.notEditingRow = {
        name: "",
        host: "",
        port: "",
        sid: "",
        login: "",
        pass: ""
      };

    this.setState({
      isOpenModal: true,
      isEditModalType: isEditModalType,
      rowDataModal: { ...this.innerMeta.notEditingRow },
      statusModal: "on open..."
    });
  };

  hadleClickModalRowClose = () => {
    this.setState({ isOpenModal: false, statusModal: "on close..." });
    this.refreshPage(this.state.page);
  };

  handleCheckBoxRow = idRow => () => {
    let newSelected = [...this.state.selected];
    const indexElement = newSelected.indexOf(idRow);

    if (indexElement === -1) newSelected.push(idRow);
    else newSelected.splice(indexElement, 1);

    this.setState({ selected: newSelected });
  };

  handleCheckBoxAllRow = event => {
    if (!event.target.checked) this.setState({ selected: [] });
    else this.setState({ selected: this.state.data.map(elem => elem.id) });
  };

  hadleClickModalInfoClose = () => {
    this.setState({ isntRedirect: false, forbidden: false });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;
  isAllSelected = () =>
    this.state.data.length !== 0 &&
    this.state.selected.length === this.state.data.length;

  render() {
    const {
      forbidden,
      filterDraft,
      page,
      numAllRows,
      data,
      isLoad,
      isNotFound,
      isOpenModal,
      selected,
      rowDataModal,
      statusModal,
      isEditModalType,
      isOpenSnackbar,
      deleteStatus,
      isntRedirect
    } = this.state;
    const emptyRows = rowsPerPage - data.length;

    const { classes } = this.props;
    if (isntRedirect)
      return (
        <div className={classes.root}>
          <Paper className={classes.paperRoot}>
            <Paper className={classes.paperTable}>
              <TableToolBar
                handleApplyFilter={this.handleApplyFilter}
                handleDeleteFilter={this.handleDeleteFilter}
                hadleClickModalRowOpen={this.hadleClickModalRowOpen}
                handleDeleteRows={this.handleDeleteRows}
                numSelected={selected.length}
                isLoad={isLoad}
              />
              <Table>
                <TableHead>
                  <TableRow className={classes.tableRow}>
                    <TableCell padding="none">
                      <Checkbox
                        onChange={this.handleCheckBoxAllRow}
                        checked={this.isAllSelected()}
                      />
                    </TableCell>
                    <TableCell
                      padding="dense"
                      className={classes.tableCellName}
                      align="left"
                    >
                      <TextField
                        id="outlined-name"
                        label={"DB name"}
                        value={filterDraft["name"]}
                        onChange={this.handleChangeFilter("name")}
                        margin="normal"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell
                      padding="dense"
                      className={classes.tableCellOther}
                      align="left"
                    >
                      <TextField
                        id="outlined-host"
                        label={"Host"}
                        value={filterDraft["host"]}
                        onChange={this.handleChangeFilter("host")}
                        margin="normal"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell
                      padding="dense"
                      className={classes.tableCellPortSid}
                      align="left"
                    >
                      <TextField
                        id="outlined-port"
                        label={"Port"}
                        value={filterDraft["port"]}
                        onChange={this.handleChangeFilter("port")}
                        margin="normal"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell
                      padding="dense"
                      className={classes.tableCellPortSid}
                      align="left"
                    >
                      <TextField
                        id="outlined-sid"
                        label={"Sid"}
                        value={filterDraft["sid"]}
                        onChange={this.handleChangeFilter("sid")}
                        margin="normal"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell
                      padding="dense"
                      className={classes.tableCellOther}
                      align="left"
                    >
                      <TextField
                        id="outlined-login"
                        label={"Login"}
                        value={filterDraft["login"]}
                        onChange={this.handleChangeFilter("login")}
                        margin="normal"
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map(row => {
                    return (
                      <TableRow className={classes.tableRow} key={row.id}>
                        <TableCell align="left" padding="none">
                          <Checkbox
                            inline
                            onChange={this.handleCheckBoxRow(row.id)}
                            checked={this.isSelected(row.id)}
                          />
                          <IconButton
                            inline
                            disabled={selected.length > 0 ? true : false}
                            onClick={this.hadleClickModalRowOpen(true, row)}
                            aria-label="Edit"
                          >
                            <Edit />
                          </IconButton>
                        </TableCell>
                        <TableCell
                          padding="dense"
                          className={classes.tableCellName}
                        >
                          {row.name}
                        </TableCell>
                        <TableCell
                          padding="dense"
                          align="left"
                          className={classes.tableCellOther}
                        >
                          {row.host}
                        </TableCell>
                        <TableCell
                          padding="dense"
                          align="left"
                          className={classes.tableCellPortSid}
                        >
                          {row.port}
                        </TableCell>
                        <TableCell
                          padding="dense"
                          align="left"
                          className={classes.tableCellPortSid}
                        >
                          {row.sid}
                        </TableCell>
                        <TableCell
                          padding="dense"
                          align="left"
                          className={classes.tableCellOther}
                        >
                          {row.login}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 49 * emptyRows }}>
                      <TableCell colSpan={6}>
                        <Fade in={emptyRows === rowsPerPage}>
                          <Typography variant="h6" id="tableTitle">
                            {isLoad
                              ? "Loading..."
                              : isNotFound
                              ? "Not found, please change filter"
                              : ""}
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
              <ModalRow
                hadleClickModalRowClose={this.hadleClickModalRowClose}
                hadleClickModalSubmit={this.hadleClickModalSubmit}
                handleChangeRowModal={this.handleChangeRowModal}
                isEditModalType={isEditModalType}
                open={isOpenModal}
                values={rowDataModal}
                statusModal={statusModal}
              />
              <ModalInfo
                open={forbidden}
                hadleClickClose={this.hadleClickModalInfoClose}
                title="Access forbidden..."
                content="You were logged out, or session timed out. If you need to continue editing on this page, please login again"
                route="/login"
                routeButtonName="Login"
              />
            </Paper>
          </Paper>
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
            message={<span id="message-id">{deleteStatus}</span>}
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
        </div>
      );
    else return <Redirect to="/" />;
  }
}

TableEditDB.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TableEditDB);
