import Backbone from "backbone";
import "backbone-relational";


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
}


module.exports = Model;
