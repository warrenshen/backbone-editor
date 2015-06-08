class ModelDirectory {

  // --------------------------------------------------
  // Setup
  // --------------------------------------------------
  constructor() {
    this._models = {};
  }

  // --------------------------------------------------
  // Methods
  // --------------------------------------------------
  get(name) {
    return this._models[name];
  }

  add(model) {
    this._models[model.name] = model;
  }
}


module.exports = new ModelDirectory();
