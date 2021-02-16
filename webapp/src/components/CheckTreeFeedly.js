import React from "react";
import CheckTree from './CheckTree';
import { API } from "aws-amplify";

export default class CheckTreeFeedly extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: this.props.checked,
      nodes: null,
      feedCollections: []
    };

    this._isMounted = false;
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this._isMounted && this.setState({
        checked: this.props.checked,
      });
    }
  }

  async componentDidMount() {
    this._isMounted = true;

    const allFeeds = await this.fetchFeeds();
    const nodes = this.getNodes(allFeeds);

    this._isMounted && this.setState({
      nodes: nodes,
      feedCollections: allFeeds
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async fetchFeeds() {
    try {
      const result = await API.get("api", "/feedly/feeds");

      return result;
    } catch (e) {
      alert(e);
    }
  }

  getNodes(feeds) {
    const result = feeds.map(category => {
      return {
        value: category.id,
        label: category.label,
        children: category.feeds.map(feed => {
          return {
            value: feed.id,
            label: feed.title,
          };
        }),
      };
    })

    return result;
  }

  handleCheckClick(checkedFeedIds) {
    let checkedFeeds = [];
    if (this.props.onCheck) {
      for (const checkedFeedId of checkedFeedIds){
        for (const feedCollection of this.state.feedCollections){
          const matchingFeed = feedCollection.feeds.find(x => x.id === checkedFeedId);
          if(matchingFeed) {
            let feed = {
              id: matchingFeed.id,
              title: matchingFeed.title,
              description: matchingFeed.description,
              img_url: matchingFeed.visualUrl,
              url: matchingFeed.website
            };
            checkedFeeds.push(feed);
          }
        }
      }

      this.props.onCheck(checkedFeeds);
    };
  }

  render() {

    return (
      this.state.nodes &&
      <CheckTree
        nodes={this.state.nodes}
        checked={this.state.checked}
        onCheck={checked => this.handleCheckClick(checked)}
      />
    );
  }


}
