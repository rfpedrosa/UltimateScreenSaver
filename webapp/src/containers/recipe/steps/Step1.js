import React from "react";
import {
  Container,
  FormGroup, Form, FormFeedback,
  Label, Input, Button,
  CardGroup, Card, CardTitle, CardImg, CardBody,
  TabContent, TabPane, Nav, NavItem, NavLink
} from "reactstrap";
import { Trans } from "react-i18next";
import "./Step.css";
import SessionStorage from '../../../components/SessionStorage';
import Providers from '../../../components/Providers';
import GalleryGoogle from "../../../components/GalleryGoogle";
import CheckTreeDropbox from '../../../components/CheckTreeDropbox';

export default class Step1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.recipe.title,
      googleAlbums: this.props.recipe.googleAlbums,
      dropboxFolders: this.props.recipe.dropboxFolders,
      activeTab: this.props.activeTab,

      showGoogleConnect: false,
      hasGoogle: false,
      showDropboxConnect: false,
      hasDropbox: false,
    };

    this._isMounted = false;
    this.isValidated = this.isValidated.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        title: this.props.recipe.title,
        googleAlbums: this.props.recipe.googleAlbums,
        dropboxFolders: this.props.recipe.dropboxFolders,
        activeTab: this.props.activeTab,
      });
    }
  }

  async componentDidMount() {
    this._isMounted = true;

    const providers = await Providers.fetchProviders();
    const showGoogleConnect = providers && !providers.includes('google');
    const hasGoogle = providers && providers.includes('google')
    const showDropboxConnect = providers && !providers.includes('dropbox');
    const hasDropbox = providers && providers.includes('dropbox')

    this._isMounted && this.setState({
      showGoogleConnect,
      hasGoogle,
      showDropboxConnect,
      hasDropbox,
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  isValidated() {
    return this.isTitleValid() && this.areItemsValid();
  };

  isTitleValid() {
    return this.state.title
      && this.state.title.trim().length > 0
      && this.state.title.trim().length < 30;
  };

  areItemsValid() {
    return (this.state.googleAlbums && this.state.googleAlbums.length > 0)
    || (this.state.dropboxFolders && this.state.dropboxFolders.length > 0);
  }

  handleInputChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    if (this.props.setProps) {
      this.props.setProps({ recipe: { ...this.props.recipe, [name]: value } });
    }
    else {
      this.setState(prevState => ({ ...prevState, [name]: value }));
    }
  }

  async handleConnect(provider) {
    SessionStorage.setStorageState(this.props.storageKey, { recipe: this.props.recipe, activeTab: this.props.activeTab });

    await Providers.obtainProvider(provider, this.props.userId);
  }

  handleCheckAlbum(albums) {
    if (this.props.setProps) {
      this.props.setProps({ recipe: { ...this.props.recipe, googleAlbums: albums } });
    }

    this.setState({ googleAlbums: albums });
  }

  handleCheckDropbox(folders) {
    if (this.props.setProps) {
      this.props.setProps({ recipe: { ...this.props.recipe, dropboxFolders: folders } });
    };

    this.setState({ dropboxFolders: folders });
  }

  toggleTab(tab) {
    if (this.props.activeTab !== tab) {
      if (this.props.setProps) {
        this.props.setProps({ activeTab: tab });
      }
      else {
        this.setState({ activeTab: tab });
      };
    }
  }

  render() {

    return (
      <Container className="Step">
        <Form>
          <h3><Trans>Recipe information</Trans></h3>

          {this.renderTitle()}

          <Nav tabs>
            <NavItem>
              <NavLink
                className={this.state.activeTab === '0' ? 'active' : ''}
                onClick={() => { this.toggleTab('0'); }}
              >
                Google Photos
            </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={this.state.activeTab === '1' ? 'active' : ''}
                onClick={() => { this.toggleTab('1'); }}
              >
                Dropbox
            </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="0">
              {this.renderGoogle()}
            </TabPane>
            <TabPane tabId="1">
              {this.renderDropbox()}
            </TabPane>
          </TabContent>

          <FormGroup>
            <Input autoComplete="off" type='hidden' invalid={!this.areItemsValid() ? true : false} />
            <FormFeedback invalid='true'><Trans>Please select albums or folders</Trans></FormFeedback>
          </FormGroup>
        </Form>
      </Container>
    );
  }

  renderTitle() {
    return (
      <FormGroup>
        <Label for="title"><Trans>Title</Trans></Label>
        <Input
          autoFocus
          autoComplete="off"
          className="form-control"
          id="title"
          name="title"
          type="text"
          value={this.state.title}
          invalid={!this.isTitleValid()}
          onChange={(e) => { this.handleInputChange(e) }}
        />
        <FormFeedback><Trans>Enter title</Trans></FormFeedback>
      </FormGroup>
    );
  }

  renderGoogle() {

    return (
      <div>
        {this.state.showGoogleConnect &&
          <CardGroup>
            <Card>
              <CardImg top width="100%" src="/images/google-photos.svg" alt="Google Photos Image" />
              <CardBody>
                <CardTitle>Google Photos</CardTitle>
                <Button onClick={() => this.handleConnect('google')}><Trans>Connect</Trans></Button>
              </CardBody>
            </Card>
          </CardGroup>
        }
        {this.state.hasGoogle &&
          <FormGroup>
            <GalleryGoogle
              selectedGoogleAlbums={this.state.googleAlbums}
              onSelectAlbum={selectedAlbums => this.handleCheckAlbum(selectedAlbums)}
            />
          </FormGroup>

        }
      </div>
    );
  }

  renderDropbox() {

    return (
      <div>
        {this.state.showDropboxConnect &&
          <CardGroup>
            <Card>
              <CardImg top width="100%" src="/images/dropbox.svg" alt="Dropbox Image" />
              <CardBody>
                <CardTitle>Dropbox</CardTitle>
                <Button onClick={() => this.handleConnect('dropbox')}><Trans>Connect</Trans></Button>
              </CardBody>
            </Card>
          </CardGroup>
        }
        {this.state.hasDropbox &&
          <FormGroup>
            <CheckTreeDropbox
              selected={this.props.recipe.dropboxFolders}
              onCheck={folders => this.handleCheckDropbox(folders)}
            />
          </FormGroup>

        }
      </div>
    );
  }
}
