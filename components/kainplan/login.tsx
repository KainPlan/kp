import React from 'react';
import style from './login.module.scss';

interface ComponentState {
    email: string;
    password: string;
}

class Login extends React.Component<void, ComponentState> {
    public constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
    }

    private handleChangeEmail(event) {
        this.setState({ email: event.target.value });
    }

    private handleChangePassword(event) {
        this.setState({ password: event.target.value });
    }

    private handleSubmit() {
        if (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(this.state.email) && this.state.password.trim().length > 0) {
            alert('Valid Data, ready for post');
        } else {
            alert('Email or Password invalid');
        }
    }

    public render() {
        return (
            <form onSubmit={() => this.handleSubmit()} className={style.login}>
                <p>Anmelden</p>
                <input id="email" type="text" value={this.state.email} onChange={this.handleChangeEmail.bind(this)} />
                <label htmlFor="email" className={style.floatlabel}>Email Adresse</label>
                <input id="password" type="password" value={this.state.password} onChange={this.handleChangePassword.bind(this)} />
                <label htmlFor="password" className={style.floatlabel}>Passwort</label>
                <input type="submit" value="Anmelden" />
            </form>
        );
    }
}

export default Login;