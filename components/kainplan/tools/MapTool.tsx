import React from "react";
import Map from "../Map";

export interface MapToolProps extends React.ComponentPropsWithRef<any> {
  map?: Map;
};

export interface MapToolState {
  cursor: string;
};

class MapTool<P extends MapToolProps, S extends MapToolState> extends React.Component<P, S> {

  public activate (map: Map): void {
  }

  public cancel (map: Map): void {
  }

  public onMouseDown (map: Map, e: React.MouseEvent): void {
  }

  public onMouseMove (map: Map, e: React.MouseEvent, clicks: any[]): void {
  }

  public onMouseUp (map: Map, e: React.MouseEvent): void {
  }

  public onTouchDown (map: Map, e: React.PointerEvent): void {
  }

  public onTouchMove (map: Map, e: React.PointerEvent, clicks: any[]): void {
  }

  public onSingleTouchMove (map: Map, e: React.PointerEvent, clicks: any[]): void {
  }

  public onDoubleTouchMove (map: Map, e: React.PointerEvent, clicks: any[]): void {
  }

  public onTouchUp (map: Map, e: React.PointerEvent, clicks: any[]): void {
  }

  public onSingleTouchUp (map: Map, e: React.PointerEvent, clicks: any[]): void {
  }

  public onDoubleTouchUp (map: Map, e: React.PointerEvent, clicks: any[]): void {
  }

  public onDown (map: Map, e: React.PointerEvent): void {
  }

  public onMove (map: Map, e: React.PointerEvent, clicks: any[]): void {
  }

  public onUp (map: Map, e: React.PointerEvent): void {
  }

  public onDrawNodes (map: Map): void {
  }

  public onDrawConnections (map: Map): void {
  }

  public render () {
    return <></>;
  }
};

export default MapTool;