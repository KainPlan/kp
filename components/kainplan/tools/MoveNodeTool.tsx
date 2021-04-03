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

  private moveWrapper (map: Map, click: React.MouseEvent): void {
    if (!this.node) return;
    const issueUpdate: boolean = Date.now() - this.lastUpdate > this.minUpdateTimeDiff;
    if (issueUpdate) this.lastUpdate = Date.now();
    map.moveNode(
      this.node, 
      map.winX2map(click.clientX),
      map.winY2map(click.clientY),
      map.state.currentFloor,
      issueUpdate
    );
  }

  public onDown (map: Map, e: React.PointerEvent): void {
    this.node = map.nodeAround(map.winX2map(e.clientX), map.winY2map(e.clientY));
  }

  public onMouseMove (map: Map, e: React.MouseEvent): void {
    this.moveWrapper(map, e);
  }

  public onSingleTouchMove (map: Map, e: React.PointerEvent, clicks: any[]): void {
    this.moveWrapper(map, clicks[0]);
  }

  public onMouseUp (map: Map, e: React.MouseEvent): void {
    if (this.node) {
      map.moveNode(
        this.node,
        map.winX2map(e.clientX),
        map.winY2map(e.clientY),
        map.state.currentFloor,
      );
      this.node = null;
    }
  }

  public onSingleTouchUp (map: Map, e: React.PointerEvent, clicks: any[]): void {
    if (this.node) {
      map.moveNode(
        this.node,
        map.winX2map(clicks[0].clientX),
        map.winY2map(clicks[0].clientY),
        map.state.currentFloor,
      );
      this.node = null;
    }
  }
}

export default MoveNodeTool;