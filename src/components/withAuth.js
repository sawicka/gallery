import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

export default function withAuth(ComponentToProtect) {
    return class extends Component {
        _isMounted = false;

        constructor(props) {
            super(props);
            this.state = {
                loading: true,
                redirect: false,
            };
        }

        componentDidMount() {
            this._isMounted = true;
            fetch('/checkToken')
                .then(res => {
                    if (res.status === 200 && this._isMounted) {
                        this.setState({ loading: false });
                    } else {
                        throw new Error(res.error);
                    }
                })
                .catch(err => {
                    console.error(err);
                    this.setState({ loading: false, redirect: true });
                });
        }

        componentWillUnmount() {
            this._isMounted = false;
        }

        render() {
            const { loading, redirect } = this.state;
            if (loading) {
                return null;
            }
            if (redirect) {
                return <Redirect to="/login" />;
            }
            return (
                <React.Fragment>
                    <ComponentToProtect {...this.props} />
                </React.Fragment>
            );
        }
}}