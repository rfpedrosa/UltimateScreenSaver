import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container } from "reactstrap";
import "./Step.css";
import { withNamespaces, Trans } from "react-i18next";

class Step6 extends Component {

    render() {

      return (
            <Container className="Step">
                <h3><Trans>Recipe created</Trans></h3>
                    <p>
                        <Trans i18nKey="Recipe created message">Recipe created sucessfully. Thank you for using Ultimate Screen Saver. Go to
                            <Link to="/"> your recipes</Link>.
                        </Trans>
                    </p>
            </Container>
        );
    }
}

export default withNamespaces("translations")(Step6);
