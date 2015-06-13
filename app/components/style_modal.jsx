import $ from "jquery";
import ClassNames from "classnames";
import React from "react";

import Component from "app/templates/component";

import StyleOption from "app/components/style_option";

import EditorActor from "app/actors/editor_actor";

import Selector from "app/helpers/selector";
import Vector from "app/helpers/vector";

import KeyConstants from "app/constants/key_constants";
import TypeConstants from "app/constants/type_constants";


class StyleModal extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "StyleModal";
  }

  // --------------------------------------------------
  // State
  // --------------------------------------------------
  getDefaultState() {
    return { shouldShowInput: false };
  }

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------
  handleBlur(event) {
    this.setState({ shouldShowInput: false });
  }

  handleClick(event) {
    event.stopPropagation();

    this.setState({ shouldShowInput: true });
  }

  handleFocus(event) {
    event.stopPropagation();

    React.findDOMNode(this.refs.input).focus();
  }

  handleKeyDown(event) {
    event.stopPropagation();
  }

  handleKeyPress(event) {
    event.stopPropagation();

    if (event.which === KeyConstants.enter) {
      var input = React.findDOMNode(this.refs.input);

      this.styleLink(input.value);
      input.blur();
    }
  }

  handleKeyUp(event) {
    event.stopPropagation();
  }

  handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleMouseUp(event) {
    event.stopPropagation();
  }

  // --------------------------------------------------
  // Actions
  // --------------------------------------------------
  styleBlocks(type) {
    EditorActor.styleBlocks(this.props.vector, type);
    this.props.updateStates();
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

  styleElements(type, link="") {
    EditorActor.styleElements(this.props.vector, type, link);
    this.props.updateStates();
  }

  styleBold(event) {
    this.styleElements(TypeConstants.element.bold);
  }

  styleItalic(event) {
    this.styleElements(TypeConstants.element.italic);
  }

  styleLink(link) {
    this.styleElements(TypeConstants.element.link, link);
  }

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------
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

    modal.style.top = rectangle.top - 44 + "px";
    modal.style.left = rectangle.left + offset + "px";
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var modal = React.findDOMNode(this.refs.modal);
    modal.addEventListener("mousedown", this.handleMouseDown.bind(this));
    modal.addEventListener("mouseup", this.handleMouseUp.bind(this));

    this.createVector(this.props.vector);
  }

  componentDidUpdate() {
    if (true) {
      console.log("Style modal component updated.");
    }

    var input = React.findDOMNode(this.refs.input);

    if (input) {
      input.addEventListener("blur", this.handleBlur.bind(this));
      input.addEventListener("click", this.handleFocus.bind(this));
      input.addEventListener("keydown", this.handleKeyDown.bind(this));
      input.addEventListener("keypress", this.handleKeyPress.bind(this));
      input.addEventListener("keyup", this.handleKeyUp.bind(this));
    }

    this.createVector(this.props.vector);
  }

  componentWillUnmount() {
    var input = React.findDOMNode(this.refs.input);

    if (input) {
      input.removeEventListener("blur", this.handleBlur);
      input.removeEventListener("click", this.handleFocus);
      input.removeEventListener("keydown", this.handleKeyDown);
      input.removeEventListener("keypress", this.handleKeyPress);
      input.removeEventListener("keyup", this.handleKeyUp);
    }

    var modal = React.findDOMNode(this.refs.modal);
    modal.removeEventListener("mousedown", this.handleMouseDown);
    modal.removeEventListener("mouseup", this.handleMouseUp);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.shouldUpdateStyler ||
           this.state.shouldShowInput !== nextState.shouldShowInput;
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderInput() {
    if (this.state.shouldShowInput) {
      return (
        <div className={"style-modal-overlay"}>
          <span className={"vertical-anchor"}></span>
          <input
            className={"style-modal-input"}
            ref={"input"}
            placeholder={"Enter or paste a link..."}>
          </input>
        </div>
      );
    }
  }

  renderOption(props, index) {
    return (
      <StyleOption
        key={index}
        {...props} />
    );
  }

  renderOptions() {
    return [
      {
        action: this.styleHeadingOne.bind(this),
        active: this.props.activeStyles[TypeConstants.block.headingOne],
        className: "fa fa-header",
      },
      {
        action: this.styleHeadingTwo.bind(this),
        active: this.props.activeStyles[TypeConstants.block.headingTwo],
        className: "fa fa-header",
      },
      {
        action: this.styleHeadingThree.bind(this),
        active: this.props.activeStyles[TypeConstants.block.headingThree],
        className: "fa fa-header",
      },
      {
        action: this.styleQuote.bind(this),
        active: this.props.activeStyles[TypeConstants.block.quote],
        className: "fa fa-quote-right",
      },
      {
        action: this.styleCentered.bind(this),
        active: this.props.activeStyles[TypeConstants.block.centered],
        className: "fa fa-align-center",
      },
      {
        action: this.styleBold.bind(this),
        active: this.props.activeStyles[TypeConstants.element.bold],
        className: "fa fa-bold",
      },
      {
        action: this.styleItalic.bind(this),
        active: this.props.activeStyles[TypeConstants.element.italic],
        className: "fa fa-italic",
      },
      {
        action: this.handleClick.bind(this),
        active: this.props.activeStyles[TypeConstants.block.headingThree],
        className: "fa fa-link",
      },
    ].map(this.renderOption, this);
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
        {this.renderInput()}
        <span className={"style-modal-triangle"}></span>
      </div>
    );
  }
}

StyleModal.propTypes = {
  activeStyles: React.PropTypes.object.isRequired,
  shouldUpdateStyler: React.PropTypes.bool.isRequired,
  updateStates: React.PropTypes.func.isRequired,
  vector: React.PropTypes.instanceOf(Vector),
};

StyleModal.defaultProps = {
  activeStyles: {},
  shouldUpdateStyler: true,
  updateStates: null,
  vector: null,
};


module.exports = StyleModal;
