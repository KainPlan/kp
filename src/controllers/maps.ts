import express from 'express';
import Map, { MapUpdate } from '../models/Map';
import utils from '../utils';
import User from '../models/User';

export function getAll (req: express.Request, res: express.Response): void {
  Map.of(<User>req.user)
    .then(maps => utils.respond(res, maps))
    .catch(err => utils.respond(res, 500, 'other_error', err));
}

export function get (req: express.Request, res: express.Response): void {
  Map.load(req.params.id)
    .then(map => {
      if (!map) return utils.respond(res, 404, 'not_found');
      utils.respond(res, map.toJSON());
    })
    .catch(err => utils.respond(res, 500, 'other_error', err));
}

export function search (req: express.Request, res: express.Response): void {
  Map.find(req.params.qry)
    .then(maps => utils.respond(res, maps))
    .catch(err => utils.respond(res, 500, 'other_error', err));
}

export function make (req: express.Request, res: express.Response): void {
  if (!req.body.name || !req.body.desc || !req.body.background) return utils.respond(res, 400, 'missing_parameters');
  Map.make((req.user as User).id, req.body.name, req.body.desc, req.body.background)
    .then(id => utils.respond(res, { id, }))
    .catch(err => typeof err === 'string' 
           ? utils.respond(res, 400, err) 
           : utils.respond(res, 500, 'other_error', err)
    );
}

export function update (req: express.Request, res: express.Response): void {
  if (!req.body.action || !req.body.stamp || !req.body.update) return utils.respond(res, 400, 'missing_parameters');
  Map.update(req.params.id, <MapUpdate>req.body)
     .then(() => utils.respond(res))
     .catch(err => utils.respond(res, 500, 'other_error', err));
}