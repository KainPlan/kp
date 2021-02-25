import style from './login.module.scss';
import React from 'react';
import { Link, Router } from '../i18n';
import fetch from 'isomorphic-unfetch';
import useUser from '../components/kainplan/auth/UserContext';

const Login = () => {
    let usernameIn: HTMLInputElement;
    let passwordIn: HTMLInputElement;

    const { refresh } = useUser();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const username: string = usernameIn.value;
        const password: string = passwordIn.value;

        if (!username.trim() || !password.trim()) {
            alert("No username or password given");
            return;
        }

        fetch('/api/users/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
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
            alert("Welcome user: " + res.json);
            // refresh().then(() => Router.push('/dashboard'));
        });
    };

    return (
        <div className={style.wrapper}>
            <Link href="/">
                <h1 className={style.root}>Kainplan</h1>
            </Link>
            <form onSubmit={onSubmit} className={style.login}>
                <p>Anmelden</p>
                <input id="username" type="text" ref={e => usernameIn = e} />
                <label htmlFor="username" className={style.floatlabel}>Username</label>
                <input id="password" type="password" ref={e => passwordIn = e} />
                <label htmlFor="password" className={style.floatlabel}>Passwort</label>
                <input type="submit" value="Anmelden" />
            </form>
            <Link href="/register">
                <span className={style.switch}>Registrieren</span>
            </Link>
            <style jsx global>{`
                body {
                    background-color: #121419;
                }
            `}</style>
        </div>
    );
};

export default Login;