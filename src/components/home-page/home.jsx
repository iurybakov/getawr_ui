import React, { Component } from "react";
import AppBarAwr from "../common/app-bar-awr";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {
  MuiPickersUtilsProvider,
  TimePicker,
  DatePicker
} from "material-ui-pickers";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";

import Paper from "@material-ui/core/Paper";
import TableHomeDB from "./table/table-db-home";
import LinearProgress from "@material-ui/core/LinearProgress";
import Fade from "@material-ui/core/Fade";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { requestContent } from "../common/requests";

const styles = theme => ({
  root: {
    width: 750,
    minWidth: 750,
    padding: theme.spacing.unit * 3
  },

  paperRoot: {
    padding: theme.spacing.unit * 3
  },
  paperPickers: {
    marginTop: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 3
  },
  gridButtons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  picker: {
    marginTop: 20,
    marginLeft: "20%"
  },
  gridForTypography: {
    display: "flex",
    alignItems: "flex-end",
    marginLeft: 10
  },
  buttons: {
    marginTop: "5%"
  },
  snackbar: {
    padding: theme.spacing.unit / 2
  }
});

class Home extends Component {
  state = {
    isLoad: false,
    dbId: null,
    isOpenSnackbar: false,
    snackbarStatus: "",
    minIntervalDuration: null,
    beginIntervalTime: new Date(),
    endIntervalTime: new Date(),
    selectedDateFrom: new Date(),
    selectedDateTo: new Date(),
    isNotStatePicker: true,
    selectedRow: {}
  };

  handleCloseSnackbar = () => {
    this.setState({ isOpenSnackbar: false });
  };

  handleGetPeriods = (isLoad, resp, selectedRow) => {
    if (isLoad) this.setState({ isLoad: true, isNotStatePicker: true });
    else {
      if (!resp.success) {
        this.setState({
          isLoad: false,
          dbId: null,
          isOpenSnackbar: true,
          snackbarStatus: resp.body,
          minIntervalDuration: null,
          beginIntervalTime: null,
          endIntervalTime: null,
          selectedDateFrom: null,
          selectedDateTo: null,
          isNotStatePicker: true,
          selectedRow: {}
        });
        return;
      }
      const { data } = resp.body;
      let i = 0;
      if (data.length > 1 && data[0].dbId === data[1].dbId) ++i;

      this.setState({
        isLoad: false,
        dbId: data[0].dbId,
        minIntervalDuration:
          data[0].endIntervalTime - data[0].beginIntervalTime + 500000,
        beginIntervalTime: new Date(data[0].beginIntervalTime - 600000),
        endIntervalTime: new Date(data[i].endIntervalTime + 600000),
        selectedDateFrom: new Date(data[i].beginIntervalTime),
        selectedDateTo: new Date(data[i].endIntervalTime),
        isNotStatePicker: false,
        selectedRow: selectedRow
      });
    }
  };

  handleGetReport = () => {
    this.setState({ isLoad: true, isNotStatePicker: true });
    const { selectedDateFrom, selectedDateTo, selectedRow } = this.state;
    const propsForGetAWR = {
      dbId: this.state.dbId,
      dateFrom: selectedDateFrom.toISOString(),
      dateTo: selectedDateTo.toISOString(),
      tennantId: selectedRow.id,
      dbName: selectedRow.name
    };
    const awrContent = window.open();
    requestContent("home", "awr", propsForGetAWR, resp => {
      this.setState({ isLoad: false, isNotStatePicker: false });
      console.log(resp);
      if (!resp.success)
        this.setState({ isOpenSnackbar: true, snackbarStatus: resp.body });
      else {
        
        awrContent.focus();        
        awrContent.document.write(resp.body);
        awrContent.document.execCommand("Stop", false);
        awrContent.document.stop();
        resp.body = null;
      }
    });
  };

  handleDateChangeFrom = date => {
    const {
      beginIntervalTime,
      minIntervalDuration,
      selectedDateTo
    } = this.state;
    if (date - beginIntervalTime < 0)
      this.setState({ selectedDateFrom: beginIntervalTime });
    else if (selectedDateTo - date < minIntervalDuration)
      this.setState({
        selectedDateFrom: new Date(+selectedDateTo - minIntervalDuration)
      });
    else this.setState({ selectedDateFrom: date });
  };

  handleDateChangeTo = date => {
    const {
      endIntervalTime,
      minIntervalDuration,
      selectedDateFrom
    } = this.state;
    if (endIntervalTime - date < 0)
      this.setState({ selectedDateTo: endIntervalTime });
    else if (date - selectedDateFrom < minIntervalDuration)
      this.setState({
        selectedDateTo: new Date(+selectedDateFrom + minIntervalDuration)
      });
    else this.setState({ selectedDateTo: date });
  };

  render() {
    const { classes } = this.props;
    const {
      isLoad,
      isNotStatePicker,
      selectedDateFrom,
      selectedDateTo,
      beginIntervalTime,
      endIntervalTime,
      snackbarStatus,
      isOpenSnackbar,
      selectedRow
    } = this.state;

    return (
      <React.Fragment>
        <AppBarAwr />
        <div className={classes.root}>
          <Paper className={classes.paperRoot}>
            <TableHomeDB handleGetPeriods={this.handleGetPeriods} />
            <div className={classes.divider} />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Paper className={classes.paperPickers}>
                <div style={{ height: 10 }}>
                  <Fade in={isLoad}>
                    <LinearProgress color="secondary" />
                  </Fade>
                </div>
                <div style={{ height: 10 }}>
                  <Fade in={!isNotStatePicker}>
                    <Typography variant="body1" color="inherit">
                      For DB: {selectedRow.name}, awr interval about{" "}
                      {parseInt(
                        (this.state.minIntervalDuration - 500000) / 60000
                      )}{" "}
                      minuts
                    </Typography>
                  </Fade>
                </div>
                <Grid container spacing={0}>
                  <Grid container spacing={0}>
                    <Grid className={classes.gridForTypography} item xs={2}>
                      <Typography variant="body1" color="inherit">
                        From period:
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <DatePicker
                        disabled={isNotStatePicker}
                        maxDate={selectedDateTo}
                        minDate={beginIntervalTime}
                        className={classes.picker}
                        label="Date"
                        value={selectedDateFrom}
                        onChange={this.handleDateChangeFrom}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TimePicker
                        disabled={isNotStatePicker}
                        maxDate={selectedDateTo}
                        minDate={beginIntervalTime}
                        className={classes.picker}
                        label="Time"
                        value={selectedDateFrom}
                        onChange={this.handleDateChangeFrom}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={0}>
                    <Grid className={classes.gridForTypography} item xs={2}>
                      <Typography
                        className={classes.typography}
                        variant="body1"
                        color="inherit"
                      >
                        To period:
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <DatePicker
                        disabled={isNotStatePicker}
                        maxDate={endIntervalTime}
                        minDate={selectedDateFrom}
                        className={classes.picker}
                        label="Date"
                        value={selectedDateTo}
                        onChange={this.handleDateChangeTo}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TimePicker
                        disabled={isNotStatePicker}
                        maxDate={endIntervalTime}
                        minDate={selectedDateFrom}
                        className={classes.picker}
                        label="Time"
                        value={selectedDateTo}
                        onChange={this.handleDateChangeTo}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={0}>
                    <Grid item className={classes.gridButtons} xs={12}>
                      <Button
                        disabled={isNotStatePicker}
                        variant="contained"
                        color="secondary"
                        onClick={this.handleGetReport}
                        className={classes.buttons}
                      >
                        Get report
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </MuiPickersUtilsProvider>
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

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Home);
