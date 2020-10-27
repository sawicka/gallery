import React, {Component} from 'react';
import Button from "react-bootstrap/Button";
import {toast, ToastContainer} from "react-toastify";
import {Redirect} from "react-router";
import Form from 'react-bootstrap/Form';

import './ArtworkForm.css';
import 'react-toastify/dist/ReactToastify.css';
import Gallery from "react-grid-gallery";
import {Modal} from "react-bootstrap";

class ArtworkForm extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            types: this.props.types || [],
            authors: [],
            isChecked: false,
            amountTitleInputs: 1,
            images: [],
            oldImages: [],
            isImageSelected: false,
            formAccepted: false,
            showModal: false,
            validated: true,
            formControl: {
                title: '',
                bookId: 1,
                owner: '1',
                createDate: '',
                description: '',
                style: '',
                technique: '',
                type: 'default',
                amount: 1,
                partsTitles: [],
                measurements: '',
                value: 0,
                purchaseDate: null,
                purchaseSource: '',
                purchaseWay: '',
                comment: '',
                authorId: 'default'
            }
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChecked = this.handleChecked.bind(this);
        this.addTitleInput = this.addTitleInput.bind(this);
        this.handleChangePartTitle = this.handleChangePartTitle.bind(this);
        this.deleteTitleInput = this.deleteTitleInput.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.onSelectImage = this.onSelectImage.bind(this);
        this.onDeleteImages = this.onDeleteImages.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.showModal = this.showModal.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        window.scrollTo(0, 0);

        fetch("/artworks/authors")
            .then(res => res.json())
            .then(data => {
                if (this._isMounted)
                    this.setState({authors: data})
            });

        if (this.props.edit) {
            fetch('/artwork/' + this.props.artworkId,
                {method: 'GET'})
                .then(res => res.json())
                .then(data => {
                    delete data[0].name; //usuwa właściwość z obiektu
                    delete data[0].country;
                    delete data[0].date;

                    data[0].owner = data[0].owner === 'GaleriaEL' ? '1' : '2';
                    let date;
                    if (data[0].purchaseDate) {//zapis daty w formacie YYYY-MM-DD
                        let elements = data[0].purchaseDate.split('.');
                        date = new Date(elements[0], elements[1], elements[2]).toISOString().split('T')[0];
                    } else
                        date = null;
                    data[0].purchaseDate = date;

                    let titles = [];
                    if (data[0].partsTitles) {
                        titles = data[0].partsTitles.split(',');
                        this.setState({isChecked: true, amountTitleInputs: titles.length});
                    }
                    data[0].partsTitles = titles;

                    this.setState({formControl: data[0]});
                });
            fetch('/artwork/' + this.props.artworkId + '/photos')
                .then(response =>
                    response.text()
                )
                .then(text =>
                    text.length ? JSON.parse(text) : {} //zabezpieczenie gdy nie ma zdjęć
                )
                .then(data => {
                    let images = Object.entries(data).length > 0 ? data.map(el => {
                        return {
                            uuid: el.uuid,
                            src: "/photo/" + el.uuid,
                            thumbnail: "/thumbnail/" + el.uuid,
                            thumbnailWidth: 120,
                            thumbnailHeight: 160
                        }
                    }) : [];
                    this.setState({oldImages: images});
                }).catch(err => console.error(err));
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleSubmit(event) {
        event.preventDefault();

        const imageData = new FormData();
        if (this.state.images.length > 0) {
            for (let i = 0; i < this.state.images.length; i++) {
                imageData.append('file', this.state.images[i]);
            }
        }

        if (this.state.formControl.type === 'default' || this.state.formControl.authorId === 'default')
            this.setState({validated: false});
        else {
            if (this.props.edit) {
                fetch('/artwork/' + this.props.artworkId, {
                    method: 'PUT',
                    body: JSON.stringify(this.state.formControl),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((res) => {
                        if (res.status !== 200 || this.state.images.length === 0)
                            return res;
                        else
                            return fetch('/images/add', {
                                method: 'POST',
                                body: imageData,
                            })
                    }
                ).then(res => {
                    if (res.status === 200)
                        this.setState({formAccepted: true});
                    else
                        toast.error('Zapisywanie nie powiodło się');
                }).catch(err => {
                    toast.error('Zapisywanie nie powiodło się');
                    return err;
                });

            } else {
                fetch('/artworks/add', {
                    method: 'POST',
                    body: JSON.stringify(this.state.formControl),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((res) => {
                        if (res.status !== 200 || this.state.images.length === 0)
                            return res;
                        else
                            return fetch('/images/add', {
                                method: 'POST',
                                body: imageData,
                            })
                    }
                ).then(res => {
                    if (res.status === 200)
                        this.setState({formAccepted: true});
                    else
                        toast.error('Zapisywanie nie powiodło się');
                }).catch(err => {
                    toast.error('Zapisywanie nie powiodło się');
                    return err;
                });
            }
        }
    }

    handleChecked() {
        this.setState({validated: true});
        let formControl = this.state.formControl;
        this.setState({formControl: {...formControl, partsTitles: []}});
        this.setState({isChecked: !this.state.isChecked});
        this.setState({amountTitleInputs: 1});
    }

    addTitleInput() {
        this.setState(state => {
            return {amountTitleInputs: state.amountTitleInputs + 1}
        })
    }

    deleteTitleInput() {
        let amount = this.state.amountTitleInputs - 1;
        this.setState( state => {
            return {amountTitleInputs: state.amountTitleInputs - 1}
        });

        const formControl = this.state.formControl;
        const partsTitles = formControl.partsTitles.slice();
        partsTitles.pop();

        this.setState({formControl: {...formControl, partsTitles: partsTitles}});

        if (amount === 0)
            this.setState({isChecked: false});
    }

    handleChange(event) {
        this.setState({validated: true});
        const value = event.target.value;
        const name = event.target.name;

        let formControl = this.state.formControl;

        this.setState({formControl: {...formControl, [name]: value}});
    }

    handleChangePartTitle(event) {
        const value = event.target.value;
        const index = parseInt(event.target.name) - 1;

        let formControl = this.state.formControl;
        let titleArray = formControl.partsTitles.slice();
        titleArray[index] = value;

        this.setState({formControl: {...formControl, partsTitles: titleArray}})
    }

    handleImageChange(event) {
        if (this.maxSelectFile(event) && this.checkMimeType(event)) {
            this.setState({images: event.target.files});
        }
    }

    maxSelectFile = (event) => {
        let files = event.target.files;
        if (files.length > 6) {
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

        for (let i = 0; i < files.length; i++) {
            if (types.every(type => files[i].type !== type)) {
                err += files[i].type + ' - format nie jest obsługiwany\n';
            }
        }

        if (err) {
            event.target.value = null;
            toast.error(err);
            return false;
        }

        return true;
    };

    onSelectImage(index) {
        let images = this.state.oldImages.slice();
        let img = images[index];
        if (img.hasOwnProperty('isSelected'))
            img.isSelected = !img.isSelected;
        else
            img.isSelected = true;

        let selectedImages = images.filter((i) => i.isSelected === true);
        let imageSelected = selectedImages.length > 0;

        this.setState({oldImages: images, isImageSelected: imageSelected});
    }

    onDeleteImages(event) {
        event.preventDefault();

        let images = this.state.oldImages.slice();
        let selectedImages = images.filter((i) => i.isSelected === true).map((i) => i.uuid);
        let notSelectedImages = images.filter((i) => i.isSelected !== true);
        this.setState({oldImages: notSelectedImages, isImageSelected: false});

        selectedImages.forEach((el) => {
            fetch('/photo/' + el, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .catch(err => err);
        });

        this.hideModal();
    }

    hideModal() {
        this.setState({showModal: false});
    }

    showModal(event) {
        event.preventDefault();
        this.setState({showModal: true});
    }

    render() {

        let displayError = this.state.validated ? 'none' : 'inline';

        let typeSelect = this.state.types.map(
            (type) => {
                let index = this.state.types.indexOf(type) + 1;
                return (
                    <option key={'type-' + index} value={index}>{type}</option>
                )
            });
        typeSelect.push(<option key={typeSelect.length} value={'default'}>-- Wybierz rodzaj --</option>);

        let authorsSelect = this.state.authors.map(
            (author) => {
                return (
                    <option key={'author-' + author.id} value={author.id}>{author.name}</option>
                )
            }
        );
        authorsSelect.push(<option key={authorsSelect.length} value={'default'}>-- Wybierz autora --</option>);

        let display = 'none';
        let titleInputs = [];
        let form = this.state.formControl;

        if (this.state.isChecked) {
            display = 'inline';

            for (let i = 1; i <= this.state.amountTitleInputs; i++) {
                titleInputs.push(
                    <Form.Group key={i} controlId={'partsTitles' + i}>
                        <Form.Control type={'text'} name={i} value={this.state.formControl.partsTitles[i - 1]}
                                      onChange={this.handleChangePartTitle}/>
                    </Form.Group>)
            }
        }

        if (this.state.formAccepted && this.props.edit)
            return <Redirect to={'/artwork/' + this.props.artworkId}/>;
        else if (this.state.formAccepted)
            return <Redirect to={'/'}/>;

        return (
            <div className="ArtworkForm">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId={'radio1'}>
                        <Form.Check type={'radio'} label={'Zbiór własny Galerii EL'} name={'owner'} value={'1'}
                                    checked={form.owner === '1'} onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group controlId={'radio2'}>
                        <Form.Check type={'radio'} label={'Obiekt z depozytu MMA'} name={'owner'} value={'2'}
                                    checked={form.owner === '2'} onChange={this.handleChange}/>
                    </Form.Group>

                    <Form.Group controlId={'inputTitle'}>
                        <Form.Label>Tytuł</Form.Label>
                        <Form.Control name={'title'} type="text" value={form.title} onChange={this.handleChange}/>
                    </Form.Group>

                    <Form.Group controlId={'checkbox'}>
                        <Form.Check type={'checkbox'} label={'Dodaj kilka tytułów'} checked={this.state.isChecked}
                                    onChange={this.handleChecked}/>
                    </Form.Group>

                    {titleInputs}

                    <div className={'titleInputBtns'}>
                        <Button variant={'secondary'} className={'addBtn'} style={{display: display}}
                                onClick={this.addTitleInput}>Dodaj</Button>
                        <Button variant={'secondary'} className={'removeBtn'} style={{display: display}}
                                onClick={this.deleteTitleInput}> Usuń </Button>
                    </div>
                    <Form.Group controlId={'selectType'}>
                        <Form.Label>Rodzaj: </Form.Label>
                        <Form.Control name={'type'} as={'select'} value={form.type} onChange={this.handleChange}>
                            {typeSelect}
                        </Form.Control>
                        <div className={'error-msg'} style={{'display': displayError}}>
                            Proszę wybrać typ
                        </div>
                    </Form.Group>
                    <Form.Group controlId={'selectAuthor'}>
                        <Form.Label>Autor: </Form.Label>
                        <Form.Control name={'authorId'} as={'select'} value={form.authorId}
                                      onChange={this.handleChange}>
                            {authorsSelect}
                        </Form.Control>
                        <div className={'error-msg'} style={{'display': displayError}}>
                            Proszę wybrać autora
                        </div>
                    </Form.Group>
                    <Form.Group controlId={'inputCreateDate'}>
                        <Form.Label>Data\Okres powstania: </Form.Label>
                        <Form.Control name={'createDate'} type="text"
                                      value={form.createDate === null ? '' : form.createDate}
                                      onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group controlId={'inputStyle'}>
                        <Form.Label>Styl: </Form.Label>
                        <Form.Control name={'style'} type="text" value={form.style === null ? '' : form.style}
                                      onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group controlId={'inputTechnique'}>
                        <Form.Label>Technika / Materiał: </Form.Label>
                        <Form.Control name={'technique'} type="text"
                                      value={form.technique === null ? '' : form.technique}
                                      onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group controlId={'inputMeasurements'}>
                        <Form.Label>Wymiary: </Form.Label>
                        <Form.Control name={'measurements'} type="text"
                                      value={form.measurements === null ? '' : form.measurements}
                                      onChange={this.handleChange}/>
                        <Form.Text className={'text-muted'}> Wymiary należy podać _x_x_ jednostka lub średnica _
                            jednostka </Form.Text>
                    </Form.Group>
                    <Form.Group controlId={'inputAmount'}>
                        <Form.Label>Ilość części: </Form.Label>
                        <Form.Control name={'amount'} type="number" value={form.amount === null ? '' : form.amount}
                                      onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group controlId={'textareaDescription'}>
                        <Form.Label>Opis: </Form.Label>
                        <Form.Control name={'description'} as={'textarea'}
                                      value={form.description === null ? '' : form.description} rows="5"
                                      onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group controlId={'inputBookId'}>
                        <Form.Label>Nr księgi wpływu: </Form.Label>
                        <Form.Control name={'bookId'} type="text" value={form.bookId === null ? '' : form.bookId}
                                      onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group controlId={'inputPurchaseWay'}>
                        <Form.Label>Sposób nabycia: </Form.Label>
                        <Form.Control name={'purchaseWay'} type="text"
                                      value={form.purchaseWay === null ? '' : form.purchaseWay}
                                      onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group controlId={'inputPurchaseSource'}>
                        <Form.Label>Źródło nabycia: </Form.Label>
                        <Form.Control name={'purchaseSource'} type="text"
                                      value={form.purchaseSource === null ? '' : form.purchaseSource}
                                      onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group controlId={'inputPurchaseDate'}>
                        <Form.Label>Data nabycia: </Form.Label>
                        <Form.Control name={'purchaseDate'} type="date"
                                      value={form.purchaseDate === null ? '' : form.purchaseDate}
                                      onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group controlId={'inputValue'}>
                        <Form.Label>Wartość: </Form.Label>
                        <Form.Control name={'value'} type="number" value={form.value === null ? '' : form.value}
                                      onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group controlId={'textareaComment'}>
                        <Form.Label>Uwagi: </Form.Label>
                        <Form.Control name={'comment'} as={'textarea'} value={form.comment === null ? '' : form.comment}
                                      rows="3" onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group controlId={'inputImage'}>
                        <Form.Label>Zdjęcia: </Form.Label>
                        {this.props.edit && (
                            <div>
                                <Gallery
                                    images={this.state.oldImages}
                                    backdropClosesModal={true}
                                    enableImageSelection={true}
                                    onSelectImage={this.onSelectImage}
                                />
                                <div style={{clear: 'both'}}/>
                                {this.state.isImageSelected && (
                                    <button onClick={this.showModal} className={'deleteBtn btn btn-dark'}>Usuń</button>
                                )}
                            </div>
                        )}

                        <Form.Control className={'uploadInput'} type="file" multiple onChange={this.handleImageChange}/>
                        <ToastContainer/>
                    </Form.Group>
                    <div className={'error-msg'} style={{'display': displayError}}>
                        Błąd, sprawdź formularz
                    </div>
                    <Button type="submit" variant={'dark'} size={'lg'} className="saveBtn">Zapisz</Button>
                </Form>

                <Modal centered show={this.state.showModal} onHide={this.hideModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Ostrzeżenie</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Czy na pewno chcesz usunąć tę zdjęcia?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.hideModal}>
                            Zamknij
                        </Button>
                        <Button variant="primary" onClick={this.onDeleteImages}>
                            Usuń
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default ArtworkForm;