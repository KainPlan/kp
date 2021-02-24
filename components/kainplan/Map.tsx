import React from 'react';
import style from './Map.module.scss';

interface MapProps {
  id: string;
  children?: React.ReactNode|React.ReactNode[];
  fullscreen?: boolean;
  width?: number;
  height?: number;
  mountCb?: ()=>void;
}

export interface MapHead {
  _id: string;
  name: string;
  desc: string;
}

export interface Node {
  _type: string;
  x: number;
  y: number;
  edges: number[];
  body?: any;
}

interface MapState {
  width: number;
  height: number;
  name: string;
  desc: string;
  mapWidth: number;
  mapHeight: number;
  background: string[];
  nodes: Node[];
  currentFloor: number;
}

class Map extends React.Component<MapProps, MapState> {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private clicks: any[] = [];
  private lastTime: number = new Date().getTime();
  private minTimeDiff: number = 10;
  private scrollMultiplier: number = 0.005;

  private cache: HTMLImageElement[];
  private clockRate: number = 10;
  private animTime: number = 100;
  private animIntval: number;

  private panScale: number = 0.3;
  private panTime: number = 150;
  private magnify: number = 1;
  private minMagnify: number = .75;
  private maxMagnify: number = 10;
  private offsetX: number = 0;
  private offsetY: number = 0;

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
    };
  }

  public componentDidMount () {
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
          nodes: res.body.nodes,
          currentFloor: 0,
        }, () => {
          this.ctx = this.canvas.getContext('2d');
          if (this.props.fullscreen) {
            window.addEventListener('resize', this.onResize.bind(this));
            this.onResize();
          }
          this.cache = this.state.background.map(b => {
            const im: HTMLImageElement = new Image();
            im.src = `/api/maps/${this.props.id}/${b}`;
            return im;
          });
          this.switchFloor(0);
          if (this.props.mountCb) this.props.mountCb();
        });
      });
  }

  // MAP EDITOR FUNCTIONS -------------------------------------------------------------- //

  public addNode(floor: number, node: Node) {

  }

  // MAP CONTROLLER FUNCTIONS -------------------------------------------------------------- //

  public reset() {
    this.ctx.translate(-this.offsetX, -this.offsetY);
  }

  private px2m(px: number): number {
    // return px * this.scale * this.magnify;
    return px * this.magnify;
  }
  
  private m2px(m: number): number {
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

  private refresh() {
    this.ctx.clearRect(0, 0, 
      this.state.width + this.m2px(this.state.mapWidth), 
      this.state.height + this.m2px(this.state.mapHeight));
    this.ctx.drawImage(this.cache[this.state.currentFloor], 
      0, 0, this.m2px(this.state.mapWidth), this.m2px(this.state.mapHeight));
  }

  
  // EVENT LISTENERS -------------------------------------------------------------- //

  private onMouseZoom (e: React.WheelEvent): void {
    let cab: DOMRect = this.canvas.getBoundingClientRect();
    this.zoom(e.deltaY*this.scrollMultiplier, 
      e.clientX - cab.left, e.clientY - cab.top);
  }

  private onMouseDown(e: React.PointerEvent) {
    this.clicks.push({...e});
    this.lastTime = new Date().getTime();
  }

  private onMouseMove(e: React.PointerEvent) {
    if (this.clicks.length === 1 && new Date().getTime() - this.lastTime > this.minTimeDiff) {
      this.pan(
        this.clicks[0].clientX - e.clientX,
        this.clicks[0].clientY - e.clientY,
        this.clicks,
      );
      this.clicks[0] = {...e};
      this.lastTime = new Date().getTime();
    }
  }

  private onMouseUp(e: React.PointerEvent) {
    this.clicks.pop();
  }

  private onTouchDown(e: React.PointerEvent) {
    this.clicks.push({...e});
    this.lastTime = new Date().getTime();
  }

  private onTouchMove(e: React.PointerEvent) {
    if (new Date().getTime() - this.lastTime > this.minTimeDiff) {
      if (this.clicks.length === 1) {
        this.pan(
          (this.clicks[0].clientX - e.clientX),
          (this.clicks[0].clientY - e.clientY),
          this.clicks,
        );
        this.clicks[0] = {...e};
        this.lastTime = new Date().getTime();
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

        this.clicks[1-otherIndex] = {...e};
        this.lastTime = new Date().getTime();
      }
    }
  }

  private onTouchUp(e: React.PointerEvent) {
    for (let i = 0; i < this.clicks.length; i++) {
      if ((this.clicks[i] as PointerEvent).pointerId === e.pointerId) {
        this.clicks.splice(i,1);
        return;
      }
    }
  }

  private onDown(e: React.PointerEvent) {
    e.preventDefault();
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
    switch(e.pointerType) {
      case 'mouse':
        this.onMouseUp(e);
        break;
      default:
        this.onTouchUp(e);
        break;
    }
  }

  public render() {
    return (
      <div className={style.root} style={{
        width: this.state.width+'px',
        height: this.state.height+'px',
      }}>
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
    );
  };
}

export default Map;