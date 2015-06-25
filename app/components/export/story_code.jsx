import React from "react";

import Component from "app/templates/component";

import SectionList from "app/components/export/section_list";
import SectionStandard from "app/components/export/section_standard";

import Story from "app/models/story";

import TypeConstants from "app/constants/type_constants";


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
  renderSection(section) {
    var props = {
      key: section.cid,
      section: section,
    };
    if (section.isList()) {
      return <SectionList {...props} />;
    } else {
      return <SectionStandard {...props} />;
    }
  }

  renderSections() {
    return this.props.story.get("sections").map(this.renderSection, this);
  }

  render() {
    return (
      <code>
        <p className="code code-blue">{"<!DOCTYPE html>"}</p>
        <p className="code code-rose">{"<html>"}</p>
        <p className="code code-rose">{"<body>"}</p>
        {this.renderSections()}
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
