import ClassNames from 'classnames';
import React from 'react';

import Component from 'app/templates/component';

class OptionMedia extends Component {

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  static get propTypes() {
    return {
      action: React.PropTypes.func.isRequired,
      className: React.PropTypes.string.isRequired,
      isActive: React.PropTypes.bool.isRequired,
    };
  }

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------
  handleMouseDown(event) {
    event.preventDefault();
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var node = React.findDOMNode(this.refs.option);
    node.addEventListener('click', this.props.action);
    node.addEventListener('mousedown', this.handleMouseDown);
  }

  componentWillUnmount() {
    var node = React.findDOMNode(this.refs.option);
    node.removeEventListener('click', this.props.action);
    node.removeEventListener('mousedown', this.handleMouseDown);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    var optionClass = ClassNames(
      { 'modal-media-option': true },
      { 'modal-media-hidden': !this.props.isActive },
      { 'modal-media-visible': this.props.isActive }
    );
    return (
      <span className={optionClass} ref={'option'}>
        <span className={'vertical-anchor'}></span>
        <i className={this.props.className}></i>
      </span>
    );
  }
}

module.exports = OptionMedia;
