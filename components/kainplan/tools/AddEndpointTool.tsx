import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import Map from "../Map";
import Popup from "../Popup";
import MapTool from "./MapTool";

class AddEndpointTool extends MapTool<any, any> {

  private popup: Popup;

  public constructor(props) {
    super(props);
    this.state = {
      cursor: 'crosshair',
    };
  }

  public onDown (map: Map, e: React.PointerEvent): void {
    this.popup.show();
  }

  public render () {
    return (
      <Popup ref={e => this.popup = e} title="Endpoint" icon={faMapMarkerAlt}>
        <h1>Hello World!</h1>
      </Popup>
    );
  }
}

export default AddEndpointTool;