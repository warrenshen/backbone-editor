import React from "react";
import ListeningComponent from "app/templates/listening_component";

import Clickable from "app/components/clickable";


class HomePage extends ListeningComponent {

  render() {
    return (
      <div>
        <h1>Welcome to the home page.</h1>
        <Clickable
          route={"/editor"}
          content={"Editor"} />
      </div>
    );
  }
}


module.exports = HomePage;
