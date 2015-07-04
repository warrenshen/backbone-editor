import $ from "jquery";
import ClassNames from "classnames";
import React from "react";

import Component from "app/templates/component";

import ModalInput from "app/components/edit/modal_input";
import OptionStyle from "app/components/edit/option_style";

import EditorActor from "app/actors/editor_actor";

import Point from "app/helpers/point";
import Selector from "app/helpers/selector";
import Vector from "app/helpers/vector";

import TypeConstants from "app/constants/type_constants";


class ModalStyle extends Component {

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  static get propTypes() {
    return {
      shouldUpdate: React.PropTypes.bool.isRequired,
      styles: React.PropTypes.object.isRequired,
      updateModalStyle: React.PropTypes.func.isRequired,
      updateStoryStyle: React.PropTypes.func.isRequired,
      vector: React.PropTypes.instanceOf(Vector),
    };
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
    if (!this.props.vector && this.state.shouldShowInput) {
      this.setState({ shouldShowInput: false });
    } else if (!this.state.shouldShowInput) {
      this.createVector(this.props.vector);
    }
  }

  componentWillUnmount() {
    var node = React.findDOMNode(this.refs.modal);
    node.removeEventListener("mousedown", this.handleMouseDown);
    node.removeEventListener("mouseup", this.handleMouseUp);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.shouldUpdate ||
           this.state.shouldShowInput !== nextState.shouldShowInput;
  }

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------
  shouldShowCenteredOption() {
    return !this.props.styles[TypeConstants.block.quote];
  }

  shouldShowItalicOption() {
    return !this.props.styles[TypeConstants.block.quote];
  }

  shouldShowHeadingOptions() {
    return !this.props.styles[TypeConstants.block.quote];
  }

  shouldShowQuoteOption() {
    var styles = this.props.styles;
    return !styles[TypeConstants.block.headingOne] &&
           !styles[TypeConstants.block.headingTwo] &&
           !styles[TypeConstants.block.headingThree];
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderInput() {
    if (this.state.shouldShowInput) {
      return (
        <ModalInput
          handleBlur={this.handleBlur.bind(this)}
          styleLink={this.styleLink.bind(this)} />
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
    var types = TypeConstants.block;
    return [
      {
        action: this.styleHeadingOne.bind(this),
        className: "fa fa-header",
        isActive: this.props.styles[types.headingOne] === true,
        isHidden: !this.shouldShowHeadingOptions(),
      },
      {
        action: this.styleHeadingTwo.bind(this),
        className: "fa fa-header",
        isActive: this.props.styles[types.headingTwo] === true,
        isHidden: !this.shouldShowHeadingOptions(),
      },
      {
        action: this.styleHeadingThree.bind(this),
        className: "fa fa-header",
        isActive: this.props.styles[types.headingThree] === true,
        isHidden: !this.shouldShowHeadingOptions(),
      },
      {
        action: this.styleQuote.bind(this),
        className: "fa fa-quote-right",
        isActive: this.props.styles[types.quote] === true,
        isHidden: !this.shouldShowQuoteOption(),
      },
      {
        action: this.styleCentered.bind(this),
        className: "fa fa-align-center",
        isActive: this.props.styles[types.centered] === true,
        isHidden: !this.shouldShowCenteredOption(),
      },
      {
        action: this.styleBold.bind(this),
        className: "fa fa-bold",
        isActive: this.props.styles[types.bold] === true,
        isHidden: false,
      },
      {
        action: this.styleItalic.bind(this),
        className: "fa fa-italic",
        isActive: this.props.styles[types.italic] === true,
        isHidden: !this.shouldShowItalicOption(),
      },
      {
        action: this.handleClick.bind(this),
        className: "fa fa-link",
        isActive: this.props.styles[TypeConstants.element.link] === true,
        isHidden: false,
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


module.exports = ModalStyle;
