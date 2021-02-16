import React, { Component, Fragment } from 'react';
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import "./App.css";
import Routes from "./Routes";
import { Auth } from "aws-amplify";
import { withNamespaces, Trans } from "react-i18next";

class App extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      userId: null,
      isOpen: false,
    };
  }

  async componentDidMount() {
    this._isMounted = true;

    try {
      var userInfo = await Auth.currentUserInfo();
      if (userInfo && userInfo.id && this._isMounted) {
        this.userHasAuthenticated(true, userInfo.id);
        return;
      }
    }
    catch (e) {
      if (e !== 'No current user') {
        console.log(e);
      }
    }

    if (this._isMounted) {
      this.setState({ isAuthenticating: false });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  userHasAuthenticated = (authenticated, userId = null) => {
    this.setState({ isAuthenticated: authenticated, "userId": userId });
  }

  handleLogout = async event => {
    await Auth.signOut();

    this.userHasAuthenticated(false);

    this.props.history.push("/login");
  }

  handleRoot = async event => {
    this.props.history.push("/");
  }

  toggle() {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      userId: this.state.userId
    };

    return (
      !this.state.isAuthenticating &&
      <div className="app">
        <Navbar color="light" light expand="md">
          <NavbarBrand onClick={this.handleRoot}>Ultimate Screen Saver</NavbarBrand>
          <NavbarToggler onClick={() => this.toggle()} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {this.state.isAuthenticated
                ? <NavItem>
                  <NavLink href="#" onClick={this.handleLogout}><Trans>Logout</Trans></NavLink>
                </NavItem>
                : <Fragment>
                  <NavItem>
                    <NavLink tag={Link} to="/signup"><Trans>Signup</Trans></NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={Link} to="/login"><Trans>Login</Trans></NavLink>
                  </NavItem>
                </Fragment>
              }
            </Nav>
          </Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }

}

export default withRouter(withNamespaces("translations")(App));
