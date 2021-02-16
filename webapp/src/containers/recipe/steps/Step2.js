import React from "react";
import {
  Container,
  FormGroup, Form,
  Label, Col,
  Input,
} from "reactstrap";
import { Trans } from "react-i18next";
import "./Step.css";

export default class Step2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      googleAlbums: this.props.recipe.googleAlbums,
      dropboxFolders: this.props.recipe.dropboxFolders,

      weights: this.props.weights,
    };

    this.isValidated = this.isValidated.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      const weights = this.getNewWeights(this.props.recipe.googleAlbums, this.props.recipe.dropboxFolders, this.props.weights);

      this.setState(prevState => ({
        ...prevState,
        googleAlbums: this.props.recipe.googleAlbums,
        dropboxFolders: this.props.recipe.dropboxFolders,
        weights: weights,
      }));
    }
  }

  componentDidMount() {
      const weights = this.getNewWeights(this.state.googleAlbums, this.state.dropboxFolders, this.state.weights);

      if (this.props.setProps) {
        this.props.setProps({ ...this.props, weights });
      }
      else {
        this.setState(prevState => ({ ...prevState, weights}));
      }
  }

  getNewWeights(googleAlbums, dropboxFolders, weights) {
    const newWeights = []
    googleAlbums.forEach(album => {
      const googleWeight = weights.find(weight => (weight.type === 'google' && weight.id === album.id))
      newWeights.push({ type: 'google', id: album.id, title: album.title, value: googleWeight ? googleWeight.value : 1 });
    });
    dropboxFolders.forEach(folder => {
      const dropboxWeight = weights.find(weight => (weight.type === 'dropbox' && weight.id === folder.id))
      newWeights.push({ type: 'dropbox', id: folder.id, title: folder.title, value: dropboxWeight ? dropboxWeight.value : 1 });
    });

    return newWeights;
  }

  isValidated() {
    const valid = this.areWeightsValid();

    if (valid) {
      const weights = this.state.weights.map(el => ({...el, value: parseInt(el.value)}));
      if (this.props.setProps) {
        this.props.setProps({ ...this.props, weights });
      }
      else {
        this.setState(prevState => ({ ...prevState, weights }));
      }
    }

    return valid;
  }

  areWeightsValid() {
    const invalid = this.state.weights.find(el => !this.isWeightValid(el.value));

    return invalid ? false : true;
  }

  isWeightValid(weight) {
    return parseInt(weight, 10) && weight > 0;
  }

  handleChange(e, index) {
    const target = e.target;
    const value = target.value;

    const newWeights = this.state.weights.slice(0);
    newWeights[index].value = value;

    if (this.props.setProps) {
      this.props.setProps({ ...this.props, weights: newWeights });
    }
    else {
      this.setState(prevState => ({ ...prevState, weights: newWeights }));
    }
  }

  render() {

    return (
      <Container className="Step">
        <h3><Trans>Weights information</Trans></h3>
        <Form>
          <FormGroup row>
            <Label sm="4">Type</Label>
            <Label sm="6">Title</Label>
            <Label sm="2">Weight</Label>
          </FormGroup>
          {this.renderWeights()}
        </Form>
      </Container>
    );
  }

  renderWeights() {
    const { weights } = this.state;
    const typeGoogle = <Label sm={4}><Trans>Album</Trans></Label>
    const typeDropbox = <Label sm={4}><Trans>Folder</Trans></Label>

    return (
      weights && weights.map((el, index) =>
        <FormGroup key={`${el.type}-${el.id}`} row>
          {el.type === 'google' && typeGoogle}
          {el.type === 'dropbox' && typeDropbox}
          {/* <Label sm={4}>{el.type === 'google' ? 'Album' : 'Folder'}</Label> */}
          <Label for={`${el.type}-${el.id}`} sm={6}>{el.title}</Label>
          <Col sm={2}>
            <Input
              type="text"
              className="weight"
              name={`${el.type}-${el.id}`}
              id={`${el.type}-${el.id}`}
              value={el.value}
              invalid={!this.isWeightValid(el.value)}
              onChange={e => this.handleChange(e, index)}
            />
          </Col>

        </FormGroup>
      )
    );
  }

}
