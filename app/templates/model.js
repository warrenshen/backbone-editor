import Backbone from "backbone";
import "backbone-relational";

// import StoreDirectory from "app/directories/store_directory";


class Model extends Backbone.RelationalModel {

  get defaults() {
    return {};
  }

  get name() {
    console.log("Model definition must include model name!")
  }

  get relations() {
    return [];
  }

  // get store() {
  //   return StoreDirectory.get(this.name);
  // }
}


module.exports = Model;
