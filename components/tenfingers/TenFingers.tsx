import React from 'react';
import Cursor from './Cursor';

interface TenFingersProps {
  values: string[];
  typeInterval?: number;
  delInterval?: number;
  endTimeout?: number;
  endEndTimeout?: number;
  loop?: boolean;
  cursorColor?: string;
}

interface TenFingersState {
  values: string[];
  typeInterval: number;
  delInterval: number;
  endTimeout: number;
  endEndTimeout: number;
  loop: boolean;
  text: string;
  cursorColor?: string;
}

class TenFingers extends React.Component<TenFingersProps, TenFingersState> {
  constructor(props: TenFingersProps) {
    super(props);
    this.state = {
      values: props.values,
      typeInterval: props.typeInterval || 200,
      delInterval: props.delInterval || 75,
      endTimeout: props.endTimeout || 1000,
      endEndTimeout: props.endEndTimeout || 4000,
      loop: typeof props.loop !== 'undefined' ? props.loop : true,
      text: '',
      cursorColor: props.cursorColor,
    };
  }

  setStateAsync(state) {
    return new Promise(resolve => {
      this.setState(state, resolve as ()=>void);
    });
  }

  sleep(timeout: number) {
    return new Promise(resolve => window.setTimeout(resolve, timeout));
  }

  async componentDidMount() {
    do {
      for (let v of this.state.values) {
        let i: number = this.state.text.length-1;
        for (; !v.startsWith(this.state.text) && i >= 0; i--) {
          await this.setStateAsync({
            text: this.state.text.substr(0,i),
          });
          await this.sleep(this.state.delInterval)
        }
        for (; i < v.length; i++) {
          await this.setStateAsync({
            text: v.substr(0,i+1),
          });
          await this.sleep(this.state.typeInterval);
        }
        await this.sleep(this.state.endTimeout);
      }
      await this.sleep(this.state.endEndTimeout);
    } while (this.state.loop);
  }

  render() {
    return (
      <>
        {this.state.text}<Cursor color={this.state.cursorColor} />
      </>
    );
  }
}

export default TenFingers;