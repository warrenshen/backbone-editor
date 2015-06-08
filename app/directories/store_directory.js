class StoreDirectory {

  // --------------------------------------------------
  // Setup
  // --------------------------------------------------
  constructor() {
    this._stores = {};
  }

  // --------------------------------------------------
  // Methods
  // --------------------------------------------------
  get(name) {
    return this._stores[name];
  }

  add(store) {
    this._stores[store.name] = store;
  }
}


module.exports = new StoreDirectory();
