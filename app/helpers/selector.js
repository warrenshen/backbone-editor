import Point from "app/helpers/point";
import Vector from "app/helpers/vector";


class Selector {

  createTreeWalker(anchorNode) {
    return document.createTreeWalker(
      anchorNode,
      NodeFilter.SHOW_TEXT,
      function(node) { return NodeFilter.FILTER_ACCEPT },
      false
    );
  }

  getParentNode(childNode) {
    var parentNode = childNode;
    while (!parentNode.dataset || !parentNode.dataset.index) {
      parentNode = parentNode.parentNode;
    }
    return parentNode;
  }

  getElementOffset(blockNode, elementNode) {
    var walker = this.createTreeWalker(blockNode);
    var offset = 0;
    while (walker.nextNode() && !walker.currentNode.isSameNode(elementNode)) {
      offset += walker.currentNode.length;
    }
    return offset;
  }

  generatePoint(selection, type="anchor") {
    var node = selection[type + "Node"];
    var parentNode = this.getParentNode(node);
    var grandparentNode = parentNode.parentNode;

    var elementOffset = this.getElementOffset(parentNode, node);
    var caretOffset = elementOffset + selection[type + "Offset"];

    var blockIndex = parseInt(parentNode.dataset.index);
    var sectionIndex = parseInt(grandparentNode.dataset.index);

    return new Point(sectionIndex, blockIndex, caretOffset);
  }

  generateVector(selection) {
    var anchorPoint = this.generatePoint(selection);
    var focusPoint = this.generatePoint(selection, "focus");

    if (anchorPoint.compareDeeply(focusPoint) < 0) {
      return new Vector(anchorPoint, focusPoint);
    } else {
      return new Vector(focusPoint, anchorPoint);
    }
  }
}


module.exports = new Selector();
