import Map from "../Map";
import { Node } from "../Map";
import MapTool from "./MapTool";

class MoveNodeTool extends MapTool<any, any> {

  private node: Node;
  private lastUpdate: number = Date.now();
  private minUpdateTimeDiff: number = 1000;
  
  public constructor(props) {
    super(props);
    this.state = {
      cursor: 'crosshair',
    };
  }

  private moveWrapper (click: React.MouseEvent): void {
    if (!this.node) return;
    const issueUpdate: boolean = Date.now() - this.lastUpdate > this.minUpdateTimeDiff;
    if (issueUpdate) this.lastUpdate = Date.now();
    this.props.map.moveNode(
      this.node, 
      this.props.map.winX2map(click.clientX),
      this.props.map.winY2map(click.clientY),
      this.props.map.state.currentFloor,
      issueUpdate
    );
  }

  public onDown (e: React.PointerEvent): void {
    this.node = this.props.map.nodeAround(this.props.map.winX2map(e.clientX), this.props.map.winY2map(e.clientY));
  }

  public onMouseMove (e: React.MouseEvent): void {
    this.moveWrapper(e);
  }

  public onSingleTouchMove (e: React.PointerEvent, clicks: any[]): void {
    this.moveWrapper(clicks[0]);
  }

  public onMouseUp (e: React.MouseEvent): void {
    if (this.node) {
      this.props.map.moveNode(
        this.node,
        this.props.map.winX2map(e.clientX),
        this.props.map.winY2map(e.clientY),
        this.props.map.state.currentFloor,
      );
      this.node = null;
    }
  }

  public onSingleTouchUp (e: React.PointerEvent, clicks: any[]): void {
    if (this.node) {
      this.props.map.moveNode(
        this.node,
        this.props.map.winX2map(clicks[0].clientX),
        this.props.map.winY2map(clicks[0].clientY),
        this.props.map.state.currentFloor,
      );
      this.node = null;
    }
  }
}

export default MoveNodeTool;