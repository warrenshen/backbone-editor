import React from "react";
import Component from "app/templates/component";


class BlockComponent extends Component {

  render() {
    return (
      <div style={this.styles.container}>
        <p
          style={this.styles.content}
          ref={"content"}
          contentEditable={true}>
        </p>
      </div>
    );
  }

  set styles(styles) {}
  get styles() {
    return {
      container: {
        position: "relative",
        width: 712,
        padding: "0 0 24px 0",
        margin: "0 auto",
        cursor: "text",
        outline: "none",
        WebkitUserSelect: "all",
      },

      content: {
        position: "relative",
        width: "100%",
        outline: "none",
        wordWrap: "break-word",
      },
    };
  }
}


module.exports = BlockComponent;
