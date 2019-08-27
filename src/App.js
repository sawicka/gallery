import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import './App.css';
import Layout from './components/Layout/Layout';
import ArtworkList from './containers/ArtworkList/ArtworkList';
import AddArtwork from './containers/AddArtwork/AddArtwork';
import Artwork from './containers/Artwork/Artwork';
import AddAuthor from "./containers/AddAuthor/AddAuthor";

class App extends Component {

  render() {
    return (
      <div>

        <BrowserRouter>
          <div className="App">
            <Layout>
              <Route path='/' exact component={ArtworkList} />
              <Route path='/add/artwork' component={AddArtwork} />
              <Route path='/add/author/' component={AddAuthor} />
              <Route path='/artwork/:id/' component={Artwork} />
            </Layout>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
