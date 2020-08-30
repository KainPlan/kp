import React from 'react';

interface CursorProps {
  color?: string;
};

interface CursorState {
  color: string;
}

class Cursor extends React.Component<CursorProps, CursorState> {
  constructor(props: CursorProps) {
    super(props);
    this.state = {
      color: props.color || '#222',
    };
  }

  render() {
    return (
      <>
        <div>&nbsp;</div>
        <style jsx>{`
          @keyframes blink {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
        
          div {
            display: inline-block;
            background-color: ${this.state.color};
            width: 2px;
            border-radius: 5px;
            animation: blink .8s linear 0s infinite forwards; 
          }  
        `}</style>
      </>
    );
  }
}

export default Cursor;