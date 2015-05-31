import $ from "jquery";
import ClassNames from "classnames";
import React from "react";
import Component from "app/templates/component";

import StyleOption from "app/components/style_option";

import EditorActor from "app/actors/editor_actor";

import Selector from "app/helpers/selector";
import Vector from "app/helpers/vector";

import TypeConstants from "app/constants/type_constants";


class StyleModal extends Component {

  handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleMouseUp(event) {
    event.stopPropagation();
  }

  styleBlocks(type) {
    EditorActor.styleBlocks(this.props.vector, type);
    this.props.updateStory();
  }

  styleCentered(event) {
    this.styleBlocks(TypeConstants.block.centered);
  }

  styleHeadingOne(event) {
    this.styleBlocks(TypeConstants.block.headingOne);
  }

  styleHeadingTwo(event) {
    this.styleBlocks(TypeConstants.block.headingTwo);
  }

  styleHeadingThree(event) {
    this.styleBlocks(TypeConstants.block.headingThree);
  }

  styleQuote(event) {
    this.styleBlocks(TypeConstants.block.quote);
  }

  styleElements(type) {
    EditorActor.styleElements(this.props.vector, type);
    this.props.updateStory();
  }

  styleBold(event) {
    this.styleElements(TypeConstants.element.bold);
  }


  styleItalic(event) {
    this.styleElements(TypeConstants.element.italic);
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

  componentDidMount() {
    super.componentDidMount();
    var node = React.findDOMNode(this.refs.modal);
    node.addEventListener("mousedown", this.handleMouseDown.bind(this));
    node.addEventListener("mouseup", this.handleMouseUp.bind(this));
    this.createVector(this.props.vector);
  }

  componentDidUpdate() {
    var node = React.findDOMNode(this.refs.modal);
    node.removeEventListener("mousedown", this.handleMouseDown);
    node.removeEventListener("mouseup", this.handleMouseUp);
    this.createVector(this.props.vector);
  }

  renderOption(props, index) {
    return (
      <StyleOption
        key={index}
        {...props} />
    );
  }

  renderOptions() {
    var activeStyles = this.props.activeStyles;
    var templates = [
      {
        action: this.styleHeadingOne.bind(this),
        active: activeStyles[TypeConstants.block.headingOne],
        className:"fa fa-header",
      },
      {
        action: this.styleHeadingTwo.bind(this),
        active: activeStyles[TypeConstants.block.headingTwo],
        className:"fa fa-header",
      },
      {
        action: this.styleHeadingThree.bind(this),
        active: activeStyles[TypeConstants.block.headingThree],
        className:"fa fa-header",
      },
      {
        action: this.styleQuote.bind(this),
        active: activeStyles[TypeConstants.block.quote],
        className: "fa fa-quote-right",
      },
      {
        action: this.styleCentered.bind(this),
        active: activeStyles[TypeConstants.block.centered],
        className: "fa fa-align-center",
      },
      {
        action: this.styleBold.bind(this),
        active: activeStyles[TypeConstants.element.bold],
        className: "fa fa-bold",
      },
      {
        action: this.styleItalic.bind(this),
        active: activeStyles[TypeConstants.element.italic],
        className: "fa fa-italic",
      },
      {
        action: this.styleHeadingThree.bind(this),
        active: activeStyles[TypeConstants.block.headingThree],
        className: "fa fa-link",
      },
    ];

    return templates.map(this.renderOption, this);
  }

  render() {
    var modalClass = ClassNames(
      { "style-modal": true },
      { "general-hidden": !this.props.vector }
    );
    return (
      <div className={modalClass} ref="modal">
        <span className={"vertical-anchor"}></span>
        {this.renderOptions()}
        <span className={"style-modal-triangle"}></span>
      </div>
    );
  }
}

StyleModal.propTypes = {
  activeStyles: React.PropTypes.object.isRequired,
  updateStory: React.PropTypes.func,
  vector: React.PropTypes.instanceOf(Vector),
};

StyleModal.defaultProps = {
  activeStyles: {},
};


module.exports = StyleModal;
