import React from 'react';

import Component from 'app/templates/component';

class OptionImage extends Component {

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var node = React.findDOMNode(this.refs.option);
    node.addEventListener('click', this.props.action);
  }

  componentWillUnmount() {
    var node = React.findDOMNode(this.refs.option);
    node.removeEventListener('click', this.props.action);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <span className={'block-image-option'} ref={'option'}>
        <i className={this.props.className}></i>
      </span>
    );
  }
}

module.exports = OptionImage;
