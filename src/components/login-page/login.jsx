import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Done from "@material-ui/icons/Done";
import Clear from "@material-ui/icons/Clear";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { Link as RouteLinkHiddenName } from "react-router-dom";
import Fade from "@material-ui/core/Fade";
import CircularProgress from "@material-ui/core/CircularProgress";
import { loginRequest } from "../common/requests";
import { Redirect } from "react-router-dom";

const RouteLink = props => <RouteLinkHiddenName {...props} />;

const styles = theme => ({
  root: {
    margin: "10%",
    width: 450,
    padding: theme.spacing.unit * 3
  },
  container: {
    padding: theme.spacing.unit * 3
  },
  textField: {
    marginTop: "5%",
    width: 300
  },
  buttons: {
    marginTop: "5%",
    marginRight: "5%",
    width: 140
  },
  icon: {
    marginRight: "10px"
  },
  paper: {
    padding: "10%"
  },
  spiner: {
    float: "right",
    color: "#6798e5",
    animationDuration: "550ms"
  }
});

class Login extends Component {
  state = {
    isLoad: false,
    isPermissionDenied: false,
    isntRedirect: true,
    loginForm: { user: "", pass: "" }
  };

  handleChangeField = name => event => {
    const { loginForm } = this.state;
    loginForm[name] = event.target.value;
    this.setState({ isPermissionDenied: false, loginForm: { ...loginForm } });
  };

  handleSubmitLogin = () => {
    this.setState({ isLoad: true });
    const { user, pass } = this.state.loginForm;
    loginRequest(user, pass, resp => {
      if (resp.status !== 200)
        this.setState({ isLoad: false, isPermissionDenied: true });
      else {
        localStorage.setItem("isAuth", "1");
        this.setState({
          isLoad: false,
          isPermissionDenied: false,
          isntRedirect: false,
          loginForm: { user: "", pass: "" }
        }); 
      }
    });
  };

  render() {
    const { classes } = this.props;
    const { isLoad, isPermissionDenied, isntRedirect, loginForm } = this.state;
    if (isntRedirect)
      return (
        <div className={classes.root}>
          <Paper className={classes.container}>
            <Paper className={classes.paper}>
              <Fade in={isLoad}>
                <CircularProgress
                  variant="indeterminate"
                  disableShrink
                  className={classes.spiner}
                  size={24}
                  thickness={4}
                />
              </Fade>

              <Typography
                className={classes.textField}
                variant="h6"
                color="inherit"
              >
                Please login
              </Typography>
              <div style={{ height: 15 }}>
                <Fade in={isPermissionDenied}>
                  <Typography variant="body1" color="primary">
                    permision denied, please check entered data
                  </Typography>
                </Fade>
              </div>
              <TextField
                id="standard-name"
                label="Login"
                className={classes.textField}
                margin="normal"
                variant="outlined"
                value={loginForm["user"]}
                onChange={this.handleChangeField("user")}
              />
              <TextField
                id="standard-password-input"
                label="Password"
                className={classes.textField}
                type="password"
                autoComplete="current-password"
                margin="normal"
                variant="outlined"
                value={loginForm["pass"]}
                onChange={this.handleChangeField("pass")}
              />
              <Button
                component={RouteLink}
                to="/"
                variant="contained"
                color="primary"
                className={classes.buttons}
              >
                <Clear className={classes.icon} />
                Back
              </Button>
              <Button
                variant="contained"
                color="secondary"
                className={classes.buttons}
                onClick={this.handleSubmitLogin}
              >
                <Done className={classes.icon} />
                Login
              </Button>
            </Paper>
          </Paper>
        </div>
      );
    else return <Redirect to="/" />;
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Login);
