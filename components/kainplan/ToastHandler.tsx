import React from 'react';
import anime from 'animejs';
import Toast, { ToastType, ToastPosition } from './Toast';
import style from './ToastHandler.module.scss';

export interface ToastWrapper {
  id: string;
  msg: string;
  type: ToastType;
  ttl: number;
  rootRef: React.RefObject<HTMLDivElement>;
  timeout: number;
}

interface ToastHandlerProps {
  position: ToastPosition;
}

interface ToastHandlerState extends ToastHandlerProps {
  toasts: ToastWrapper[];
}

class ToastHandler extends React.Component<ToastHandlerProps, ToastHandlerState> {
  constructor(props) {
    super(props);
    this.state = {
      position: props.position,
      toasts: [],
    };
  }

  hide(wrapper: ToastWrapper) {
    window.clearTimeout(wrapper.timeout);
    anime({
      targets: wrapper.rootRef.current,
      opacity: [1, 0],
      easing: 'linear',
      duration: 400,
    }).finished.then(() => this.setState({
      toasts: this.state.toasts.filter(tw => tw.id !== wrapper.id),
    }));
  }

  show(wrapper: ToastWrapper) {
    wrapper.timeout = window.setTimeout(() => this.hide(wrapper), Math.floor(wrapper.ttl*1000));
    this.setState({
      toasts: [
        ...this.state.toasts,
        wrapper,
      ],
    }, () => anime({
      targets: wrapper.rootRef.current,
      opacity: [0, 1],
      easing: 'spring(1, 100, 15, 0)',
      duration: 500,
    }));
  }

  showInfo(msg: string, time: number) {
    this.show({ 
      id: Math.random()+msg,
      type: ToastType.INFO,
      msg: msg,
      ttl: time,
      rootRef: React.createRef(),
      timeout: 0,
    });
  }

  showWarning(msg: string, time: number) {
    this.show({
      id: Math.random()+msg,
      type: ToastType.WARNING,
      msg: msg,
      ttl: time,
      rootRef: React.createRef(),
      timeout: 0,
    });
  }

  showError(msg: string, time: number) {
    this.show({
      id: Math.random()+msg,
      type: ToastType.ERROR,
      msg: msg,
      ttl: time,
      rootRef: React.createRef(),
      timeout: 0,
    });
  }

  render() {
    return (
      <>
        <div 
          className={style.root}
          style={{
            position: 'fixed',
            zIndex: 20,
            left: [ ToastPosition.BOTTOM_LEFT, ToastPosition.TOP_LEFT, ].includes(this.state.position) ? '5px' 
                  : [ ToastPosition.BOTTOM_CENTER, ToastPosition.TOP_CENTER, ].includes(this.state.position) ? '50%' : '',
            top: [ ToastPosition.TOP_LEFT, ToastPosition.TOP_RIGHT, ].includes(this.state.position) ? '5px' : '',
            right: [ ToastPosition.BOTTOM_RIGHT, ToastPosition.TOP_RIGHT, ToastPosition.TOP_CENTER, ].includes(this.state.position) ? '5px' : '',
            bottom: [ ToastPosition.BOTTOM_LEFT, ToastPosition.BOTTOM_RIGHT, ToastPosition.BOTTOM_CENTER ].includes(this.state.position) ? '5px' : '',
            transform: [ ToastPosition.BOTTOM_CENTER, ToastPosition.TOP_CENTER, ].includes(this.state.position) ? 'translateX(-50%)' : '',
          }}
        >
          {this.state.toasts.map(tw => (
            <div style={{
              marginTop: '2.5px',
              width: '100%',
              position: 'relative',
            }}>
              <Toast 
                key={tw.id} 
                rootRef={tw.rootRef} 
                type={tw.type} 
                msg={tw.msg} 
                position={ToastPosition.UNALIGNED} 
                onClose={() => this.hide(tw)}
              />
            </div>
          ))}
        </div>
      </>
    );
  }
}

export default ToastHandler;