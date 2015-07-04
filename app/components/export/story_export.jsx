import React from "react";

import Component from "app/templates/component";

import SectionList from "app/components/export/section_list";
import SectionStandard from "app/components/export/section_standard";
import StyleClass from "app/components/export/style_class";

import Story from "app/models/story";

import TypeConstants from "app/constants/type_constants";


class StoryExport extends Component {

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  static get propTypes() {
    return {
      story: React.PropTypes.instanceOf(Story).isRequired,
    };
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
          {"\"http://fonts.googleapis.com/css?family=Merriweather:400,400italic,700,700italic|Montserrat:400,700\""}
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
          { type: "margin", value: "0" },
          { type: "color", value: "#565A5C" },
          { type: "font-weight", value: "400" },
          { type: "font-size", value: "18px" },
          { type: "font-family", value: "\"Merriweather\", serif" },
          { type: "line-height", value: "30px" },
          { type: "text-align", value: "left" },
          { type: "white-space", value: "pre-wrap" },
        ],
      },
      {
        class: "block-caption",
        attributes: [
          { type: "width", value: "87.5%" },
          { type: "padding-top", value: "8px" },
          { type: "margin", value: "auto" },
          { type: "color", value: "#878B8D" },
          { type: "font-size", value: "14px" },
          { type: "line-height", value: "18px" },
          { type: "font-style", value: "italic" },
          { type: "text-align", value: "center" },
        ],
      },
      {
        class: "block-centered",
        attributes: [
          { type: "text-align", value: "center" },
        ],
      },
      {
        class: "block-divider",
        attributes: [
          { type: "width", value: "10%" },
          { type: "margin", value: "auto" },
          { type: "border-width", value: "1px" },
          { type: "border-style", value: "solid" },
          { type: "border-color", value: "#878B8D" },
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
      {
        class: "block-image",
        attributes: [],
      },
      {
        class: "block-quote",
        attributes: [
          { type: "width", value: "115%" },
          { type: "margin-left", value: "-7.5%" },
          { type: "font-size", value: "24px" },
          { type: "font-family", value: "\"Montserrat\", sans-serif" },
          { type: "font-style", value: "italic" },
          { type: "line-height", value: "48px" },
          { type: "text-align", value: "center" },
        ],
      },
      {
        class: "section",
        attributes: [
          { type: "display", value: "block" },
          { type: "position", value: "relative" },
          { type: "width", value: "100%" },
        ],
      },
      {
        class: "section-standard",
        attributes: [],
      },
      {
        class: "section-list",
        attributes: [
          { type: "padding", value: "0" },
          { type: "margin", value: "0" },
        ],
      },
      {
        class: "story",
        attributes: [
          { type: "display", value: "block" },
          { type: "position", value: "relative" },
          { type: "width", value: "712px" },
          { type: "padding-bottom", value: "356px" },
          { type: "margin", value: "auto" },
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
        {this.renderClasses()}
      </code>
    );
  }
}


module.exports = StoryExport;
