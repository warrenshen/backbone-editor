import Events from 'events';

import Dispatcher from 'app/dispatcher';


class Store extends Events.EventEmitter {

  // --------------------------------------------------
  // Setup
  // --------------------------------------------------
  initialize() {
    Dispatcher.register(this.handleDispatch.bind(this));
    if (this.setDefaults) {
      this.setDefaults();
    }
  }

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  get name() {
    return 'Store';
  }

  // --------------------------------------------------
  // Dispatch
  // --------------------------------------------------
  // Stores that listen for dispatches must override this method.
  handleDispatch(payload) {}
}


module.exports = Store;
