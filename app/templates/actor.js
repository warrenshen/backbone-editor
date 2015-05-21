import Dispatcher from "app/dispatcher";


class Actor {

  // Tell the dispatcher to dispatch given action.
  // @param action - hash with `type` and other params.
  act(action) {
    Dispatcher.handleViewAction(action);
  }
}


module.exports = Actions;
