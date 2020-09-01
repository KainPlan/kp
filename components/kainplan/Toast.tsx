import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faExclamationTriangle, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import style from './Toast.module.scss';

export enum ToastType {
  ERROR, WARNING, INFO
}

export enum ToastPosition {
  TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT, TOP_CENTER, BOTTOM_CENTER, UNALIGNED
}

interface ToastProps {
  type: ToastType;
  msg: string;
  position: ToastPosition;
  rootRef?: React.RefObject<HTMLDivElement>;
  onClose?: () => void;
}

interface ToastState extends ToastProps {
}

class Toast extends React.Component<ToastProps, ToastState> {
  constructor(props) {
    super(props);
    this.state = {
      type: props.type,
      msg: props.msg,
      position: props.position,
      onClose: props.onClose || (() => undefined),
    };
  }

  render() {
    return (
      <>
        <div className={style.root} ref={this.props.rootRef} style={{
          position: this.state.position === ToastPosition.UNALIGNED ? 'static' : 'fixed',
          left: [ToastPosition.TOP_LEFT,ToastPosition.BOTTOM_LEFT].includes(this.state.position) ? '5px' : [ToastPosition.TOP_CENTER,ToastPosition.BOTTOM_CENTER].includes(this.state.position) ? '50%' : 'unset',
          right: [ToastPosition.TOP_RIGHT,ToastPosition.BOTTOM_RIGHT].includes(this.state.position) ? '5px' : 'unset',
          top: [ToastPosition.TOP_LEFT,ToastPosition.TOP_RIGHT,ToastPosition.TOP_CENTER].includes(this.state.position) ? '5px' : 'unset',
          bottom: [ToastPosition.BOTTOM_LEFT,ToastPosition.BOTTOM_RIGHT,ToastPosition.BOTTOM_CENTER].includes(this.state.position) ? '5px' : 'unset',
          transform: [ToastPosition.TOP_CENTER,ToastPosition.BOTTOM_CENTER].includes(this.state.position) ? 'translateX(50%)' : 'none',
        }}>
          <i style={{
            color: this.state.type === ToastType.ERROR ? '#FF2D61' : this.state.type === ToastType.WARNING ? '#FFCB2D' : '#622DFF',
          }}>
            <FontAwesomeIcon icon={
              this.state.type === ToastType.ERROR ? faExclamationCircle
              : this.state.type === ToastType.WARNING ? faExclamationTriangle
              : faInfoCircle
            }/>
          </i>
          <div>
            {this.state.msg}
          </div>
          <i style={{
          }}>
            <FontAwesomeIcon 
              icon={faTimes} 
              onClick={() => this.state.onClose()}
            />
          </i>
        </div>
      </>
    );
  }
}

export default Toast;