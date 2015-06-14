import ClassNames from "classnames";

import BlockComponent from "app/templates/block_component";


class BlockQuote extends BlockComponent {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "BlockQuote";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    var block = this.props.block;
    var contentClass = ClassNames(
      { "block-content": true },
      { "block-quote": true },
      { "block-centered": block.get("centered") }
    );

    return (
      <blockquote
        className={"block-container"}
        data-index={block.get("index")}>
        <p
          className={contentClass}
          contentEditable={this.props.shouldEnableEdits}
          ref={"content"}>
        </p>
      </blockquote>
    );
  }
}


module.exports = BlockQuote;
