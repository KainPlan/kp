import React from 'react';
import Link from 'next/link';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

  render() {
    return (
      <>
        <Link href={this.props.href}>
          <div>
            <a>
              { this.state.position === HypedIconPosition.AFTER && this.props.label }
              { typeof this.props.icon !== 'undefined' && <i><FontAwesomeIcon icon={this.props.icon} /></i> }
              { this.state.position === HypedIconPosition.BEFORE && this.props.label }
            </a>    
          </div>
        </Link>
      </>
    );
  }
}

export default HypedLink;