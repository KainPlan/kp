import Map from "../Map";
import MapTool from "./MapTool";

class AddNodeTool extends MapTool<any, any> {

  public constructor(props) {
    super(props);
    this.state = {
      cursor: 'crosshair',
    };
  }

  public onDown (map: Map, e: React.PointerEvent): void {
    map.addNode({
      _type: 'node',
      id: Date.now(),
      x: map.winX2map(e.clientX),
      y: map.winY2map(e.clientY),
      edges: [],
    }, map.state.currentFloor);
  }
}

export default AddNodeTool;