import Node, { NodeJSON } from "./Node";

export interface EndNodeJSON extends NodeJSON {
  title: string;
  desc: string;
}

export default class EndNode extends Node {
  public title: string;
  public desc: string;

  constructor(id: number, x: number, y: number, title: string, desc: string, neighbours?: Node[]) {
    super(id, x, y, neighbours);
    this.title = title;
    this.desc = desc;
  }
};
