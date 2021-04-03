import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import Head from 'next/head';
import React from 'react';
import style from './Map.module.scss';
import MapTool from './tools/MapTool';
import PanTool from './tools/PanTool';

interface MapProps {
  id: string;
  children?: React.ReactNode|React.ReactNode[];
  fullscreen?: boolean;
  width?: number;
  height?: number;
  tools?: (typeof MapTool)[];
  defaultTool?: typeof MapTool;
  ctrlTool?: typeof MapTool;
  shiftTool?: typeof MapTool;
  altTool?: typeof MapTool;
  mountCb?: ()=>void;
}

export interface MapHead {
  _id: string;
  name: string;
  desc: string;
}

export interface MapUpdate {
  action: string;
  stamp: number;
  update: object;
}

export interface MapAPIResponse {
  success?: boolean;
  code: number;
  body: object;
}

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
}

export enum MapMode {
  PAN,
  NODE,
  ENDPOINT,
  ERASE,
  CONNECT,
  MOVE,
}

interface MapState {
  width: number;
  height: number;
  name: string;
  desc: string;
  mapWidth: number;
  mapHeight: number;
  background: string[];
  nodes: Node[][];
  currentFloor: number;
  tool: MapTool<any, any>;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}

class Map extends React.Component<MapProps, MapState> {
  private canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  private clicks: any[] = [];
  private lastTime: number = Date.now();
  private minTimeDiff: number = 10;
  private scrollMultiplier: number = 0.005;

  private cache: HTMLImageElement[];
  private clockRate: number = 10;
  private animTime: number = 100;
  private animIntval: number;

  public mouseX: number = 0;
  public mouseY: number = 0;
  private tools: { [key: string]: MapTool<any, any>, } = {};

  private panScale: number = 0.3;
  private panTime: number = 150;
  private magnify: number = 1;
  private minMagnify: number = .75;
  private maxMagnify: number = 10;
  private offsetX: number = 0;
  private offsetY: number = 0;

  private updateQueue: MapUpdate[] = [];
  private updating: boolean = false;
  private stopUpdating: boolean = false;

  public constructor (props) {
    super(props);
    this.state = {
      width: props.width||800,
      height: props.height||600,
      name: '',
      desc: '',
      mapWidth: 0,
      mapHeight: 0,
      background: [],
      nodes: [],
      currentFloor: 0,
      tool: null,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
    };
  }

  public componentDidMount () {
    const defaultTool: any = this.props.defaultTool ? this.tools[this.props.defaultTool.name] : this.tools[PanTool.name];
    this.setState({ tool: defaultTool, });
    fetch(`/api/maps/${this.props.id}`)
      .then(res => {
        if (!res.ok) return window.alert('error!');
        return res.json();
      })
      .then(res => {
        if (!res.success) return window.alert('other error!');
        this.setState({
          name: res.body.name,
          desc: res.body.desc,
          mapWidth: res.body.width,
          mapHeight: res.body.height,
          background: res.body.background,
          currentFloor: 0,
        }, () => {
          this.ctx = this.canvas.getContext('2d');
          if (this.props.fullscreen) {
            window.addEventListener('resize', this.onResize.bind(this));
            this.onResize();
          }
          window.addEventListener('keydown', this.observeSpecialKeys.bind(this));
          window.addEventListener('keyup', this.observeSpecialKeys.bind(this));
          this.cache = this.state.background.map(b => {
            const im: HTMLImageElement = new Image();
            im.src = `/api/maps/${this.props.id}/${b}`;
            return im;
          });
          this.switchFloor(0);
          this.entangleNodes(res.body.nodes as RawNode[][])
              .then(() => {
                if (this.props.mountCb) this.props.mountCb();
              });
        });
      });
  }

  // MAP EDITOR FUNCTIONS -------------------------------------------------------------- //

  public addFloor(background: string) {
    this.setState({
      background: [...this.state.background, background, ],
    }, () => {
      const im: HTMLImageElement = new Image();
      im.src = background;
      this.switchFloor(this.state.background.length-1);
      this.ensureUpdate('addFloor', { background, });
    });
  }

  public addNode(node: Node, floor?: number) {
    floor = floor || this.state.currentFloor;
    if (!this.isFloor(floor)) return;
    const nodes: Node[][] = this.state.nodes;
    nodes[floor].push(node);
    this.setState({
      nodes,
    }, () => {
      this.refresh();
      this.queueUpdate('addNode', { floor, node, })
    });
  }

  public updateNodeBody(node: Node, body: object, floor?: number) {
    floor = floor || this.state.currentFloor;
    if (!this.isFloor(floor)) return;
    node.body = body;
    const nodes: Node[][] = this.state.nodes;
    nodes[floor] = [...nodes[floor].filter(n => n.id !== node.id), node,];
    this.setState({
      nodes,
    }, () => {
      this.queueUpdate('updateNodeBody', { floor, node: node.id, body, });
    });
  }

  public moveNode(node: Node, x: number, y: number, floor?: number, issueUpdate?: boolean) {
    floor = floor || this.state.currentFloor;
    issueUpdate = issueUpdate === undefined ? true : issueUpdate;
    if (!this.isFloor(floor)) return;
    node.x = x;
    node.y = y;
    const nodes: Node[][] = this.state.nodes;
    nodes[floor] = [...nodes[floor].filter(n => n.id !== node.id), node,];
    this.setState({
      nodes,
    }, () => {
      this.refresh();
      if (issueUpdate) this.queueUpdate('moveNode', { floor, node: node.id, x, y, })
    });
  }

  public deleteNode(node: Node, floor?: number) {
    floor = floor || this.state.currentFloor;
    if (!this.isFloor(floor)) return;
    const nodes: Node[][] = this.state.nodes;
    node.edges.forEach(n => this.disconnectNodes(node, n, floor));
    nodes[floor] = nodes[floor].filter(n => n.id !== node.id);
    this.setState({
      nodes,
    }, () => {
      this.refresh();
      this.queueUpdate('deleteNode', { floor, node: node.id, })
    });
  }

  public connectNodes(a: Node, b: Node, floor?: number) {
    floor = floor || this.state.currentFloor;
    if (!this.isFloor(floor)) return;
    const nodes: Node[][] = this.state.nodes;
    const aIndex: number = nodes[floor].findIndex(n => n.id === a.id);
    const bIndex: number = nodes[floor].findIndex(n => n.id === b.id);
    // check if connection already exists ... 
    if (nodes[floor][aIndex].edges.filter(n => n.id === b.id).length && nodes[floor][bIndex].edges.filter(n => n.id === a.id).length)
      return;
    // establish a connection in the way that could also fixing
    // a broken connection ...
    if (!nodes[floor][aIndex].edges.filter(n => n.id === b.id).length)
      nodes[floor][aIndex].edges.push(b);
    if (!nodes[floor][bIndex].edges.filter(n => n.id === a.id).length)
      nodes[floor][bIndex].edges.push(a);
    this.setState({
      nodes,
    }, () => {
      this.refresh();
      this.queueUpdate('connectNodes', { floor, a: a.id, b: b.id, })
    });
  }

  public disconnectNodes(a: Node, b: Node, floor?: number) {
    floor = floor || this.state.currentFloor;
    if (!this.isFloor(floor)) return;
    const nodes: Node[][] = this.state.nodes;
    const aIndex: number = nodes[floor].findIndex(n => n.id === a.id);
    const bIndex: number = nodes[floor].findIndex(n => n.id === b.id);
    nodes[floor][aIndex].edges = nodes[floor][aIndex].edges.filter(n => n.id !== b.id);
    nodes[floor][bIndex].edges = nodes[floor][bIndex].edges.filter(n => n.id !== a.id);
    this.setState({
      nodes,
    }, () => {
      this.refresh();
      this.queueUpdate('disconnectNodes', { floor, a: a.id, b: b.id, })
    });
  }

  // MAP EDITOR HELPER FUNCTIONS -------------------------------------------------------------- //

  public isFloor(floor: number): boolean {
    return this.state.nodes[floor] instanceof Array;
  }

  public nodeAt(x: number, y: number, floor?: number): Node {
    floor = floor || this.state.currentFloor;
    if (!this.isFloor(floor)) return null;
    return this.state.nodes[floor].filter(n => n.x === x && n.y === y)[0];
  }

  public nodeAround(x: number, y: number, radius?: number, floor?: number): Node {
    radius = radius || 5;
    floor = floor || this.state.currentFloor;
    if (!this.isFloor(floor)) return null;
    let min: number = Infinity;
    let node: Node = null;
    this.state.nodes[floor].forEach(n => {
      if (n.x >= x-radius && n.x <= x+radius && n.y >= y-radius && n.y <= y+radius && (Math.pow(n.x-x, 2) + Math.pow(n.y-y, 2)) < min) {
        min = Math.pow(n.x-x, 2) + Math.pow(n.y-y, 2); // full euclidean distance not required ... 
        node = n;
      }
    });
    return node;
  }

  private queueUpdate(action: string, update: object): MapUpdate {
    const tmp: MapUpdate = { action, stamp: Date.now(), update, };
    this.updateQueue.push(tmp);
    this.syncUpdates();
    return tmp;
  }

  private sendUpdate(update: MapUpdate): Promise<MapAPIResponse> {
    return new Promise((resolve, reject) => 
      fetch(`/api/maps/${this.props.id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body:  JSON.stringify(update),
      }).then(res => res.json())
        .then(res => resolve(res))
        .catch(reject)
    );
  }

  private async syncUpdates() {
    if (this.updating) return;
    this.updating = true;
    while (this.updateQueue.length) {
      for (let i = 0; i < 5; i++) {
        const res: MapAPIResponse = await this.sendUpdate(this.updateQueue[0]);
        if (res.success) break;
      }
      this.updateQueue.shift();
      if (this.stopUpdating) break;
    }
    this.updating = false;
  }

  private async ensureUpdate(action: string, update: object) {
    const tmp: MapUpdate = { action, stamp: Date.now(), update, };
    this.stopUpdating = true;
    while (this.updating) await new Promise((resolve, reject) => setTimeout(resolve, 10));
    this.updating = true;
    this.stopUpdating = false;
    this.updateQueue.push(tmp);
    let res: MapAPIResponse = null;
    while (this.updateQueue.length) {
      for (let i = 0; i < 5; i++) {
        res = await this.sendUpdate(this.updateQueue[0]);
        if (res.success) break;
      }
      const dropped: MapUpdate = this.updateQueue.shift();
      if (dropped.stamp === tmp.stamp) {
        this.refresh();
        break;
      }
    }
    this.updating = false;
    return res.success;
  }

  // MAP CONTROLLER FUNCTIONS -------------------------------------------------------------- //

  private entangleNodes(rawNodes: RawNode[][]): Promise<void> {
    return new Promise((resolve, reject) => {
      const nodes: Node[][] = [];
      rawNodes.forEach((f, fi) => {
        nodes.push([]);
        f.forEach(n => nodes[fi].push({ ...n, edges: [], }));
      });
      nodes.forEach((f, fi) => 
        f.forEach((n, ni) => {
          rawNodes[fi][ni].edges.forEach(e => {
            // for  now, only same floor ... 
            const other: Node = f.filter(x => x.id === e)[0];
            if (other) n.edges.push(other);
          });
        }));
      this.setState({
        nodes,
      }, resolve);
    });
  }

  public changeTool(tool: typeof MapTool) {
    this.setState({ tool: this.tools[tool.name], })
  }

  public reset() {
    this.ctx.translate(-this.offsetX, -this.offsetY);
  }

  public winX2map(winX: number): number {
    return this.px2m(winX - this.canvas.getBoundingClientRect().left - this.offsetX);
  }

  public winY2map(winY: number): number {
    return this.px2m(winY - this.canvas.getBoundingClientRect().top - this.offsetY);
  }

  public px2m(px: number): number {
    // return px * this.scale * this.magnify;
    return px / this.magnify;
  }
  
  public m2px(m: number): number {
    // return m * (1/this.map.scale) * this.magnifiy;
    return m * this.magnify;
  }

  private onResize(): void {
    this.resize(window.innerWidth, window.innerHeight);
  }

  public resize(width: number, height: number): void {
    this.setState({
      width, height,
    }, () => {
      const prevX: number = this.offsetX;
      const prevY: number = this.offsetY;
      this.offsetX = 0;
      this.offsetY = 0;
      this.staticPan(-prevX, -prevY);
      this.refresh();
    });
  }

  public switchFloor(fid: number) {
    this.setState({
      currentFloor: fid,
    }, () => {
      if (!this.cache[fid].complete) {
        // this.loadingFn(true);
        return this.cache[fid].onload = () => {
          // this.loadingFn(false);
          this.refresh();
        };
      }
      this.refresh();
    });
  }

  public zoom(deltaMagnify: number, centerX: number, centerY: number): void {
    let previousMagnify = this.magnify;
    this.magnify = Math.round((this.magnify - deltaMagnify) * 100) / 100;

    if (this.magnify < this.minMagnify) this.magnify = this.minMagnify;
    else if (this.magnify > this.maxMagnify) this.magnify = this.maxMagnify;

    this.staticPan(
      ((centerX - this.offsetX) / previousMagnify) * this.magnify + this.offsetX - centerX,
      ((centerY - this.offsetY) / previousMagnify) * this.magnify + this.offsetY - centerY
    );
    this.refresh();
  }

  private staticPan(deltaX: number, deltaY: number) {
    let newOffsetX = this.offsetX - deltaX;
    let newOffsetY = this.offsetY - deltaY;

    if (newOffsetX > 0) {
      newOffsetX = 0;
    } else if (newOffsetX < Math.min(-this.m2px(this.state.mapWidth) + this.state.width, 0)) {
      newOffsetX = Math.min(-this.m2px(this.state.mapWidth) + this.state.width, 0);
    }

    if (newOffsetY > 0) {
      newOffsetY = 0;
    } else if (newOffsetY < Math.min(-this.m2px(this.state.mapHeight) + this.state.height, 0)) {
      newOffsetY = Math.min(-this.m2px(this.state.mapHeight) + this.state.height, 0);
    }

    deltaX = newOffsetX - this.offsetX;
    deltaY = newOffsetY - this.offsetY;

    this.ctx.translate(deltaX, deltaY);
    this.offsetX = newOffsetX;
    this.offsetY = newOffsetY;
    this.refresh();
  }

  public pan(deltaX: number, deltaY: number, clicks?: MouseEvent[], time?: number): void {
    window.clearInterval(this.animIntval);

    let animTime: number = time || this.panTime;
    let i: number = 0;
    let xv: number = deltaX * this.panScale * (1/Math.max(1, this.magnify));
    let xa: number = -xv / animTime;
    let yv: number = deltaY * this.panScale * (1/Math.max(1, this.magnify));
    let ya: number = -yv / animTime;

    this.staticPan(deltaX, deltaY);
    this.animIntval = window.setInterval(() => {
      if (i++ >= this.panTime) window.clearInterval(this.animIntval);
      if (i > 15 && ((clicks && clicks.length === 0) || !clicks)) {
        this.staticPan(xv, yv);
        xv += xa;
        yv += ya;
      }
    }, 1);
  }

  public panIntoView(target: Node, fid: number) {
    window.clearInterval(this.animIntval);
    this.switchFloor(fid);

    let i: number = 0;
    let padX: number = this.px2m(this.state.width/2);
    let padY: number = this.px2m(this.state.height/2);
    let stepX: number = (target.x + this.px2m(this.offsetX) - padX) / this.animTime;
    let stepY: number = (target.y + this.px2m(this.offsetY) - padY) / this.animTime;

    this.animIntval = window.setInterval(() => {
      if (i >= this.animTime) window.clearInterval(this.animIntval);
      this.staticPan(this.m2px(stepX), this.m2px(stepY));
      i++;
    }, 1);
  }

  private drawNodes() {
    const prevStrokeStyle: string|CanvasGradient|CanvasPattern = this.ctx.strokeStyle;
    const prevFillStyle: string|CanvasGradient|CanvasPattern = this.ctx.fillStyle;
    const prevLineWidth: number = this.ctx.lineWidth;
    this.ctx.fillStyle = 'rgba(0,255,197,.5)';
    this.ctx.lineWidth = 3;
    this.state.nodes[this.state.currentFloor].forEach(n => {
      this.ctx.strokeStyle = n._type === 'node' ? '#00FFC5' : '#00FF2C';
      this.ctx.beginPath();
      this.ctx.ellipse(this.m2px(n.x), this.m2px(n.y),
                     this.m2px(1.5), this.m2px(1.5), 
                     0, 0, 2 * Math.PI);
      this.ctx.stroke();
      this.ctx.fill();
    });
    this.state.tool.onDrawNodes();
    this.ctx.lineWidth = prevLineWidth;
    this.ctx.fillStyle = prevFillStyle;
    this.ctx.strokeStyle = prevStrokeStyle;
  }

  private drawConnections() {
    const prevStrokeStyle: string|CanvasGradient|CanvasPattern = this.ctx.strokeStyle;
    const prevLineWidth: number = this.ctx.lineWidth;
    this.ctx.strokeStyle = '#00FFC5';
    this.ctx.lineWidth = 3;
    const drawn: number[] = [];
    this.state.nodes[this.state.currentFloor].forEach(n => {
      drawn.push(n.id);
      n.edges.forEach(e => {
        if (drawn.includes(e.id)) return;
        this.ctx.beginPath();
        this.ctx.moveTo(this.m2px(n.x), this.m2px(n.y));
        this.ctx.lineTo(this.m2px(e.x), this.m2px(e.y));
        this.ctx.stroke();
      });
    });
    this.state.tool.onDrawConnections();
    this.ctx.lineWidth = prevLineWidth;
    this.ctx.strokeStyle = prevStrokeStyle;
  }

  public refresh() {
    this.ctx.clearRect(0, 0, 
      this.state.width + this.m2px(this.state.mapWidth), 
      this.state.height + this.m2px(this.state.mapHeight));
    this.ctx.drawImage(this.cache[this.state.currentFloor], 
      0, 0, this.m2px(this.state.mapWidth), this.m2px(this.state.mapHeight));
    this.drawConnections();
    this.drawNodes();
  }
  
  // EVENT LISTENERS -------------------------------------------------------------- //

  private triggerEvent (listener: string, args: any[]): void {
    if (this.state.ctrlKey && this.props.ctrlTool) this.tools[this.props.ctrlTool.name][listener](...args);
    else if (this.state.shiftKey && this.props.shiftTool) this.tools[this.props.shiftTool.name][listener](...args);
    else if (this.state.altKey && this.props.altTool) this.tools[this.props.altTool.name][listener](...args);
    else this.state.tool[listener](...args);
  }

  private onMouseZoom (e: React.WheelEvent): void {
    let cab: DOMRect = this.canvas.getBoundingClientRect();
    this.zoom(e.deltaY*this.scrollMultiplier, 
      e.clientX - cab.left, e.clientY - cab.top);
  }

  private onMouseDown(e: React.PointerEvent) {
    this.triggerEvent(this.state.tool.onMouseDown.name, [e,]);
    this.clicks.push({...e});
    this.lastTime = Date.now();
  }

  private onMouseMove(e: React.PointerEvent) {
    if (this.clicks.length === 1 && Date.now() - this.lastTime > this.minTimeDiff) {
      this.triggerEvent(this.state.tool.onMouseMove.name, [e, this.clicks,]);
      this.clicks[0] = {...e};
      this.lastTime = Date.now();
    }
  }

  private onMouseUp(e: React.PointerEvent) {
    this.triggerEvent(this.state.tool.onMouseUp.name, [e,]);
    this.clicks.pop();
  }

  private onTouchDown(e: React.PointerEvent) {
    this.triggerEvent(this.state.tool.onTouchDown.name, [e,]);
    this.clicks.push({...e});
    this.lastTime = Date.now();
  }

  private onTouchMove(e: React.PointerEvent) {
    if (Date.now() - this.lastTime > this.minTimeDiff) {
      this.triggerEvent(this.state.tool.onTouchMove.name, [e, this.clicks,]);
      if (this.clicks.length === 1) {
        this.triggerEvent(this.state.tool.onSingleTouchMove.name, [e, this.clicks,]);
        this.clicks[0] = {...e};
        this.lastTime = Date.now();
      } else if (this.clicks.length === 2) {
        let otherIndex: number = this.clicks[0].pointerId===e.pointerId ? 1 : 0;
        let dX: number = Math.abs(e.clientX-this.clicks[otherIndex].clientX);
        let dY: number = Math.abs(e.clientY-this.clicks[otherIndex].clientY);
        let currDiff: number = Math.max(dX, dY);
        let prevDiff: number = Math.max(
          Math.abs(this.clicks[1-otherIndex].clientX-this.clicks[otherIndex].clientX),
          Math.abs(this.clicks[1-otherIndex].clientY-this.clicks[otherIndex].clientY),
        );
        let compDiff: number = prevDiff-currDiff;
        let cab: DOMRect = this.canvas.getBoundingClientRect();
        this.zoom(compDiff * 0.02,
          Math.min(e.clientX, this.clicks[otherIndex].clientX) - cab.left + dX / 2,
          Math.min(e.clientY, this.clicks[otherIndex].clientY) - cab.top + dY / 2);

        this.triggerEvent(this.state.tool.onDoubleTouchMove.name, [e, this.clicks,]);
        this.clicks[1-otherIndex] = {...e};
        this.lastTime = Date.now();
      }
    }
  }

  private onTouchUp(e: React.PointerEvent) {
    this.triggerEvent(this.state.tool.onTouchUp.name, [e, this.clicks,]);
    if (this.clicks.length === 1) this.triggerEvent(this.state.tool.onSingleTouchUp.name, [e, this.clicks,]);
    else if (this.clicks.length === 2) this.triggerEvent(this.state.tool.onDoubleTouchUp.name, [e, this.clicks,]);
    for (let i = 0; i < this.clicks.length; i++) {
      if ((this.clicks[i] as PointerEvent).pointerId === e.pointerId) {
        this.clicks.splice(i,1);
        return;
      }
    }
  }

  private onDown(e: React.PointerEvent) {
    e.preventDefault();
    console.log('[DEBUG]: tool: ');
    console.log(this.state.tool);
    this.triggerEvent(this.state.tool.onDown.name, [e,]);
    switch(e.pointerType) {
      case 'mouse':
        this.onMouseDown(e);
        break;
      default:
        this.onTouchDown(e);
        break;
    }
  }

  private onMove(e: React.PointerEvent) {
    e.preventDefault();
    this.mouseX = this.winX2map(e.clientX);
    this.mouseY = this.winY2map(e.clientY);
    this.triggerEvent(this.state.tool.onMove.name, [e, this.clicks,]);
    switch(e.pointerType) {
      case 'mouse':
        this.onMouseMove(e);
        break;
      default:
        this.onTouchMove(e);
        break;
    }
  }

  private onUp(e: React.PointerEvent) {
    e.preventDefault();
    this.triggerEvent(this.state.tool.onUp.name, [e,]);
    switch(e.pointerType) {
      case 'mouse':
        this.onMouseUp(e);
        break;
      default:
        this.onTouchUp(e);
        break;
    }
  }

  private observeSpecialKeys(e: React.KeyboardEvent) {
    if (e.key === 'Escape') this.state.tool.cancel(this);
    this.setState({
      ctrlKey: e.ctrlKey,
      altKey: e.altKey,
      shiftKey: e.shiftKey,
    });
  }

  public render() {
    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no" />
        </Head>
        <div className={style.root} style={{
          width: this.state.width+'px',
          height: this.state.height+'px',
          cursor: this.state.ctrlKey && this.props.ctrlTool
                  ? this.tools[this.props.ctrlTool.name].state.cursor
                  : this.state.shiftKey && this.props.shiftTool
                    ? this.tools[this.props.shiftTool.name].state.cursor
                    : this.state.altKey && this.props.altTool
                      ? this.tools[this.props.altTool.name].state.cursor
                      : this.state.tool
                        ? this.state.tool.state.cursor
                        : 'wait',
        }}>
          {
            this.props.tools
            ? this.props.tools.map(t => React.createElement(t, { map: this, key: t.name, ref: e => this.tools[t.name] = e, }))
            : <PanTool map={this} ref={e => this.tools[PanTool.name] = e} />
          }
          <canvas
            ref={e => this.canvas = e}
            width={this.state.width}
            height={this.state.height}
            onWheel={this.onMouseZoom.bind(this)}
            onPointerDown={this.onDown.bind(this)}
            onPointerMove={this.onMove.bind(this)}
            onPointerUp={this.onUp.bind(this)}
            onPointerCancel={this.onUp.bind(this)}
            onPointerOut={this.onUp.bind(this)}
            onPointerLeave={this.onUp.bind(this)}
          ></canvas>
          <div>
            { this.props.children }
          </div>
          <div>

          </div>
        </div>
      </>
    );
  };
}

export default Map;