import React from "react";
import { API } from "aws-amplify";
import Gallery from "./Gallery";

export default class GalleryGoogle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedGoogleAlbums: this.props.selectedGoogleAlbums,

      googleAlbums: null,
      images: []
    };

    this._isMounted = false;
  }

  async componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      let googleAlbums = this.state.googleAlbums;
      if (!googleAlbums){
        googleAlbums = await this.getAlbums();
      }
      const images = this.getImages(googleAlbums, this.props.selectedGoogleAlbums);

      this._isMounted && this.setState({
        selectedGoogleAlbums: this.props.selectedGoogleAlbums,
        googleAlbums,
        images,
      });
    }
  }

  async getAlbums() {
    const apiResults = await this.fetchGoogleAlbums();
    const albums = apiResults.map(el => {
      return { id: el.id, title: el.title, value: el.coverPhotoBaseUrl };
    });

    return albums;
  }

  async componentDidMount() {
    this._isMounted = true;

    const albums = await this.getAlbums();
    const images = this.getImages(albums, this.state.selectedGoogleAlbums);

    this._isMounted && this.setState({ googleAlbums: albums, images: images });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async fetchGoogleAlbums() {
    try {
      const result = await API.get("api", "/google/albums");
      return result;
    }
    catch (e) {
      alert(e);
    }
  }

  getImages(albums, selectedAlbums) {
    if (albums) {
      const result = albums.map(el => {
        const index = selectedAlbums.findIndex(selectedValue => {
          return el.id === selectedValue.id;
        });

        return {
          src: el.value,
          thumbnail: `${el.value}=w500-h250-p`,
          thumbnailWidth: 500,
          thumbnailHeight: 250,
          isSelected: index > -1 ? true : false,
          caption: el.title
        };
      });

      return result;
    }

    return [];
  }


  handleSelectionChange(indexes) {
    const selectedGoogleAlbums = indexes.map(value => {
      return this.state.googleAlbums[value];
    });

    if (this.props.onSelectAlbum) {
      this.props.onSelectAlbum(selectedGoogleAlbums);
    }

    this.setState({ selectedGoogleAlbums: selectedGoogleAlbums });
  }

  render() {
    return (
      <Gallery
        images={this.state.images}
        onSelectionChange={indexes => this.handleSelectionChange(indexes)}
      />
    )
  }
}
