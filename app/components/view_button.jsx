import React from 'react';

import Component from 'app/templates/component';

class ViewButton extends Component {

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  static get propTypes() {
    return {
      action: React.PropTypes.func.isRequired,
      className: React.PropTypes.string.isRequired,
      content: React.PropTypes.string.isRequired,
    };
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var node = React.findDOMNode(this.refs.button);
    node.addEventListener('click', this.props.action);
  }

  componentWillUnmount() {
    var node = React.findDOMNode(this.refs.button);
    node.removeEventListener('click', this.props.action);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <span className={this.props.className} ref={'button'}>
        {this.props.content}
      </span>
    );
  }
}

module.exports = ViewButton;
