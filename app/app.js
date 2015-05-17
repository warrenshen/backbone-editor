import Backbone from "backbone";
import Router from "app/routers/router";

import RouterDirectory from "app/directories/router_directory";


class App {

  constructor() {
    RouterDirectory.add(Router);
    Backbone.history.start({ pushState: true });
  }
}


module.exports = new App();
