import React from "react";
import {
  Container,
  FormGroup, Form, FormFeedback,
  Input, Button, ButtonGroup,
  CardGroup, Card, CardTitle, CardImg, CardBody,
} from "reactstrap";
import { Trans } from "react-i18next";
import "./Step.css";
import SessionStorage from '../../../components/SessionStorage';
import Providers from '../../../components/Providers';
import CheckTreeFeedly from "../../../components/CheckTreeFeedly";

export default class Step3 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      feedlyEnabled: this.props.recipe.feedlyEnabled,
      feedlyFeeds: this.props.recipe.feedlyFeeds,

      allFeedlyFeeds: null,
      showFeedlyConnect: null,
      hasFeedly: false,
    };

    this.isValidated = this.isValidated.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        feedlyEnabled: this.props.recipe.feedlyEnabled,
        feedlyFeeds: this.props.recipe.feedlyFeeds,
      });
    }
  }

  async componentDidMount() {
    const providers = await Providers.fetchProviders();
    const showFeedlyConnect = providers && !providers.includes('feedly');
    const hasFeedly = providers && providers.includes('feedly');

    this.setState({ showFeedlyConnect, hasFeedly });
  }

  async handleConnect(provider) {
    SessionStorage.setStorageState(this.props.storageKey, this.props.recipe);

    await Providers.obtainProvider(provider, this.props.userId);
  }

  isValidated() {
    return this.areFeedsValid();
  }

  areFeedsValid() {
    if (this.state.feedlyEnabled) {
      return this.state.feedlyFeeds.length > 0;
    }

    return true;
  }

  handleEnabledClick(feedlyEnabled) {
    if (this.props.setProps) {
      this.props.setProps({ recipe: { ...this.props.recipe, feedlyEnabled: feedlyEnabled } });
    };

    this.setState({ feedlyEnabled });
  }


  handleCheckClick(checked) {
    if (this.props.setProps) {
      this.props.setProps({ recipe: { ...this.props.recipe, feedlyFeeds: checked } });
    };

    this.setState({ feedlyFeeds: checked });
  }

  render() {

    return (
      <Container className="Step">
        <h3><Trans>RSS Feeds information</Trans></h3>

        <Form>
          <FormGroup>
            <h5><Trans>Turn on/off feeds</Trans></h5>
            <ButtonGroup>
              <Button color="primary" onClick={() => this.handleEnabledClick(true)} active={this.state.feedlyEnabled}>Enabled</Button>
              <Button color="primary" onClick={() => this.handleEnabledClick(false)} active={!this.state.feedlyEnabled}>Disabled</Button>
            </ButtonGroup>
          </FormGroup>

          {this.state.feedlyEnabled && this.renderFeedly()}
        </Form>

      </Container>
    );
  }

  renderFeedly() {

    return (
      <div>
        {this.state.showFeedlyConnect &&
          <CardGroup>
            <Card>
              <CardImg top src="/images/feedly.svg" alt="Feedly logo" />
              <CardBody>
                <CardTitle>Feedly</CardTitle>
                <Button id='feedly' onClick={() => this.handleConnect('feedly')}><Trans>Connect</Trans></Button>
              </CardBody>
            </Card>
          </CardGroup>
        }
        {this.state.hasFeedly &&
          <FormGroup>
            <CheckTreeFeedly
              checked={this.state.feedlyFeeds}
              onCheck={checked => this.handleCheckClick(checked)}
            />
            <Input autoComplete="off" type='hidden' invalid={!this.areFeedsValid() ? true : false} />
            <FormFeedback invalid='true'><Trans>Please select feeds</Trans></FormFeedback>
          </FormGroup>
        }
      </div>
    );
  }

}

