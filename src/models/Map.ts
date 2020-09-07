import db from '../db';
import mongoose from 'mongoose';
import User from './User';
import utils from '../utils';

export interface Node {
  _type: string;
  x: number;
  y: number;
  edges: number[];
  body?: any;
};

interface MapRow {
  id: number;
  user: number;
  map: string;
};

export interface MapHead {
  _id: string;
  name: string;
  desc: string;
};

const MapSchema = new mongoose.Schema({
  name: String,
  desc: String,
  width: Number,
  height: Number,
  background: Array,
  node: Array,
});
const MapModel = mongoose.model('Map', MapSchema);

export default class Map {
  public _id: string;
  public name: string;
  public desc: string;
  public width: number;
  public height: number;
  public background: string[];
  public nodes: Node[];

  public floors: number;

  constructor (_id: string, name: string, desc: string, width: number, height: number, background: string[], nodes: Node[]) {
    this._id = _id;
    this.name = name;
    this.desc = desc;
    this.width = width;
    this.height = height;
    this.background = background;
    this.nodes = nodes;

    this.floors = this.background.length;
  }

  public toJSON(floor?: number): object {
    return {
      _id: this._id,
      name: this.name,
      desc: this.desc,
      width: this.width,
      height: this.height,
      background: this.background,
      nodes: this.nodes,
    };
  }

  public static load (id: string): Promise<Map|null> {
    return new Promise((resolve, reject) => {
      MapModel.findById(mongoose.Types.ObjectId(id), (err, res) => {
        if (err) return reject(err);
        if (!res) return resolve(null);
        resolve(new Map(id, res!.get('name'), res!.get('desc'), res!.get('width'), res!.get('height'), <string[]> res!.get('background'), <Node[]> res!.get('nodes')));
      });
    });
  }

  public static find (qry: string): Promise<MapHead[]> {
    return new Promise((resolve, reject) => {
      MapModel.find(
        { $text: { $search: qry, }, }, 
        { _id: 1, name: 1, desc: 1, },
        { limit: 10, },
        (err, res) => {
          if (err) return reject(err);
          resolve(res.map(m => <MapHead>{ _id: m.get('_id'), name: m.get('name'), desc: m.get('desc'), }));
        }
      );
    });
  }

  public static of (id: number): Promise<MapHead[]>;
  public static of (user: User): Promise<MapHead[]>;

  public static of (user: User|number): Promise<MapHead[]> {
    const id = typeof user === 'object' ? user.id : user;
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM maps WHERE "user" = $1', [id,])
        .then(res => {
          const ids = res.rows.map((r: MapRow) => mongoose.Types.ObjectId(r.map));
          MapModel.find(
            { _id: { $in: ids, }, },
            { _id: 1, name: 1, desc: 1, },
            (err, res) => {
              if (err) return reject(err);
              resolve(res.map(m => <MapHead>{ _id: m.get('_id'), name: m.get('name'), desc: m.get('desc'), }));
            }
          );
        })
        .catch(reject);
    });
  }
};