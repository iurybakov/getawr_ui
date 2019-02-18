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
import CircularProgress from "@material-ui/core/CircularProgress";
import Fade from "@material-ui/core/Fade";
import { requestContent, requestPeriods } from "../common/requests";
import { Typography } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const styles = theme => ({
  root: {
    width: 650,
    minWidth: 650,
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
  },
  spiner: {
    color: "#6798e5",
    animationDuration: "550ms"
  },
  snackbar: {
    padding: theme.spacing.unit / 2
  }
});

class HistoryAwrGetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: -1,
      data: [],
      isLoad: true,
      isOpenSnackbar: false,
      snackbarStatus: ""
    };

    requestContent("history", "content", null, resp => {
      this.setState({
        data: resp.body.data,
        isLoad: false
      });
    });
  }

  handleCloseSnackbar = () => {
    this.setState({ isOpenSnackbar: false });
  };

  handleListItemClick = index => event => {
    this.setState({ selectedIndex: index, isLoad: true });

    const { data } = this.state;
    const awrContent = window.open();
    requestPeriods("history", "awr", data[index].id, resp => {
      this.setState({ isLoad: false, isNotStatePicker: false });
      if (!resp.success)
        this.setState({ isOpenSnackbar: true, snackbarStatus: resp.body });
      else {
        awrContent.focus();
        awrContent.document.write(resp.body);
        awrContent.document.execCommand("Stop", false);
        awrContent.document.close();
        resp.body = null;
      }
    });
  };

  render() {
    const { classes } = this.props;
    const {
      selectedIndex,
      data,
      isLoad,
      isOpenSnackbar,
      snackbarStatus
    } = this.state;
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
                    <Typography inline variant="h6">
                      History of receiving reports
                    </Typography>

                    <Fade in={isLoad}>
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
                  </ListSubheader>
                }
                className={classes.list}
              >
                {data.map((row, index) => (
                  <ListItem
                    button
                    disabled={isLoad}
                    selected={selectedIndex === index}
                    onClick={this.handleListItemClick(index)}
                  >
                    <ListItemIcon />
                    <ListItemText
                      inset
                      primary={row.nameOraDb}
                      secondary={
                        new Date(row.beginIntervalTime).toUTCString() +
                        " - " +
                        new Date(row.endIntervalTime).toUTCString()
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Paper>
        </div>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={isOpenSnackbar}
          autoHideDuration={8000}
          onClose={this.handleCloseSnackbar}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">{snackbarStatus}</span>}
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
  }
}

HistoryAwrGetting.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(HistoryAwrGetting);
