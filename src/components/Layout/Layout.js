import React from 'react';
import { Link } from 'react-router-dom';

import './Layout.css';

const layout = (props) => (
    <div className="Layout">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

            <a href="/" className="navbar-brand logo">Księga Inwentarzowa Galerii EL</a>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link to='/'><span className="nav-link">Lista</span></Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/add/artwork'><span className="nav-link" >Dodaj dzieło</span></Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/add/author'><span className="nav-link" >Dodaj autora</span></Link>
                    </li>
                </ul>
            </div>
        </nav>

        <main>
            <div className={"container-fluid"}>

            {props.children}

            </div>
        </main>
        <footer>

        </footer>
    </div>
);

export default layout;
