import $ from "jquery";
import ClassNames from "classnames";
import React from "react";

import Component from "app/templates/component";

import OptionStyle from "app/components/edit/option_style";

import EditorActor from "app/actors/editor_actor";

import Point from "app/helpers/point";
import Selector from "app/helpers/selector";
import Vector from "app/helpers/vector";

import KeyConstants from "app/constants/key_constants";
import TypeConstants from "app/constants/type_constants";


class ModalStyle extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "ModalStyle";
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
    React.findDOMNode(this.refs.input).focus();
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
    this.props.updateStoryStyle();
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

  styleElements(type, url="") {
    EditorActor.styleElements(this.props.vector, type, url);
    this.props.updateStoryStyle();
  }

  styleBold(event) {
    this.styleElements(TypeConstants.element.bold);
  }

  styleItalic(event) {
    this.styleElements(TypeConstants.element.italic);
  }

  styleLink(url) {
    this.styleElements(TypeConstants.element.link, url);
  }

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------
  createVector(vector, point) {
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
    } else if (!point) {
      var selection = window.getSelection();
      selection.removeAllRanges();
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

    this.createVector(this.props.vector, this.props.point);
  }

  componentDidUpdate() {
    if (false) {
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

    this.createVector(this.props.vector, this.props.point);
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
    return nextProps.shouldUpdate ||
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
      <OptionStyle
        key={index}
        {...props} />
    );
  }

  renderOptions() {
    return [
      {
        action: this.styleHeadingOne.bind(this),
        className: "fa fa-header",
        isActive: this.props.activeStyles[TypeConstants.block.headingOne],
      },
      {
        action: this.styleHeadingTwo.bind(this),
        className: "fa fa-header",
        isActive: this.props.activeStyles[TypeConstants.block.headingTwo],
      },
      {
        action: this.styleHeadingThree.bind(this),
        className: "fa fa-header",
        isActive: this.props.activeStyles[TypeConstants.block.headingThree],
      },
      {
        action: this.styleQuote.bind(this),
        className: "fa fa-quote-right",
        isActive: this.props.activeStyles[TypeConstants.block.quote],
      },
      {
        action: this.styleCentered.bind(this),
        className: "fa fa-align-center",
        isActive: this.props.activeStyles[TypeConstants.block.centered],
      },
      {
        action: this.styleBold.bind(this),
        className: "fa fa-bold",
        isActive: this.props.activeStyles[TypeConstants.element.bold],
      },
      {
        action: this.styleItalic.bind(this),
        className: "fa fa-italic",
        isActive: this.props.activeStyles[TypeConstants.element.italic],
      },
      {
        action: this.handleClick.bind(this),
        className: "fa fa-link",
        isActive: this.props.activeStyles[TypeConstants.element.link],
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

ModalStyle.propTypes = {
  activeStyles: React.PropTypes.object.isRequired,
  point: React.PropTypes.instanceOf(Point),
  shouldUpdate: React.PropTypes.bool.isRequired,
  updateStoryStyle: React.PropTypes.func.isRequired,
  vector: React.PropTypes.instanceOf(Vector),
};

ModalStyle.defaultProps = {
  activeStyles: {},
  point: null,
  shouldUpdate: true,
  updateStoryStyle: null,
  vector: null,
};


module.exports = ModalStyle;
