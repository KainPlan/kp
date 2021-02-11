import express from 'express';
import Map from '../models/Map';
import User from '../models/User';
import utils from '../utils';

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

export function isAllowedToEdit(req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (!req.isAuthenticated()) return res.redirect('/login');
  const mapId: string = req.originalUrl.split('/').slice(-1)[0];
  // ... apparently next makes some weird extra requests... allow those as well... 
  if (req.originalUrl.startsWith('/_next/static/chunks/pages/edit/')) return next();
  if (!mapId.match(/^[0-9a-fA-F]{24}$/)) return res.redirect('/dashboard');
  Map.isOwner(mapId, <User>req.user)
     .then(owner => owner ? next() : res.redirect('/dashboard'))
     .catch(err => {
       utils.log(err);
       res.redirect('/dashboard');
     });
}