import express from 'express';
import Map from '../models/Map';
import utils from '../utils';

export function get (req: express.Request, res: express.Response): void {
  Map.load(req.params.id)
    .then(map => {
      if (!map) return utils.respond(res, 404, 'not_found');
      utils.respond(res, map.toJSON());
    })
    .catch(err => utils.respond(res, 500, 'other_error', err));
}