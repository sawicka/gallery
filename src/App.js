import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import './App.css';
import Layout from './components/Layout/Layout';
import ArtworkList from './containers/ArtworkList/ArtworkList';
import AddArtwork from './components/AddArtwork/AddArtwork';
import EditArtwork from "./components/EditArtwork/EditArtwork";
import Artwork from './containers/Artwork/Artwork';
import AddAuthor from "./containers/AddAuthor/AddAuthor";
import Login from './containers/Login/Login';
import withAuth from "./components/withAuth";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            types: [],
            authors: [],
            isLogged: false,
        };

        this.setIsLogged = this.setIsLogged.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        fetch('/checkToken')
            .then(res => {
                if (res.status === 200) this.setState({isLogged: true})
            })
            .catch(err => console.log(err));

        fetch("/artworks/types")
            .then(res => res.json())
            .then(data => {
                this.setState({types: data})
            });

        fetch("/artworks/authors")
            .then(res => res.json())
            .then(data => {
                this.setState({authors: data})
            });
    }

    setIsLogged(isLogged) {
        this.setState({isLogged: isLogged});
    }

    logout() {
        fetch('/logout')
            .catch(err => console.log(err));
        this.setState({isLogged: false});
    }

    render() {
        const AuthAddArtwork = withAuth(AddArtwork);
        const AuthEditArtwork = withAuth(EditArtwork);

        return (
            <div>
                <BrowserRouter>
                    <div className="App">
                        <Layout isLogged={this.state.isLogged} logout={this.logout}>
                            <Route path='/' exact
                                   render={(props) => <ArtworkList {...props} types={this.state.types} authors={this.state.authors}/>}/>
                            <Route path='/login'
                                   render={(props) => <Login {...props} setIsLogged={this.setIsLogged}/>}/>
                            <Route path='/add/artwork'
                                   render={(props) => <AuthAddArtwork {...props} types={this.state.types}/>}/>
                            <Route path='/add/author' component={withAuth(AddAuthor)}/>
                            <Route path='/artwork/:id'
                                   render={(props) => <Artwork {...props} isLogged={this.state.isLogged}/>}/>
                            <Route path='/edit/artwork/:id'
                                   render={(props) => <AuthEditArtwork {...props} types={this.state.types}/>}/>
                        </Layout>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
