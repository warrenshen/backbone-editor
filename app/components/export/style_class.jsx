import React from "react";

import Component from "app/templates/component";

import StyleAttribute from "app/components/export/style_attribute";


class StyleClass extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "StyleClass";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderAttribute(attribute, index) {

  }

  renderAttributes() {
    // return this.props.attributes.map(this.renderAttribute, this);
    return <StyleAttribute />
  }

  render() {
    return (
      <code>
        <p className="code">
          <span className="code code-rose">
            {".block"}
          </span>
          <span className="code">
            {" {"}
          </span>
        </p>
        {this.renderAttributes()}
        <p className="code">
          {"}"}
        </p>
      </code>
    );
  }
}


module.exports = StyleClass;
