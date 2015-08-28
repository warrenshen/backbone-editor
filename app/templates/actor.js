import Dispatcher from 'app/dispatcher';


class Actor {

  // Tell the dispatcher to dispatch given action.
  // @param action - hash with `type` and other params.
  act(action) {
    if (false) {
      console.log('Dispatching action: ' + action.type);
    }
    Dispatcher.dispatchAction(action);
  }
}


module.exports = Actor;
