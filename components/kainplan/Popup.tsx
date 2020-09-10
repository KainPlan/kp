import React from 'react';
import anime from 'animejs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, IconDefinition, faEyeDropper } from '@fortawesome/free-solid-svg-icons';
import style from './Popup.module.scss';

export interface PopupProps {
  title: string;
  children?: React.ReactElement|React.ReactElement[];
  icon?: IconDefinition;
  visible?: boolean;
  unCloseable?: boolean;
  onHide?: () => void;
}

export interface PopupState {
  unCloseable: boolean;
  visible: boolean;
  onHide: () => void;
}

class Popup extends React.Component<PopupProps, PopupState> {
  constructor(props) {
    super(props);
    this.state = {
      unCloseable: props.unCloseable,
      visible: props.visible,
      onHide: props.onHide || (() => undefined),
    };
  }

  window: HTMLDivElement;

  setCloseable(closeable: boolean) {
    this.setState({
      unCloseable: !closeable,
    });
  }

  show() {
    anime.remove(this.window);
    this.setState({
      visible: true,
    }, () => anime({
      targets: this.window,
      scale: [0, 1],
      duration: 500,
      easing: 'easeOutBack',
    }));
  }

  wiggle() {
    anime({
      targets: this.window,
      translateX: [0, -25],
      duration: 100,
      easing: 'linear',
    }).finished.then(() => anime({
      targets: this.window,
      translateX: [-25, 25],
      duration: 150,
      easing: 'linear',
    }).finished.then(() => anime({
      targets: this.window,
      translateX: [25, 0],
      duration: 300,
      easing: 'easeOutElastic',
    })));
  }

  onHide() {
    if (!this.state.unCloseable) return this.hide();
    this.wiggle();
  }

  hide() {
    anime.remove(this.window);
    anime({
      targets: this.window,
      scale: [1, 0],
      duration: 400,
      easing: 'easeInBack',
    }).finished.then(() => this.setState({
      visible: false,
    }, () => this.state.onHide()));
  }

  render() {
    return (
      <>
        <div 
          className={style.root}
          style={{
            display: this.state.visible ? 'block' : 'none',
          }}
          onClick={() => this.onHide()}
        >
          <div 
            ref={e => this.window = e}
            onClick={e => {
              e.stopPropagation();
              return true;
            }}
          >
            <div className={style.headerDiv}>
              <label>
                <i>
                  <FontAwesomeIcon icon={this.props.icon || faEyeDropper } />
                </i>
                {this.props.title}
              </label>
              {
                !this.state.unCloseable
                ? <i onClick={() => this.onHide()}>
                    <FontAwesomeIcon icon={faTimes} />
                  </i>
                : ''
              }
            </div>
            <div className={style.bodyDiv}>
              {this.props.children}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Popup;