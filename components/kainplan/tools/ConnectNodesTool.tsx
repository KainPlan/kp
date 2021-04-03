import Map from "../Map";
import { Node } from "../Map";
import MapTool, { MapToolProps, MapToolState, } from "./MapTool";

interface ConnectNodesToolProps extends MapToolProps {
};

interface ConnectNodesToolState extends MapToolState {
  from: Node;
};

class ConnectNodesTool extends MapTool<ConnectNodesToolProps, ConnectNodesToolState> {

  public cursor: string = 'crosshair';
  private lastConnection: number = Date.now();
  private minRefreshTimeout: number = 10;

  public constructor(props) {
    super(props);
    this.state = {
      cursor: 'crosshair',
      from: null,
    };
  }

  private reset (): void {
    this.setState({ from: null, cursor: 'crosshair', });
  }

  public activate (map: Map): void {
    this.reset();
  }

  public cancel (map: Map): void {
    this.reset();
  }

  public onDown (map: Map, e: React.PointerEvent): void {
    const node: Node = map.nodeAround(map.winX2map(e.clientX), map.winY2map(e.clientY));
    if (!node) return;
    if (!this.state.from) {
      this.setState({ from: node }); 
    } else {
      map.connectNodes(this.state.from, node, map.state.currentFloor);
      this.reset();
    }
  }

  public onMove (map: Map, e: React.PointerEvent): void {
    if (Date.now() - this.lastConnection > this.minRefreshTimeout) {
      this.lastConnection = Date.now();
      map.refresh();
    }
  }

  public onDrawConnections (map: Map): void {
    if (this.state.from) {
      map.ctx.strokeStyle = '#FF009D';
      map.ctx.beginPath();
      map.ctx.moveTo(map.m2px(this.state.from.x), map.m2px(this.state.from.y));
      map.ctx.lineTo(map.m2px(map.mouseX), map.m2px(map.mouseY));
      map.ctx.stroke();
    }
  }
}

export default ConnectNodesTool;