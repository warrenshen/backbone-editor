import $ from "jquery";
import ClassNames from "classnames";
import React from "react";
import Component from "app/templates/component";

import Selector from "app/helpers/selector";
import Vector from "app/helpers/vector";


class StyleModal extends Component {

  componentDidMount() {
    super.componentDidMount();
    this.createVector(this.props.vector);
  }

  componentDidUpdate() {
    this.createVector(this.props.vector);
  }

  createVector(vector) {
    if (vector) {
      var startPoint = vector.startPoint;
      var endPoint = vector.endPoint;

      var startSection = $('section[data-index="' + startPoint.sectionIndex + '"]')[0];
      var endSection = $('section[data-index="' + endPoint.sectionIndex + '"]')[0];

      var startBlock = startSection.childNodes[startPoint.blockIndex];
      var endBlock = endSection.childNodes[endPoint.blockIndex];

      var startCaretOffset = startPoint.caretOffset;
      var endCaretOffset = endPoint.caretOffset;

      var selection = window.getSelection();
      var range = document.createRange();

      var currentNode;
      var complete = false;
      var walker = Selector.createTreeWalker(startBlock);
      while (walker.nextNode() && !complete) {
        currentNode = walker.currentNode;
        if (startCaretOffset - currentNode.length < 0) {
          range.setStart(currentNode, startCaretOffset);
          complete = true;
        } else {
          startCaretOffset -= currentNode.length;
        }
      }

      complete = false;
      walker = Selector.createTreeWalker(endBlock);
      while (walker.nextNode() && !complete) {
        currentNode = walker.currentNode;
        if (endCaretOffset - currentNode.length <= 0) {
          range.setEnd(currentNode, endCaretOffset);
          complete = true;
        } else {
          endCaretOffset -= currentNode.length;
        }
      }

      selection.removeAllRanges();
      selection.addRange(range);
      this.positionModal(range);
    }
  }

  positionModal(range) {
    var rectangle = range.getBoundingClientRect();
    var modal = React.findDOMNode(this.refs.modal);
    var offset = rectangle.width / 2 - modal.offsetWidth / 2;
    modal.style.top = rectangle.top - 42 + "px";
    modal.style.left = rectangle.left + offset + "px";
  }

  render() {
    var modalClass = ClassNames(
      {"style-modal": true},
      {"general-hidden": !this.props.vector}
    );
    return (
      <div className={modalClass} ref="modal">
        <span className={"vertical-anchor"}></span>
        <span className={"style-modal-triangle"}></span>
      </div>
    );
  }
}

StyleModal.propTypes = {
  shouldUpdateModal: React.PropTypes.bool.isRequired,
  vector: React.PropTypes.instanceOf(Vector),
};

StyleModal.defaultProps = {
  shouldUpdateModal: true,
};


module.exports = StyleModal;
