import React, { Component } from "react";

import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import Add from "@material-ui/icons/Add";
import Remove from "@material-ui/icons/Remove";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  highlight: {
    color: theme.palette.secondary.main,
    backgroundColor: lighten(theme.palette.secondary.light, 0.85)
  },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    display: "flex",
    color: theme.palette.text.secondary,
    minWidth: 300,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 15
  },
  title: {
    flex: "0 0 auto"
  },
  toolBarElement: {
    marginLeft: 10
  },
  spiner: {
    color: "#6798e5",
    animationDuration: "550ms"
  }
});

class TableToolBar extends Component {
  render() {
    const { numSelected, classes } = this.props;

    return (
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: numSelected > 0
        })}
      >
        <div className={classes.title}>
          {numSelected > 0 ? (
            <Typography color="inherit" variant="subtitle1">
              {numSelected} selected
            </Typography>
          ) : (
            <Typography variant="h6" id="tableTitle">
              List of database instance records
            </Typography>
          )}
        </div>
        <div className={classes.spacer} />

        <div className={classes.actions}>
          {numSelected > 0 ? (
            <Tooltip placement={"top"} title="Delete">
              <IconButton
                onClick={this.props.handleDeleteRows}
                aria-label="Delete"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <React.Fragment>
              {this.props.isLoad ? (
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
                      onClick={this.props.handleDeleteFilter}
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
                      onClick={this.props.handleApplyFilter}
                      aria-label="Aply filter"
                    >
                      <FilterListIcon />
                    </IconButton>
                  </Tooltip>
                </React.Fragment>
              )}
              <Tooltip
                disableFocusListener
                placement={"top"}
                title="Add record"
              >
                <IconButton
                  color="secondary"
                  className={classes.toolBarElement}
                  onClick={this.props.hadleClickModalRowOpen(false)}
                  aria-label="Add record"
                >
                  <Add />
                </IconButton>
              </Tooltip>
            </React.Fragment>
          )}
        </div>
      </Toolbar>
    );
  }
}

TableToolBar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired
};

export default withStyles(styles)(TableToolBar);
