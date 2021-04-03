import Map from "../Map";
import MapTool from "./MapTool";

class PanTool extends MapTool<any, any> {

  public constructor(props) {
    super(props);
    this.state = {
      cursor: 'move',
    };
  }

  public onMouseMove (map: Map, e: React.MouseEvent, clicks: any[]): void {
    map.pan(
      clicks[0].clientX - e.clientX,
      clicks[0].clientY - e.clientY,
      clicks,
    );
  }

  public onSingleTouchMove (map: Map, e: React.PointerEvent, clicks: any[]): void {
    map.pan(
      clicks[0].clientX - e.clientX,
      clicks[0].clientY - e.clientY,
      clicks,
    );
  }
}

export default PanTool;