import Map from "../Map";
import { Node } from "../Map";
import MapTool from "./MapTool";

class EraseNodeTool extends MapTool<any, any> {

  public constructor(props) {
    super(props);
    this.state = {
      cursor: 'crosshair',
    };
  }

  public onDown (map: Map, e: React.PointerEvent): void {
    const node: Node = map.nodeAround(map.winX2map(e.clientX), map.winY2map(e.clientY));
    if (!node) return;
    map.deleteNode(node, map.state.currentFloor);
  }
}

export default EraseNodeTool;