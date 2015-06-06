import ClassNames from "classnames";
import React from "react";
import Component from "app/templates/component";


class MediaModal extends Component {

  render() {
    var modalClass = ClassNames(
      { "media-modal": true },
      { "general-hidden": false }
    );
    return (
      <div className={modalClass} ref="modal">
        <span className={"media-modal-icon"}>
          <i className={"fa fa-square"}></i>
        </span>
      </div>
    );
  }
}


module.exports = MediaModal;
