import style from './login.module.scss';
import React from 'react';
import { Link, Router } from '../i18n';
import fetch from 'isomorphic-unfetch';
import useUser from '../components/kainplan/auth/UserContext';

const Register = () => {
    let emailIn: HTMLInputElement;
    let usernameIn: HTMLInputElement;
    let passwordIn: HTMLInputElement;

    const { refresh } = useUser();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const email: string = emailIn.value;
        const username: string = usernameIn.value;
        const password: string = passwordIn.value;

        if (!username.trim() || !password.trim() || !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
            alert("Email, Password or Username invalid");
            return;
        }

        fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                username: username,
                password: password,
            }),
        }).then(res => {
            if (res.status === 401) {
                alert("Wrong username or password given");
                return;
            }
            if (res.status !== 200) {
                alert("Server error");
                return;
            }
            refresh().then(() => Router.push('/dashboard'));
        });
    };

    return (
        <div className={style.body}>
            <div className={style.help}>
                <img src={require('../images/login/background.jpeg')} className={style.image} />
                <Link href="/">
                    <h1 className={style.link}>Kainplan</h1>
                </Link>
            </div>
            <div className={style.wrapper}>
                <form onSubmit={onSubmit} className={style.login}>
                    <p>Registrieren</p>
                    <input id="email" type="text" ref={e => emailIn = e} />
                    <label htmlFor="email" className={style.floatlabel}>Email</label>
                    <input id="username" type="text" ref={e => usernameIn = e} />
                    <label htmlFor="username" className={style.floatlabel}>Username</label>
                    <input id="password" type="password" ref={e => passwordIn = e} />
                    <label htmlFor="password" className={style.floatlabel}>Passwort</label>
                    <input type="submit" value="Registrieren" />
                </form>
                <Link href="/login">
                    <span className={style.switch}>Anmelden</span>
                </Link>
                <style jsx global>{`
                body {
                    background-color: #121419;
                }
            `}</style>
            </div>
        </div>
    );
};

export default Register;