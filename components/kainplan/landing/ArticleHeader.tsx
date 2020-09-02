import React from 'react';
import style from './ArticleHeader.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';

export enum ArticleHeaderBackgroundType {
  VIDEO, IMAGE
};

export enum ArticleHeaderForegroundType {
  IMAGE, TEXT
};

interface ArticleHeaderProps {
  background: any;
  foreground: any;
  backgroundType?: ArticleHeaderBackgroundType;
  foregroundType?: ArticleHeaderForegroundType;
  onScrollDown?: () => void;
  centerBackground?: boolean;
};

class ArticleHeader extends React.Component<ArticleHeaderProps> {
  public render() {
    return (
      <div className={style.root}>
        <div className={style.inner}>
          {
            (this.props.backgroundType === undefined || this.props.backgroundType === ArticleHeaderBackgroundType.VIDEO)
            ? <video autoPlay muted loop style={{
                transform: this.props.centerBackground ? 'translateY(-50%)' : 'none',
              }}>
                <source src={this.props.background} type="video/mp4" />
              </video>
            : <img src={this.props.background} style={{
                transform: this.props.centerBackground ? 'translateY(-50%)' : 'none',
              }} />
          }
          <div className={style.fore}>
            {
              (this.props.foregroundType === undefined || this.props.foregroundType === ArticleHeaderForegroundType.IMAGE)
              ? <img src={this.props.foreground} />
              : <h2>{this.props.foreground}</h2>
            }
          </div>
        </div>
        {
          this.props.onScrollDown
          ? <div className={style.scrollDownContainer} onClick={this.props.onScrollDown}>
              <i><FontAwesomeIcon icon={faAngleDoubleDown} /></i>
            </div>
          : ''
        }
      </div>
    );
  }
};

export default ArticleHeader;