import React, { Component } from "react";
import { Container } from "reactstrap";
import "./Step.css";
import { Trans } from "react-i18next";
import SessionStorage from "../../../components/SessionStorage";

export default class Step5 extends Component {
  constructor(props) {
    super(props);

    this.isValidated = this.isValidated.bind(this);
  }

  async isValidated() {
    try {
      this.assignWeights(this.props.recipe, this.props.weights);

      await this.props.onFinalAction(this.props.recipe);
      SessionStorage.removeStorageState(this.props.storageKey);

      return true;
    } catch (e) {
      alert(e);
      return false;
    }
  }

  assignWeights(recipe, weights){
    recipe.googleAlbums.forEach(album => {
      const albumWeight = weights.find(weight => weight.type === 'google' && weight.id === album.id);
      album.weight = albumWeight.value;
    });
    recipe.dropboxFolders.forEach(folder => {
      const folderWeight = weights.find(weight => weight.type === 'dropbox' && weight.id === folder.id);
      folder.weight = folderWeight.value;
    });
  }

  render() {
    const { recipe } = this.props;

    const transition = this.props.transitionOptions.find(element => {
      return element.value === recipe.transition
    });
    const display = this.props.displayOptions.find(element => {
      return element.value === recipe.display
    });

    return (
      <Container className="Step">
        <h3><Trans>Recipe review</Trans></h3>
        <p><Trans>Title</Trans>: {recipe.title}</p>
        <p><Trans>Albums selected</Trans>: {recipe.googleAlbums.length}</p>
        <p><Trans>Folders selected</Trans>: {recipe.dropboxFolders.length}</p>
        <p><Trans>RSS Feeds enabled</Trans>: {recipe.feedlyEnabled ? <Trans>True</Trans> : <Trans>False</Trans>}</p>
        <p><Trans>RSS Feeds selected</Trans>: {recipe.feedlyFeeds.length}</p>
        <p><Trans>Transition effect</Trans>: {transition.label}</p>
        <p><Trans>Transition seconds</Trans>: {recipe.transitionSeconds}</p>
        <p><Trans>Display effect</Trans>: {display.label}</p>
      </Container>
    );
  }
}
