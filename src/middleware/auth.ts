import express from 'express';

export function authenticated(req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (!req.isAuthenticated()) {
    res.send(JSON.stringify({ msg: 'Not authenticated!', }));
    return;
  }
  next();
}

export function authenticatedOrRedirect(req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (!req.isAuthenticated()) return res.redirect('/login');
  next();
}