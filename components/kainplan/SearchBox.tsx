import React from 'react';
import ResponsiveInputBox from './ResponsiveInputBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import style from './SearchBox.module.scss';

interface SearchBoxProps {
  label: string|string[];
  westIcon: IconDefinition;
  eastIcon: IconDefinition;
  hidden?: boolean;
  onWestClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onEastClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  onContentChange?: (content: string) => void;
}

interface SearchBoxState extends SearchBoxProps {
  hidden: boolean;
}

class SearchBox extends React.Component<SearchBoxProps, SearchBoxState> {
  constructor(props) {
    super(props);
    this.state = {
      label: props.label,
      westIcon: props.westIcon,
      eastIcon: props.eastIcon,
      onWestClick: props.onWestClick || (() => undefined),
      onEastClick: props.onEastClick || (() => undefined),
      onFocus: props.onFocus || (() => undefined),
      onBlur: props.onBlur || (() => undefined),
      onContentChange: props.onContentChange || (() => undefined),
      hidden: Boolean(this.props.hidden),
    };
  }

  input: ResponsiveInputBox;

  focus() {
    this.input.focus();
  }

  hide() {
    this.setState({
      hidden: true,
    });
  }

  show() {
    this.setState({
      hidden: false,
    });
  }
  
  render() {
    return (
      <>
        <div className={style.root} style={{
          'display': this.state.hidden ? 'none' : 'flex',
        }}>
          <i onClick={this.state.onWestClick}>
            <FontAwesomeIcon icon={this.state.westIcon} />
          </i>
          <div>
            <ResponsiveInputBox 
              ref={e => this.input = e}
              label={this.state.label} 
              onFocus={this.state.onFocus}
              onBlur={this.state.onBlur}
              onContentChange={this.state.onContentChange}
            />
          </div>
          <i onClick={this.state.onEastClick}>
            <FontAwesomeIcon icon={this.state.eastIcon} />
          </i>
        </div>
      </>
    );
  }
}

export default SearchBox;