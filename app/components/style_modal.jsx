import $ from "jquery";
import React from "react";
import Component from "app/templates/component";

import Selector from "app/helpers/selector";
import Vector from "app/helpers/vector";


class StyleModal extends Component {

  componentDidMount() {
    super.componentDidMount();
    this.createVector(this.props.vector);
  }

  componentDidUpdate() {
    this.createVector(this.props.vector);
  }

  createVector(vector) {
    if (vector) {

    }
  }

  render() {
    return (
      <div className="style-modal">
        <span className="vertical-anchor"></span>
        <span className="style-modal-triangle"></span>
      </div>
    );
  }
}

StyleModal.propTypes = {
  vector: React.PropTypes.object,
};


module.exports = StyleModal;
