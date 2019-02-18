import React, { Component } from "react";
import { Link as RouteLinkHiddenName } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { logoutRequest } from "./requests";
import Tooltip from "@material-ui/core/Tooltip";
import ModalInfo from "../common/modal-info";

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
    super(props);
    this.state = {
      isLogged: false,
      isSuggestModalOpen: false,
      isntAdmin: true
    };
    try {
      if (sessionStorage.getItem("isAuth") === "1") {
        this.state.isLogged = true;
        if (sessionStorage.getItem("role") === "ADMIN")
          this.state.isntAdmin = false;
      } else this.state.isLogged = false;
    } catch (ex) {
      sessionStorage.setItem("isAuth", "0");
    }
  }

  handleLogout = () => {
    logoutRequest(resp => {
      sessionStorage.setItem("isAuth", "0");
      sessionStorage.setItem("role", "");
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
    const { isLogged, isSuggestModalOpen, isntAdmin } = this.state;

    return (
      <AppBar position="static" style={{ minWidth: 1100 }}>
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
            Home
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
              <Tooltip
                placement="bottom"
                title={
                  isntAdmin
                    ? "If you want to edit list of users, please login with ADMIN role"
                    : ""
                }
              >
                <Button
                  className={classes.navButton}
                  component={isntAdmin ? Button : RouteLink}
                  to="/admin"
                  color="inherit"
                >
                  Edit list users
                </Button>
              </Tooltip>
              <Button
                className={classes.navButton}
                component={RouteLink}
                to="/about"
                color="inherit"
              >
                About
              </Button>
              <Button
                className={classes.loginButton}
                onClick={this.handleLogout}
                color="inherit"
              >
                Logout ({sessionStorage.getItem("role")})
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
                className={classes.navButton}
                component={RouteLink}
                to="/about"
                color="inherit"
              >
                About
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
        <ModalInfo
          open={isSuggestModalOpen}
          hadleClickClose={this.handleCloseModal}
          title="You are not logged in"
          content="Only authorized users can access this page. Please log in if you need to edit your Oracle database connection information"
          route="/login"
          routeButtonName="Login"
        />
      </AppBar>
    );
  }
}

AppBarAwr.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AppBarAwr);
