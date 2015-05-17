import Backbone from "backbone";
import Router from "app/routers/router";


class App {

  constructor() {
    this.router = Router;
    Backbone.history.start({ pushState: true });
  }
}


module.exports = new App();
