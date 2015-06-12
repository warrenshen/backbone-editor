import ClassNames from "classnames";
import React from "react";

import Component from "app/templates/component";


class LinkModal extends Component {

  render() {
    var modalClass = ClassNames(
      { "link-modal": true },
      { "general-hidden": false }
    );
    return (
      <div className={modalClass} ref="modal">
        <span className={"link-modal-triangle"}></span>
      </div>
    );
  }
}


module.exports = LinkModal;
