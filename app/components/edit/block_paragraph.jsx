import ClassNames from 'classnames';
import React from 'react';

import BlockEdit from 'app/templates/block_edit';

import ModalMedia from 'app/components/edit/modal_media';

import EditorStore from 'app/stores/editor_store';

class BlockParagraph extends BlockEdit {

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderModal() {
    var block = this.props.block;
    var point = EditorStore.point;
    if (!block.get('content') &&
        point &&
        point.sectionIndex === block.get('section_index') &&
        point.blockIndex === block.get('index')) {
      return <ModalMedia {...this.props} />;
    }
  }

  render() {
    var block = this.props.block;
    var contentClass = ClassNames(
      { 'block-content': true },
      { 'block-centered': block.isCentered() }
    );
    return (
      <div
        className={'block-container'}
        data-index={block.get('index')}>
        <p
          className={contentClass}
          ref={'content'}>
        </p>
        {this.renderModal()}
      </div>
    );
  }
}

module.exports = BlockParagraph;
