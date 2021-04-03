import React from "react";
import Map from "../Map";

export interface MapToolProps extends React.ComponentPropsWithRef<any> {
  map?: Map;
};

export interface MapToolState {
  cursor: string;
};

class MapTool<P extends MapToolProps, S extends MapToolState> extends React.Component<P, S> {

  public activate (): void {
  }

  public cancel (): void {
  }

  public onMouseDown (e: React.MouseEvent): void {
  }

  public onMouseMove (e: React.MouseEvent, clicks: any[]): void {
  }

  public onMouseUp (e: React.MouseEvent): void {
  }

  public onTouchDown (e: React.PointerEvent): void {
  }

  public onTouchMove (e: React.PointerEvent, clicks: any[]): void {
  }

  public onSingleTouchMove (e: React.PointerEvent, clicks: any[]): void {
  }

  public onDoubleTouchMove (e: React.PointerEvent, clicks: any[]): void {
  }

  public onTouchUp (e: React.PointerEvent, clicks: any[]): void {
  }

  public onSingleTouchUp (e: React.PointerEvent, clicks: any[]): void {
  }

  public onDoubleTouchUp (e: React.PointerEvent, clicks: any[]): void {
  }

  public onDown (e: React.PointerEvent): void {
  }

  public onMove (e: React.PointerEvent, clicks: any[]): void {
  }

  public onUp (e: React.PointerEvent): void {
  }

  public onDrawNodes (): void {
  }

  public onDrawConnections (): void {
  }

  public render () {
    return <></>;
  }
};

export default MapTool;