import React from 'react';
import ResponsiveInputBox from './ResponsiveInputBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import style from './SearchBox.module.scss';

interface SearchBoxProps {
  label: string|string[];
  westIcon: IconDefinition;
  eastIcon: IconDefinition;
  onWestClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onEastClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  onContentChange?: (content: string) => void;
}

interface SearchBoxState extends SearchBoxProps {
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
    };
  }

  input: ResponsiveInputBox;

  focus() {
    this.input.focus();
  }
  
  render() {
    return (
      <>
        <div className={style.root}>
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