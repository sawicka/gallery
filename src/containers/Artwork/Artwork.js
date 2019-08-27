import React, { Component } from 'react';

import './Artwork.css';

class Artwork extends Component {
    state = {
        artwork: []
    };

    componentDidMount() {
        console.log(this.props);
        fetch('/artwork/'+this.props.match.params.id)
            .then(response => response.json())
            .then(data => {
                this.setState({artwork: data[0]});

            });
    }

    render() {
        return (<div className="container-fluid Artwork">
            <h3>{this.state.artwork.title}</h3>
            <hr />
            <div className="row">
                <div className="col-lg-2 col-md-4 col-sm-5">
                    <span>Tytuły:</span>
                </div>
                <div className="col-lg-10 col-md-8 col-sm-7">
                    {this.state.artwork.partsTitles}
                </div>
            </div>
            <div className="row">
                <div className="col-lg-2 col-md-4 col-sm-5">
                    <span>Autor:</span>
                </div>
                <div className="col-lg-10 col-md-8 col-sm-7">
                    {this.state.artwork.name}
                </div>
            </div>
            <div className="row">
                <div className="col-lg-2 col-md-4 col-sm-5">
                    <span>Kraj pochodzenia autora:</span>
                </div>
                <div className="col-lg-10 col-md-8 col-sm-7">
                    {this.state.artwork.country}
                </div>
            </div>
            <div className="row">
                <div className="col-lg-2 col-md-4 col-sm-5">
                    <span>Data powstania:</span>
                </div>
                <div className="col-lg-10 col-md-8 col-sm-7">
                    {this.state.artwork.createDate}
                </div>
            </div>

            <hr />

            <div className="row">
                <div className="col-lg-2 col-md-4 col-sm-5">
                    <span>Rodzaj obiektu:</span>
                </div>
                <div className="col-lg-10 col-md-8 col-sm-7">
                    {this.state.artwork.type}
                </div>
            </div>
            <div className="row">
                <div className="col-lg-2 col-md-4 col-sm-5">
                    <span>Styl:</span>
                </div>
                <div className="col-lg-10 col-md-8 col-sm-7">
                    {this.state.artwork.style}
                </div>
            </div>
            <div className="row">
                <div className="col-lg-2 col-md-4 col-sm-5">
                    <span>Technika/Materiał:</span>
                </div>
                <div className="col-lg-10 col-md-8 col-sm-7">
                    {this.state.artwork.tehnique}
                </div>
            </div>
            <div className="row">
                <div className="col-lg-2 col-md-4 col-sm-5">
                    <span>Wymiary:</span>
                </div>
                <div className="col-lg-10 col-md-8 col-sm-7">
                    {this.state.artwork.measurments}
                </div>
            </div>
            <div className="row">
                <div className="col-lg-2 col-md-4 col-sm-5">
                    <span>Ilość części:</span>
                </div>
                <div className="col-lg-10 col-md-8 col-sm-7">
                    {this.state.artwork.amount}
                </div>
            </div>
            <div className="row">
                <div className="col-lg-2 col-md-4 col-sm-5">
                    <span>Opis:</span>
                </div>
                <div className="col-lg-10 col-md-8 col-sm-7">
                    {this.state.artwork.description}
                </div>
            </div>

            <hr />
            <p>Zdjęcia</p>

            <hr />

            <div className="row">
                <div className="col-lg-2 col-md-4 col-sm-5">
                    <span>Data nabycia:</span>
                </div>
                <div className="col-lg-10 col-md-8 col-sm-7">
                    {this.state.artwork.purchaseDate}
                </div>
            </div>
            <div className="row">
                <div className="col-lg-2 col-md-4 col-sm-5">
                    <span>Sposób nabycia:</span>
                </div>
                <div className="col-lg-10 col-md-8 col-sm-7">
                    {this.state.artwork.purchaseWay}
                </div>
            </div>
            <div className="row">
                <div className="col-lg-2 col-md-4 col-sm-5">
                    <span>Źródło nabycia:</span>
                </div>
                <div className="col-lg-10 col-md-8 col-sm-7">
                    {this.state.artwork.purchaseSource}
                </div>
            </div>
            <div className="row">
                <div className="col-lg-2 col-md-4 col-sm-5">
                    <span>Wartość:</span>
                </div>
                <div className="col-lg-10 col-md-8 col-sm-7">
                    {this.state.artwork.value}
                </div>
            </div>
            <div className="row">
                <div className="col-lg-2 col-md-4 col-sm-5">
                    <span>Data dodania:</span>
                </div>
                <div className="col-lg-10 col-md-8 col-sm-7">
                    {this.state.artwork.date}
                </div>
            </div>
            <div className="row">
                <div className="col-lg-2 col-md-4 col-sm-5">
                    <span>Nr księgi wpływu:</span>
                </div>
                <div className="col-lg-10 col-md-8 col-sm-7">
                    {this.state.artwork.bookId}
                </div>
            </div>
            <div className="row">
                <div className="col-lg-2 col-md-4 col-sm-5">
                    <span>Uwagi:</span>
                </div>
                <div className="col-lg-10 col-md-8 col-sm-7">
                    {this.state.artwork.comment}
                </div>
            </div>
        </div>)
    }
}

export default Artwork;
