import Backbone from "backbone";
import React from "react";

import EditorPage from "app/components/editor_page";


class Router extends Backbone.Router {

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  get name() {
    return "Router";
  }

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  routes() {
    return {
      "": "editor",
      "editor/": "editor",
    };
  }

  // --------------------------------------------------
  // Methods
  // --------------------------------------------------
  editor() {
    React.render(
      <EditorPage />,
      document.body
    );
  }
}


module.exports = new Router();
