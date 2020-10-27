import React, {Component} from 'react';
import { Modal, Button } from "react-bootstrap";
import Gallery from 'react-grid-gallery';

import './Artwork.css';
import {Link, Redirect} from "react-router-dom";

class Artwork extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            deleteAccepted: false,
            artwork: [],
            images: [],
        };
        this.onDelete = this.onDelete.bind(this);
    }


    componentDidMount() {
        window.scrollTo(0, 0);

        fetch('/artwork/' + this.props.match.params.id)
            .then(response => response.json())
            .then(data => {
                data[0].owner = data[0].owner === 'GaleriaEL' ? 'Zbiór własny Galerii EL' : 'Obiekt z depozytu MMA';
                this.setState({artwork: data[0]});
            })
            .catch(err => console.error(err));
        fetch('/artwork/' + this.props.match.params.id + '/photos')
            .then(response =>
                response.text()
            )
            .then(text =>
                text.length ? JSON.parse(text) : {} //zabezpieczenie gdy nie ma zdjęć
            )
            .then(data => {
                let images = Object.entries(data).length > 0 ? data.map(el => { //sprawdzenie czy objekt jest pusty
                    return {
                        uuid: el.uuid,
                        src: "/photo/" + el.uuid,
                        thumbnail: "/thumbnail/" + el.uuid,
                        thumbnailWidth: 120,
                        thumbnailHeight: 160
                    }
                }) : [];
                this.setState({images: images});
            })
            .catch(err => console.error(err));

    }

    async onDelete(event) {
        event.preventDefault();

        if (this.state.images.length > 0) {
            let images = this.state.images.map(i => i.uuid);
            for (const el of images) {
                await fetch('/photo/' + el, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => res.json())
                    .catch(err => err);
            }
        }

        fetch('/artwork/' + this.props.match.params.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res.status === 200)
                this.setState({deleteAccepted: true})
        }).catch(err => err);
    }

    render() {
        if (this.state.deleteAccepted)
            return <Redirect to={'/'}/>;

        return (
            <div className="container-fluid Artwork">
                <div>
                    {this.props.isLogged && (
                        <div>
                            <Link to={'/edit/artwork/' + this.state.artwork.id} className={'btn btn-dark'}>Edytuj</Link>
                            <button onClick={() => {this.setState({showModal: true})}} className={'btn btn-dark'}>Usuń</button>
                        </div>
                    ) }
                    <h3>{this.state.artwork.title}</h3>
                    <hr/>
                    <div className="row">
                        <div className="col">
                            {this.state.artwork.owner}
                        </div>
                    </div>
                    <br/>
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

                    <hr/>

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

                    <hr/>
                    <p>Zdjęcia</p>
                    <Gallery images={this.state.images} backdropClosesModal={true} enableImageSelection={false}/>
                    <div style={{clear: 'both'}}/>
                    <hr/>

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
                </div>

                <Modal centered show={this.state.showModal} onHide={() => {this.setState({showModal: false})}}>
                    <Modal.Header closeButton>
                        <Modal.Title>Ostrzeżenie</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Czy na pewno chcesz usunąć tę prace?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {this.setState({showModal: false})}}>
                            Zamknij
                        </Button>
                        <Button variant="primary" onClick={this.onDelete} >
                            Usuń
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default Artwork;
