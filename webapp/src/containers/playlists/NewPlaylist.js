import React, { Component } from "react";
import {
  Progress,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from "reactstrap";
import "./NewPlaylist.css";
import { withNamespaces, Trans } from "react-i18next";
import { API } from "aws-amplify";
import Fullscreen from "react-full-screen";

class NewPlaylist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
      isLoading: true,
      isFull: props.location.state ? props.location.state.fullscreen : false,
      playlist: null,
      imageDimensions: null
    };

    this.selector = React.createRef();

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onEntering = this.onEntering.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    await this.createPlaylist();
  }

  componentDidUpdate(prevProps) {
    /*     on componentDidMount() authentication state may still being verified
    (try refresh home screen while authenticated) so componentDidUpdate is a better to place to check if authentication state changed */
    if (this.props.isAuthenticated &&
      this.props.isAuthenticated !== prevProps.isAuthenticated) {
      this.createPlaylist();
    }

    const { imageDimensions } = this.state;
    const node = this.selector.current.node;
    if (!imageDimensions || imageDimensions.width !== node.offsetWidth || imageDimensions.height !== node.offsetHeight) {
      this.setState({
        imageDimensions: {
          width: node.offsetWidth,
          height: node.offsetHeight
        }
      });
    }

  }

  async createPlaylist() {
    try {
      const playlist = await API.post("api", `/playlists?recipeId=${this.props.match.params.id}`, {
        body: {}
      });
      this.setState({ playlist: playlist });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  onFullScreenChange = (isFull) => {
    this.setFullScreen(isFull);
  }

  setFullScreen = (isFull) => {
    this.setState({ isFull });
  }

  onEntering() {
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === this.state.playlist.photos.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? this.state.playlist.photos.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  renderProgressAnimation() {
    return (
      <div>
        <div className="text-center"><Trans>Loading</Trans></div>
        <Progress animated color="info" value="100" />
      </div>
    );
  }

  renderImages() {
    const { activeIndex, playlist, imageDimensions } = this.state;

    const imgStyles = { "--kenburns-time": `${playlist.transitionEffect.duration}s` };

    const slides = playlist.photos.map((item, index) => {
      var url = `${item.url}=w${imageDimensions.width}-h${imageDimensions.height}`;
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          onEntering={this.onEntering}
          key={index}
        >
          <img src={url} alt={item.source} className={playlist.displayEffect.type === 'kenburns' ? 'kenburns' : ''} style={imgStyles}/>
          <CarouselCaption captionText={index.toString()} captionHeader={item.source} />
        </CarouselItem>
      );
    });

    return (
      <Carousel
        activeIndex={activeIndex}
        next={this.next}
        previous={this.previous}
        keyboard={true}
        pause={false}
        interval={playlist.transitionEffect.duration * 1000}
        className={playlist.transitionEffect.type === 'crossfade' ? 'carousel-fade' : ''}
      >
        <CarouselIndicators items={slides} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
        {slides}
        <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
        <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
      </Carousel>
    );
  }

  render() {
    const { isLoading, isFull, imageDimensions } = this.state;

    return (
      <Fullscreen
        enabled={isFull}
        onChange={isFull => this.onFullScreenChange(isFull)}
        ref={this.selector}
      >
        {isLoading
          ? this.renderProgressAnimation()
          : imageDimensions ? this.renderImages() :
            null
        }
      </Fullscreen>
    );
  }

}

export default withNamespaces("translations")(NewPlaylist);
