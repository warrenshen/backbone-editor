import React from "react";

import Component from "app/templates/component";

import Story from "app/models/story";


class StoryCode extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "StoryCode";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <code>
        <p className="code code-blue">{"<!DOCTYPE html>"}</p>
        <p className="code code-rose">{"<html>"}</p>
        <p className="code code-rose">{"<body>"}</p>
        {this.props.story.toCode()}
        <p className="code code-rose">{"</body>"}</p>
        <p className="code code-rose">{"</html>"}</p>
      </code>
    );
  }
}

StoryCode.propTypes = {
  story: React.PropTypes.instanceOf(Story).isRequired,
};

StoryCode.defaultProps = {
  story: new Story(),
};


module.exports = StoryCode;
