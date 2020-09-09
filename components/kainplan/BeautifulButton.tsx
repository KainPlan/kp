import React from 'react';
import style from './BeautifulButton.module.scss';

interface BeautifulButtonProps {
  label: string;
  type?: string;
  onClick?: ()=>void;
}

interface BeautifulButtonState {
}

class BeautifulButton extends React.Component<BeautifulButtonProps, BeautifulButtonState> {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <>
        <input 
          type={this.props.type || 'button'} 
          value={this.props.label} 
          onClick={() => this.props.onClick && this.props.onClick()}  
          className={style.root}
        />
      </>
    );
  }
}

export default BeautifulButton;