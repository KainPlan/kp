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

  public activate (): void {
    this.reset();
  }

  public cancel (): void {
    this.reset();
  }

  public onDown (e: React.PointerEvent): void {
    const node: Node = this.props.map.nodeAround(this.props.map.winX2map(e.clientX), this.props.map.winY2map(e.clientY));
    if (!node) return;
    if (!this.state.from) {
      this.setState({ from: node }); 
    } else {
      this.props.map.connectNodes(this.state.from, node, this.props.map.state.currentFloor);
      this.reset();
    }
  }

  public onMove (e: React.PointerEvent): void {
    if (Date.now() - this.lastConnection > this.minRefreshTimeout) {
      this.lastConnection = Date.now();
      this.props.map.refresh();
    }
  }

  public onDrawConnections (): void {
    if (this.state.from) {
      this.props.map.ctx.strokeStyle = '#FF009D';
      this.props.map.ctx.beginPath();
      this.props.map.ctx.moveTo(this.props.map.m2px(this.state.from.x), this.props.map.m2px(this.state.from.y));
      this.props.map.ctx.lineTo(this.props.map.m2px(this.props.map.mouseX), this.props.map.m2px(this.props.map.mouseY));
      this.props.map.ctx.stroke();
    }
  }
}

export default ConnectNodesTool;