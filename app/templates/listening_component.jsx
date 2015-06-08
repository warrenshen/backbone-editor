import React from "react";
import Component from "app/templates/component";


class ListeningComponent extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  stores() {
    return [];
  }

  // --------------------------------------------------
  // State
  // --------------------------------------------------
  getDefaultState() {
    return this.getStoreState();
  }

  getStoreState() {
    return {};
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
    this.setState(this.getStoreState());
  }
}


module.exports = ListeningComponent;
