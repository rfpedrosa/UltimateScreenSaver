import React from "react";
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import CheckboxTree from 'react-checkbox-tree';

export default class CheckTree extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nodes: this.props.nodes,
      checked: this.props.checked,
      expanded: [],
    };

  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({nodes: this.props.nodes});
    }
  }


  handleCheckClick(checked) {
    if (this.props.onCheck) {
      this.props.onCheck(checked);
    };

    this.setState({ checked });
  }

  render() {

    return (
      <CheckboxTree
        nodes={this.state.nodes}
        checked={this.state.checked}
        expanded={this.state.expanded}
        showExpandAll={false}
        onCheck={checked => this.handleCheckClick(checked)}
        onExpand={expanded => this.setState({ expanded })}
      />
    );
  }

}
