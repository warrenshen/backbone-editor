import React from "react";

import Component from "app/templates/component";

import SectionList from "app/components/export/section_list";
import SectionStandard from "app/components/export/section_standard";
import StyleClass from "app/components/export/style_class";

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
  renderImports() {
    return (
      <p className="code indented-tertiary">
        <span className={"code code-rose"}>
          {"  <link"}
        </span>
        <span className={"code code-green"}>
          {" href="}
        </span>
        <span className={"code code-blue"}>
          {"\"http://fonts.googleapis.com/css?family=Merriweather:400italic,400,700,700italic|Montserrat:400,700\""}
        </span>
        <span className={"code code-green"}>
          {" rel= "}
        </span>
        <span className={"code code-blue"}>
          {"\"stylesheet\""}
        </span>
        <span className={"code code-green"}>
          {" type= "}
        </span>
        <span className={"code code-blue"}>
          {"\"text/css\""}
        </span>
        <span className={"code code-rose"}>
          {">"}
        </span>
      </p>
    );
  }

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

  renderClass(props, index) {
    return (
      <StyleClass
        key={index}
        {...props} />
    );
  }

  renderClasses() {
    return [
      {
        class: "block",
        attributes: [
          {
            type: "display",
            value: "block",
          },
          {
            type: "width",
            value: "100%",
          },
        ],
      },
    ].map(this.renderClass, this);
  }

  render() {
    return (
      <code>
        <p className="code code-blue">{"<!DOCTYPE html>"}</p>
        <p className="code code-rose">{"<html>"}</p>
        <p className="code code-rose">{"<head>"}</p>
        {this.renderImports()}
        <p className="code code-rose">{"<head>"}</p>
        <p className="code code-rose">{"</head>"}</p>
        <p className="code code-rose">{"<body>"}</p>
        <p className="code">
          <span className="code code-rose">
            {"<div"}
          </span>
          <span className="code code-green">
            {" class="}
          </span>
          <span className="code code-blue">
            {"\"story\""}
          </span>
          <span className="code code-rose">
            {">"}
          </span>
        </p>
        {this.renderSections()}
        <p className="code code-rose">{"</div>"}</p>
        <p className="code code-rose">{"</body>"}</p>
        <p className="code code-rose">{"</html>"}</p>
        <p className="code code-rose">{""}</p>
        {this.renderClasses()}
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
