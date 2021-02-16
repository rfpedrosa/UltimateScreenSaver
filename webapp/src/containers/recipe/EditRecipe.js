import React, { Component } from "react";
import { Container } from "reactstrap";
import "./NewRecipe.css";
import { withNamespaces } from "react-i18next";
import RecipeWizard from '../../components/RecipeWizard';
import { API } from "aws-amplify";

class EditRecipe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recipe: null,
    };
  }

  async componentWillMount(){
    try {
      const recipe = await this.getRecipe();
      this.setState({ recipe });
    }
    catch(e) {
      alert(e);
    }    
  }

  async getRecipe() {
    const apiRecipe = await API.get("api", `/recipes/${this.props.match.params.id}`);

    return {
      title: apiRecipe.title,
      googleAlbums: apiRecipe.albums,
      dropboxFolders: apiRecipe.folders,

      feedlyEnabled: apiRecipe.feedsEnabled,
      feedlyFeeds: apiRecipe.feeds,

      transition: apiRecipe.transitionEffect.type,
      transitionSeconds: apiRecipe.transitionEffect.duration,
      display: apiRecipe.displayEffect.type,
    }
  }

  async saveRecipe(recipe) {
    return await API.put("api", `/recipes/${this.props.match.params.id}`, {
      body: recipe
    });
  }

  render() {
    const { t } = this.props;

    return (
      <Container className="EditRecipe">
        <div className='step-progress'>
        {this.state.recipe &&
          <RecipeWizard
            userId={this.props.userId}
            storageName='EditRecipe'
            finalActionText={t('Save a recipe')}
            onFinalAction={recipe => this.saveRecipe(recipe)}
            recipe={this.state.recipe}
          />
        }

        </div>
      </Container>
    );
  }

}

export default withNamespaces("translations")(EditRecipe);
