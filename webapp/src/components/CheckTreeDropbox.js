import React from "react";
import CheckTree from './CheckTree';
import PropTypes from 'prop-types';
import { API } from "aws-amplify";

class CheckTreeDropbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: this.props.selected,

      folders: null,
      nodes: null,
    };

    this._isMounted = false;
  }

  async componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      const nodes = this.getNodes(this.state.folders);
      const selected = this.props.selected;

      this._isMounted && this.setState({
        selected,
        nodes,
        checked: selected.map(el => el.id),
      });
    }
  }

  async componentDidMount() {
    this._isMounted = true;

    const apiResults = await this.fetchFolders();
    const folders = apiResults.map(el => {
      return { id: el.id, title: el.path_display, name: el.name, path_lower: el.path_lower };
    });

    const nodes = this.getNodes(folders);
    const selected = this.state.selected;

    this._isMounted && this.setState({
      folders,
      nodes,
      checked: selected.map(el => el.id),
    });

  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async fetchFolders() {
    try {
      const result = await API.get("api", "/dropbox/folders");
      return result;
    } catch (e) {
      alert(e);
    }
  }

  getNodes(selected) {
    if (!selected) {
      return [];
    }
    const roots = selected.filter(el => el.path_lower.split('/').length === 2);
    const result = roots.map(el => {
      return {
        value: el.path_lower,
        label: el.name,
        children: this.getTreeItems(el, selected, 1)
      };
    });

    return result;
  }

  getTreeItems(parentNode, nodes, level){
    var childs = nodes.filter(el => el.path_lower.startsWith(parentNode.path_lower) && el.path_lower.split('/').length === 2 + level);
    if (childs.length > 0){
      return childs.map(el => {
        return {
          value: el.id,
          label: el.name,
          children: this.getTreeItems(el, nodes, level + 1)
        };
      });
    }

    return null;
  }

  handleCheckClick(folders) {
    const items = folders.map(el => {
      return this.state.folders.find(folder => folder.id === el)
    });

    if (this.props.onCheck) {
      this.props.onCheck(items);
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

CheckTreeDropbox.propTypes = {
  selected: PropTypes.array.isRequired,
};

export default CheckTreeDropbox;
