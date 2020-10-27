import React, { Component } from 'react';
import './Login.css';
import { Form } from 'react-bootstrap';
import Button from "react-bootstrap/Button";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password: '',
            errorMsg: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const value = event.target.value;
        const name = event.target.name;

        this.setState( {[name]: value});
    }

    handleSubmit(event) {
        event.preventDefault();

        fetch('/auth', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if(res.status === 200) {
                this.props.setIsLogged(true);
                this.props.history.push('/');
            } else if (res.status === 401)
                this.setState({errorMsg: "Niepoprawny login lub hasło"})
        }).catch(err => {
            console.log(err);
            if (err.status === 401)
               this.setState({errorMsg: "Niepoprawny login lub hasło"})
        })
    }

    render() {
        return (
            <div className={'Login'}>
                <h3>Logowanie</h3>
                <Form className={'loginForm'} onSubmit={this.handleSubmit}>
                    <Form.Group controlId={'login'}>
                        <Form.Label >Login</Form.Label>
                        <Form.Control type={'text'} name={'login'} onChange={this.handleInputChange} required/>
                    </Form.Group>
                    <Form.Group  controlId={'password'}>
                        <Form.Label>Hasło</Form.Label>
                        <Form.Control type={'password'} name={'password'} onChange={this.handleInputChange} required/>
                    </Form.Group>
                    <p className={'error-msg'}>{this.state.errorMsg}</p>
                    <Button type="submit" variant={'dark'} size={'lg'} className="saveBtn" >Zaloguj się</Button>
                </Form>
            </div>
        )
    }

} export default Login