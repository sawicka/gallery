import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

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
        fetch('/author/add', {
            method: 'POST',
            body: JSON.stringify(this.state.formControl),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res)
            .catch(err => err);

console.log("Submitted");
        event.preventDefault();
    }

    render() {
        return (
            <div className={"AddAuthor"}>
                <h3> Nowy autor</h3>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId={'nameInput'}>
                        <Form.Label>Imię: </Form.Label>
                        <Form.Control name="name" type="text" value={this.state.formControl.name} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId={'surnameInput'}>
                        <Form.Label>Nazwisko: </Form.Label>
                        <Form.Control name="surname" type="text" value={this.state.formControl.surname} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Kraj pochodzenia: </Form.Label>
                        <Form.Control name="country" type="text" value={this.state.formControl.country} onChange={this.handleChange} />
                    </Form.Group>
                    <Button type="submit" variant={'dark'} size={'lg'} className="saveBtn" >Dodaj</Button>
                </Form>
            </div>
        )
    }

} export default AddAuthor;