import express from 'express';

export function login (req: express.Request, res: express.Response): void {
    let uname: string = req.body.username;
    let passwd: string = req.body.password;
    res.send({status: '200'});
}

export function register (req: express.Request, res: express.Response): void {
    let uname: string = req.body.username;
    let passwd: string = req.body.password;
    res.send({status: '200'});
}