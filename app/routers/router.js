import Backbone from "backbone";
import React from "react";


class Router extends Backbone.Router {

  get name() {
    return "Router";
  }

  routes() {
    return {
      "index.html": "home",
    };
  }

  home() {
    debugger
    React.render(
      <div>Hello</div>,
      document.body
    );
  }
}


module.exports = new Router();
