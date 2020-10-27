import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast} from "react-toastify";

import './AddAuthor.css';

class AddAuthor extends Component{
    constructor(props) {
        super(props);

        this.state = {
            formControl: {
                name: '',
                surname: '',
                country: ''
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;

        let formControl = this.state.formControl;

        this.setState({formControl: {...formControl, [name]: value}});
    }

    handleSubmit(event) {
        event.preventDefault();

        fetch('/author/add', {
            method: 'POST',
            body: JSON.stringify(this.state.formControl),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if(res.status === 200) {
                toast.success('Zapisano pomyślnie');
                this.setState({formControl: {name: '', surname: '', country: ''}})
            }
        }).catch(err => err);
    }

    render() {
        return (
            <div className={"AddAuthor"}>
                <h3> Nowy autor</h3>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId={'nameInput'}>
                        <Form.Label>Imię: </Form.Label>
                        <Form.Control required name="name" type="text" value={this.state.formControl.name} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId={'surnameInput'}>
                        <Form.Label>Nazwisko: </Form.Label>
                        <Form.Control required name="surname" type="text" value={this.state.formControl.surname} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Kraj pochodzenia: </Form.Label>
                        <Form.Control name="country" type="text" value={this.state.formControl.country} onChange={this.handleChange} />
                    </Form.Group>
                    <Button type="submit" variant={'dark'} size={'lg'} className="saveBtn" >Dodaj</Button>
                    <ToastContainer/>
                </Form>
            </div>
        )
    }

} export default AddAuthor;