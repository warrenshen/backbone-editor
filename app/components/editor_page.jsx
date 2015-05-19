import React from "react";
import ListeningComponent from "app/templates/listening_component";

import Story from "app/models/story";


class EditorPage extends ListeningComponent {

  render() {
    return (
      <div className={"general-page"}>
        Welcome to the editor page.
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
