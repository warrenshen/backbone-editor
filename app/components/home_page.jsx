import React from "react";
import ListeningComponent from "app/templates/listening_component";

import Clickable from "app/components/clickable";


class HomePage extends ListeningComponent {

  render() {
    return (
      <div className={"general-page"}>
        Welcome to the home page.
        <Clickable
          route={"/editor"}
          content={"Editor"} />
      </div>
    );
  }
}


module.exports = HomePage;
