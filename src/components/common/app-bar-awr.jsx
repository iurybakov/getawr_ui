import React, { Component } from "react";
import { Link as RouteLinkHiddenName } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Paper from "@material-ui/core/Paper";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { logoutRequest } from "./requests";

const RouteLink = props => <RouteLinkHiddenName {...props} />;

const styles = {
  loginButton: {
    marginLeft: "auto"
  },
  navButton: {
    whiteSpace: "nowrap",
    marginLeft: "10px"
  }
};

class AppBarAwr extends Component {
  constructor(props) {
    super();
    this.state = {
      isLogged: false,
      isSuggestModalOpen: false
    };
    try {
      if (localStorage.getItem("isAuth") === "1") this.state.isLogged = true;
      else this.state.isLogged = false;
    } catch (ex) {
      console.log(ex);
      localStorage.setItem("isAuth", "0");
    }
  }

  handleLogout = () => {
    logoutRequest(resp => {
      localStorage.setItem("isAuth", "0");
      this.setState({ isLogged: false });
    });
  };

  handleCloseModal = () => {
    this.setState({ isSuggestModalOpen: false });
  };

  handleSuggestLogin = () => {
    this.setState({ isSuggestModalOpen: true });
  };

  render() {
    const { classes } = this.props;
    const { isLogged, isSuggestModalOpen } = this.state;

    return (
      <AppBar>
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Get Oracle AWR
          </Typography>
          <Button
            className={classes.navButton}
            component={RouteLink}
            to="/"
            color="inherit"
          >
            home
          </Button>
          <Button
            className={classes.navButton}
            component={RouteLink}
            to="/history"
            color="inherit"
          >
            History
          </Button>

          {isLogged ? (
            <React.Fragment>
              <Button
                className={classes.navButton}
                component={RouteLink}
                to="/edit-list-db"
                color="inherit"
              >
                Edit list DB
              </Button>
              <Button
                className={classes.loginButton}
                onClick={this.handleLogout}
                color="inherit"
              >
                Logout
              </Button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Button
                className={classes.navButton}
                onClick={this.handleSuggestLogin}
                color="inherit"
              >
                Edit list DB
              </Button>
              <Button
                className={classes.loginButton}
                component={RouteLink}
                to="/login"
                color="inherit"
              >
                Login
              </Button>
            </React.Fragment>
          )}
        </Toolbar>
        <Dialog
          disableRestoreFocus
          open={isSuggestModalOpen}
          onClose={this.handleCloseModal}
        >
          <Paper style={{ padding: 20 }}>
            <DialogTitle>You are not logged in</DialogTitle>
            <hr />
            <DialogContentText>
              <Typography variant="h6" color="inherit" style={{ margin: 20 }}>
                Only authorized users can access this page. Please log in if you
                need to edit your Oracle database connection information.
              </Typography>
            </DialogContentText>
            <hr />
            <DialogActions style={{ marginTop: 20 }}>
              <Button onClick={this.handleCloseModal} color="inherit">
                Close
              </Button>
              <Button
                style={{ marginLeft: 10 }}
                component={RouteLink}
                to="/login"
                color="inherit"
              >
                Login
              </Button>
            </DialogActions>
          </Paper>
        </Dialog>
      </AppBar>
    );
  }
}

AppBarAwr.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AppBarAwr);
