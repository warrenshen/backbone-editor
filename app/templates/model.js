import Backbone from "backbone";
import "backbone-relational";


class Model extends Backbone.RelationalModel {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  get defaults() {
    return {};
  }

  get name() {
    return "Model";
  }

  get relations() {
    return [];
  }
}


module.exports = Model;
