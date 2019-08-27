import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './ArtworkList.css';

class ArtworkList extends Component {
    state = {
        artworks: [],
    };

    componentDidMount() {
        if(this.state.artworks.length === 0) {
            fetch('/artworks')
                .then(response => response.json())
                .then(data => {
                    this.setState({artworks: data});

                });
        }
    }

    render() {

        const artworksCard = this.state.artworks.map((artwork) => {
            return (
                <div className="col-sm-12 col-md-6 col-lg-4" key={artwork.id}>
                    <div className="artwork-card" >
                        <img className="artwork-img" src={"/artworks/"+artwork.id+"/photo"} alt="test" />
                        <div className="artwork-info">
                            <h5 className="artwork-title">{artwork.title}</h5>
                            <h6 className="artwork-author">{artwork.name}</h6>
                            <Link to={'/artwork/'+artwork.id} role="button" className="btn btn-dark">Więcej</Link>
                        </div>
                    </div>
                </div>
            )
        });

        return (
            <div className="ArtworksList row justify-content-center">
                    {artworksCard}
            </div>
        )
    }
}

export default ArtworkList;
