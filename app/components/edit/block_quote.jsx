import React from 'react';

import BlockEdit from 'app/templates/block_edit';

class BlockQuote extends BlockEdit {

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <blockquote
        className={'block-container'}
        data-index={this.props.block.get('index')}>
        <p
          className={'block-content block-quote'}
          ref={'content'}>
        </p>
      </blockquote>
    );
  }
}

module.exports = BlockQuote;
