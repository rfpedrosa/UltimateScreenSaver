import React from "react";
import { Trans } from "react-i18next";
import {
  Container,
  FormGroup, Form, FormFeedback,
  Input,
} from "reactstrap";
import "./Step.css";
import Select from "react-select";

export default class Step4 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTransition: this.props.transitionOptions.find(element => { return element.value === this.props.recipe.transition; }),
      transitionOptions: this.props.transitionOptions,
      transitionSeconds: this.props.recipe.transitionSeconds,

      selectedDisplay: this.props.displayOptions.find(element => { return element.value === this.props.recipe.display; }),
      displayOptions: this.props.displayOptions,
    };

    this.isValidated = this.isValidated.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState(prevState => ({
        selectedTransition: this.props.transitionOptions.find(element => { return element.value === this.props.recipe.transition; }),
        transitionOptions: this.props.transitionOptions,
        transitionSeconds: this.props.recipe.transitionSeconds,

        selectedDisplay: this.props.displayOptions.find(element => { return element.value === this.props.recipe.display; }),
        displayOptions: this.props.displayOptions,
      }));
    }
  }

  isValidated() {
    return this.isTransitionValid() && this.isTransitionSecondsValid() && this.isDisplayValid();
  }

  isTransitionValid() {
    return this.state.selectedTransition != null;
  }

  isTransitionSecondsValid() {
    return parseInt(this.state.transitionSeconds, 10) && this.state.transitionSeconds > 0;
  }

  isDisplayValid() {
    return this.state.selectedDisplay != null;
  }

  handleSelectChangeTransition(selectedOption) {
    if (this.props.setProps) {
      this.props.setProps({ recipe: { ...this.props.recipe, transition: selectedOption.value } });
    };

    this.setState({ selectedTransition: selectedOption });
  }

  handleSelectChangeDisplay(selectedOption) {
    if (this.props.setProps) {
      this.props.setProps({ recipe: { ...this.props.recipe, display: selectedOption.value } });
    };

    this.setState({ selectedDisplay: selectedOption });
  }

  handleInputChangeTransition(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    if (this.props.setProps) {
      this.props.setProps({ recipe: { ...this.props.recipe, transitionSeconds: value } });
    };

    this.setState({ transitionSeconds: value });
  }

  render() {

    return (
      <Container className="Step">
        <h3><Trans>Customize</Trans></h3>

        <Form>
          <FormGroup>
            <h5><Trans>Transition effect</Trans></h5>

            <Select
              value={this.state.selectedTransition}
              onChange={selectedOption => this.handleSelectChangeTransition(selectedOption)}
              options={this.state.transitionOptions}
              isSearchable={false}
              isClearable={false}
            />
            <Input autoComplete="off" type='hidden' invalid={!this.isTransitionValid()} />
            <FormFeedback invalid='true'><Trans>Please select transition effect</Trans></FormFeedback>

            {this.state.selectedTransition && this.renderTransitionDetails()}

          </FormGroup>
          <FormGroup>
            <h5><Trans>Display effect</Trans></h5>
            <Select
              value={this.state.selectedDisplay}
              onChange={selectedOption => this.handleSelectChangeDisplay(selectedOption)}
              options={this.state.displayOptions}
              isSearchable={false}
              isClearable={false}
            />
            <Input autoComplete="off" type='hidden' invalid={!this.isDisplayValid()} />
            <FormFeedback invalid='true'><Trans>Please select display effect</Trans></FormFeedback>
          </FormGroup>
        </Form>

      </Container>
    );
  }

  renderTransitionDetails() {
    return (
      <div>
        <h5>Enter seconds for transition</h5>
        <Input
          autoComplete="off"
          value={this.state.transitionSeconds}
          onChange={e => this.handleInputChangeTransition(e)}
          invalid={!this.isTransitionSecondsValid()}
        />
        <FormFeedback invalid='true'><Trans>Please enter valid number</Trans></FormFeedback>
      </div>
    );
  }
}

