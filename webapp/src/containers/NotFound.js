import React from "react";
import { Container } from "reactstrap";
import "./NotFound.css";
import { Trans } from 'react-i18next';

export default function NotFound () {
  return (
    <Container className="NotFound">
      <h3><Trans>Sorry, page not found</Trans></h3>
    </Container>
  );
}