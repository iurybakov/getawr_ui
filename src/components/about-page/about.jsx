import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBarAwr from "../common/app-bar-awr";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";

const styles = theme => ({
  root: {
    width: 750,
    minWidth: 750,
    padding: theme.spacing.unit * 3
  },
  paperRoot: {
    padding: theme.spacing.unit * 3
  },
  paperList: {
    padding: theme.spacing.unit * 3
  }
});

class About extends Component {
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <AppBarAwr />
        <div className={classes.root}>
          <Paper className={classes.paperRoot}>
            <Paper className={classes.paperList}>
              <Typography variant="h5">
                Required privileges for the Oracle database user
              </Typography>
              <Typography variant="body1">
                <br />
                GRANT SELECT ON SYS.V_$DATABASE TO [user]; <br />
                GRANT SELECT ON SYS.V_$INSTANCE TO [user];
                <br />
                GRANT EXECUTE ON SYS.DBMS_WORKLOAD_REPOSITORY TO [user];
                <br />
                GRANT SELECT ON SYS.DBA_HIST_DATABASE_INSTANCE TO [user];
                <br />
                GRANT SELECT ON SYS.DBA_HIST_SNAPSHOT TO [user];
                <br />
                <br />
              </Typography>
              <Typography variant="h5">
                The source code of the project
              </Typography>
              <Typography variant="body1">
                <br />
                Front end: <br />
                <a href="https://github.com/iurybakov/getawr_ui">
                  https://github.com/iurybakov/getawr_ui
                </a>
                <br />
                <br />
                Back end: <br />
                <a href="https://github.com/iurybakov/getawr">
                  https://github.com/iurybakov/getawr
                </a>
                <br />
                <br />
              </Typography>
            </Paper>
          </Paper>
        </div>
      </React.Fragment>
    );
  }
}

About.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(About);
