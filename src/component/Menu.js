import React, { Component } from 'react'
import CheckboxTree from 'react-checkbox-tree';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function read_nodes_from_json(node_json) {
  if(Object.keys(node_json).length === 0) return [];

  let node_list = [];
  for(const key in node_json) {
    node_list.push({
      value : key,
      label : key,
      children : read_nodes_from_json(node_json[key]),
    });
  }

  return node_list;
}

export default class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked : [],
      expanded : [],
      nodes : [],
    };

  }

  async componentDidMount() {
    let node_json = await fetch('menu_nodes.json').then(response => response.json());

    let nodes = read_nodes_from_json(node_json);
    this.setState({ nodes : nodes }) ;
  }

  render() {
    console.log(this.state.checked);

    return (
      <CheckboxTree
        nodes={this.state.nodes}
        checked={this.state.checked}
        expanded={this.state.expanded}
        onCheck={(checked) => this.setState({ checked : checked })}
        onExpand={(expanded) => this.setState({ expanded : expanded })}
        icons={{
          check: <FontAwesomeIcon className="rct-icon rct-icon-check" icon="check-square" />,
          uncheck: <FontAwesomeIcon className="rct-icon rct-icon-uncheck" icon={['fas', 'square']} />,
          halfCheck: <FontAwesomeIcon className="rct-icon rct-icon-half-check" icon="check-square" />,
          expandClose: <FontAwesomeIcon className="rct-icon rct-icon-expand-close" icon="chevron-right" />,
          expandOpen: <FontAwesomeIcon className="rct-icon rct-icon-expand-open" icon="chevron-down" />,
          expandAll: <FontAwesomeIcon className="rct-icon rct-icon-expand-all" icon="plus-square" />,
          collapseAll: <FontAwesomeIcon className="rct-icon rct-icon-collapse-all" icon="minus-square" />,
          parentClose: <FontAwesomeIcon className="rct-icon rct-icon-parent-close" icon="folder" />,
          parentOpen: <FontAwesomeIcon className="rct-icon rct-icon-parent-open" icon="folder-open" />,
          leaf: <FontAwesomeIcon className="rct-icon rct-icon-leaf-close" icon="file" />
        }}
      />
    );
  }

}
