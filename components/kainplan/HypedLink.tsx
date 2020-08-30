import React from 'react';
import Link from 'next/link';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import style from './HypedLink.module.scss';

export enum HypedIconPosition {
  BEFORE, AFTER
}

interface HypedLinkProps {
  label: string;
  href: string;
  icon?: IconDefinition;
  position?: HypedIconPosition;
}

interface HypedLinkState {
  position: HypedIconPosition;
}

class HypedLink extends React.Component<HypedLinkProps, HypedLinkState> {
  constructor(props) {
    super(props);
    this.state = {
      position: typeof props.position !== 'undefined' ? props.position : HypedIconPosition.AFTER,
    };
  }

  public render() {
    return (
      <>
        <Link href={this.props.href}>
          <div className={style.root}>
            <a>
              { this.state.position === HypedIconPosition.AFTER && this.props.label }
              { typeof this.props.icon !== 'undefined' && <i style={{
                marginLeft: this.state.position === HypedIconPosition.AFTER && '7.5px',
                marginRight: this.state.position === HypedIconPosition.BEFORE && '7.5px',
              }}><FontAwesomeIcon icon={this.props.icon} /></i> }
              { this.state.position === HypedIconPosition.BEFORE && this.props.label }
            </a>    
          </div>
        </Link>
      </>
    );
  }
}

export default HypedLink;