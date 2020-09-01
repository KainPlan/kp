import React from 'react';
import TenFingers from '../tenfingers/TenFingers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import style from './ResponsiveInputBox.module.scss';

interface ResponsiveInputBoxProps {
  label: string|string[];
  type?: string;
  style?: any;
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  onContentChange?: (content: string) => void;
}

interface ResponsiveInputBoxState extends ResponsiveInputBoxProps {
  active: boolean;
  block: boolean;
  content: string;
}

class ResponsiveInputBox extends React.Component<ResponsiveInputBoxProps, ResponsiveInputBoxState> {
  constructor(props) {
    super(props);
    this.state = {
      label: props.label,
      type: props.type || 'text',
      active: false,
      block: false,
      content: '',
      onFocus: props.onFocus || (() => undefined),
      onBlur: props.onBlur || (() => undefined),
      onContentChange: props.onContentChange || (() => undefined),
    };
  }

  input: HTMLInputElement;

  focus() {
    if (!this.state.block) this.input.focus();
  }

  onFocus(e: FocusEvent) {
    this.setState({
      active: true,
    }, () => this.state.onFocus(e));
  }

  onBlur(e: FocusEvent) {
    this.setState({
      active: this.state.content.length > 0 ? true : false,
    }, () => this.state.onBlur(e));
  }

  onKeyUp(e: KeyboardEvent) {
    if (e.keyCode === 27) return (e.target as HTMLInputElement).blur();
    if ((e.target as HTMLInputElement).value !== this.state.content) {
      this.setState({
        content: (e.target as HTMLInputElement).value,
      }, () => this.state.onContentChange(this.state.content));
    }
  }

  sleep(timeout: number) {
    return new Promise(resolve => window.setTimeout(resolve, timeout));
  }

  quadFunc(len: number, mul: number) {
    return function(n: number) {
      return mul * Math.pow(n/len - 0.5, 2);
    }
  }

  clear() {
    this.input.blur();
    this.setState({
      content: '',
      block: true,
    }, async () => {
      let f = this.quadFunc(this.input.value.length, 5);
      while (this.input.value.length > 0) {
        this.input.value = this.input.value.substr(0, this.input.value.length-1);
        await this.sleep(25*f(this.input.value.length));
      }
      this.setState({
        block: false,
      });
      this.input.focus();
    });
  }

  render() {
    return (
      <>
        <div className={style.root} style={this.props.style}>
          <div style={{
            height: this.state.active ? "1.5em" : "0",
          }}></div>
          <div>
            <input 
              ref={e => this.input = e}
              type={this.state.type}
              onFocus={this.onFocus.bind(this)} 
              onBlur={this.onBlur.bind(this)}
              onKeyUp={this.onKeyUp.bind(this)}
              spellCheck="false"
              autoComplete="off"
            />
            <i 
              style={{
                opacity: this.state.content.length > 0 ? "1" : "0",
              }}
              onClick={this.clear.bind(this)}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </i>
            <label style={{
              color: this.state.active ? "#afafaf" : "#ababab",
              fontSize: this.state.active ? ".8em" : "inherit",
              top: this.state.active ? "-.2em" : "50%",
            }}>
              {
                Array.isArray(this.state.label) 
                  ? <TenFingers 
                      values={this.state.label} 
                      endEndTimeout={500} 
                      cursorColor="#dadada"
                    />
                  : this.state.label
              }
            </label>
          </div>
        </div>
      </>
    );
  }
}

export default ResponsiveInputBox;