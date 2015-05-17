import Backbone from "backbone";
import React from "react";

import EditorPage from "app/components/editor_page";


class Router extends Backbone.Router {

  get name() {
    return "Router";
  }

  routes() {
    return {
      "": "home",
      "editor": "editor",
    };
  }

  home() {
    React.render(
      <div>Hello</div>,
      document.body
    );
  }

  editor() {
    React.render(
      <EditorPage />,
      document.body
    );
  }
}


module.exports = new Router();
