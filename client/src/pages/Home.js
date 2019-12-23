import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../components/Grid";
import Jumbotron from "../components/Jumbotron";

class Home extends Component {
  state = {
    books: [],
    condition:false,
    state: false
  };

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-12">
            <Jumbotron condition={this.state.condition} />
            
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Home;