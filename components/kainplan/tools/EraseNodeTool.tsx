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

  public onDown (e: React.PointerEvent): void {
    const node: Node = this.props.map.nodeAround(this.props.map.winX2map(e.clientX), this.props.map.winY2map(e.clientY));
    if (!node) return;
    this.props.map.deleteNode(node, this.props.map.state.currentFloor);
  }
}

export default EraseNodeTool;