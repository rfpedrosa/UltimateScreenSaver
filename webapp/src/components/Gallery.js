import React from "react";
import ReactGridGallery from 'react-grid-gallery';
import "./Gallery.css";

export default class Gallery extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      images: this.props.images,
    };

    this.onSelectImage = this.handleSelectImage.bind(this);
  }

  componentDidUpdate(prevProps){
    if (prevProps !== this.props) {
      this.setState({images: this.props.images });
    }
  }

  handleSelectImage(index) {
    var newImages = this.state.images.slice();
    var img = newImages[index];
    if (img.hasOwnProperty("isSelected")) {
      img.isSelected = !img.isSelected;
    }
    else {
      img.isSelected = true;
    }

    if (this.props.onSelectionChange){
      this.props.onSelectionChange(this.getSelectedIndexes());
    }

    this.setState({ images: newImages });
  }

  getSelectedIndexes() {
    var results = [];
    for (var i = 0; i < this.state.images.length; i++) {
      if (this.state.images[i].isSelected === true) {
        results.push(i);
      }
    }

    return results;
  }

  render() {

    return (
      <div className="gallery" style={{
        display: "block",
        minHeight: "1px",
        width: "100%",
        border: "1px solid #ddd",
        overflow: "auto"
      }}>
        <ReactGridGallery images={this.state.images}
          onClickThumbnail={index => this.handleSelectImage(index)}
          onSelectImage={index => this.handleSelectImage(index)}
        />
      </div>
    )
  }
}
