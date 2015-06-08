import React from "react";
import Component from "app/templates/component";


class ListeningComponent extends Component {

  // --------------------------------------------------
  // State
  // --------------------------------------------------
  get defaultState() {
    return this.storeState();
  }

  get storeState() {
    return {};
  }

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  stores() {
    return [];
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var self = this;
    this.stores().map(function(store) {
      store.addChangeListener(self._onChange.bind(self));
    });
  }

  componentWillUnmount() {
    var self = this;
    this.stores().map(function(store) {
      store.removeChangeListener(self._onChange.bind(self));
    });
  }

  // --------------------------------------------------
  // Events
  // --------------------------------------------------
  _onChange() {
    this.setState(this.storeState);
  }
}


module.exports = ListeningComponent;
