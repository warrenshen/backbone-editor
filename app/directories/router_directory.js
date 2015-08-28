class RouterDirectory {

  // --------------------------------------------------
  // Setup
  // --------------------------------------------------
  constructor() {
    this._routers = {};
  }

  // --------------------------------------------------
  // Methods
  // --------------------------------------------------
  get(name) {
    return this._routers[name];
  }

  add(router) {
    this._routers[router.name] = router;
  }
}

module.exports = new RouterDirectory();
