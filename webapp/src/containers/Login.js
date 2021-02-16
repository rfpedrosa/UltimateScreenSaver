import React, { Component } from "react";
import { Container, FormGroup, Form, Label, Input } from "reactstrap";
import LoaderButton from "../components/LoaderButton";
import "./Login.css";
import { withNamespaces } from "react-i18next";
import { Auth } from "aws-amplify";

class Login extends Component {
  constructor(props) {
    super(props);

    // Password must have at least 8 characters and one of them must be a non-alpha one
    // https://stackoverflow.com/questions/12055005/password-must-have-at-least-one-non-alpha-character
    this.passwordRegex = new RegExp("^(?=.{8})(?=.*[^a-zA-Z])");

    this.state = {
      isLoading: false,
      email: "",
      password: ""
    };
  }

  validateForm() {
    return this.state.email.length > 0
      && this.state.password.length > 0
      && this.passwordRegex.test(this.state.password);
  }

  handleChange = async event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      var cognitoUser = await Auth.signIn(this.state.email, this.state.password);
      this.props.userHasAuthenticated(true, cognitoUser.id);
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { t } = this.props;

    return (
      <Container className="Login">
        <Form onSubmit={this.handleSubmit}>
          <FormGroup row>
            <Label for="email" >{t('Email')}</Label>
            <Input
              autoFocus
              type="email"
              name="email"
              id="email"
              placeholder={t('email placeholder')}
              value={this.state.email}
              onChange={this.handleChange}
              autoComplete="username"
            />
          </FormGroup>
          <FormGroup row>
            <Label for="password" >{t('Password')}</Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder={t('password placeholder')}
              value={this.state.password}
              onChange={this.handleChange}
              autoComplete="current-password"
            />
          </FormGroup>
          <FormGroup row>
            <LoaderButton
              block
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text={t('Login')}
              loadingText={t('Logging in…')}
            />
          </FormGroup>
        </Form>
      </Container>
    );
  }

}

// extended main view with translate hoc
export default withNamespaces("translations")(Login);
