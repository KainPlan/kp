import { faMapMarkerAlt, faPencilRuler } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import BeautifulButton from "../BeautifulButton";
import ClassicalInput from "../ClassicalInput";
import Map, { Node } from "../Map";
import Popup from "../Popup";
import MapTool, { MapToolProps } from "./MapTool";

class EditEndpointTool extends MapTool<MapToolProps, any> {

  private popup: Popup;
  private node: Node;
  private titleIn: HTMLInputElement;
  private descIn: HTMLInputElement;

  public constructor(props) {
    super(props);
    this.state = {
      cursor: 'crosshair',
    };
  }

  public activate(): void {
    this.node = null;
    this.clearInputs();
  }

  public onDown(e: React.PointerEvent): void {
    this.node = this.props.map.nodeAround(this.props.map.winX2map(e.clientX), this.props.map.winY2map(e.clientY));
    if (this.node && this.node._type === 'endpoint') {
      if (!Object.keys(this.node.body).includes('title') || !Object.keys(this.node.body).includes('desc')) {
        // fix somehow broken node ... 
        this.node.body = { title: '', desc: '', };
      }
      this.titleIn.value = this.node.body!.title;
      this.descIn.value = this.node.body!.desc;
      this.popup.show();
    }
  }

  private clearInputs() {
    this.titleIn.value = '';
    this.descIn.value = '';
  }

  private onSubmit(e: React.FormEvent): void {
    e.preventDefault();
    if (this.node === null) return;
    const title: string = this.titleIn.value.trim();
    const desc: string = this.descIn.value.trim();
    if (!title || !desc) return;
    this.props.map.updateNodeBody(this.node, {
      title,
      desc,
    }, this.props.map.state.currentFloor);
    this.node = null;
    this.popup.hide();
  }

  public render() {
    return (
      <Popup ref={e => this.popup = e} title="Endpoint" icon={faPencilRuler}>
        <form onSubmit={this.onSubmit.bind(this)}>
          <ClassicalInput label="Titel" ref={e => this.titleIn = e as HTMLInputElement} />
          <ClassicalInput textArea label="Description" ref={e => this.descIn = e as HTMLInputElement} />
          <BeautifulButton label="Save!" type="submit" />
        </form>
      </Popup>
    );
  }
}

export default EditEndpointTool;