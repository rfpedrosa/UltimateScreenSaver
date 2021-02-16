import React, { Component } from "react";
import { Container } from "reactstrap";
import "./RecipeWizard.css";
import { withNamespaces } from "react-i18next";
import PropTypes from 'prop-types';
import SessionStorage from './SessionStorage';
import StepZilla from "react-stepzilla";

import Step1 from "../containers/recipe/steps/Step1";
import Step2 from "../containers/recipe/steps/Step2";
import Step3 from "../containers/recipe/steps/Step3";
import Step4 from "../containers/recipe/steps/Step4";
import Step5 from "../containers/recipe/steps/Step5";
import Step6 from "../containers/recipe/steps/Step6";

class RecipeWizard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: this.props.userId,
      storageKey: SessionStorage.getStorageKey(this.props.storageName, this.props.userId),

      recipe: this.props.recipe ? this.props.recipe : this.newRecipe(),

      currentStep: null,
      activeTab: '0',
      weights: this.props.recipe ? this.getWeights(this.props.recipe) : [],

      setProps: newProps => this.setProps(newProps),
      onFinalAction: this.props.onFinalAction,

      transitionOptions: [
        { value: 'crossfade', label: 'Crossfade' },
        { value: 'quickcut', label: 'Quick cut' },
      ],
      displayOptions: [
        { value: 'none', label: 'None' },
        { value: 'kenburns', label: 'Ken burns' }
      ]

    };
  }

  getWeights(recipe) {
    const weights = [];
    recipe.googleAlbums.forEach(el => {
      weights.push({ type: 'google', id: el.id, title: el.title, value: el.weight ? el.weight : 1 })
    });
    recipe.dropboxFolders.forEach(el => {
      weights.push({ type: 'dropbox', id: el.id, title: el.title, value: el.weight ? el.weight : 1 })
    });

    return weights;
  }

  newRecipe(){
    return {
      title: '',
      googleAlbums: [],
      dropboxFolders: [],

      feedlyEnabled: true,
      feedlyFeeds: [],

      transition: null,
      transitionSeconds: 5,
      display: null,
    };
  }

  componentWillMount() {
      const storageData = SessionStorage.loadStorageState(this.state.storageKey);
      if (storageData !== undefined) {
        this.setState({ ...storageData });
      }
      else {
        this.setState({ currentStep: 0 });
      }
  }

  componentWillUnmount(){
    SessionStorage.removeStorageState(this.state.storageKey);
  }

  setProps(data) {
    this.setState(prevState => {
      SessionStorage.setStorageState(this.state.storageKey, { ...prevState, ...data });

      return { ...prevState, ...data };
    });
  }

  handleStepChange(step){
    this.setState((prevState) => {
      SessionStorage.setStorageState(this.state.storageKey, { ...prevState, currentStep: step });

      return { currentStep: step };
    });
  }

  render() {

    return (
      <Container className="NewRecipe">
        <div className='step-progress'>
          {this.state.currentStep !== null && this.renderWizard()}
        </div>
      </Container>
    );
  }

  renderWizard(){
    const { t } = this.props;

    const steps =
    [
      {
        name: t('Recipe information'), component:
          <Step1 {...this.state}
          />
      },
      {
        name: t('Weights information'), component:
          <Step2 {...this.state}
          />
      },
      {
        name: t('RSS Feeds information'), component:
          <Step3 {...this.state}
          />
      },
      {
        name: t('Customize'), component:
          <Step4 {...this.state}
          />
      },
      {
        name: t('Review'), component:
          <Step5 {...this.state}
          />
      },
      {
        name: t('Finish'), component:
          <Step6 {...this.state}
          />
      }
    ];

    return (
      <StepZilla steps={steps}
              startAtStep={this.state.currentStep}
              nextButtonText={t('Next')}
              backButtonText={t('Previous')}
              nextButtonCls='btn btn-prev btn-primary float-right'
              backButtonCls='btn btn-next btn-primary float-left'
              nextTextOnFinalActionStep={this.props.finalActionText}
              prevBtnOnLastStep={false}
              onStepChange={(step) => this.handleStepChange(step)}
              preventEnterSubmission={true}
            />
    );
  }
}

RecipeWizard.propTypes = {
  userId: PropTypes.string.isRequired,
  storageName: PropTypes.string.isRequired,
  finalActionText: PropTypes.string.isRequired,
  onFinalAction: PropTypes.func.isRequired,
};

export default withNamespaces("translations")(RecipeWizard);
