import React from "react";
import ListeningComponent from "app/templates/listening_component";


class HomePage extends ListeningComponent {

  render() {
    return (
      <div className={"general-page"}>
        Welcome to the home page.
      </div>
    );
  }
}


module.exports = HomePage;
