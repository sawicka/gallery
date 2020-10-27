import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { sampleArts } from "../../dumydata";

import "./ArtworkList.css";

class ArtworkList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      artworks: [],
      checkedTypes: [],
      checkedAuthors: [],
      filterString: "",
    };

    this.onCheck = this.onCheck.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
  }

  componentDidMount() {
    // fetch('/artworks')
    //     .then(response => response.json())
    //     .then(data => {
    //         this.setState({artworks: data});
    //     });
    this.setState({ artworks: sampleArts });
  }

  onCheck(event) {
    let list;

    if (event.target.className === "type-checkbox")
      list = this.state.checkedTypes.slice();
    else list = this.state.checkedAuthors.slice();

    if (list.indexOf(event.target.id) < 0) {
      list.push(event.target.id);
    } else {
      list = list.filter((el) => el !== event.target.id);
    }

    if (event.target.className === "type-checkbox")
      this.setState({ checkedTypes: list });
    else this.setState({ checkedAuthors: list });
  }

  onTextChange(event) {
    this.setState({ filterString: event.target.value });
  }

  render() {
    const typesCheckbox = this.props.types.map((type) => {
      return (
        <div className={"inline-input"} key={this.props.types.indexOf(type)}>
          <input
            onChange={this.onCheck}
            className={"type-checkbox"}
            id={type}
            type={"checkbox"}
          />
          <label className={"type-label"} htmlFor={type}>
            {" "}
            {type}{" "}
          </label>
        </div>
      );
    });

    const authorsCheckbox = this.props.authors.map((author) => {
      return (
        <div className={"inline-input"} key={author.id}>
          <input
            onChange={this.onCheck}
            className={"author-checkbox"}
            id={author.name}
            type={"checkbox"}
          />
          <label className={"type-label"} htmlFor={author.name}>
            {" "}
            {author.name}{" "}
          </label>
        </div>
      );
    });

    let artworks = this.state.artworks;
    if (this.state.checkedTypes.length > 0) {
      artworks = artworks.filter(
        (artwork) => this.state.checkedTypes.indexOf(artwork.type) >= 0
      );
    }
    if (this.state.checkedAuthors.length > 0) {
      artworks = artworks.filter(
        (artwork) => this.state.checkedAuthors.indexOf(artwork.name) >= 0
      );
    }
    if (this.state.filterString !== "") {
      artworks = artworks.filter(
        (artwork) =>
          artwork.title !== null &&
          artwork.title
            .toLowerCase()
            .includes(this.state.filterString.toLocaleLowerCase())
      );
    }

    const artworksCard = artworks.map((artwork) => {
      return (
        <Col sm={12} md={6} lg={6} xl={4} key={artwork.id}>
          <div className="artwork-card">
            <img className="artwork-img" src={artwork.photo} alt="test" />
            <div className="artwork-info">
              <h5 className="artwork-title">{artwork.title}</h5>
              <h6 className="artwork-author">{artwork.author.name}</h6>
              <Link
                to={"/artwork/" + artwork.id}
                role="button"
                className="btn btn-dark"
              >
                Więcej
              </Link>
            </div>
          </div>
        </Col>
      );
    });

    return (
      <div className="ArtworksList">
        <div className={"filter"}>
          <h4>Wyszukaj dzieło</h4>
          <input
            className={"search-title form-control"}
            placeholder={"Wpisz tytuł"}
            type={"text"}
            onKeyUp={this.onTextChange}
          />
          <h4>Filtry</h4>
          <div className={"ml-2"}>
            <h6>Typ</h6>
            {typesCheckbox}
          </div>
          <div className={"ml-2"}>
            <h6>Autor</h6>
            {authorsCheckbox}
          </div>
        </div>
        <Row>{artworksCard}</Row>
      </div>
    );
  }
}

export default ArtworkList;
