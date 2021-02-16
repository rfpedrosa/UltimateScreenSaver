import React, { Component } from "react";
import { Container } from "reactstrap";
import "./NewRecipe.css";
import { withNamespaces } from "react-i18next";
import RecipeWizard from '../../components/RecipeWizard';
import { API } from "aws-amplify";

class NewRecipe extends Component {

  async createRecipe(recipe) {
    return await API.post("api", "/recipes", {
      body: recipe
    });
  }

  render() {
    const { t } = this.props;

    return (
      <Container className="NewRecipe">
        <div className='step-progress'>
          <RecipeWizard
            userId={this.props.userId}
            storageName='NewRecipe'
            finalActionText={t('Create a recipe')}
            onFinalAction={recipe => this.createRecipe(recipe)}
          />
        </div>
      </Container>
    );
  }

}

export default withNamespaces("translations")(NewRecipe);
