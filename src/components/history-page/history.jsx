import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBarAwr from "../common/app-bar-awr";
import Paper from "@material-ui/core/Paper";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

const styles = theme => ({
  root: {
    width: 650,
    minWidth: 650,
    marginTop: theme.spacing.unit * 7,
    padding: theme.spacing.unit * 3
  },
  paperRoot: {
    padding: theme.spacing.unit * 3
  },
  paperList: {
    padding: theme.spacing.unit * 3
  },
  list: {
    backgroundColor: theme.palette.background.paper
  }
});

class HistoryAwrGetting extends Component {
  state = {
    selectedIndex: -1
  };

  handleListItemClick = (event, index) => {
    this.setState({ selectedIndex: index });
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <AppBarAwr />
        <div className={classes.root}>
          <Paper className={classes.paperRoot}>
            <Paper className={classes.paperList}>
              <List
                component="nav"
                subheader={
                  <ListSubheader component="div">
                    History of receiving reports
                  </ListSubheader>
                }
                className={classes.list}
              >
                <ListItem
                  button
                  selected={this.state.selectedIndex === 0}
                  onClick={event => this.handleListItemClick(event, 0)}
                >
                  <ListItemIcon />
                  <ListItemText inset primary="An example entry" />
                </ListItem>
                <ListItem
                  button
                  selected={this.state.selectedIndex === 1}
                  onClick={event => this.handleListItemClick(event, 1)}
                >
                  <ListItemIcon />
                  <ListItemText inset primary="An example entry" />
                </ListItem>
              </List>
            </Paper>
          </Paper>
        </div>
      </React.Fragment>
    );
  }
}

HistoryAwrGetting.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(HistoryAwrGetting);
