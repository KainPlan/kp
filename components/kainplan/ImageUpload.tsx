import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import style from './ImageUpload.module.scss';

interface ImageUploadProps {
  label: string;
  incentive: string;
}

interface ImageUploadState {
  file?: File;
  hovering?: boolean;
}

class ImageUpload extends React.Component<ImageUploadProps, ImageUploadState> {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  public img: HTMLImageElement;

  dragging(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      hovering: true,
    });
  }

  dragEnd(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      hovering: false,
    });
  }

  drop(e: React.DragEvent) {
    e.persist();
    this.dragEnd(e);
    if (e.dataTransfer.files.length === 0) return;
    let file: File = e.dataTransfer.files[0];
    if (!file.type.startsWith('image/')) return;
    let reader: FileReader = new FileReader();
    reader.onload = () => {
      this.setState({
        file,
      }, () => {
        this.img.src = reader.result.toString();
      });
    };
    reader.readAsDataURL(file);
  }

  clearSelection() {
    this.setState({
      file: undefined,
    });
  }

  render() {
    return (
      <div 
        className={style.root + (this.state.hovering ? ' '+style.highlight : '')}
        onDragEnter={this.dragging.bind(this)}
        onDragOver={this.dragging.bind(this)}
        onDragLeave={this.dragEnd.bind(this)}
        onDrop={this.drop.bind(this)}
      >
        <div style={{
          display: this.state.file ? 'none' : 'inline-block',
        }}>
          <h3>{ this.props.label }</h3>
          <span>{ this.props.incentive }</span>
        </div>
        <img
          ref={e => this.img = e}
          src="" 
          style={{
            display: this.state.file ? 'block' : 'none',
          }}
        />
        <div style={{
          display: this.state.file ? 'flex' : 'none',
        }}>
          <i onClick={this.clearSelection.bind(this)}>
            <FontAwesomeIcon icon={faTimes} />
          </i>
          <span>{ this.state.file && this.state.file.name }</span>
        </div>
      </div>
    );
  }
}

export default ImageUpload;