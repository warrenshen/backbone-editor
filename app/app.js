import Backbone from "backbone";
import Router from "app/routers/router";

import Models from "app/buckets/models";

import ModelDirectory from "app/directories/model_directory";
import RouterDirectory from "app/directories/router_directory";


class App {

  constructor(models) {
    this.initialize(models);
    RouterDirectory.add(Router);
    Backbone.history.start({ pushState: true });
  }

  initialize(models) {
    models.map(function(model) {
      ModelDirectory.add(model);
    });
  }
}


module.exports = new App(Models);
