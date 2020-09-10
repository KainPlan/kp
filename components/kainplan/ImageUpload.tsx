import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface ImageUploadProps {
  label: string;
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

  img: HTMLImageElement;

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
      <>
        <div 
          className={`imageupload-root ${this.state.hovering ? 'highlight' : ''}`}
          onDragEnter={this.dragging.bind(this)}
          onDragOver={this.dragging.bind(this)}
          onDragLeave={this.dragEnd.bind(this)}
          onDrop={this.drop.bind(this)}
        >
          <div style={{
            display: this.state.file ? 'none' : 'inline-block',
          }}>
            <h3>{ this.props.label }</h3>
            <span>Datei hier ablegen!</span>
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
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css?family=Bebas+Neue&display=swap');

          .imageupload-root {
            width: 100%;
            height: 100%;
            min-height: 150px;
            border: 3px dashed #f2f2f2;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            user-select: none;
            color: #7c7c7c;
            position: relative;
            transition: .2s ease;

            &.highlight {
              border-color: #622dff;
              color: rgba(98, 45, 255, .6);
            }

            & > div:first-child {
              text-align: center;

              & > h3 {
                font-size: 2em;
                margin: 0;
                text-align: center;
                font-family: 'Bebas Neue', sans-serif;
                font-weight: lighter;
              }
            }

            & > img {
              max-width: 100%;
              max-height: 100%;
              opacity: .4;
            }

            & > div:last-child {
              align-items: center;
              color: #303841;
              position: absolute;
              top: 50%;
              left: 50%;
              z-index: 1;
              transform: translate(-50%, -50%);

              & > i {
                font-size: 1.5em;
                margin-right: 10px;
                transition: .15s ease;

                &:hover {
                  cursor: pointer;
                  color: #FF2D61;
                }
              }

              & > span {
                font-family: 'Bebas Neue', sans-serif;
                font-size: 3em;
              }
            }
          }
        `}</style>
      </>
    );
  }
}

export default ImageUpload;