import React, { Component } from "react";
import { Route } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Home from "./components/home-page/home";
import EditListDb from "./components/edit-list-db-page/edit-list-db";
import Login from "./components/login-page/login";
import HistoryAwrGetting from "./components/history-page/history"
import Admin from "./components/admin-page/admin";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      light: '#f80000',
      main: '#f80000',
      dark: '#f80000',
      contrastText: '#f9fbe7',
    },
    secondary: {
      light: '#81d4fa',
      main: '#4fc3f7',
      dark: '#29b6f6',
      contrastText: '#e1f5fe',
    },
  },
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>      
        <Route exact path="/" component={Home}/>
        <Route exact path="/history" component={HistoryAwrGetting}/>
        <Route exact path="/edit-list-db" component={EditListDb}/>
        <Route exact path="/admin" component={Admin} /> 
        <Route exact path="/login" component={Login} />       
      </MuiThemeProvider>
    );
  }
}

export default App;
