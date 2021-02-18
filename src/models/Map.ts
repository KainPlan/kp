import db from '../db';
import mongoose from 'mongoose';
import User from './User';
import fs from 'fs';
import mime from 'mime';
import probe from 'probe-image-size';
import path from 'path';

export interface Node {
  _type: string;
  x: number;
  y: number;
  edges: number[];
  body?: any;
};

export interface MapUpdate {
  action: string;
  update: any;
}

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
  nodes: Array,
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
      MapModel.findById(mongoose.Types.ObjectId(id), (err: mongoose.Error, res: any) => {
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

  public static make (user: number, name: string, desc: string, background: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!background.startsWith('data:')) return reject('invalid_background');
      const img: Buffer = Buffer.from(background.substr(background.indexOf(',')+1), 'base64');
      const specs: probe.ProbeResult|null = probe.sync(img);
      if (!specs) return reject('invalid_background');
      const nmap = new MapModel({ 
        name, desc, 
        width: specs.width, 
        height: specs.height, 
        background: [
          `0.${mime.getExtension(specs.mime)}`,
        ], 
        nodes: [], 
      });
      nmap.save(err => {
        if (err) return reject(err);
        db.query('INSERT INTO maps ("user", "map") VALUES ($1, $2)', [user, nmap._id.toString(),])
          .then(res => {
            fs.mkdirSync(path.join(process.env.RES_PATH, nmap._id.toString()));
            fs.writeFile(path.join(process.env.RES_PATH, nmap._id.toString(), `0.${mime.getExtension(specs.mime)}`), 
                         img,
                         err => {
              if (err) return reject(err);
              resolve(nmap._id.toString());
            });
          })
          .catch(reject);
      });
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
            null,
            (err: mongoose.Error, res: any) => {
              if (err) return reject(err);
              resolve(res.map((m: any) => <MapHead>{ _id: m.get('_id'), name: m.get('name'), desc: m.get('desc'), }));
            }
          );
        })
        .catch(reject);
    });
  }

  public static isOwner (mapId: string, userId: number): Promise<boolean>;
  public static isOwner (mapId: string, user: User): Promise<boolean>;

  public static isOwner (mapId: string, user: number|User): Promise<boolean> {
    const id: number = typeof user === 'object' ? user.id : user;
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM maps WHERE "user" = $1 AND "map" = $2', [id, mapId, ])
        .then(res => {
          resolve(res.rowCount !== 0);
        })
        .catch(reject);
    });
  }

  public static update (mapId: string, update: MapUpdate): Promise<boolean> {
    return new Promise((resolve, reject) => {
      
    });
  }
};