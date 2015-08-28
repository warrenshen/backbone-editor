import React from 'react';

import Component from 'app/templates/component';

class StyleAttribute extends Component {

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  static get propTypes() {
    return {
      attribute: React.PropTypes.object.isRequired,
    };
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    var attribute = this.props.attribute;
    return (
      <p className='code'>
        <span className='code code-blue'>
          {'  ' + attribute.type}
        </span>
        <span className='code'>
          {': '}
        </span>
        <span className='code code-green'>
          {attribute.value}
        </span>
        <span className='code'>
          {';'}
        </span>
      </p>
    );
  }
}

module.exports = StyleAttribute;
