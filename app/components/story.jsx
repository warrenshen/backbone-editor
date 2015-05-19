import React from "react";
import Component from "app/templates/component";

import SectionComponent from "app/components/section";

import Story from "app/models/story";


class StoryComponent extends Component {

  renderSection(section) {
    <SectionComponent key={section.get("cid")} section={section} />
  }

  renderSections() {
    var sections = this.props.story.get("sections");
    return sections.map(this.renderSection, this);
  }

  render() {
    return (
      <div>
        <span>test story</span>
        {this.renderSections()}
      </div>
    );
  }
}

StoryComponent.propTypes = {
  story: React.PropTypes.object.isRequired,
}

StoryComponent.defaultProps = {
  story: new Story(),
}


module.exports = StoryComponent;