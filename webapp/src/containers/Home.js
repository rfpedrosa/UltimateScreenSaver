import React, { Component } from "react";
import { ListGroupItemHeading, ListGroupItemText, NavLink, Row, Col, Button } from "reactstrap";
import { Link } from "react-router-dom";
import "./Home.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faTrash } from '@fortawesome/free-solid-svg-icons'
import { withNamespaces, Trans } from "react-i18next";
import { API } from "aws-amplify";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recipes: null
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    await this.fetchRecipes();
  }

  componentDidUpdate(prevProps) {
    /*     on componentDidMount() authentication state may still being verified
    (try refresh home screen while authenticated) so componentDidUpdate is a better to place to check if authentication state changed */
    if (this.props.isAuthenticated &&
      this.props.isAuthenticated !== prevProps.isAuthenticated) {
      this.fetchRecipes();
    }
  }

  async fetchRecipes() {
    try {
      const recipes = await API.get("api", "/recipes");
      this.setState({ recipes: recipes });
    } catch (e) {
      alert(e);
    }
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Ultimate Screen saver</h1>
        <p><Trans>Combine your photos with music and make your walls happy again</Trans></p>
        <div>
          <Link to="/login" className="btn btn-info btn-lg">
            <Trans>Login</Trans>
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            <Trans>Signup</Trans>
          </Link>
        </div>
      </div>
    );
  }

  deleteRecipe(recipeId) {
    return API.del("api", `/recipes/${recipeId}`);
  }

  async handleDelete(e, recipeId) {
    e.preventDefault();

    const { t } = this.props;
    const confirmed = window.confirm(
      t('Are you sure you want to delete this recipe?')
    );

    if (!confirmed) {
      return;
    }

    try {
      await this.deleteRecipe(recipeId);
      const recipes = this.state.recipes.filter(el => el.recipeId !== recipeId);
      this.setState(prevState => ({...prevState, recipes: recipes}));
    } catch (e) {
      alert(e);
    }

  }

  renderRecipesList(recipes) {
    return [{}].concat(recipes).map(
      (recipes, i) =>
        i !== 0
          ?<Row key={recipes.recipeId}>
            <Col sm="8">
              <NavLink tag={Link} to={`/recipes/${recipes.recipeId}`}>
                <ListGroupItemHeading>{recipes.title.trim()}</ListGroupItemHeading>
                <ListGroupItemText>
                  <Trans>Created</Trans>{": " + new Date(recipes.createdAt).toLocaleString()}
                </ListGroupItemText>
              </NavLink>
            </Col>
            <Col sm="2">
              <Button onClick={e => this.handleDelete(e, recipes.recipeId)}>
              <FontAwesomeIcon icon={faTrash} />
              </Button>
            </Col>
            <Col sm="2">
              <Link to={{
                pathname: `/recipes/${recipes.recipeId}/play`,
                state: { fullscreen: true }
              }}>
                <FontAwesomeIcon icon={faPlay} size="lg" />
              </Link>
            </Col>
          </Row>
          : <NavLink
            tag={Link}
            key="new"
            to="/recipes/new"
          >
            <h4>
              <b>{"\uFF0B"}</b> <Trans>Create a recipe</Trans>
            </h4>
          </NavLink>
    );
  }

  renderRecipes() {
    return (
      <div className="recipes">
        <h3><Trans>Your recipes</Trans></h3>
        {this.state.recipes && this.renderRecipesList(this.state.recipes)}
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderRecipes() : this.renderLander()}
      </div>
    );
  }

}

export default withNamespaces("translations")(Home);
