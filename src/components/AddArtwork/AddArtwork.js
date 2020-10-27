import React from 'react';
import ArtworkForm from '../../containers/ArtworkForm/ArtworkForm';

import './AddArtwork.css';

const addArtwork = (props) =>
        (
            <div className="AddArtwork">
                <h3>Nowy obiekt</h3>
                <ArtworkForm edit={false} types={props.types}/>
            </div>
        );
export default addArtwork;