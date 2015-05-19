import React from "react";
import ListeningComponent from "app/templates/listening_component";

import Section from "app/components/section";

import Story from "app/models/story";


class EditorPage extends ListeningComponent {

  renderSection(section) {
    <Section key={section.get("cid")} section={section} />
  }

  renderSections() {
    var sections = this.props.story.get("sections");
    return sections.map(this.renderSection(), this);
  }

  render() {
    return (
      <div className={"general-page"}>
        Welcome to the editor page.
        {this.renderSections()}
      </div>
    );
  }
}

EditorPage.propTypes = {
  story: React.PropTypes.object.isRequired,
}

EditorPage.defaultProps = {
  story: new Story(),
}


module.exports = EditorPage;
