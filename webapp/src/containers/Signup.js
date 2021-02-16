import React, { Component } from "react";
import {
    Container,
    Form,
    FormText,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";
import { withNamespaces, Trans } from "react-i18next";
import { Auth } from "aws-amplify";

class Signup extends Component {
    constructor(props) {
        super(props);

        // Password must have at least 8 characters and one of them must be a non-alpha one
        // https://stackoverflow.com/questions/12055005/password-must-have-at-least-one-non-alpha-character
        this.passwordRegex = new RegExp("^(?=.{8})(?=.*[^a-zA-Z])");

        this.state = {
            isLoading: false,
            email: "",
            password: "",
            confirmPassword: "",
            confirmationCode: "",
            newUser: null
        };
    }

    validateForm() {
        return this.state.email.length > 0
            && this.state.password.length > 0
            && this.state.password === this.state.confirmPassword
            && this.passwordRegex.test(this.state.password)
    }

    validateConfirmationForm() {
        return this.state.confirmationCode.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        try {
            const newUser = await Auth.signUp({
                username: this.state.email,
                password: this.state.password
            });
            this.setState({
                newUser
            });
        } catch (e) {
            alert(e.message);
            switch (e.code) {
                /*     If the user refreshes their page at the confirm step, they won’t be able to get back and confirm that account.
                    In case we tried to signup again using the same email/username, we will get this exception.
                                 */
                case 'UserNotConfirmedException':
                case 'UsernameExistsException':
                    try {
                        const newUser = await Auth.resendSignUp(this.state.email);
                        this.setState({
                            newUser
                        });
                    } catch (e) {
                        alert(e.message);
                        throw e; // let others bubble up
                    }
                    break;
                default:
                    throw e; // let others bubble up
            }
        }
        finally{
            this.setState({ isLoading: false });
        }
    }

    handleConfirmationSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        try {
            await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
            var cognitoUser = await Auth.signIn(this.state.email, this.state.password);

            this.props.userHasAuthenticated(true, cognitoUser.id);
            this.props.history.push("/");
        } catch (e) {
            alert(e.message);
            this.setState({ isLoading: false });
        }
    }

    renderConfirmationForm() {
        const { t } = this.props;
        return (
            <Form onSubmit={this.handleConfirmationSubmit}>
                <FormGroup>
                    <Label for="confirmationCode"><Trans>Confirmation Code</Trans></Label>
                    <Input
                        autoFocus
                        id="confirmationCode"
                        name="confirmationCode"
                        type="tel"
                        value={this.state.confirmationCode}
                        onChange={this.handleChange}
                    />
                    <FormText><Trans>Please check your email for the code</Trans></FormText>
                </FormGroup>
                <LoaderButton
                    block
                    disabled={!this.validateConfirmationForm()}
                    type="submit"
                    isLoading={this.state.isLoading}
                    text={t('Verify')}
                    loadingText={t('Verifying…')}
                />
            </Form>
        );
    }

    renderForm() {
        const { t } = this.props;

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormGroup>
                    <Label>{t('Email')}</Label>
                    <Input
                        autoFocus
                        id="email"
                        type="email"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        autoComplete="username"
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="password" >{t('Password')}</Label>
                    <Input
                        id="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        type="password"
                        autoComplete="new-password"
                    />
                    <FormText><Trans>At least 8 characters including a non alphanumeric one</Trans></FormText>
                </FormGroup>
                <FormGroup>
                    <Label for="confirmPassword">{t('Confirm Password')}</Label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        value={this.state.confirmPassword}
                        onChange={this.handleChange}
                        type="password"
                        autoComplete="new-password"
                    />
                </FormGroup>
                <LoaderButton
                    block
                    disabled={!this.validateForm()}
                    type="submit"
                    isLoading={this.state.isLoading}
                    text={t('Signup')}
                    loadingText={t('Signing up…')}
                />
            </Form>
        );
    }

    render() {
        return (
            <Container className="Signup">
                {this.state.newUser === null
                    ? this.renderForm()
                    : this.renderConfirmationForm()}
            </Container>
        );
    }
}

export default withNamespaces("translations")(Signup);
