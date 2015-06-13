import ClassNames from "classnames";
import React from "react";

import Component from "app/templates/component";

import Link from "app/helpers/link";


class LinkModal extends Component {

  positionModal(rectangle) {
    var modal = React.findDOMNode(this.refs.modal);
    var offset = rectangle.width / 2 - modal.offsetWidth / 2;
    modal.style.top = rectangle.bottom + 8 + "px";
    modal.style.left = rectangle.left + offset + "px";
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidUpdate() {
    var link = this.props.link;
    if (link) {
      var content = React.findDOMNode(this.refs.content);
      content.innerHTML = link.content;
      this.positionModal(link.rectangle);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.shouldUpdateLinker;
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    var modalClass = ClassNames(
      { "link-modal": true },
      { "general-hidden": !this.props.link }
    );
    return (
      <div className={modalClass} ref={"modal"}>
        <span className={"vertical-anchor"}></span>
        <span className={"link-modal-content"} ref={"content"}></span>
        <span className={"link-modal-triangle"}></span>
      </div>
    );
  }
}

LinkModal.propTypes = {
  link: React.PropTypes.instanceOf(Link),
  shouldUpdateLinker: React.PropTypes.bool.isRequired,
};

LinkModal.defaultProps = {
  shouldUpdateLinker: false,
};


module.exports = LinkModal;
