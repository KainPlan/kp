import express from 'express';
import User from '../models/User';
import { ESRCH } from 'constants';

export function auth (req: express.Request, res: express.Response): void {
    info(req, res);
}

export function info (req: express.Request, res: express.Response): void {
    res.send({ success: true, user: (<User>req.user).sanitize(), });
}

export function register (req: express.Request, res: express.Response): void {
    const email: string = req.body.email;
    const username: string = req.body.username;
    const password: string = req.body.password;
    
    if (!email || !username || !password) {
        res.send({ msg: 'Missing arguments!', });
        return;
    }
    if (email.length > 40) {
        res.send({ msg: 'Email longer than 40 characters!', });
        return;
    }
    if (password.length < 8) {
        res.send({ msg: 'Password less than 8 characters!', });
        return;
    }

    User.make(email, username, password)
        .then(() => res.send({ success: true, }))
        .catch(err => {
            res.send({ msg: 'Couldn\'t create user!', });
        });
}

export function logout(req: express.Request, res: express.Response): void {
    req.logout();
    res.send({ success: true, });
}