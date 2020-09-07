import express from 'express';
import Map from '../models/Map';
import utils from '../utils';
import User from '../../models/User';

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