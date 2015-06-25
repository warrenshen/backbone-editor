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
      var node = React.findDOMNode(this.refs.input);
      this.styleLink(node.value);
      node.blur();
    }
  }

  handleKeyUp(event) {
    event.stopPropagation();
  }

  handleMouseDown(event) {
    event.preventDefault();
  }

  handleMouseUp(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  // --------------------------------------------------
  // Actions
  // --------------------------------------------------
  styleBlocks(type) {
    EditorActor.styleBlocks(this.props.vector, { type: type });
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
    EditorActor.styleElements(this.props.vector, { type: type, url: url });
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
  createVector(vector) {
    if (vector) {
      var startPoint = vector.startPoint;
      var endPoint = vector.endPoint;
      var sectionNodes = $("section, ol, ul");
      var startNode = sectionNodes[startPoint.sectionIndex]
                      .childNodes[startPoint.blockIndex];
      var endNode = sectionNodes[endPoint.sectionIndex]
                    .childNodes[endPoint.blockIndex];
      var selection = window.getSelection();
      var range = document.createRange();
      var caretOffset = startPoint.caretOffset;
      var currentNode = null;
      var walker = Selector.createTreeWalker(startNode);
      while (walker.nextNode() && caretOffset >= 0) {
        currentNode = walker.currentNode;
        if (caretOffset - currentNode.length <= 0) {
          range.setStart(currentNode, caretOffset);
        }
        caretOffset -= currentNode.length;
      }
      caretOffset = endPoint.caretOffset;
      walker = Selector.createTreeWalker(endNode);
      while (walker.nextNode() && caretOffset >= 0) {
        currentNode = walker.currentNode;
        if (caretOffset - currentNode.length <= 0) {
          range.setEnd(currentNode, caretOffset);
        }
        caretOffset -= currentNode.length;
      }
      selection.removeAllRanges();
      selection.addRange(range);
      this.positionModal(range);
    }
  }

  positionModal(range) {
    var rectangle = range.getBoundingClientRect();
    var node = React.findDOMNode(this.refs.modal);
    var offset = rectangle.width / 2 - node.offsetWidth / 2;
    if (rectangle.top) {
      node.style.top = rectangle.top - 44 + "px";
      node.style.left = rectangle.left + offset + "px";
    } else {
      EditorActor.updateVector(null);
      this.props.updateModalStyle();
    }
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var node = React.findDOMNode(this.refs.modal);
    node.addEventListener("mousedown", this.handleMouseDown.bind(this));
    node.addEventListener("mouseup", this.handleMouseUp.bind(this));
    this.createVector(this.props.vector);
  }

  componentDidUpdate() {
    if (false) {
      console.log("Style modal component updated.");
    }
    var node = React.findDOMNode(this.refs.input);
    if (node) {
      node.addEventListener("blur", this.handleBlur.bind(this));
      node.addEventListener("click", this.handleFocus.bind(this));
      node.addEventListener("keydown", this.handleKeyDown.bind(this));
      node.addEventListener("keypress", this.handleKeyPress.bind(this));
      node.addEventListener("keyup", this.handleKeyUp.bind(this));
    }
    this.createVector(this.props.vector);
  }

  componentWillUnmount() {
    var node = React.findDOMNode(this.refs.input);
    if (node) {
      node.removeEventListener("blur", this.handleBlur);
      node.removeEventListener("click", this.handleFocus);
      node.removeEventListener("keydown", this.handleKeyDown);
      node.removeEventListener("keypress", this.handleKeyPress);
      node.removeEventListener("keyup", this.handleKeyUp);
    }
    node = React.findDOMNode(this.refs.modal);
    node.removeEventListener("mousedown", this.handleMouseDown);
    node.removeEventListener("mouseup", this.handleMouseUp);
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
        isActive: this.props.styles[TypeConstants.block.headingOne],
      },
      {
        action: this.styleHeadingTwo.bind(this),
        className: "fa fa-header",
        isActive: this.props.styles[TypeConstants.block.headingTwo],
      },
      {
        action: this.styleHeadingThree.bind(this),
        className: "fa fa-header",
        isActive: this.props.styles[TypeConstants.block.headingThree],
      },
      {
        action: this.styleQuote.bind(this),
        className: "fa fa-quote-right",
        isActive: this.props.styles[TypeConstants.block.quote],
      },
      {
        action: this.styleCentered.bind(this),
        className: "fa fa-align-center",
        isActive: this.props.styles[TypeConstants.block.centered],
      },
      {
        action: this.styleBold.bind(this),
        className: "fa fa-bold",
        isActive: this.props.styles[TypeConstants.element.bold],
      },
      {
        action: this.styleItalic.bind(this),
        className: "fa fa-italic",
        isActive: this.props.styles[TypeConstants.element.italic],
      },
      {
        action: this.handleClick.bind(this),
        className: "fa fa-link",
        isActive: this.props.styles[TypeConstants.element.link],
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
  shouldUpdate: React.PropTypes.bool.isRequired,
  styles: React.PropTypes.object.isRequired,
  updateModalStyle: React.PropTypes.func.isRequired,
  updateStoryStyle: React.PropTypes.func.isRequired,
  vector: React.PropTypes.instanceOf(Vector),
};

ModalStyle.defaultProps = {
  shouldUpdate: true,
  styles: {},
  updateModalStyle: null,
  updateStoryStyle: null,
  vector: null,
};


module.exports = ModalStyle;
