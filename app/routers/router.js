import Backbone from "backbone";
import React from "react";

import EditorPage from "app/components/editor_page";


class Router extends Backbone.Router {

  get name() {
    return "Router";
  }

  routes() {
    console.log("Router's routes method called!");
    return {
      "": "editor",
      "/": "editor",
      "editor": "editor",
      "editor/": "editor",
    };
  }

  editor() {
    React.render(
      <EditorPage />,
      document.body
    );
  }
}


module.exports = new Router();
