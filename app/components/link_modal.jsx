import ClassNames from "classnames";
import React from "react";

import Component from "app/templates/component";

import Link from "app/helpers/link";


class LinkModal extends Component {

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidUpdate() {
    var link = this.props.link;
    if (link) {
      var content = React.findDOMNode(this.refs.content);
      content.innerHTML = link.content;
    }
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    console.log("rendering");
    var modalClass = ClassNames(
      { "link-modal": true },
      { "general-hidden": !this.props.link }
    );
    return (
      <div className={modalClass} ref="modal">
        <span className={"vertical-anchor"}></span>
        <span className={"link-modal-content"}>
          www.google.com
        </span>
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
