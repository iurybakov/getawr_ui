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
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FilterListIcon from "@material-ui/icons/FilterList";
import Remove from "@material-ui/icons/Remove";
import CircularProgress from "@material-ui/core/CircularProgress";
import AbstractFilterDataForTable from "../../common/abstract-filtered-data";
import Fade from "@material-ui/core/Fade";
import { requestPeriods } from "../../common/requests";

const rowsPerPage = 5;

const styles = {
  paperTable: {
    overflowX: "auto"
  },
  tableCellButton: {
    width: 98,
    minWidth: 98
  },
  actions: {
    marginLeft: "auto"
  },
  toolBarElement: {
    marginLeft: 10
  },
  tableCellName: {
    wordBreak:"break-all",
    width: "40%"
  },
  tableCellOS: {
    wordBreak:"break-all",
    width: "35%"
  },
  tableCellVersion: {
    wordBreak:"break-all",
    width: "25%"
  },
  spiner: {
    color: "#6798e5",
    animationDuration: "550ms"
  }
};

class TableHomeDB extends AbstractFilterDataForTable {
  state = {
    selectedRow: {},
    filterDraft: { name: "", os: "", version: "" },
    page: 0,
    numAllRows: 0,
    data: [],
    isLoad: true,
    isNotFound: false
  };

  constructor(props) {
    super(props, rowsPerPage);
    this.innerMeta.endPointRequest = "home";
    this.innerMeta.typeRequest = "content";
    this.innerMeta.initMethod();
    this.innerMeta.initMethod = null;
    this.innerMeta.templateEmptyFilterDraft = { name: "", os: "", version: "" };
  }

  handleClickRow = row => () => {
    if (this.state.isLoad) return;
    this.setState({ selectedRow: row });
    this.props.handleGetPeriods(true);
    requestPeriods("home", "periods", row.id, resp => {
      this.props.handleGetPeriods(false, resp, row);
    });
  };

  isSelectedRow = id => id === this.state.selectedRow.id;

  render() {
    const {
      page,
      numAllRows,
      data,
      isLoad,
      filterDraft,
      isNotFound
    } = this.state;
    const emptyRows = rowsPerPage - data.length;

    const { classes } = this.props;

    return (
      <Paper className={classes.paperTable}>
        <Toolbar>
          <Typography variant="h6" id="tableTitle">
            Please select database
          </Typography>
          <div className={classes.spacer} />
          <div className={classes.actions}>
            {isLoad ? (
              <CircularProgress
                variant="indeterminate"
                disableShrink
                className={classes.spiner}
                size={24}
                thickness={4}
              />
            ) : (
              <React.Fragment>
                <Tooltip
                  disableFocusListener
                  placement={"top"}
                  title="Clear filter"
                >
                  <IconButton
                    className={classes.toolBarElement}
                    onClick={this.handleDeleteFilter}
                    aria-label="Clear filter"
                  >
                    <Remove />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  disableFocusListener
                  placement={"top"}
                  title="Aply filter"
                >
                  <IconButton
                    className={classes.toolBarElement}
                    onClick={this.handleApplyFilter}
                    aria-label="Aply filter"
                  >
                    <FilterListIcon />
                  </IconButton>
                </Tooltip>
              </React.Fragment>
            )}
          </div>
        </Toolbar>

        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.tableRow}>
              <TableCell className={classes.tableCellName} align="left">
                <TextField
                  id="outlined-name"
                  label={"Name"}
                  value={filterDraft["name"]}
                  onChange={this.handleChangeFilter("name")}
                  margin="normal"
                  variant="outlined"
                />
              </TableCell>
              <TableCell className={classes.tableCellOS} align="left">
                <TextField
                  id="outlined-os"
                  label={"OS"}
                  onChange={this.handleChangeFilter("os")}
                  value={filterDraft["os"]}
                  margin="normal"
                  variant="outlined"
                />
              </TableCell>
              <TableCell className={classes.tableCellVersion} align="left">
                <TextField
                  id="outlined-version"
                  label={"Version"}
                  onChange={this.handleChangeFilter("version")}
                  value={filterDraft["version"]}
                  margin="normal"
                  variant="outlined"
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(row => (
              <TableRow
                hover={!isLoad}
                selected={this.isSelectedRow(row.id)}
                onClick={this.handleClickRow(row)}
                className={classes.tableRow}
                key={row.id}
              >
                <TableCell className={classes.tableCellName}>{row.name}</TableCell>
                <TableCell className={classes.tableCellOS}>{row.os}</TableCell>
                <TableCell className={classes.tableCellVersion}>{row.version}</TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 48 * emptyRows }}>
                <TableCell colSpan={3}>
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
          rowsPerPageOptions={[5]}
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
    );
  }
}

TableHomeDB.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TableHomeDB);
