import Backbone from "backbone";
import Router from "app/routers/router";

import Models from "app/buckets/models";
import Stores from "app/buckets/stores";

import ModelDirectory from "app/directories/model_directory";
import RouterDirectory from "app/directories/router_directory";
import StoreDirectory from "app/directories/store_directory";

import "app/styles/editor.scss";
import "app/styles/general.scss";


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
      // Call store's initialize method here instead of in
      // store's constructor so registration with store directory
      // takes place before store initializaiton.
      store.initialize();
    });
  }
}


module.exports = new App(Models, Stores);
