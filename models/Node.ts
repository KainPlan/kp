
export interface NodeJSON {
  id: number;
  _type: string;
  x: number;
  y: number;
  neighbours: number[];
  body?: any;
};

export default class Node {
  public id: number;
  public x: number;
  public y: number;
  public neighbours: Node[];

  constructor(id: number, x: number, y: number, neighbours?: Node[]) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.neighbours = neighbours || [];
  }
};
