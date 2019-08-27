import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast} from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';
import './AddArtwork.css';

class AddArtwork extends Component {
    constructor(props) {
        super(props);

        this.state = {
            types : [],
            authors: [],
            isChecked: false,
            amountTitleInputs: 1,
            images: null,

            formControl: {
                title: null,
                bookId: 1,
                createDate: null,
                description: null,
                style: null,
                technique: null,
                type: 'default',
                amount: 1,
                partsTitles: [],
                measurements: null,
                value: null,
                purchaseDate: null,
                purchaseSource: null,
                purchaseWay: null,
                comment: null,
                authorId: 'default'
            }

        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChecked = this.handleChecked.bind(this);
        this.addTitleInput = this.addTitleInput.bind(this);
        this.handleChangePartTitle = this.handleChangePartTitle.bind(this);
        this.deleteTitleInput = this.deleteTitleInput.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
    }

    componentDidMount() {
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

    handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;

        let formControl = this.state.formControl;

        this.setState({formControl: {...formControl, [name]: value}});
    }

    handleChangePartTitle(event) {
        const value = event.target.value;
        const index = parseInt(event.target.name) - 1;

        let formControl = this.state.formControl;
        let titleArray = formControl.partsTitles;
        titleArray[index] = value;

        this.setState({formControl: {...formControl, partsTitles: titleArray }})
    }

    handleImageChange(event) {
        if(this.maxSelectFile(event) && this.checkMimeType(event)){
            this.setState({images: event.target.files});
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        const data = new FormData();
        for(let i = 0; i < this.state.images.length; i++) {
            data.append('file', this.state.images[i]);
        }

        fetch('/images/add', {
            method: 'POST',
            body: data,
        }).then(res => {
            toast.success('Zapisano pomyślnie');
        }).catch(err => {
            toast.error('Zapisywanie nie powiodło się');
        })

/*        console.log(this.state.formControl);
        fetch('/artwork/add', {
            method: 'POST',
            body: JSON.stringify(this.state.formControl),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res)
            .catch(err => err)*/
    }

    maxSelectFile = (event) => {
        let files = event.target.files;
        if(files.length > 6) {
            const msg = 'Można przesłać tylko 6 plików';
            event.target.value = null;
            toast.warn(msg);
            return false;
        }
        return true;
    };

    checkMimeType = (event) => {
        let files = event.target.files;
        let err;
        const types = ['image/png', 'image/jpeg'];

        for(let i = 0; i < files.length; i++) {
            if(types.every(type => files[i].type !== type)) {
                err += files[i].type + ' - format nie jest obsługiwany\n';
            }
        }

        if(err) {
            event.target.value = null;
            toast.error(err);
            return false;
        }

        return true;
    };

    handleChecked() {
        let formControl = this.state.formControl;
        this.setState({formControl: {...formControl, title: null, partsTitles: []}});
        this.setState({isChecked: !this.state.isChecked});
        this.setState({amountTitleInputs: 1});
    }

    addTitleInput() {
        this.setState({amountTitleInputs: this.state.amountTitleInputs + 1})
    }

    deleteTitleInput() {
        let amount = this.state.amountTitleInputs - 1;
        this.setState({amountTitleInputs: amount});

        const formControl = this.state.formControl;
        const partsTitles = formControl.partsTitles;
        partsTitles.pop();

        this.setState({formControl: {...formControl, partsTitles: partsTitles}});

        if(amount === 0)
            this.setState({isChecked: false});
    }

    render() {
        let typeSelect = this.state.types.map(
            (type) => {
                let index = this.state.types.indexOf(type);
                return (
                    <option key={'type-'+index} value={index}>{type}</option>
                )
        });
        typeSelect.push(<option key={typeSelect.length} value={'default'} >-- Wybierz rodzaj --</option>);

        let authorsSelect = this.state.authors.map(
            (author) => {
                return (
                    <option key={'author-'+author.id} value={author.id} >{author.name}</option>
                )
            }
        );
        authorsSelect.push(<option key={authorsSelect.length} value={'default'}>-- Wybierz autora --</option>);

        let isDisabled = false;
        let display = 'none';
        let titleInputs = [];

        if(this.state.isChecked) {
            isDisabled = true;
            display = 'inline';

            for(let i = 1; i <= this.state.amountTitleInputs; i++){
                titleInputs.push(
                    <Form.Group key={i} controlId={ 'partsTitles' + i }>
                        <Form.Control name={i} onChange={this.handleChangePartTitle}/>
                    </Form.Group>)
            }
        }

        return (
            <div className="AddArtwork">
                <h3>Nowy obiekt</h3>

                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId={'inputTitle'}>
                        <Form.Label>Tytuł</Form.Label>
                        <Form.Control disabled={isDisabled} name={'title'} type="text" onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group controlId={'checkbox'}>
                        <Form.Check type={'checkbox'} label={'Dodaj kilka tytułów'} checked={this.state.isChecked} onChange={this.handleChecked}/>
                    </Form.Group>

                    { titleInputs }

                    <div className={'titleInputBtns'}>
                        <Button variant={'secondary'} className={'addBtn'} style={{display: display}} onClick={this.addTitleInput} >Dodaj</Button>
                        <Button variant={'secondary'} className={'removeBtn'} style={{display: display}} onClick={this.deleteTitleInput}> Usuń </Button>
                    </div>
                    <Form.Group controlId={'selectType'}>
                        <Form.Label>Rodzaj: </Form.Label>
                        <Form.Control name={'type'} as={'select'} value={this.state.formControl.type} onChange={this.handleChange} >
                            {typeSelect}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId={'selectAuthor'}>
                        <Form.Label>Autor: </Form.Label>
                        <Form.Control name={'authorId'} as={'select'} value={this.state.formControl.authorId} onChange={this.handleChange}>
                            {authorsSelect}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId={'inputCreateDate'}>
                        <Form.Label>Data\Okres powstania: </Form.Label>
                        <Form.Control name={'createDate'} type="text" onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId={'inputStyle'}>
                        <Form.Label>Styl: </Form.Label>
                        <Form.Control name={'style'} type="text" onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId={'inputTechnique'}>
                        <Form.Label>Technika / Materiał: </Form.Label>
                        <Form.Control name={'technique'} type="text" onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId={'inputMeasurements'}>
                        <Form.Label>Wymiary: </Form.Label>
                        <Form.Control name={'measurements'} type="text" onChange={this.handleChange} />
                        <Form.Text className={'text-muted'}> Wymiary należy podać _x_x_ jednostka lub średnica _ jednostka </Form.Text>
                    </Form.Group>
                    <Form.Group controlId={'inputAmount'}>
                        <Form.Label>Ilość części: </Form.Label>
                        <Form.Control name={'amount'} type="text" onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId={'textareaDescription'}>
                        <Form.Label>Opis: </Form.Label>
                        <Form.Control name={'description'} as={'textarea'} rows="5" onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group controlId={'inputBookId'}>
                        <Form.Label>Nr księgi wpływu: </Form.Label>
                        <Form.Control name={'bookId'} type="text" onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId={'inputPurchaseWay'}>
                        <Form.Label>Sposób nabycia: </Form.Label>
                        <Form.Control name={'purchaseWay'} type="text" onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId={'inputPurchaseSource'}>
                        <Form.Label>Źródło nabycia: </Form.Label>
                        <Form.Control name={'purchaseSource'} type="text" onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId={'inputPurchaseDate'}>
                        <Form.Label>Data nabycia: </Form.Label>
                        <Form.Control name={'purchaseDate'} type="date" onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId={'inputValue'}>
                        <Form.Label>Wartość: </Form.Label>
                        <Form.Control name={'value'} type="text" onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId={'textareaComment'}>
                        <Form.Label>Uwagi: </Form.Label>
                        <Form.Control name={'comment'} as={'textarea'} rows="3" onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group controlId={'inputImage'}>
                        <Form.Label>Zdjęcia: </Form.Label>
                        <Form.Control type="file" multiple onChange={this.handleImageChange}/>
                        <ToastContainer/>
                    </Form.Group>
                    <Button type="submit" variant={'dark'} size={'lg'} className="saveBtn" >Dodaj</Button>
                </Form>
            </div>)
    }
}

export default AddArtwork;
