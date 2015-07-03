import React from "react";

import Component from "app/templates/component";

import SectionList from "app/components/export/section_list";
import SectionStandard from "app/components/export/section_standard";
import StyleClass from "app/components/export/style_class";

import Story from "app/models/story";

import TypeConstants from "app/constants/type_constants";


class StoryExport extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "StoryExport";
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
          { type: "display", value: "block" },
          { type: "position", value: "relative" },
          { type: "width", value: "100%" },
          { type: "padding-bottom", value: "24px" },
          { type: "font-weight", value: "400" },
          { type: "font-size", value: "18px" },
          { type: "font-family", value: "\"Merriweather\", serif" },
          { type: "line-height", value: "30px" },
          { type: "text-align", value: "left" },
        ],
      },
      {
        class: "block-centered",
        attributes: [
          { type: "text-align", value: "center" },
        ],
      },
      {
        class: "block-heading-one",
        attributes: [
          { type: "font-weight", value: "700" },
          { type: "font-size", value: "48px" },
          { type: "font-family", value: "\"Montserrat\", sans-serif" },
          { type: "line-height", value: "64px" },
        ],
      },
      {
        class: "block-heading-two",
        attributes: [
        { type: "font-weight", value: "700" },
        { type: "font-size", value: "36px" },
        { type: "font-family", value: "\"Montserrat\", sans-serif" },
        { type: "line-height", value: "48px" },
        ],
      },
      {
        class: "block-heading-three",
        attributes: [
        { type: "font-weight", value: "700" },
        { type: "font-size", value: "30px" },
        { type: "font-family", value: "\"Montserrat\", sans-serif" },
        { type: "line-height", value: "36px" },
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

StoryExport.propTypes = {
  story: React.PropTypes.instanceOf(Story).isRequired,
};

StoryExport.defaultProps = {
  story: new Story(),
};


module.exports = StoryExport;
