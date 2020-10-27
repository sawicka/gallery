import React from 'react';
import ArtworkForm from "../../containers/ArtworkForm/ArtworkForm";

import './EditArtwork.css';

const editArtwork = (props) =>
    (
        <div className={'EditArtwork'}>
            <h3>Edycja</h3>
            <ArtworkForm artworkId={props.match.params.id} edit={true} types={props.types}/>
        </div>
    );

export default editArtwork;