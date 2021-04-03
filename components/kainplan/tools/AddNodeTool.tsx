import Map from "../Map";
import MapTool, { MapToolProps } from "./MapTool";

class AddNodeTool extends MapTool<MapToolProps, any> {

  public constructor(props) {
    super(props);
    this.state = {
      cursor: 'crosshair',
    };
  }

  public onDown (e: React.PointerEvent): void {
    this.props.map.addNode({
      _type: 'node',
      id: Date.now(),
      x: this.props.map.winX2map(e.clientX),
      y: this.props.map.winY2map(e.clientY),
      edges: [],
    }, this.props.map.state.currentFloor);
  }
}

export default AddNodeTool;