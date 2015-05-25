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

  render() {
    return (
      <div className="style-modal">
        <span className="style-modal-triangle"></span>
      </div>
    );
  }
}

StyleModal.propTypes = {
  vector: React.PropTypes.object,
};


module.exports = StyleModal;


render: ->
  <div
    style={@modalStyle()}
    onMouseDown={@handleMouseDown}
    onMouseUp={@handleMouseUp}
    onClick={@handleClick}>
    <VerticalAnchor />
    {@renderStyleOptions()}
    <div style={@styles.triangle}></div>
    {@renderLinkModal()}
  </div>
