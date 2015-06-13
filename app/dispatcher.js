import Flux from "flux";


class Dispatcher extends Flux.Dispatcher {

  dispatchAction(action) {
    this.dispatch({ action: action });
  }
}


module.exports = new Dispatcher();
