import ClassNames from "classnames";
import React from "react";
import BlockComponent from "app/templates/block_component";


class BlockImage extends BlockComponent {

  getDefaultState() {
    return { shouldShowPlaceholder: true };
  }

  handleBlur(event) {
    if (!this.props.block.get("content")) {
      this.setState({ shouldShowPlaceholder: true });
    }
  }

  handleFocus(event) {
    if (this.state.shouldShowPlaceholder) {
      this.setState({ shouldShowPlaceholder: false });
    }
  }

  componentDidMount() {
    super.componentDidMount();
    var content = React.findDOMNode(this.refs.content);
    content.addEventListener("blur", this.handleBlur.bind(this));
    content.addEventListener("focus", this.handleFocus.bind(this));
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    var content = React.findDOMNode(this.refs.content);
    content.removeEventListener("blur", this.handleBlur);
    content.removeEventListener("focus", this.handleFocus);
  }

  render() {
    var block = this.props.block;
    var captionClass = ClassNames(
      { "block-image-caption": true },
      { "general-placeholder": this.state.shouldShowPlaceholder }
    );
    return (
      <div
        className={"block-container"}
        data-index={block.get("index")}>
        <div className={"block-image-container"}>
          <img className={"block-image"} src={block.get("source")} />
          <p
            className={"general-invisible"}
            contentEditable={"true"}
            ref={"invisible"}>
          </p>
        </div>
        <p
          className={captionClass}
          contentEditable={this.props.shouldEnableEdits}
          placeholder={"Write a caption here..."}
          ref={"content"}>
        </p>
      </div>
    );
  }
}


module.exports = BlockImage;
