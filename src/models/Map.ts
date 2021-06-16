import db from '../db';
import mongoose from 'mongoose';
import User from './User';
import fs from 'fs';
import mime from 'mime';
import probe from 'probe-image-size';
import path from 'path';

interface RawNode {
  _type: string;
  id: number;
  x: number;
  y: number;
  edges: number[];
  body?: any;
}

export interface Node {
  _type: string;
  id: number;
  x: number;
  y: number;
  edges: Node[];
  body?: any;
};

export interface FloorNode {
  floor: number;
  node: Node;
};

export interface MapUpdate {
  action: string;
  stamp: number;
  update: object;
}

interface AddNodeUpdate {
  floor: number;
  node: Node;
}

interface MoveNodeUpdate {
  floor: number;
  node: number;
  x: number;
  y: number;
}

interface DeleteNodeUpdate {
  floor: number;
  node: Node;
}

interface ConnectNodesUpdate {
  floor: number;
  a: number;
  b: number;
}

interface DisconnectNodesUpdate {
  floor: number;
  a: number;
  b: number;
}

interface UpdateNodeBodyUpdate {
  floor: number;
  node: number;
  body: any;
}

interface AddFloorUpdate {
  background: string;
}

interface AddStairsUpdate {
  a: FloorNode;
  b: FloorNode;
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
        nodes: [
          [],
        ],
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

  private static addNode (mapId: string, node: Node, floor: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const update: any = { $push: {} };
      update['$push'][`nodes.${floor}`] = node;
      MapModel.updateOne(
        { _id: mongoose.Types.ObjectId(mapId), }, 
        update,
        null,
        (err: mongoose.Error, res: any) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }

  private static moveNode (mapId: string, nodeId: number, x: number, y: number, floor: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const select: any = { _id: mongoose.Types.ObjectId(mapId), };
      select[`nodes.${floor}`] = { $elemMatch: { id: nodeId, }, };
      const update: any = { $set: { }, };
      update['$set'][`nodes.${floor}.$.x`] = x;
      update['$set'][`nodes.${floor}.$.y`] = y;
      MapModel.updateOne(
        select,
        update,
        null,
        (err: mongoose.Error, res: any) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  private static updateNodeBody (mapId: string, nodeId: number, body: any, floor: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const select: any = { _id: mongoose.Types.ObjectId(mapId), };
      select[`nodes.${floor}`] = { $elemMatch: { id: nodeId, }, };
      const update: any = { $set: { }, };
      update['$set'][`nodes.${floor}.$.body`] = body;
      MapModel.updateOne(
        select,
        update,
        null,
        (err: mongoose.Error, res: any) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  private static deleteNode (mapId: string, node: Node, floor: number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const update: any = { $pull: {} };
      const session: mongoose.ClientSession = await mongoose.startSession();
      await session.withTransaction(async () => {
        try {
          update['$pull'][`nodes.${floor}.$[].edges`] = node.id;
          if (node._type === 'stairs_up') update['$pull'][`nodes.${floor+1}.$[].edges`] = node.body!.upper;
          else if (node._type === 'stairs_down') update['$pull'][`nodes.${floor-1}.$[].edges`] = node.body!.lower;
          await MapModel.updateOne(
            { _id: mongoose.Types.ObjectId(mapId), },
            update
          );
          delete update['$pull'][`nodes.${floor}.$[].edges`];
          update['$pull'][`nodes.${floor}`] = { id: node.id, };
          if (node._type === 'stairs_up') update['$pull'][`nodes.${floor+1}`] = { id: node.body!.upper, };
          else if (node._type === 'stairs_down') update['$pull'][`nodes.${floor-1}`] = { id: node.body!.lower, };
          await MapModel.updateOne(
            { _id: mongoose.Types.ObjectId(mapId), }, 
            update
          );
        } catch (e: any) {
          reject(e);
        }
      });
      session.endSession();
      resolve();
    });
  }

  private static connectNodes (mapId: string, a: number, b: number, floor: number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const select: any = { _id: mongoose.Types.ObjectId(mapId), };
      select[`nodes.${floor}`] = { $elemMatch: { id: a, }, };
      const update: any = { $push: {} };
      update['$push'][`nodes.${floor}.$.edges`] = b;
      const session: mongoose.ClientSession = await mongoose.startSession();
      await session.withTransaction(async () => {
        try {
          await MapModel.updateOne(select, update);
          select[`nodes.${floor}`]['$elemMatch']['id'] = b;
          update['$push'][`nodes.${floor}.$.edges`] = a;
          await MapModel.updateOne(select, update);
        } catch (e: any) {
          reject(e);
        }
      });
      session.endSession();
      resolve();
    });
  }

  private static disconnectNodes (mapId: string, a: number, b: number, floor: number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const select: any = { _id: mongoose.Types.ObjectId(mapId), };
      const update: any = { $pull: {} };
      const session: mongoose.ClientSession = await mongoose.startSession();
      await session.withTransaction(async () => {
        try {
          select[`nodes.${floor}`] = { $elemMatch: { id: a, }, };
          update['$pull'][`nodes.${floor}.$.edges`] = b;
          await MapModel.updateOne(select, update);
          select[`nodes.${floor}`] = { $elemMatch: { id: b, }, };
          update['$pull'][`nodes.${floor}.$.edges`] = a;
          await MapModel.updateOne(select, update);
        } catch (e: any) {
          reject(e);
        }
      });
      session.endSession();
      resolve();
    });
  }

  private static addFloor (mapId: string, background: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!background.startsWith('data:')) return reject('invalid_background');
      const img: Buffer = Buffer.from(background.substr(background.indexOf(',')+1), 'base64');
      const specs: probe.ProbeResult|null = probe.sync(img);
      if (!specs) return reject('invalid_background');
      Map.load(mapId).then(map => {
        const imgId: number = map!.floors;
        fs.writeFile(path.join(process.env.RES_PATH, mapId, `${imgId}.${mime.getExtension(specs.mime)}`), 
                      img,
                      async err => {
          if (err) return reject(err);
          const update: any = { $push: { background: `${imgId}.${mime.getExtension(specs.mime)}`, nodes: [ [ ], ], } };
          const session: mongoose.ClientSession = await mongoose.startSession();
          await session.withTransaction(async () => {
            try {
              await MapModel.updateOne({ _id: mongoose.Types.ObjectId(mapId), }, update);
            } catch (e: any) {
              reject(e);
            }
          });
          session.endSession();
          resolve();
        });
      });
    });
  }

  private static addStairs (mapId: string, a: FloorNode, b: FloorNode): Promise<void> {
    return new Promise((resolve, reject) => {
      const update: any = { $push: {} };
      update['$push'][`nodes.${a.floor}`] = a.node;
      update['$push'][`nodes.${b.floor}`] = b.node;
      MapModel.updateOne(
        { _id: mongoose.Types.ObjectId(mapId), }, 
        update,
        null,
        (err: mongoose.Error, res: any) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }

  public static update (mapId: string, update: MapUpdate): Promise<void> {
    return new Promise((resolve, reject) => {
      switch(update.action) {
        case 'addNode':
          console.log(`[DEBUG;${mapId}]: Request to add node @ (${(<AddNodeUpdate>update.update).node.x}, ${(<AddNodeUpdate>update.update).node.y}) ... `);
          this.addNode(mapId, (<AddNodeUpdate>update.update).node, (<AddNodeUpdate>update.update).floor)
          .then(resolve)
          .catch(reject);
          break;
        case 'moveNode':
          console.log(`[DEBUG;${mapId}]: Request to move node to (${(<MoveNodeUpdate>update.update).x}, ${(<MoveNodeUpdate>update.update).y}) ... `);
          this.moveNode(mapId, (<MoveNodeUpdate>update.update).node, (<MoveNodeUpdate>update.update).x, (<MoveNodeUpdate>update.update).y, (<MoveNodeUpdate>update.update).floor)
              .then(resolve)
              .catch(reject);
          break;
        case 'deleteNode':
          console.log(`[DEBUG;${mapId}]: Request to delete node ${(<DeleteNodeUpdate>update.update).node.id} ... `);          
          this.deleteNode(mapId, (<DeleteNodeUpdate>update.update).node, (<DeleteNodeUpdate>update.update).floor)
              .then(resolve)
              .catch(reject);
          break;
        case 'connectNodes':
          console.log(`[DEBUG;${mapId}]: Request to connect nodes ${(<ConnectNodesUpdate>update.update).a} & ${(<ConnectNodesUpdate>update.update).b} ... `);
          this.connectNodes(mapId, (<ConnectNodesUpdate>update.update).a, (<ConnectNodesUpdate>update.update).b, (<ConnectNodesUpdate>update.update).floor)
              .then(resolve)
              .catch(reject);
          break;
        case 'disconnectNodes':
          console.log(`[DEBUG;${mapId}]: Request to disconnect nodes ${(<DisconnectNodesUpdate>update.update).a} & ${(<DisconnectNodesUpdate>update.update).b} ... `);
          this.disconnectNodes(mapId, (<DisconnectNodesUpdate>update.update).a, (<DisconnectNodesUpdate>update.update).b, (<DisconnectNodesUpdate>update.update).floor)
              .then(resolve)
              .catch(reject);
          break;
        case 'updateNodeBody':
          console.log(`[DEBUG;${mapId}]: Request to update body of node ${(<UpdateNodeBodyUpdate>update.update).node} ... `);
          this.updateNodeBody(mapId, (<UpdateNodeBodyUpdate>update.update).node, (<UpdateNodeBodyUpdate>update.update).body, (<UpdateNodeBodyUpdate>update.update).floor)
              .then(resolve)
              .catch(reject);
          break;
        case 'addFloor':
          console.log(`[DEBUG;${mapId}]: Request to add floor ... `);
          this.addFloor(mapId, (<AddFloorUpdate>update.update).background)
              .then(resolve)
              .catch(reject);
          break;
        case 'addStairs':
          console.log(`[DEBUG;${mapId}]: Request to add stairs`);
          this.addStairs(mapId, (<AddStairsUpdate>update.update).a, (<AddStairsUpdate>update.update).b)
              .then(resolve)
              .catch(reject);
          break;
        default:
          reject(`Unknown action (${update})`);
          break;
      }
    });
  }
};