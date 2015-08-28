import Backbone from 'backbone';
import 'backbone-relational';

class Model extends Backbone.RelationalModel {

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  get defaults() {
    return {};
  }

  get name() {
    return 'Model';
  }

  get relations() {
    return [];
  }
}

module.exports = Model;
