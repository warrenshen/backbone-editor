import Backbone from 'backbone';
import React from 'react';

import ViewContainer from 'app/components/view_container';

class Router extends Backbone.Router {

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  get name() {
    return 'Router';
  }

  // --------------------------------------------------
  // Methods
  // --------------------------------------------------
  editor() {
    React.render(
      <ViewContainer />,
      document.body
    );
  }

  routes() {
    return {
      '': 'editor',
      'editor/': 'editor',
    };
  }
}

module.exports = new Router();
