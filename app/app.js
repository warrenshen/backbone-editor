import Backbone from "backbone";
import Router from "app/routers/router";

import Models from "app/buckets/models";
import Stores from "app/buckets/stores";

import ModelDirectory from "app/directories/model_directory";
import RouterDirectory from "app/directories/router_directory";
import StoreDirectory from "app/directories/store_directory";

import "app/styles/edit.scss";
import "app/styles/etcetera.scss";
import "app/styles/export.scss";


class App {

  constructor(models, stores) {
    this.initialize(models, stores);
    RouterDirectory.add(Router);
    Backbone.history.start({ pushState: true });
  }

  initialize(models, stores) {
    models.map(function(model) {
      ModelDirectory.add(model);
    });
    stores.map(function(store) {
      StoreDirectory.add(store);
      // Call store's initialize method here so initializaiton takes
      // place after after registration with store directory.
      store.initialize();
    });
  }
}


module.exports = new App(Models, Stores);
