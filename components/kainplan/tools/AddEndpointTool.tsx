import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import BeautifulButton from "../BeautifulButton";
import ClassicalInput from "../ClassicalInput";
import Map from "../Map";
import Popup from "../Popup";
import ResponsiveInputBox from "../ResponsiveInputBox";
import MapTool, { MapToolProps } from "./MapTool";

class AddEndpointTool extends MapTool<MapToolProps, any> {

  private popup: Popup;
  private posX: number;
  private posY: number;
  private titleIn: HTMLInputElement;
  private descIn: HTMLInputElement;

  public constructor(props) {
    super(props);
    this.state = {
      cursor: 'crosshair',
    };
  }

  public activate (): void {
    this.posX = null;
    this.posY = null;
    this.titleIn.value = '';
    this.descIn.value = '';
  }

  public onDown (e: React.PointerEvent): void {
    this.posX = e.clientX;
    this.posY = e.clientY;
    this.popup.show();
  }

  private onSubmit (e: React.FormEvent): void {
    e.preventDefault();
    if (this.posX === null || this.posY === null) return;
    const title: string = this.titleIn.value.trim();
    const desc: string = this.descIn.value.trim();
    if (!title || !desc) return;
    this.props.map.addNode({
      _type: 'endpoint',
      id: Date.now(),
      x: this.props.map.winX2map(this.posX),
      y: this.props.map.winY2map(this.posY),
      edges: [],
      body: {
        title,
        desc,
      },
    }, this.props.map.state.currentFloor);
    this.posX = null;
    this.posY = null;
    this.titleIn.value = '';
    this.descIn.value = '';
    this.popup.hide();
  }

  public render () {
    return (
      <Popup ref={e => this.popup = e} title="Endpoint" icon={faMapMarkerAlt}>
        <form onSubmit={this.onSubmit.bind(this)}>
          <ClassicalInput label="Titel" ref={e => this.titleIn = e as HTMLInputElement} />
          <ClassicalInput textArea label="Description" ref={e => this.descIn = e as HTMLInputElement} />
          <BeautifulButton label="Create!" type="submit" />
        </form>
      </Popup>
    );
  }
}

export default AddEndpointTool;