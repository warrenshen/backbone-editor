import Events from "events";

import Dispatcher from "app/dispatcher";


var CHANGE_EVENT = "change";

class Store extends Events.EventEmitter {

  initialize() {
    Dispatcher.register(this.handleDispatch.bind(this));
    if (this.setDefaults) {
      this.setDefaults();
    }
  }

  // --------------------------------------------------
  // Dispatch
  // --------------------------------------------------
  // Stores that listen for dispatches must override this method.
  handleDispatch(payload) {}

  // --------------------------------------------------
  // Events
  // --------------------------------------------------
  addChangeListener(callback) {
    this.addListener(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }
}


module.exports = Store;
